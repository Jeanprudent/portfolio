"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { ParticlesCanvas } from "./ParticlesCanvas"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"
import ROICalculator from "@/components/ui/ROICalculator"

export function HeroSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const location = config?.location || "Cotonou, Bénin"
  const disponible = config?.disponible !== false
  const tagline = config?.tagline || "Je crée des sites web qui transforment votre présence en ligne en moteur de croissance."

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      paddingTop: 60,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  }

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Canvas Particles */}
      <ParticlesCanvas />

      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      {/* Decorative glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 10s ease-in-out infinite 2s",
        }}
      />

      {/* Main content: left copy + right ROI calculator on desktop */}
      <motion.div
        className="relative z-10 px-4 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="md:grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
          {/* Left: copy and CTAs */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="font-heading font-bold text-2xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              Transformez votre <span className="gradient-text">site web</span> en machine à clients automatique
            </h1>

            <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-xl">
              J'aide les PME et entrepreneurs à gagner en visibilité, automatiser leurs processus de travail et accélérer leur croissance grâce à des sites web performants, au SEO et à des automatisations intelligentes.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="/#contact" className="btn-primary" aria-label="Réserver audit SEO gratuit 15 minutes">
                <Icon icon="line-md:briefcase-twotone" width={18} />
                Réserver un audit gratuit
                <Icon icon="line-md:arrow-right" width={16} />
              </a>

              <a href="#contact" className="btn-ghost">
                <Icon icon="line-md:telegram" width={18} />
                {t("hero.cta_secondary")}
              </a>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {[
                { icon: "line-md:github-loop", href: "https://github.com/Jeanprudent", label: "GitHub" },
                { icon: "line-md:linkedin", href: "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287", label: "LinkedIn" },
                { icon: "line-md:facebook", href: "https://www.facebook.com/jean.prudent.2025", label: "Facebook" },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded-xl glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all">
                  <Icon icon={s.icon} width={19} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: ROI calculator */}
          <motion.div variants={itemVariants} className="mt-6 md:mt-0">
            <ROICalculator />
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
