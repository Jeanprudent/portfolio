"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import type { Project } from "@/types/portfolio"
import { T } from "@/components/ui/T"

/**
 * Carte projet partagée par la section « Projets » de l'accueil et la page
 * /projets. Extraite de ProjectsSection pour que les deux rendus ne
 * divergent pas au premier ajustement de style.
 *
 * `showFeaturedBadge` : inutile sur l'accueil, qui n'affiche QUE les projets
 * en vedette — le badge y serait sur toutes les cartes.
 */
export function ProjectCard({
  project,
  showFeaturedBadge = true,
}: {
  project: Project
  showFeaturedBadge?: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-card overflow-hidden group"
    >
      {/* Visuel */}
      <div className="relative h-48 overflow-hidden">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            /* Un alt reduit au titre ne dit ni ce qu'on voit, ni qui l'a fait.
               La categorie vient de la fiche du projet : aucun lieu n'est
               ajoute ici, plusieurs references sont a l'etranger. */
            alt={`Aperçu du site ${project.title}, ${project.category} réalisé par Jean Prudent IDOHOU`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255, 122, 26,0.15), rgba(255, 122, 26,0.15))" }}
          >
            <Icon icon="line-md:image-twotone" width={48} className="text-(--text-muted)" />
          </div>
        )}
        {showFeaturedBadge && project.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white">
              En vedette
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-60" />
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-md text-xs font-medium"
              style={{
                background: "rgba(255, 122, 26,0.1)",
                border: "1px solid rgba(255, 122, 26,0.2)",
                color: "#ff7a1a",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-heading font-semibold text-xl text-(--text-primary) mb-2 group-hover:gradient-text transition-all duration-300">
          <T>{project.title}</T>
        </h3>
        <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">
          <T>{project.description}</T>
        </p>

        {/* Resultat mesure. Absent tant que le projet n'a pas de chiffre a
            montrer : un badge vide vaudrait moins que pas de badge. */}
        {project.result && (
          <p className="inline-flex items-center gap-1.5 mb-5 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <Icon icon="line-md:arrow-up" width={15} className="shrink-0" />
            <T>{project.result}</T>
          </p>
        )}

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
  )
}
