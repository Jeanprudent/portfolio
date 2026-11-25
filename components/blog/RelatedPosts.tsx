import Link from "next/link"
import SafeImage from "@/components/ui/SafeImage"
import { Icon } from "@iconify/react"
import { formatDate, datePublication } from "@/lib/utils"
import type { BlogPost } from "@/types/portfolio"

/**
 * Articles similaires, en pleine largeur sous la colonne de lecture.
 *
 * Occupe la place que tient la section Offres sur une fiche service : même
 * gabarit, contenu adapté au contexte (décision du 20/08).
 */
export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-balance font-heading text-2xl font-bold md:text-3xl">
        Articles similaires
      </h2>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="glass-card group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-(--bg-secondary)">
                {post.cover_url ? (
                  <SafeImage
                    src={post.cover_url}
                    alt=""
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Icon
                      icon="line-md:pencil-alt-twotone"
                      width={36}
                      aria-hidden
                      className="text-primary/25"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md px-2 py-0.5 text-xs"
                      style={{ background: "rgba(255, 122, 26,0.15)", color: "#ff7a1a" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mb-1 font-heading text-base font-semibold leading-snug text-(--text-primary) transition-colors duration-200 group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-(--text-secondary)">
                  {post.excerpt}
                </p>

                <p className="mt-auto pt-4 text-xs text-(--text-muted)">
                  {formatDate(datePublication(post))}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
