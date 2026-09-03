import { createHash, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { z } from "zod"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { sanitizeHtml } from "@/lib/sanitize"
import { slugify } from "@/lib/slug"
import { absoluteUrl } from "@/lib/site"

/**
 * Webhook de publication d'articles (n8n).
 *
 * Le workflow n8n surveille des flux RSS, fait rédiger l'article par un nœud
 * IA, puis POSTe le résultat ici. La route écrit dans `blog_posts` avec la clé
 * service_role — voir lib/supabase-admin.ts pour pourquoi la clé anon ne
 * suffit pas.
 *
 * Deux garde-fous délibérés :
 *  - l'article est TOUJOURS créé en brouillon (`published: false`). Rien de ce
 *    qu'écrit l'IA n'atteint le site public sans un clic humain dans
 *    /gestion/blog. C'est la seule protection réelle contre un article faux,
 *    hors sujet ou dupliqué ;
 *  - le HTML reçu passe par le même sanitizeHtml que le rendu de l'article.
 *    Un nœud IA peut recracher n'importe quoi, y compris ce qu'il a lu dans
 *    un flux RSS hostile ; on ne stocke que la liste blanche TipTap.
 */

// Écriture en base à chaque appel : jamais de cache, jamais de prérendu.
export const dynamic = "force-dynamic"

// Ni le titre ni l'extrait ne doivent contenir de saut de ligne : ils partent
// dans les balises <title> et <meta description> de la page.
const singleLine = /^[^\r\n]+$/

const schema = z.object({
  title: z.string().min(10).max(160).regex(singleLine),

  // Facultatif : dérivé du titre s'il est absent. Imposé en minuscules sans
  // accent, parce qu'il finit dans une URL et sert de clé d'unicité.
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug invalide")
    .optional(),

  // Facultatif : extrait du contenu s'il est absent (voir buildExcerpt).
  excerpt: z.string().max(300).regex(singleLine).optional(),

  // HTML, pas du Markdown : la page article fait un dangerouslySetInnerHTML
  // sur ce champ. Le prompt du nœud IA doit l'exiger explicitement.
  content: z.string().min(200).max(200_000),

  // Une URL absolue http(s). `data:` est refusé ici comme dans sanitize.ts :
  // une image en data-URI peut embarquer du SVG, donc du script.
  cover_url: z
    .string()
    .url()
    .max(1000)
    .refine((u) => /^https?:\/\//i.test(u), "URL de couverture non http(s)")
    .optional()
    .nullable(),

  tags: z.array(z.string().min(2).max(40).regex(singleLine)).max(6).optional(),
})

/**
 * Comparaison à temps constant du secret.
 *
 * On compare les empreintes SHA-256 plutôt que les chaînes brutes : d'une part
 * timingSafeEqual exige deux buffers de même longueur, d'autre part comparer
 * les longueurs en clair révélerait déjà la taille du secret.
 */
function secretMatches(received: string, expected: string): boolean {
  const a = createHash("sha256").update(received).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}

/** Extrait de secours : le texte du HTML nettoyé, coupé sur un mot entier. */
function buildExcerpt(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    // Entités les plus courantes ; le reste est marginal dans un extrait.
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= 200) return text
  const cut = text.slice(0, 200)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

// Garde-fou contre une boucle n8n emballée (un workflow mal configuré peut
// rejouer des dizaines de fois). Même approche qu'app/api/contact/route.ts :
// en mémoire, donc par instance — suffisant pour un webhook appelé quelques
// fois par jour.
const RATE_LIMIT = 20 // requêtes max
const RATE_WINDOW_MS = 10 * 60 * 1000 // par tranche de 10 minutes
const hits: number[] = []

function isRateLimited(): boolean {
  const now = Date.now()
  while (hits.length && now - hits[0] >= RATE_WINDOW_MS) hits.shift()
  hits.push(now)
  return hits.length > RATE_LIMIT
}

export async function POST(request: Request) {
  const expected = (process.env.BLOG_WEBHOOK_SECRET || "").trim()

  // Un secret absent ou trop court transformerait la route en formulaire de
  // publication ouvert : on refuse de servir plutôt que de laisser passer.
  if (expected.length < 32) {
    console.error(
      "BLOG_WEBHOOK_SECRET manquante ou trop courte (32 caractères minimum) — webhook blog désactivé."
    )
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 503 })
  }

  const auth = request.headers.get("authorization") || ""
  const received = auth.startsWith("Bearer ") ? auth.slice(7).trim() : ""
  if (!received || !secretMatches(received, expected)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  if (isRateLimited()) {
    return NextResponse.json(
      { error: "Trop d'articles envoyés. Réessayez dans quelques minutes." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    // Le détail des champs fautifs part dans la réponse : n8n l'affiche dans
    // l'exécution, ce qui évite de deviner quel champ le nœud IA a raté.
    return NextResponse.json(
      {
        error: "Champs invalides",
        details: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 }
    )
  }

  const input = parsed.data

  // `img` reste autorisé dans lib/sanitize.ts : l'éditeur TipTap de /gestion
  // insère de vraies images dans les articles écrits à la main. Mais sur ce
  // chemin-ci, l'URL vient d'un modèle qui n'a aucun moyen d'en connaître une
  // qui existe — le résultat est une image cassée dans le brouillon. Le canal
  // prévu pour une illustration est `cover_url`, validé séparément.
  const content = sanitizeHtml(input.content).replace(/<img\b[^>]*>/gi, "")

  // On mesure le TEXTE, pas le HTML : `content` a déjà passé le min(200) de
  // zod, mais 200 caractères de balises ne font pas un article. Deux cas
  // tombent ici — un contenu entièrement composé de balises interdites
  // (<script>, <iframe>…), et un article réellement trop court.
  const textLength = content.replace(/<[^>]+>/g, "").trim().length
  if (textLength < 200) {
    return NextResponse.json(
      {
        error: `Contenu trop court : ${textLength} caractères de texte après nettoyage, 200 minimum.`,
      },
      { status: 422 }
    )
  }

  // Piège inverse, et le plus probable : un nœud IA qui renvoie du Markdown.
  // sanitizeHtml n'a alors rien à retirer — le texte passe intact et l'article
  // s'afficherait comme un pavé sans titres ni paragraphes, avec des « ## » et
  // des « ** » visibles. On exige au moins une balise de bloc.
  if (!/<(p|h2|h3|h4|ul|ol|blockquote|pre)[\s>]/i.test(content)) {
    return NextResponse.json(
      {
        error:
          "Contenu sans structure HTML. Attendu : du HTML (<h2>, <p>, <ul>…), pas du Markdown.",
      },
      { status: 422 }
    )
  }

  const slug = input.slug || slugify(input.title)
  if (!slug) {
    return NextResponse.json({ error: "Slug indérivable du titre" }, { status: 422 })
  }

  const admin = supabaseAdmin()
  if (!admin) {
    console.error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquante — écriture blog impossible."
    )
    return NextResponse.json({ error: "Base non configurée." }, { status: 503 })
  }

  // Les flux RSS repassent sur les mêmes sujets : on refuse le doublon au lieu
  // d'écraser un article que tu as peut-être déjà relu et corrigé à la main.
  const { data: existing, error: lookupError } = await admin
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (lookupError) {
    console.error("Webhook blog — échec de la vérification du slug:", lookupError)
    return NextResponse.json({ error: "Erreur base de données" }, { status: 500 })
  }

  if (existing) {
    return NextResponse.json(
      { error: "Article déjà existant", slug, id: existing.id },
      { status: 409 }
    )
  }

  const { data, error } = await admin
    .from("blog_posts")
    .insert({
      title: input.title.trim(),
      slug,
      content,
      excerpt: input.excerpt?.trim() || buildExcerpt(content),
      cover_url: input.cover_url || null,
      tags: input.tags?.map((t) => t.trim()).filter(Boolean) ?? [],
      // Jamais true. La mise en ligne reste un geste humain, dans /gestion/blog.
      published: false,
    })
    .select("id, slug")
    .single()

  if (error) {
    // 23505 = violation d'unicité : deux exécutions n8n concurrentes ont visé
    // le même slug et sont passées ensemble à travers la vérification.
    if (error.code === "23505") {
      return NextResponse.json({ error: "Article déjà existant", slug }, { status: 409 })
    }
    console.error("Webhook blog — échec de l'insertion:", error)
    return NextResponse.json({ error: "Erreur base de données" }, { status: 500 })
  }

  return NextResponse.json(
    {
      ok: true,
      id: data.id,
      slug: data.slug,
      published: false,
      // Lien direct vers le back-office : n8n peut le pousser dans une
      // notification (email, Slack, WhatsApp) « un brouillon t'attend ».
      review_url: absoluteUrl("/gestion/blog"),
    },
    { status: 201 }
  )
}
