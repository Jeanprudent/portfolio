import { createClient } from "@supabase/supabase-js"
import { STATS, SERVICES, PROJECTS, TESTIMONIALS } from "@/data/portfolio-data"
import { BLOG_POSTS } from "@/data/blog-data"
import type { Stat, Service, Project, Testimonial, BlogPost } from "@/types/portfolio"

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
