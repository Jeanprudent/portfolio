"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { useAutoTranslate } from "@/hooks/useAutoTranslate"
import type { PortfolioConfig } from "@/lib/supabase-data"
import { CONTACT_LOCATION } from "@/lib/contact-info"

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
]

export function AboutSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const bio = useAutoTranslate(config?.bio || "")
  const location = config?.location || CONTACT_LOCATION

  return (
    <section id="a-propos" className="section-spacing">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-stretch">
          {/* Photo side — full-cover */}
          <motion.div
            className="relative w-full max-w-xs mx-auto lg:max-w-none lg:mx-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="animated-border h-full lg:min-h-[360px]">
              <div
                className="relative w-full aspect-square lg:h-full lg:aspect-[1] rounded-[calc(1rem-1px)] overflow-hidden"
                style={{ background: "var(--bg)" }}
              >
                {config?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.avatar_url}
                    alt={config.site_name || "Jean Prudent"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.15))",
                    }}
                  >
                    <Icon icon="line-md:person-twotone" width={80} className="text-primary opacity-60" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-lg text-(--text-primary)">
                        {config?.site_name || "Jean Prudent"}
                      </p>
                      <p className="text-secondary text-sm font-medium">Dev & Designer</p>
                    </div>
                  </div>
                )}

                {/* Gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                  }}
                />

                {/* Floating badges over image */}
                <motion.div
                  className="absolute top-4 right-4 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon icon="line-md:star-twotone" width={16} className="text-primary" />
                  <span className="text-xs font-semibold text-black">96% {t("about.badge_satisfaction")}</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-4 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Icon icon="line-md:confirm-circle-twotone" width={16} className="text-green-400" />
                  <span className="text-xs font-semibold text-white">+15 {t("about.badge_projects")}</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 right-4 glass rounded-xl border border-(--glass-border) px-3 py-2 flex items-center gap-2"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Icon icon="line-md:map-marker-twotone" width={16} className="text-primary" />
                  <span className="text-xs font-semibold text-white">{location}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            className="space-y-7 flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div>
              <span className="section-label mb-4 inline-flex">
                <Icon icon="line-md:person-twotone" width={14} />
                {t("about.label")}
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-(--text-primary) leading-tight mt-4 mb-5">
                {t("about.title")} <span className="gradient-text">{t("about.title_highlight")}</span>
              </h2>
              <div className="space-y-4 text-(--text-secondary) leading-relaxed">
                {config?.bio ? (
                  <p>{bio}</p>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <a href="#contact" className="btn-primary w-full justify-center sm:w-auto">
                <Icon icon="line-md:telegram" width={18} />
                {t("about.cta_contact")}
              </a>
              <a
                href={config?.github_url || "https://github.com/Jeanprudent"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon icon="line-md:github-loop" width={18} />
                {t("about.cta_github")}
              </a>
              <a
                href="/cv.pdf"
                download="CV-Jean-Prudent-IDOHOU.pdf"
                className="btn-ghost"
              >
                <Icon icon="line-md:download-loop" width={18} />
                {t("about.cta_cv")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
