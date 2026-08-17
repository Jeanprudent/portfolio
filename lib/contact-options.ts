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
