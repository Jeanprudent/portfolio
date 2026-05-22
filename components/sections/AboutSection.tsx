"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"

const HIGHLIGHTS = [
  {
    icon: "line-md:laptop-twotone",
    label: "Développement Web",
    description: "Sites sur mesure avec les dernières technologies",
  },
  {
    icon: "line-md:search-twotone",
    label: "Expert SEO",
    description: "Référencement naturel et visibilité Google",
  },
  {
    icon: "line-md:lightning-twotone-loop",
    label: "Automatisation",
    description: "Workflows n8n pour optimiser vos processus",
  },
]

export function AboutSection() {
  return (
    <section id="a-propos" className="section-spacing">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Visual side */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Avatar card */}
            <div className="relative">
              <div className="animated-border">
                <div
                  className="w-64 h-64 md:w-80 md:h-80 rounded-[calc(1rem-1px)] flex flex-col items-center justify-center gap-4"
                  style={{ background: "var(--bg)" }}
                >
                  {/* Avatar placeholder */}
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))",
                      border: "2px solid rgba(124,58,237,0.3)",
                    }}
                  >
                    <Icon icon="line-md:person-twotone" width={60} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading font-bold text-lg text-(--text-primary)">Jean Prudent</p>
                    <p className="text-secondary text-sm font-medium">Dev & Designer</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -right-4 -top-4 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon icon="line-md:star-twotone" width={16} className="text-yellow-400" />
                <span className="text-xs font-semibold text-(--text-primary)">96% satisfaction</span>
              </motion.div>

              <motion.div
                className="absolute -left-4 -bottom-4 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Icon icon="line-md:confirm-circle-twotone" width={16} className="text-green-400" />
                <span className="text-xs font-semibold text-(--text-primary)">+15 projets livrés</span>
              </motion.div>

              <motion.div
                className="absolute -left-8 top-1/3 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Icon icon="line-md:map-marker-twotone" width={16} className="text-primary" />
                <span className="text-xs font-semibold text-(--text-primary)">Cotonou, Bénin</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            className="space-y-7"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div>
              <span className="section-label mb-4 inline-flex">
                <Icon icon="line-md:person-twotone" width={14} />
                À propos de moi
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-(--text-primary) leading-tight mt-4 mb-5">
                Votre partenaire digital <span className="gradient-text">de confiance</span>
              </h2>
              <div className="space-y-4 text-(--text-secondary) leading-relaxed">
                <p>
                  Je suis <strong className="text-(--text-primary) font-semibold">Jean Prudent IDOHOU</strong>,
                  développeur frontend & web designer spécialisé dans la création de solutions digitales
                  stratégiques pour les <strong className="text-(--text-primary)">PME, TPE et entrepreneurs</strong>.
                </p>
                <p>
                  Ma mission : concevoir des sites web <strong className="text-(--text-primary)">performants,
                  élégants et optimisés pour le SEO</strong> afin d&apos;accroître votre visibilité, convertir
                  plus de prospects en clients et transformer votre présence en ligne en véritable levier de croissance.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid gap-3">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-4 glass rounded-xl p-4 border border-(--glass-border) hover:border-primary/30 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon icon={h.icon} width={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-(--text-primary) text-sm mb-0.5">{h.label}</p>
                    <p className="text-(--text-secondary) text-xs leading-relaxed">{h.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#contact" className="btn-primary">
                <Icon icon="line-md:telegram" width={18} />
                Me contacter
              </a>
              <a
                href="https://github.com/Jeanprudent"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon icon="line-md:github-loop" width={18} />
                Mon GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
