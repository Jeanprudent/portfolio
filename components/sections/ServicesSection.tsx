"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"

const SERVICE_COLORS = [
  { from: "#7C3AED", to: "#A855F7", glow: "rgba(124,58,237,0.3)" },
  { from: "#06B6D4", to: "#0891B2", glow: "rgba(6,182,212,0.3)" },
  { from: "#A855F7", to: "#EC4899", glow: "rgba(168,85,247,0.3)" },
  { from: "#7C3AED", to: "#06B6D4", glow: "rgba(124,58,237,0.25)" },
]

export function ServicesSection() {
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
            Ce que je peux faire{" "}
            <span className="gradient-text">pour vous</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des solutions digitales sur mesure pour développer votre activité et maximiser votre présence en ligne.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {SERVICES.filter((s) => s.visible).map((service, i) => {
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
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}22)`,
                    border: `1px solid ${colors.from}33`,
                  }}
                >
                  <Icon
                    icon={service.icon}
                    width={28}
                    style={{ color: colors.from }}
                  />
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-lg md:text-xl text-(--text-primary) mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-(--text-secondary) text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Arrow link */}
                <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold transition-all duration-200 group-hover:gap-3"
                  style={{ color: colors.from }}>
                  En savoir plus
                  <Icon icon="line-md:arrow-right" width={14} />
                </div>
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
