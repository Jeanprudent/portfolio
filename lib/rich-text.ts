import { serviceSlug } from "@/lib/slug"

/**
 * Mise en forme minimale du texte libre saisi dans /gestion.
 *
 * La bio partait dans un unique <p> : une ligne vide dans le champ ne
 * produisait rien a l'ecran, et le texte s'affichait en pave. Deux besoins
 * seulement, donc pas de moteur Markdown :
 *
 *   - une ligne vide separe deux paragraphes ;
 *   - [texte](/services/mon-service) devient un lien interne.
 *
 * Les liens sont volontairement limites aux chemins internes : la bio est un
 * champ de base de donnees, et un href libre y ouvrirait une injection
 * javascript: ou un lien sortant pose depuis le back-office.
 */

export type Segment =
  | { type: "texte"; contenu: string }
  | { type: "lien"; contenu: string; href: string }

// « commence par / » ne suffit pas : "//exemple.tld" est une URL
// protocole-relatif, et "/\exemple.tld" le devient aussi, les navigateurs
// normalisant l'antislash en slash. Deux liens sortants deguises en chemin
// interne. D'ou le refus d'un second separateur et de tout antislash.
const LIEN = /\[([^\]]+)\]\((\/(?![/\\])[^)\s\\]*)\)/g

export function decouperParagraphes(texte: string): string[] {
  return texte
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function analyserLiens(paragraphe: string): Segment[] {
  const segments: Segment[] = []
  let curseur = 0

  for (const found of paragraphe.matchAll(LIEN)) {
    const debut = found.index ?? 0
    if (debut > curseur) {
      segments.push({ type: "texte", contenu: paragraphe.slice(curseur, debut) })
    }
    segments.push({ type: "lien", contenu: found[1], href: found[2] })
    curseur = debut + found[0].length
  }

  if (curseur < paragraphe.length) {
    segments.push({ type: "texte", contenu: paragraphe.slice(curseur) })
  }
  return segments
}

/** Chemin public d'une fiche service, pour l'aide a la saisie du back-office. */
export function cheminService(titre: string, slug?: string | null): string {
  return `/services/${slug || serviceSlug({ title: titre } as Parameters<typeof serviceSlug>[0])}`
}
