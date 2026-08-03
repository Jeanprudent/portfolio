"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/portfolio-data"
import type { Project } from "@/types/portfolio"
import { T } from "@/components/ui/T"

export function ProjectsSection({ projects = PROJECTS }: { projects?: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  // Ensure featured projects are always shown first
  const sorted = filtered.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  return (
    <section id="projets" className="section-spacing">
      <div className="container-max">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:briefcase-twotone" width={14} />
            Portfolio
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            <span className="gradient-text">Mes réalisations</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des projets concrets qui ont transformé la présence digitale de mes clients.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]"
                  : "glass border border-(--glass-border) text-(--text-secondary) hover:text-(--text-primary) hover:border-primary/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {sorted.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="glass-card overflow-hidden group"
              >
                {/* Image placeholder */}
                <div className="relative h-48 overflow-hidden">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.15))" }}
                    >
                      <Icon icon="line-md:image-twotone" width={48} className="text-(--text-muted)" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white">
                        En vedette
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          color: "#7C3AED",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-heading font-semibold text-xl text-(--text-primary) mb-2 group-hover:gradient-text transition-all duration-300">
                    <T>{project.title}</T>
                  </h3>
                  <p className="text-(--text-secondary) text-sm leading-relaxed mb-5">
                    <T>{project.description}</T>
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {project.project_url && project.project_url !== "#" && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors duration-200"
                      >
                        <Icon icon="line-md:external-link" width={15} />
                        Voir le site
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200"
                      >
                        <Icon icon="line-md:github-loop" width={15} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-(--text-secondary) mb-5 text-sm">
            Vous avez un projet en tête ?
          </p>
          <a href="#contact" className="btn-primary inline-flex">
            <Icon icon="line-md:chat-arrow-up-twotone" width={18} />
            Discutons de votre projet
          </a>
        </motion.div>
      </div>
    </section>
  )
}
