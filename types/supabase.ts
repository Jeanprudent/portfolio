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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["portfolio_config"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["portfolio_config"]["Insert"]>
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          order_index: number
          visible: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          project_url: string | null
          github_url: string | null
          tags: string[]
          category: string
          featured: boolean
          order_index: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["skills"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["stats"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["stats"]["Insert"]>
      }
    }
  }
}
