// Source unique des coordonnées affichées sur le site.
//
// Elles étaient recopiées en dur dans six fichiers (Footer, ContactSection,
// fiche service, ContactModal, ServiceOffers, route API) : un changement de
// numéro obligeait à passer partout, avec le risque d'en oublier un.
//
// Ce sont des VALEURS DE REPLI : quand la table portfolio_config renseigne
// email / whatsapp / location, c'est elle qui gagne. Le repli sert quand
// Supabase est injoignable ou le champ vide.

export const CONTACT_EMAIL = "jeanprudent03@gmail.com"

/** Téléphone (appels). Format international sans « + » ni espaces. */
export const CONTACT_PHONE = "2290192175002"

/** Version lisible du téléphone, pour l'affichage uniquement. */
export const CONTACT_PHONE_DISPLAY = "+229 01 92 17 50 02"

/**
 * WhatsApp — numéro DISTINCT du téléphone. Format sans « + » ni espaces,
 * c'est ce qu'attend wa.me.
 */
export const CONTACT_WHATSAPP = "2290162484609"

/** Version lisible du WhatsApp, pour l'affichage uniquement. */
export const CONTACT_WHATSAPP_DISPLAY = "+229 01 62 48 46 09"

export const CONTACT_LOCATION = "Cotonou, Bénin"

/** Lien WhatsApp, avec message pré-rempli optionnel. */
export function whatsappLink(number: string = CONTACT_WHATSAPP, text?: string): string {
  const base = `https://wa.me/${number.replace(/[^0-9]/g, "")}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/** Lien mailto avec objet et corps correctement encodés. */
export function mailtoLink(subject: string, body?: string, to: string = CONTACT_EMAIL): string {
  const params = new URLSearchParams({ subject })
  if (body) params.set("body", body)
  return `mailto:${to}?${params.toString()}`
}
