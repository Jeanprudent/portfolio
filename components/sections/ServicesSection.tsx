"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import type { Service } from "@/types/portfolio"
import { T } from "@/components/ui/T"
import { serviceSlug } from "@/lib/slug"

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
 * Carte de service EMPILABLE.
 *
 * Mécanique : chaque carte est un bloc `sticky` qui s'épingle en haut à une
 * hauteur croissante (index × 26 px) ; les cartes se recouvrent donc en
 * laissant dépasser le bord supérieur de la précédente. En parallèle, l'échelle
 * décroît avec l'avancement du scroll (origine en haut) : la carte « enterrée »
 * rapetisse légèrement, ce qui donne la profondeur du paquet.
 *
 * Respecte prefers-reduced-motion : on fige l'échelle à 1 (empilement simple,
 * sans animation de mise à l'échelle).
 */
function StackedServiceCard({
  service,
  index,
  total,
  progress,
}: {
  service: Service
  index: number
  total: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const reduce = useReducedMotion()
  const href = `/services/${serviceSlug(service)}`
  const image = resolveImage(service)
  const number = String(index + 1).padStart(2, "0")
  const imageRight = index % 2 === 0

  const targetScale = 1 - (total - 1 - index) * 0.04
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  const top = 96 + index * 26

  return (
    <div className="h-[86vh] md:h-[82vh] sticky flex items-start justify-center" style={{ top }}>
      <motion.article
        style={{ scale: reduce ? undefined : scale }}
        className="origin-top w-full overflow-hidden rounded-3xl border border-(--glass-border) bg-(--bg) shadow-[0_24px_60px_-20px_rgba(18,18,18,0.22)]"
      >
        <div className="grid md:grid-cols-2 items-stretch">
          {/* Illustration */}
          <div
            className={`relative min-h-[220px] md:min-h-[460px] overflow-hidden bg-(--bg-secondary) ${
              imageRight ? "md:order-2" : "md:order-1"
            }`}
          >
            {image ? (
              <Image
                src={image}
                alt={service.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(135deg,rgba(255,122,26,0.15),rgba(18,18,18,0.10))]">
                <Icon icon={service.icon} width={56} className="text-primary" aria-hidden />
              </div>
            )}
            {/* Liseré orange de marque */}
            <span
              className={`absolute inset-y-0 w-1.5 bg-primary ${imageRight ? "left-0" : "right-0"}`}
              aria-hidden
            />
          </div>

          {/* Contenu */}
          <div
            className={`flex flex-col justify-center p-7 md:p-12 ${
              imageRight ? "md:order-1" : "md:order-2"
            }`}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="font-heading text-5xl md:text-6xl font-black leading-none text-primary/25">
                {number}
              </span>
              <span className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0">
                <Icon icon={service.icon} width={24} aria-hidden />
              </span>
            </div>

            <h3 className="font-heading font-extrabold uppercase tracking-tight text-2xl md:text-4xl text-(--text-primary) leading-[1.05] mb-4">
              <T>{service.title}</T>
            </h3>

            <p className="text-(--text-secondary) text-sm md:text-base leading-relaxed max-w-prose">
              <T>{service.description}</T>
            </p>

            <a href={href} className="btn-primary mt-7 self-start">
              En savoir plus
              <Icon icon="line-md:arrow-right" width={16} aria-hidden />
              <span className="sr-only"> sur {service.title}</span>
            </a>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export function ServicesSection({
  services = SERVICES.filter((s) => s.visible),
}: {
  services?: Service[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <section id="services" className="section-spacing">
      <div className="container-max">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:star-twotone" width={14} />
            Mes services
          </span>
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-4xl md:text-5xl lg:text-6xl text-(--text-primary) mb-4 leading-[1.02]">
            Ce que je fais <span className="text-primary">pour vous</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed">
            Des solutions digitales sur mesure pour développer votre activité et maximiser
            votre présence en ligne.
          </p>
        </motion.div>

        {/* Pile de cartes */}
        <div ref={containerRef} className="relative">
          {services.map((service, i) => (
            <StackedServiceCard
              key={service.id}
              service={service}
              index={i}
              total={services.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
