"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { ParticlesCanvas } from "./ParticlesCanvas"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"

function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5)
  const [hourlyRate, setHourlyRate] = useState<number>(10000) // FCFA

  const annualCost = Math.max(0, hoursPerWeek) * Math.max(0, hourlyRate) * 52

  const formatted = (value: number) => {
    try {
      return new Intl.NumberFormat('fr-FR').format(value)
    } catch {
      return String(value)
    }
  }

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-white/3 to-white/5 rounded-lg border border-(--glass-border) max-w-xl mx-auto">
      <h4 className="font-semibold text-sm mb-2">Combien d'heures perdez-vous chaque semaine ?</h4>
      <p className="text-(--text-secondary) text-xs mb-3">À 10 000 FCFA / 15€ l'heure, combien perdez-vous par an à cause des tâches manuelles (emails, relances, saisie) ?</p>

      <div className="grid grid-cols-2 gap-3 items-end">
        <label htmlFor="hours" className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Heures / semaine</span>
          <input
            id="hours"
            type="number"
            min={0}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="input"
            aria-label="Heures par semaine"
          />
        </label>

        <label htmlFor="rate" className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Tarif horaire (FCFA)</span>
          <input
            id="rate"
            type="number"
            min={0}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="input"
            aria-label="Tarif horaire en FCFA"
          />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-(--text-secondary)">Coût annuel estimé</div>
          <div className="font-heading font-bold text-lg">{formatted(annualCost)} FCFA</div>
        </div>

        <div className="text-right">
          <button
            type="button"
            className="btn-outline mr-2"
            onClick={() => {
              setHoursPerWeek(2)
              setHourlyRate(10000)
            }}
          >
            Exemple : 2h / semaine
          </button>

          <a href="#contact" className="btn-primary" aria-label="Réserver audit SEO gratuit 15 minutes">
            Réserver mon audit SEO gratuit (15 min)
          </a>
        </div>
      </div>

      <p className="mt-3 text-xs text-(--text-secondary)">À {formatted(hourlyRate)} FCFA / ~15€ l'heure, vous perdez ~{formatted(annualCost)} FCFA par an (est.)</p>
    </div>
  )
}

export function HeroSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const location = config?.location || "Cotonou, Bénin"
  const disponible = config?.disponible !== false
  // keep tagline variable for fallback
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

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ROI-focused H1 */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-bold text-2xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-4"
        >
          Transformez votre <span className="gradient-text">site web</span> en machine à clients automatique
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6"
        >
          J’aide les PME et entrepreneurs à Cotonou et à l'international à dominer Google et à automatiser leur acquisition grâce à des architectures Next.js et des agents IA sur-mesure.
        </motion.p>

        {/* ROI calculator (mini) */}
        <motion.div variants={itemVariants} className="mb-6">
          <ROICalculator />
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contact" className="btn-primary" aria-label="Réserver audit SEO gratuit 15 minutes">
            <Icon icon="line-md:briefcase-twotone" width={18} />
            Réserver mon audit SEO gratuit (15 min)
            <Icon icon="line-md:arrow-right" width={16} />
          </a>
          <a href="#contact" className="btn-ghost">
            <Icon icon="line-md:telegram" width={18} />
            {t("hero.cta_secondary")}
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mt-5 mb-5"
        >
          {[
            { icon: "line-md:github-loop", href: "https://github.com/Jeanprudent", label: "GitHub" },
            {
              icon: "line-md:linkedin",
              href: "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287",
              label: "LinkedIn",
            },
            { icon: "line-md:facebook", href: "https://www.facebook.com/jean.prudent.2025", label: "Facebook" },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-xl glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all"
            >
              <Icon icon={s.icon} width={19} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
