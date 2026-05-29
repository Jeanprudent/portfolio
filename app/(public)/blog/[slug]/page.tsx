import { notFound } from "next/navigation"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { BLOG_POSTS } from "@/data/blog-data"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return BLOG_POSTS.filter((p) => p.published).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — Jean Prudent IDOHOU`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug && p.published)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.id !== post.id && p.published).slice(0, 2)

  return (
    <article className="section-spacing container-max max-w-3xl">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-primary transition-colors duration-200 mb-10 group"
      >
        <Icon
          icon="line-md:arrow-left"
          width={14}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        Retour au blog
      </Link>

      {/* Cover */}
      <div
        className="w-full h-56 md:h-72 rounded-2xl flex items-center justify-center mb-8"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Icon icon="line-md:pencil-alt-twotone" width={60} className="text-primary/25" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.15)", color: "#A855F7" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-(--text-primary) leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-(--text-muted) mb-10 pb-8" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <span className="flex items-center gap-1.5">
          <Icon icon="line-md:person-twotone" width={14} />
          Jean Prudent IDOHOU
        </span>
        <span className="flex items-center gap-1.5">
          <Icon icon="line-md:calendar-twotone" width={14} />
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </span>
      </div>

      {/* Content */}
      <div
        className="prose-jp"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author CTA */}
      <div
        className="mt-14 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        style={{
          background: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
        >
          <Icon icon="line-md:person-twotone" width={28} className="text-[#A855F7]" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm mb-0.5">Jean Prudent IDOHOU</p>
          <p className="text-white/50 text-sm">
            Développeur web &amp; Designer basé à Cotonou. Vous avez un projet web ?
          </p>
        </div>
        <Link
          href="/#contact"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          Me contacter
        </Link>
      </div>

      {/* Share */}
      <div className="mt-8 flex items-center gap-3">
        <span className="text-sm text-(--text-muted)">Partager :</span>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://jeanprudent.dev/blog/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200"
          aria-label="Partager sur LinkedIn"
        >
          <Icon icon="line-md:linkedin" width={16} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://jeanprudent.dev/blog/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200"
          aria-label="Partager sur Facebook"
        >
          <Icon icon="line-md:facebook" width={16} />
        </a>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading font-bold text-xl text-(--text-primary) mb-6">
            Articles similaires
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="glass-card p-5 group hover:border-primary/30 transition-colors duration-300"
              >
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {rel.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: "rgba(124,58,237,0.15)", color: "#A855F7" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-(--text-primary) group-hover:text-primary transition-colors duration-200 leading-snug mb-1">
                  {rel.title}
                </p>
                <p className="text-xs text-(--text-muted)">{formatDate(rel.created_at)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
