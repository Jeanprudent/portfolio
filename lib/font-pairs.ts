import type { CSSProperties } from "react"

/**
 * Paires de polices proposées dans /gestion/design.
 *
 * `headingVar` / `bodyVar` doivent correspondre aux variables déclarées par
 * next/font dans app/layout.tsx : c'est le seul point de couplage entre les
 * deux fichiers. next/font n'expose pas ces noms à l'exécution (`.variable`
 * est une classe CSS), la correspondance ne peut donc pas être vérifiée
 * automatiquement.
 */
export type FontPair = {
  id: string
  label: string
  heading: string
  body: string
  headingVar: string
  bodyVar: string
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: "sofia",
    label: "Sofia Sans Extra Condensed + Sofia Sans (marque)",
    heading: "Sofia Sans Extra Condensed",
    body: "Sofia Sans",
    headingVar: "--font-sofia-condensed",
    bodyVar: "--font-sofia-sans",
  },
  {
    id: "syne-dm",
    label: "Syne + DM Sans",
    heading: "Syne",
    body: "DM Sans",
    headingVar: "--font-syne",
    bodyVar: "--font-dm-sans",
  },
  {
    id: "outfit-inter",
    label: "Outfit + Inter",
    heading: "Outfit",
    body: "Inter",
    headingVar: "--font-outfit",
    bodyVar: "--font-inter",
  },
  {
    id: "space-inter",
    label: "Space Grotesk + Inter",
    heading: "Space Grotesk",
    body: "Inter",
    headingVar: "--font-space-grotesk",
    bodyVar: "--font-inter",
  },
  {
    id: "plus-manrope",
    label: "Plus Jakarta + Manrope",
    heading: "Plus Jakarta Sans",
    body: "Manrope",
    headingVar: "--font-plus-jakarta",
    bodyVar: "--font-manrope",
  },
]

export const DEFAULT_FONT_PAIR = FONT_PAIRS[0]

/** Une valeur inconnue (colonne absente, base plus récente) retombe sur la paire par défaut. */
export function resolveFontPair(id?: string | null): FontPair {
  return FONT_PAIRS.find((pair) => pair.id === id) ?? DEFAULT_FONT_PAIR
}

/**
 * Variables lues par globals.css : `@theme inline` y branche --font-heading et
 * --font-sans, donc les utilitaires Tailwind `font-heading` / `font-sans`
 * suivent la paire choisie sans qu'aucun composant ne change.
 */
export function fontPairStyle(pair: FontPair): CSSProperties {
  return {
    "--font-heading-family": `var(${pair.headingVar}), sans-serif`,
    "--font-body-family": `var(${pair.bodyVar}), system-ui, -apple-system, sans-serif`,
  } as CSSProperties
}
