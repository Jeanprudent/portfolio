import type { Offer } from "@/types/portfolio"

/**
 * « À partir de X » affiché dans le hero d'une fiche service.
 *
 * Le montant est DÉDUIT des offres, jamais saisi à part : c'est ce qui
 * empêche le hero de contredire le tableau des tarifs plus bas quand les
 * prix évoluent (décision du 20/08).
 *
 * Renvoie null si aucune offre n'a de prix plancher exploitable — le hero
 * n'affiche alors simplement pas de prix.
 */
export function fromPrice(offers?: Offer[] | null): string | null {
  if (!offers?.length) return null

  const candidates = offers.filter(
    (o): o is Offer & { price_min: number } =>
      typeof o.price_min === "number" && o.price_min > 0
  )
  if (!candidates.length) return null

  const moins = candidates.reduce((a, b) => (b.price_min < a.price_min ? b : a))
  const devise = moins.currency?.trim() || "XOF"

  // fr-FR groupe les milliers par une espace insécable, pas par une virgule.
  let montant: string
  try {
    montant = new Intl.NumberFormat("fr-FR").format(moins.price_min)
  } catch {
    montant = String(moins.price_min)
  }

  return `À partir de ${montant} ${devise}`
}
