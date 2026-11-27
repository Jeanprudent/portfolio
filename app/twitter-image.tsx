import { renderOgImage, ogSize, ogContentType, ogAlt } from "@/lib/og"

// Image Twitter/X par défaut (même visuel que l'Open Graph). Rend la carte
// `summary_large_image` du layout effective sur l'ensemble du site.
export const size = ogSize
export const contentType = ogContentType
export const alt = ogAlt

export default function TwitterImage() {
  return renderOgImage()
}
