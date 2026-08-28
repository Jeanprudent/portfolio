"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { PROJECTS } from "@/data/portfolio-data"
import type { Project } from "@/types/portfolio"
import { ProjectCard } from "@/components/projects/ProjectCard"

/**
 * Section « Projets » de l'accueil : vitrine des seuls projets cochés
 * « En vedette » dans le back-office. Le catalogue complet, avec ses
 * filtres par catégorie, vit sur /projets.
 */
export function ProjectsSection({ projects = PROJECTS }: { projects?: Project[] }) {
  const featured = projects.filter((p) => p.featured)

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
            <span className="gradient-text">Quelques réalisations</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des projets concrets qui ont transformé la présence digitale de mes clients.
          </p>
        </motion.div>

        {/* Grille — le badge « En vedette » serait sur toutes les cartes ici */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} showFeaturedBadge={false} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/projets" className="btn-primary inline-flex">
            <Icon icon="line-md:briefcase-twotone" width={18} />
            Voir tous mes projets réalisés
          </Link>
          <p className="text-(--text-secondary) mt-6 text-sm">
            Vous avez un projet en tête ?{" "}
            <a href="#contact" className="text-primary font-semibold hover:text-primary-light transition-colors duration-200">
              Discutons-en
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
