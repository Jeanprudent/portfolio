import { NextResponse } from "next/server"
import { z } from "zod"

// Route dynamique : jamais mise en cache (envoi d'email à chaque requête).
export const dynamic = "force-dynamic"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20),
})

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(request: Request) {
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
  const { name, email, subject, message } = parsed.data

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
        subject: `[Portfolio] ${subject}`,
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
