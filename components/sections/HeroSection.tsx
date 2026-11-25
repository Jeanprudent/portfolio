"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { ParticlesCanvas } from "./ParticlesCanvas"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import type { PortfolioConfig } from "@/lib/supabase-data"
// ROICalculator est retiré du hero (bloc commenté plus bas). L'import est
// commenté avec lui : le laisser actif déclenche un avertissement de lint.
// Pour le réactiver, décommenter cette ligne ET le bloc « Right: ROI calculator ».
// import ROICalculator from "@/components/ui/ROICalculator"

export function HeroSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  // location / disponible / tagline ont été retirés : les blocs qui les
  // affichaient (badge de localisation, accroche) sont commentés plus bas.
  // Les rétablir en même temps que ces blocs si besoin.

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

      {/* Decorative glow orbs — orange de marque */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.20) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.12) 0%, transparent 70%)",
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
        <div className="md:grid md:grid-cols-1 gap-8 items-center text-center">
          {/* Left: copy and CTAs */}
          <motion.div variants={itemVariants} className="space-y-6 flex flex-col items-center">
            <h1 className="font-heading font-extrabold uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tight">
              Transformez votre <span className="text-primary">présence en ligne</span> en machine à clients automatique
            </h1>

            <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-xl">
              Vous êtes une PME/TPE ou Entrepreneur, je vous aide à gagner en visibilité, automatiser votre processus de travail et accélérer votre croissance grâce à un site web performant optimisé pour le SEO et à des automatisations intelligentes.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/#projets" className="btn-primary w-full justify-center sm:w-auto">
                <Icon icon="line-md:briefcase-twotone" width={18} />
                {t("hero.cta_primary")}
                <Icon icon="line-md:arrow-right" width={16} />
              </Link>

              <a href="#contact" className="btn-ghost w-full justify-center sm:w-auto">
                <Icon icon="line-md:telegram" width={18} />
                {t("hero.cta_secondary")}
              </a>
            </div>

            {/* Social media links
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
            */}
            
          </motion.div>

          {/* Right: ROI calculator 
          <motion.div variants={itemVariants} className="mt-6 md:mt-0">
            <ROICalculator />
          </motion.div> */}
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
