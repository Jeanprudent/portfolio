/**
 * URL canonique du site, source unique.
 *
 * Trois valeurs se contredisaient avant : metadataBase déclarait
 * https://jeanprudent.dev (domaine qui ne répond pas), tandis que le sitemap
 * et le robots.txt annonçaient l'URL Vercel. Les balises canoniques
 * désignaient donc un domaine mort — de quoi empêcher l'indexation des pages
 * réellement en ligne.
 *
 * Pour basculer sur un vrai domaine plus tard : définir NEXT_PUBLIC_SITE_URL
 * dans les variables d'environnement Vercel, puis redéployer. Aucun code à
 * modifier — metadataBase, le sitemap, le robots.txt et les liens de partage
 * suivent automatiquement.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jprudent-portfolio.vercel.app"
)
  .trim()
  .replace(/\/+$/, "")

/**
 * Construit une URL absolue à partir d'un chemin (« /services » ->
 * « https://…/services »).
 *
 * Une URL déjà absolue est renvoyée intacte : les couvertures d'articles et
 * les bannières peuvent être hébergées n'importe où, et les préfixer
 * produisait « https://mon-site.com/https://autre-site.com/img.jpg » dans
 * les données structurées.
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}
