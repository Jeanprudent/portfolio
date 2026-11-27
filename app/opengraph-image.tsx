import { renderOgImage, ogSize, ogContentType, ogAlt } from "@/lib/og"

// Image Open Graph par défaut du site (convention Next : ce fichier fournit
// og:image à toutes les routes sans image propre). Voir lib/og.tsx.
export const size = ogSize
export const contentType = ogContentType
export const alt = ogAlt

export default function OpengraphImage() {
  return renderOgImage()
}
