import { notFound } from "next/navigation"

/**
 * TEMPORAIRE — vérifie si notFound() depuis une page dynamique renvoie bien
 * 404 sur Vercel (et non 500). À supprimer avec /api/diag.
 */
export const dynamic = "force-dynamic"

export default async function DiagNotFound() {
  notFound()
}
