"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { PROJECT_CATEGORIES } from "@/data/portfolio-data"
import type { Project } from "@/types/portfolio"
import { ProjectCard } from "@/components/projects/ProjectCard"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("all")

  // N'afficher que les onglets qui mènent quelque part : une catégorie sans
  // aucun projet donnerait un filtre qui vide la grille.
  const categories = PROJECT_CATEGORIES.filter(
    (cat) => cat.id === "all" || projects.some((p) => p.category === cat.id)
  )

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  // Les projets en vedette d'abord, l'ordre du back-office ensuite.
  const sorted = filtered
    .slice()
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  return (
    <section className="section-spacing container-max">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="section-label mb-4 inline-flex items-center gap-1.5">
          <Icon icon="line-md:briefcase-twotone" width={14} />
          Portfolio
        </span>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-(--text-primary) mt-4 mb-4">
          Projets <span className="gradient-text">réalisés</span>
        </h1>
        <p className="text-(--text-secondary) text-lg max-w-xl mx-auto">
          L&apos;ensemble de mes réalisations — sites web, référencement naturel
          et automatisation. Filtrez par type de prestation.
        </p>
      </motion.div>

      {/* Filtres */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
      >
        {categories.map((cat) => (
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
      </motion.div>

      {/* Grille */}
      <AnimatePresence mode="popLayout">
        {sorted.length > 0 ? (
          <motion.div
            key="grid"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {sorted.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
              icon="line-md:briefcase-twotone"
              width={48}
              className="text-(--text-muted) mx-auto mb-4"
            />
            <p className="text-(--text-secondary) text-sm">
              Aucun projet dans cette catégorie pour le moment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-(--text-secondary) mb-5 text-sm">
          Vous avez un projet en tête ?
        </p>
        <Link href="/#contact" className="btn-primary inline-flex">
          <Icon icon="line-md:chat-twotone" width={18} />
          Discutons de votre projet
        </Link>
      </motion.div>
    </section>
  )
}
