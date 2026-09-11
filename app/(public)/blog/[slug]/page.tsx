import { notFound } from "next/navigation"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { Metadata } from "next"

import ArticleHero from "@/components/blog/ArticleHero"
import RelatedPosts from "@/components/blog/RelatedPosts"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"

import { getBlogPost, getBlogPosts } from "@/lib/supabase-data"
import { sanitizeHtml } from "@/lib/sanitize"
import { absoluteUrl } from "@/lib/site"
import { datePublication } from "@/lib/utils"
import { CONTACT_EMAIL } from "@/lib/contact-info"

// Relire l'article depuis Supabase à chaque requête (backoffice).
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Article introuvable" }

  const path = `/blog/${post.slug}`

  // Le gabarit « %s | Jean Prudent » du layout ajoute 15 caractères : au-delà
  // de 45 ici, le titre est tronqué dans les résultats Google.
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(path),
      publishedTime: datePublication(post),
      modifiedTime: post.updated_at || post.created_at,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const related = (await getBlogPosts()).filter((p) => p.id !== post.id).slice(0, 3)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <div className="container-max section-spacing">
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <Link
        href="/blog"
        className="group mb-6 inline-flex items-center gap-1.5 text-sm text-(--text-secondary) transition-colors duration-200 hover:text-primary"
      >
        <Icon
          icon="line-md:arrow-left"
          width={14}
          aria-hidden
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Retour au blog
      </Link>

      <ArticleHero post={post} />

      {/* Même gabarit que les fiches services : lecture en 2/3, encart collé. */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div
            className="prose-jp max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                <Icon
                  icon="line-md:person-twotone"
                  width={22}
                  aria-hidden
                  className="text-primary"
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--text-primary)">
                  Jean Prudent IDOHOU
                </p>
                <p className="text-xs text-(--text-muted)">Développeur web &amp; designer</p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-(--text-secondary)">
              J&apos;accompagne les PME et entrepreneurs de Cotonou, de la conception
              du site à son référencement. Un projet en tête ?
            </p>

            <Link href="/#contact" className="btn-primary w-full justify-center text-sm">
              <Icon icon="line-md:telegram" width={16} aria-hidden />
              Me contacter
            </Link>

            <div className="mt-4 space-y-1 text-sm text-(--text-secondary)">
              <div>
                Email : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>

            <div
              className="mt-5 border-t pt-4"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <p className="mb-2 text-xs uppercase tracking-wide text-(--text-muted)">
                Partager
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Partager sur LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass border border-(--glass-border) text-(--text-secondary) transition-all duration-200 hover:border-primary/40 hover:text-primary"
                >
                  <Icon icon="line-md:linkedin" width={16} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Partager sur Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass border border-(--glass-border) text-(--text-secondary) transition-all duration-200 hover:border-primary/40 hover:text-primary"
                >
                  <Icon icon="line-md:facebook" width={16} />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Pleine largeur, à la place qu'occupe la section Offres sur une fiche. */}
      <RelatedPosts posts={related} />
    </div>
  )
}
