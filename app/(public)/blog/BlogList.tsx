"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import type { BlogPost } from "@/types/portfolio"
import { formatDate, cn, datePublication } from "@/lib/utils"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState("Tous")
  const [search, setSearch] = useState("")

  const allTags = ["Tous", ...Array.from(new Set(posts.flatMap((p) => p.tags)))]

  const filtered = posts.filter((post) => {
    const matchTag = activeTag === "Tous" || post.tags.includes(activeTag)
    const matchSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <section className="section-spacing container-max">
      {/* Header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="section-label mb-4 inline-flex items-center gap-1.5">
          <Icon icon="line-md:pencil-alt-twotone" width={14} />
          Blog
        </span>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-(--text-primary) mt-4 mb-4">
          Articles &amp;{" "}
          <span className="gradient-text">Conseils</span>
        </h1>
        <p className="text-(--text-secondary) text-lg max-w-xl mx-auto">
          Web design, Référencement SEO, automatisation; des conseils concrets pour développer votre présence en ligne.
        </p>
      </motion.div>

      {/* Search + Tags */}
      <motion.div
        className="mb-10 flex flex-col gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      >
        <div className="relative w-full max-w-sm">
          <Icon
            icon="line-md:search"
            width={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none transition-colors duration-200"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200",
                activeTag === tag
                  ? "text-white"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
              )}
              style={
                activeTag === tag
                  ? {
                      background: "rgba(255, 122, 26,0.25)",
                      border: "1px solid rgba(255, 122, 26,0.4)",
                    }
                  : {
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-col h-full glass-card overflow-hidden group hover:border-primary/30 transition-colors duration-300"
                >
                  {/* Cover */}
                  <div
                    className="h-44 flex items-center justify-center shrink-0 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 122, 26,0.1), rgba(255, 122, 26,0.07))",
                    }}
                  >
                    {post.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        icon="line-md:pencil-alt-twotone"
                        width={44}
                        className="text-primary/30"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            background: "rgba(255, 122, 26,0.15)",
                            color: "#ff7a1a",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-heading font-semibold text-base text-(--text-primary) group-hover:text-primary transition-colors duration-200 leading-snug mb-2">
                      {post.title}
                    </h2>
                    <p className="text-(--text-secondary) text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-(--text-muted)">
                      <time dateTime={datePublication(post)}>{formatDate(datePublication(post))}</time>
                      <span className="flex items-center gap-1 text-primary/60 group-hover:text-primary transition-colors duration-200">
                        Lire
                        <Icon icon="line-md:arrow-right" width={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Icon
              icon="line-md:document-list-twotone"
              width={48}
              className="text-(--text-muted) mx-auto mb-4"
            />
            <p className="text-(--text-secondary) text-sm">
              Aucun article ne correspond à votre recherche.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveTag("Tous") }}
              className="mt-4 text-primary text-sm hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
