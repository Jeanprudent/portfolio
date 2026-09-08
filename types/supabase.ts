
export type Database = {
  public: {
    Tables: {
      portfolio_config: {
        Row: {
          id: string
          site_name: string
          tagline: string
          bio: string
          email: string
          whatsapp: string
          location: string
          avatar_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string
          github_url: string | null
          linkedin_url: string | null
          facebook_url: string | null
          seo_title: string | null
          seo_description: string | null
          google_analytics_id: string | null
          font_pair: string
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          site_name?: string
          tagline?: string
          bio?: string
          email?: string
          whatsapp?: string
          location?: string
          avatar_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          github_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          google_analytics_id?: string | null
          font_pair?: string
          disponible?: boolean
        }
        Update: {
          site_name?: string
          tagline?: string
          bio?: string
          email?: string
          whatsapp?: string
          location?: string
          avatar_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          github_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          google_analytics_id?: string | null
          font_pair?: string
          disponible?: boolean
        }
        Relationships: []
      }
      // Colonnes slug, banner, long_description, offers et content ajoutées
      // par les migrations 003 et 004. Sans elles ici, le client Supabase
      // typé rejette les écritures du back-office.
      services: {
        Row: {
          id: string
          title: string
          slug: string | null
          description: string
          long_description: string | null
          banner: string | null
          icon: string
          offers: unknown
          content: unknown
          order_index: number
          visible: boolean
          created_at: string
        }
        Insert: {
          title: string
          slug?: string | null
          description: string
          long_description?: string | null
          banner?: string | null
          icon?: string
          offers?: unknown
          content?: unknown
          order_index?: number
          visible?: boolean
        }
        Update: {
          title?: string
          slug?: string | null
          description?: string
          long_description?: string | null
          banner?: string | null
          icon?: string
          offers?: unknown
          content?: unknown
          order_index?: number
          visible?: boolean
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          project_url: string | null
          github_url: string | null
          result: string | null
          tags: string[]
          category: string
          featured: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          title: string
          description: string
          image_url?: string | null
          project_url?: string | null
          github_url?: string | null
          result?: string | null
          tags?: string[]
          category?: string
          featured?: boolean
          order_index?: number
        }
        Update: {
          title?: string
          description?: string
          image_url?: string | null
          project_url?: string | null
          github_url?: string | null
          result?: string | null
          tags?: string[]
          category?: string
          featured?: boolean
          order_index?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
          icon: string
          category: string
          level: number
          order_index: number
        }
        Insert: {
          name: string
          icon: string
          category?: string
          level?: number
          order_index?: number
        }
        Update: {
          name?: string
          icon?: string
          category?: string
          level?: number
          order_index?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          company: string
          text: string
          avatar_url: string | null
          rating: number
          visible: boolean
          created_at: string
        }
        Insert: {
          name: string
          role: string
          company: string
          text: string
          avatar_url?: string | null
          rating?: number
          visible?: boolean
        }
        Update: {
          name?: string
          role?: string
          company?: string
          text?: string
          avatar_url?: string | null
          rating?: number
          visible?: boolean
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_url: string | null
          tags: string[]
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          slug: string
          content?: string
          excerpt?: string
          cover_url?: string | null
          tags?: string[]
          published?: boolean
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          cover_url?: string | null
          tags?: string[]
          published?: boolean
        }
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          label: string
          value: number
          suffix: string
          icon: string
          order_index: number
        }
        Insert: {
          label: string
          value: number
          suffix?: string
          icon?: string
          order_index?: number
        }
        Update: {
          label?: string
          value?: number
          suffix?: string
          icon?: string
          order_index?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
