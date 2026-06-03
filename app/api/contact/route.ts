import { NextResponse } from "next/server"
import { z } from "zod"

// Route dynamique : jamais mise en cache (envoi d'email à chaque requête).
export const dynamic = "force-dynamic"

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  subject: z.string().min(3).max(150),
  message: z.string().min(20).max(5000),
  // Honeypot : champ caché qui doit rester vide. Rempli = bot.
  website: z.string().optional(),
})

// Rate-limiting en mémoire (par IP). Suffisant pour une instance unique ;
// pour un déploiement multi-instances, brancher un store partagé (Redis/Upstash).
const RATE_LIMIT = 5 // requêtes max
const RATE_WINDOW_MS = 10 * 60 * 1000 // par tranche de 10 minutes
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Purge occasionnelle pour éviter une croissance mémoire illimitée.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(request: Request) {
  // IP cliente derrière proxy (Vercel/Cloudflare renseignent x-forwarded-for).
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de messages. Réessayez dans quelques minutes." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 422 })
  }
  const { name, email, subject, message, website } = parsed.data

  // Honeypot rempli : on renvoie un succès factice sans rien envoyer
  // (ne pas signaler au bot que sa soumission a été rejetée).
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const apiKey = (process.env.RESEND_API_KEY || "").trim()
  if (!apiKey) {
    // Configuration manquante : on le signale clairement côté serveur.
    console.error("RESEND_API_KEY manquante — impossible d'envoyer l'email de contact.")
    return NextResponse.json(
      { error: "Service d'envoi non configuré." },
      { status: 503 }
    )
  }

  // Adresse destinataire (toi) et expéditeur (domaine vérifié sur Resend,
  // ou onboarding@resend.dev pour les tests).
  const to = (process.env.CONTACT_EMAIL_TO || "jeanprudent03@gmail.com").trim()
  const from = (process.env.CONTACT_EMAIL_FROM || "Portfolio <onboarding@resend.dev>").trim()

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 12px">Nouveau message depuis le portfolio</h2>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject:  `${name} : ${subject}`,
        html,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error("Échec Resend:", res.status, detail)
      return NextResponse.json(
        { error: "L'envoi de l'email a échoué." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Erreur réseau Resend:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    )
  }
}
