/**
 * Slug canonique d'un service, calculé depuis son titre.
 *
 * Sert de pont entre les deux sources de données : la table `services` de
 * Supabase ne stocke ni `slug` ni `banner` (schéma de la migration 001, plus
 * ancien que le type Service), alors que data/portfolio-data.ts les porte.
 * On rapproche donc les deux par le titre, qui lui est identique de part
 * et d'autre.
 *
 * Deux pièges que la version précédente ne gérait pas :
 *  - les accents : « Création » donnait « cr-ation », faute de décomposer
 *    les caractères avant de filtrer sur [a-z0-9] ;
 *  - l'esperluette : elle était traduite en « et », alors que les slugs
 *    canoniques la suppriment (« maintenance-support-wordpress »).
 */
export function slugify(str: string): string {
  return str
    .normalize("NFD")                  // « é » -> « e » + accent combinant
    .replace(/[̀-ͯ]/g, "")   // retire les accents combinants
    .toLowerCase()
    .replace(/&/g, " ")                // « A & B » -> « a-b », pas « a-et-b »
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** Slug d'un service : celui stocké s'il existe, sinon calculé depuis le titre. */
export function serviceSlug(service: { slug?: string; title: string }): string {
  return service.slug?.trim() || slugify(service.title)
}
