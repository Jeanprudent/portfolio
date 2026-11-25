import { EXPERTISES, type Expertise, type Ville } from "@/data/local-seo"

export type { Expertise, Ville }

/**
 * Expertises : gérées en code (contenu riche et stable).
 * Villes : pilotées depuis Supabase (getLocalVilles dans supabase-data), avec
 * repli sur data/local-seo.ts. Les fonctions ci-dessous prennent donc la liste
 * de villes résolue en argument plutôt que de la lire elles-mêmes.
 */
export function getExpertises(): Expertise[] {
  return EXPERTISES
}

export function findExpertise(slug: string): Expertise | null {
  return EXPERTISES.find((e) => e.slug === slug) ?? null
}

/** Slug de page plat : « creation-site-web-cotonou ». */
export function localSlug(expertise: Expertise, ville: Ville): string {
  return `${expertise.slug}-${ville.slug}`
}

export function localPath(expertise: Expertise, ville: Ville): string {
  return `/${localSlug(expertise, ville)}`
}

export function localTitle(expertise: Expertise, ville: Ville): string {
  return `${expertise.nom} ${ville.prep} ${ville.nom}`
}

/** Toutes les combinaisons réelles, à partir d'une liste de villes donnée. */
export function allLocalSlugs(villes: Ville[]): string[] {
  const slugs: string[] = []
  for (const e of EXPERTISES) {
    for (const v of villes) slugs.push(localSlug(e, v))
  }
  return slugs
}

/** Résout un slug plat en (expertise, ville) à partir des villes fournies. */
export function resolveLocalSlug(
  slug: string,
  villes: Ville[]
): { expertise: Expertise; ville: Ville } | null {
  for (const e of EXPERTISES) {
    for (const v of villes) {
      if (localSlug(e, v) === slug) return { expertise: e, ville: v }
    }
  }
  return null
}
