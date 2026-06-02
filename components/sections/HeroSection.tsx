"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { ParticlesCanvas } from "./ParticlesCanvas"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"

const TYPEWRITER_WORDS = [
  "Développeur Frontend",
  "Web Designer",
  "Expert SEO",
  "Intégrateur WordPress",
  "Consultant Digital",
]

function useTypewriter(words: string[], speed = 90, deleteSpeed = 45, pause = 2200) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (text.length < word.length) {
            setText(word.slice(0, text.length + 1))
          } else {
            setTimeout(() => setDeleting(true), pause)
          }
        } else {
          if (text.length > 0) {
            setText(text.slice(0, -1))
          } else {
            setDeleting(false)
            setWordIndex((i) => (i + 1) % words.length)
          }
        }
      },
      deleting ? deleteSpeed : speed
    )
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, speed, deleteSpeed, pause])

  return text
}

export function HeroSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const typedText = useTypewriter(TYPEWRITER_WORDS)
  const location = config?.location || "Cotonou, Bénin"
  const disponible = config?.disponible !== false
  const tagline = config?.tagline || "Je crée des sites web qui transforment votre présence en ligne en moteur de croissance."

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
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
        {/* Badge
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="section-label">
            <Icon icon="line-md:map-marker-twotone" width={14} />
            {location}{disponible ? ` · ${t("hero.badge_disponible")}` : ""}
          </span>
        </motion.div> */}

        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg font-medium text-(--text-secondary) mb-3 font-sans"
        >
          {t("hero.greeting")}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-4"
        >
          <span className="gradient-text">Jean</span>{" "}
          <span className="text-(--text-primary)">Prudent</span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          variants={itemVariants}
          className="h-9 md:h-11 flex items-center justify-center mb-8"
        >
          <p className="font-heading text-xl md:text-2xl font-semibold text-secondary">
            {typedText}
            <span
              className="inline-block w-0.5 h-6 bg-secondary ml-1 align-middle"
              style={{ animation: "pulse 1s step-end infinite" }}
            />
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          {tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#projets" className="btn-primary">
            <Icon icon="line-md:briefcase-twotone" width={18} />
            {t("hero.cta_primary")}
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
          className="flex items-center justify-center gap-4 mt-10"
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
              className="w-10 h-10 rounded-xl glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon icon={s.icon} width={19} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator 
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <p className="text-(--text-muted) text-xs tracking-widest uppercase">Scroll</p>
        <motion.div
          className="w-5 h-8 rounded-full border border-(--glass-border) flex justify-center pt-1.5"
          animate={{ borderColor: ["rgba(124,58,237,0.2)", "rgba(124,58,237,0.6)", "rgba(124,58,237,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div> */}

      <style jsx>{`
        @keyframes pulse {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
