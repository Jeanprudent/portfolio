export interface PortfolioConfig {
  id: string
  site_name: string
  tagline: string
  bio: string
  email: string
  whatsapp: string
  location: string
  avatar_url?: string
  primary_color: string
  secondary_color?: string
  accent_color?: string
  github_url?: string
  linkedin_url?: string
  facebook_url?: string
  seo_title?: string
  seo_description?: string
  google_analytics_id?: string
  disponible?: boolean
}

export interface Offer {
  id: string
  name: string
  price?: string
  price_min?: number
  price_max?: number
  currency?: string
  duration_days: number
  description: string
}

export interface Service {
  id: string
  title: string
  slug?: string
  description: string
  long_description?: string
  banner?: string
  /**
   * Contenu structuré des sections de la fiche (colonne jsonb `content`,
   * migration 004). Volontairement typé `unknown` : la forme est validée à
   * la lecture par parseServiceContent, jamais supposée ici.
   */
  content?: unknown
  offers?: Offer[]
  icon: string
  order_index: number
  visible: boolean
  created_at?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  project_url?: string
  github_url?: string
  /** Resultat mesure, affiche en badge sur la carte. Vide tant qu il n y a pas de chiffre verifiable. */
  result?: string
  tags: string[]
  category: string
  featured: boolean
  order_index: number
  created_at?: string
}

export interface Skill {
  id: string
  name: string
  icon: string
  category: "frontend" | "backend" | "cms" | "design" | "tools" | "seo"
  level: number
  order_index?: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  avatar_url?: string
  rating: number
  visible: boolean
  created_at?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_url?: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  order_index: number
}
