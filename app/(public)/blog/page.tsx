import { getBlogPosts } from "@/lib/supabase-data"
import { BlogList } from "./BlogList"

// Relire les articles depuis Supabase à chaque requête pour refléter
// les ajouts/suppressions effectués dans le backoffice.
export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogList posts={posts} />
}
