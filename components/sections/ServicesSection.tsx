"use client"

import React, { useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import type { Service } from "@/types/portfolio"
import { T } from "@/components/ui/T"
import { serviceSlug } from "@/lib/slug"

const SERVICE_COLORS = [
  { from: "#7C3AED", to: "#A855F7", glow: "rgba(124,58,237,0.30)" },
  { from: "#8B5CF6", to: "#6D28D9", glow: "rgba(139,92,246,0.30)" },
  { from: "#A855F7", to: "#7C3AED", glow: "rgba(168,85,247,0.30)" },
  { from: "#6D28D9", to: "#9F67F5", glow: "rgba(109,40,217,0.25)" },
]

/**
 * Illustrations livrées avec le site (public/services, voir CREDITS.md).
 * Indexées par slug canonique — la table `services` de Supabase ne stocke
 * aucune colonne `banner`, c'est donc ce repli qui alimente les cartes.
 */
const SERVICE_IMAGES: Record<string, string> = {
  "creation-de-sites-web-sur-mesure": "/services/creation-de-sites-web-sur-mesure.webp",
  "optimisation-seo-visibilite-google": "/services/optimisation-seo-visibilite-google.webp",
  "maintenance-support-wordpress": "/services/maintenance-support-wordpress.webp",
  "automatisation-optimisation-digitale": "/services/automatisation-optimisation-digitale.webp",
}

// Anciens placeholders SVG ("/services/<slug>.svg") encore stockés en base :
// on les ignore au profit des vraies photos ci-dessus.
const LEGACY_PLACEHOLDER = /^\/services\/[a-z0-9-]+\.svg$/

function resolveImage(service: Service): string | null {
  if (service.banner && !LEGACY_PLACEHOLDER.test(service.banner)) return service.banner
  return SERVICE_IMAGES[serviceSlug(service)] ?? null
}

/**
 * Effet de bascule 3D au survol, sans dépendance externe.
 * Désactivé au clavier/tactile et si l'utilisateur a demandé moins d'animations.
 */
function useTilt(enabled = true) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!finePointer.matches || reduced.matches) return

    let frame = 0

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * 10
        const rotateX = (0.5 - py) * 7
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ""
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      el.style.transform = ""
    }
  }, [enabled])

  return ref
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const colors = SERVICE_COLORS[index % SERVICE_COLORS.length]
  const href = `/services/${serviceSlug(service)}`
  const image = resolveImage(service)
  // Le tilt vit sur la carte interne : la reveal framer-motion reste
  // sur le wrapper, les deux n'écrivent jamais sur le même `transform`.
  const tiltRef = useTilt()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <article
        ref={tiltRef as React.RefObject<HTMLElement>}
        className="glass-card group h-full flex flex-col overflow-hidden will-change-transform"
      >
        {/* Illustration du service — ratio fixe pour éviter tout décalage de mise en page */}
        <div className="relative w-full aspect-[8/5] sm:aspect-[16/9] overflow-hidden bg-(--bg-secondary)">
          {image ? (
            <Image
              src={image}
              alt={`${service.title}`}
              fill
              sizes="(min-width: 1200px) 560px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}22)`,
              }}
            >
              <Icon icon={service.icon} width={44} style={{ color: colors.from }} aria-hidden />
            </div>
          )}

          {/* Voile dégradé : garantit le contraste de la pastille dans les deux thèmes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 38%, rgba(0,0,0,0) 70%)",
            }}
          />

          {/* Pastille d'icône posée sur l'image */}
          <div
            className="absolute bottom-3 left-4 w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${colors.from}CC, ${colors.to}CC)`,
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: `0 6px 20px ${colors.glow}`,
            }}
          >
            <Icon icon={service.icon} width={22} className="text-white" aria-hidden />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-heading font-semibold text-lg md:text-xl text-(--text-primary) leading-snug mb-3">
            <T>{service.title}</T>
          </h3>

          <p className="text-(--text-secondary) text-sm leading-relaxed">
            <T>{service.description}</T>
          </p>

          <a
            href={href}
            className="inline-flex items-center gap-1.5 mt-auto pt-5 text-xs font-semibold transition-all duration-200 group-hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current rounded-sm self-start"
            style={{ color: colors.from }}
          >
            En savoir plus
            <Icon icon="line-md:arrow-right" width={14} aria-hidden />
            <span className="sr-only"> sur {service.title}</span>
          </a>
        </div>
      </article>
    </motion.div>
  )
}

export function ServicesSection({ services = SERVICES.filter((s) => s.visible) }: { services?: Service[] }) {
  return (
    <section id="services" className="section-spacing">
      <div className="container-max">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:star-twotone" width={14} />
            Mes services
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Ce que je fais{" "}
            <span className="gradient-text">pour vous</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des solutions digitales sur mesure pour développer votre activité et maximiser votre présence en ligne.
          </p>
        </motion.div>

        {/* Service Cards grid */}
        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#contact" className="btn-primary inline-flex">
            <Icon icon="line-md:phone-call-loop" width={18} />
            Discutons de votre projet
          </a>
        </motion.div>
      </div>
    </section>
  )
}
