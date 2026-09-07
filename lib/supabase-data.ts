import { createClient } from "@supabase/supabase-js"
import { STATS, SERVICES, PROJECTS, TESTIMONIALS } from "@/data/portfolio-data"
import { BLOG_POSTS } from "@/data/blog-data"
import { serviceSlug } from "@/lib/slug"
import { mergeService } from "@/lib/merge-service"
import type { Stat, Service, Project, Testimonial, BlogPost } from "@/types/portfolio"
import { DEFAULT_FONT_PAIR, resolveFontPair, type FontPair } from "@/lib/font-pairs"

export type PortfolioConfig = {
  id: string
  tagline: string | null
  bio: string | null
  location: string | null
  disponible: boolean | null
  email: string | null
  whatsapp: string | null
  github_url: string | null
  linkedin_url: string | null
  facebook_url: string | null
  avatar_url: string | null
  site_name: string | null
}

function client() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
  return createClient(url, key)
}

export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  try {
    const { data } = await client().from("portfolio_config").select("*").single()
    return data as PortfolioConfig | null
  } catch {
    return null
  }
}

export async function getStats(): Promise<Stat[]> {
  try {
    const { data } = await client().from("stats").select("*").order("order_index")
    return data?.length ? (data as Stat[]) : STATS
  } catch {
    return STATS
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const { data } = await client().from("services").select("*").order("order_index")
    if (data?.length) return (data as Service[]).filter((s) => s.visible)
    return SERVICES.filter((s) => s.visible)
  } catch {
    return SERVICES.filter((s) => s.visible)
  }
}

/**
 * Une fiche service par son slug.
 *
 * Le repli sur data/portfolio-data.ts n'est pas décoratif : c'est lui qui
 * garantit que la page reste servie si Supabase est injoignable. Il couvre
 * aussi les colonnes que la base ne porte pas encore pour un service donné
 * (long_description, offers), tant que le contenu n'y a pas été repris.
 */
export async function getService(slug: string): Promise<Service | null> {
  const local = SERVICES.find((s) => serviceSlug(s) === slug) ?? null

  try {
    const { data } = await client()
      .from("services")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    // Fusion : la base fait autorité, le fichier comble les trous.
    // Voir lib/merge-service.ts — un tableau vide n'est pas une valeur.
    if (data) return mergeService(local, data as Service)
  } catch {
    /* repli ci-dessous */
  }

  return local
}

/** Slugs des services visibles, pour generateStaticParams. */
export async function getServiceSlugs(): Promise<string[]> {
  try {
    const { data } = await client()
      .from("services")
      .select("slug")
      .eq("visible", true)

    const slugs = (data ?? [])
      .map((r) => (r as { slug: string | null }).slug)
      .filter((s): s is string => Boolean(s))

    if (slugs.length) return slugs
  } catch {
    /* repli ci-dessous */
  }

  return SERVICES.filter((s) => s.visible).map(serviceSlug)
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { data } = await client().from("projects").select("*").order("order_index")
    return data?.length ? (data as Project[]) : PROJECTS
  } catch {
    return PROJECTS
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await client().from("testimonials").select("*").order("created_at")
    if (data?.length) return (data as Testimonial[]).filter((t) => t.visible)
    return TESTIMONIALS.filter((t) => t.visible)
  } catch {
    return TESTIMONIALS.filter((t) => t.visible)
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await client()
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) return (data as BlogPost[]).filter((p) => p.published)
    return BLOG_POSTS.filter((p) => p.published)
  } catch {
    return BLOG_POSTS.filter((p) => p.published)
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await client()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
    if (data) return data as BlogPost
    return BLOG_POSTS.find((p) => p.slug === slug && p.published) ?? null
  } catch {
    return BLOG_POSTS.find((p) => p.slug === slug && p.published) ?? null
  }
}

/**
 * Paire de polices choisie dans /gestion/design, lue par le layout racine.
 *
 * Requête REST directe plutôt que supabase-js : elle seule accepte les
 * options de cache de Next. Un fetch non caché dans le layout racine ferait
 * basculer les fiches services — prérendues via generateStaticParams — en
 * rendu dynamique à chaque visite. Trente secondes de fraîcheur suffisent
 * pour un réglage qui change deux fois par an.
 *
 * Repli silencieux sur la paire par défaut : tant que la migration 006 n'est
 * pas jouée, la colonne n'existe pas et PostgREST renvoie une 400.
 */
export async function getFontPair(): Promise<FontPair> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
  if (!url || !key) return DEFAULT_FONT_PAIR

  try {
    const res = await fetch(`${url}/rest/v1/portfolio_config?select=font_pair&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 30 },
    })
    if (!res.ok) return DEFAULT_FONT_PAIR
    const rows = (await res.json()) as { font_pair?: string }[]
    return resolveFontPair(rows?.[0]?.font_pair)
  } catch {
    return DEFAULT_FONT_PAIR
  }
}
