import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/lib/supabase-data"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import { absoluteUrl } from "@/lib/site"

// Régénérer le sitemap à chaque requête pour refléter les articles
// ajoutés/supprimés depuis le backoffice (mêmes données que /blog).
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/projets"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Fiches services : ce sont les pages qui portent les offres et les prix,
  // elles manquaient entièrement au sitemap. Le slug est calculé avec la même
  // fonction que generateStaticParams, sinon le sitemap annoncerait des URLs
  // qui n'existent pas.
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.filter((s) => s.visible).map((service) => ({
    url: absoluteUrl(`/services/${serviceSlug(service)}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updated_at || post.created_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...serviceRoutes, ...postRoutes]
}
