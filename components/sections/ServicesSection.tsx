"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import type { Service } from "@/types/portfolio"
import { T } from "@/components/ui/T"

const SERVICE_COLORS = [
  { from: "#7C3AED", to: "#A855F7", glow: "rgba(124,58,237,0.3)" },
  { from: "#8B5CF6", to: "#6D28D9", glow: "rgba(139,92,246,0.3)" },
  { from: "#A855F7", to: "#7C3AED", glow: "rgba(168,85,247,0.3)" },
  { from: "#6D28D9", to: "#9F67F5", glow: "rgba(109,40,217,0.25)" },
]

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

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
            Ce que je peux faire pour vous{" "}
            <span className="gradient-text"></span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des solutions digitales sur mesure pour développer votre activité et maximiser votre présence en ligne.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((service, i) => {
            const colors = SERVICE_COLORS[i % SERVICE_COLORS.length]
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="glass-card p-7 group cursor-default"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}22)`,
                    border: `1px solid ${colors.from}33`,
                  }}
                >
                  <Icon
                    icon={service.icon}
                    width={22}
                    style={{ color: colors.from }}
                  />
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-lg md:text-xl text-(--text-primary) mb-3 leading-snug">
                  <T>{service.title}</T>
                </h3>
                <p className="text-(--text-secondary) text-sm leading-relaxed">
                  <T>{service.description}</T>
                </p>

                {/* En savoir plus link */}
                <a
                  href={`/services/${service.slug ?? slugify(service.title)}`}
                  className="flex items-center gap-1.5 mt-5 text-xs font-semibold transition-all duration-200 group-hover:gap-3"
                  style={{ color: colors.from }}
                >
                  En savoir plus
                  <Icon icon="line-md:arrow-right" width={14} />
                </a>
              </motion.div>
            )
          })}
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
