import { notFound } from "next/navigation"

/**
 * TEMPORAIRE — diagnostic de l'erreur 500 sur /blog/[slug] en production.
 * À supprimer une fois la cause identifiée.
 */
export const dynamic = "force-dynamic"

type Rapport = Record<string, unknown>

async function essai(nom: string, fn: () => Promise<unknown>, out: Rapport) {
  try {
    out[nom] = await fn()
  } catch (e) {
    const err = e as Error
    out[nom] = {
      ERREUR: err?.message ?? String(e),
      nom_erreur: err?.name,
      code: (err as unknown as { code?: string })?.code,
      pile: err?.stack?.split("\n").slice(0, 14),
    }
  }
}

export async function GET() {
  const out: Rapport = {
    node: process.version,
    plateforme: `${process.platform}/${process.arch}`,
    cwd: process.cwd(),
    vercel_env: process.env.VERCEL_ENV ?? null,
    vercel_region: process.env.VERCEL_REGION ?? null,
    site_url_env: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    supabase_url_defini: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabase_key_definie: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    notFound_est_une_fonction: typeof notFound === "function",
  }

  await essai("sanitize", async () => {
    const { sanitizeHtml } = await import("@/lib/sanitize")
    return sanitizeHtml('<p>ok</p><script>alert(1)</script>')
  }, out)

  await essai("article_hero", async () => {
    const m = await import("@/components/blog/ArticleHero")
    return typeof m.default
  }, out)

  await essai("related_posts", async () => {
    const m = await import("@/components/blog/RelatedPosts")
    return typeof m.default
  }, out)

  await essai("json_ld", async () => {
    const m = await import("@/components/seo/JsonLd")
    return typeof m.ArticleJsonLd
  }, out)

  await essai("supabase_data", async () => {
    const { getBlogPost } = await import("@/lib/supabase-data")
    const p = await getBlogPost("developpement-web")
    return p ? { trouve: true, cover_url: p.cover_url, tags: p.tags } : { trouve: false }
  }, out)

  await essai("page_blog_slug", async () => {
    const m = await import("@/app/(public)/blog/[slug]/page")
    return typeof m.default
  }, out)

  return Response.json(out, { headers: { "cache-control": "no-store" } })
}
