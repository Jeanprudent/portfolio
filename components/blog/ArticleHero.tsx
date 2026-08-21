import SafeImage from "@/components/ui/SafeImage"
import { Icon } from "@iconify/react"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types/portfolio"

/**
 * Bandeau d'article, calqué sur ServiceHero : bannière pleine largeur,
 * voile dégradé, titre et méta par-dessus.
 *
 * Seul composant de la page à émettre un <h1>.
 */
export default function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <header className="relative mb-12 w-full overflow-hidden rounded-2xl">
      <div className="relative min-h-[18rem] md:min-h-[22rem]">
        {post.cover_url ? (
          <SafeImage
            src={post.cover_url}
            alt=""
            priority
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 gradient-mesh bg-(--bg-secondary)" />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.30) 100%)",
          }}
        />

        <div className="relative flex min-h-[18rem] flex-col items-start justify-center gap-4 p-6 md:min-h-[22rem] md:p-10">
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <h1 className="max-w-3xl text-balance font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <Icon icon="line-md:person-twotone" width={15} aria-hidden />
              Jean Prudent IDOHOU
            </span>
            <span className="flex items-center gap-1.5">
              <Icon icon="line-md:calendar-twotone" width={15} aria-hidden />
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
