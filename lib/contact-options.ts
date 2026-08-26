// Source unique des options du formulaire de contact.
// Importée par le formulaire (affichage + validation) ET par la route API
// (validation serveur + libellé lisible dans l'email) : impossible que les
// deux listes divergent.

export const BESOIN_VALUES = [
  "site-web",
  "seo",
  "automatisation-ia",
  "autre",
] as const

export type BesoinValue = (typeof BESOIN_VALUES)[number]

export const BESOINS: { value: BesoinValue; i18nKey: string; label: string }[] = [
  {
    value: "site-web",
    i18nKey: "contact.besoin_site",
    label: "Je veux un site web",
  },
  {
    value: "seo",
    i18nKey: "contact.besoin_seo",
    label: "Je veux optimiser le SEO de mon site web",
  },
  {
    value: "automatisation-ia",
    i18nKey: "contact.besoin_ia",
    label: "Je veux automatiser avec l'IA",
  },
  {
    value: "autre",
    i18nKey: "contact.besoin_autre",
    label: "Autre / je ne sais pas encore",
  },
]

/** Libellé français, utilisé côté serveur pour l'objet et le corps de l'email. */
export function besoinLabel(value: string): string {
  return BESOINS.find((b) => b.value === value)?.label ?? value
}

/**
 * Besoin pré-sélectionné dans le formulaire ouvert depuis une fiche service.
 *
 * Rapprochement par mots-clés plutôt que par slug exact : les fiches sont
 * éditables depuis le back-office, un titre reformulé ne doit pas casser la
 * pré-sélection.
 *
 * L'ordre des tests compte. La maintenance passe en premier parce qu'elle
 * n'entre dans aucune des trois autres cases — sans ce garde, « Maintenance
 * & support WordPress » serait happée plus bas par « web ».
 */
export function besoinPourService(slugOuTitre: string): BesoinValue {
  const s = slugOuTitre.toLowerCase()
  if (/maintenance|support|wordpress/.test(s)) return "autre"
  if (/seo|référencement|referencement|visibilit/.test(s)) return "seo"
  if (/automatis|workflow|n8n|\bia\b|intelligence artificielle/.test(s)) return "automatisation-ia"
  if (/site|vitrine|création|creation|web/.test(s)) return "site-web"
  return "autre"
}
