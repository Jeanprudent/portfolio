import type { Metadata } from "next"
import { getBlogPosts } from "@/lib/supabase-data"
import { BlogList } from "./BlogList"

// Relire les articles depuis Supabase à chaque requête pour refléter
// les ajouts/suppressions effectués dans le backoffice.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog : conseils web, SEO & automatisation au Bénin",
  description:
    "Articles et guides pratiques sur la création de sites web, le référencement naturel (SEO) et l'automatisation, pour les entrepreneurs, PME et artisans au Bénin.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog : conseils web, SEO & automatisation | Jean Prudent",
    description:
      "Conseils concrets pour développer votre présence en ligne : sites web, SEO local et automatisation.",
    url: "/blog",
    locale: "fr_FR",
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogList posts={posts} />
}
