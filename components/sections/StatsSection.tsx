"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Icon } from "@iconify/react"
import { STATS } from "@/data/portfolio-data"
import type { Stat } from "@/types/portfolio"
import { T } from "@/components/ui/T"

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5)
  const [hourlyRate, setHourlyRate] = useState<number>(10000) // FCFA par exemple

  const annualCost = Math.max(0, hoursPerWeek) * Math.max(0, hourlyRate) * 52

  const formatted = (value: number) => {
    try {
      return new Intl.NumberFormat('fr-FR').format(value)
    } catch {
      return String(value)
    }
  }

  return (
    <div className="mt-8 p-4 bg-gradient-to-r from-white/3 to-white/5 rounded-lg border border-(--glass-border) max-w-xl mx-auto">
      <h3 className="font-semibold text-lg mb-2">Combien ça vous coûte aujourd'hui ?</h3>
      <p className="text-(--text-secondary) text-sm mb-4">Estimez rapidement les heures perdues à gérer des tâches manuelles (emails, relances, saisie) — l'automatisation peut récupérer ce temps.</p>

      <div className="grid grid-cols-2 gap-3 items-end">
        <label className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Heures / semaine</span>
          <input
            type="number"
            min={0}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="input"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Tarif horaire (FCFA)</span>
          <input
            type="number"
            min={0}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="input"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-(--text-secondary)">Coût annuel estimé</div>
          <div className="font-heading font-bold text-2xl">{formatted(annualCost)} FCFA</div>
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
            Exemple: 2h / semaine
          </button>

          <a href="#contact" className="btn-primary">
            Réserver mon audit SEO gratuit (15 min)
          </a>
        </div>
      </div>

      <p className="mt-3 text-xs text-(--text-secondary)">À 10 000 FCFA / 15€ l'heure, {formatted(hoursPerWeek * 10000 * 52)} FCFA par an (est.)</p>
    </div>
  )
}

export function StatsSection({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <section className="relative overflow-hidden">
      {/* Glowing separator line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-max">
        <div className="glass rounded-2xl border border-(--glass-border) px-6 py-8 md:px-10">

          {/* Hero-like copy targeting ROI */}
          <div className="mb-6 text-center">
            <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-4">
              Transformez votre <span className="gradient-text">site web</span> en machine à clients automatique
            </h1>
            <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-4">
              J’aide les PME et entrepreneurs à Cotonou et à l'international à dominer Google et à automatiser leur acquisition grâce à des architectures Next.js et des agents IA sur-mesure.
            </p>
            <a href="#contact" className="jsx-53d3f122a573a0b5 btn-primary">
              <span></span>Réserver mon audit SEO gratuit (15 min)<span></span>
            </a>
          </div>

          {/* ROI calculator */}
          <ROICalculator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <Icon icon={stat.icon} width={22} className="text-primary" />
                </div>

                <div>
                  <p className="font-heading font-bold text-3xl md:text-4xl gradient-text leading-none mb-1">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-(--text-secondary) text-xs md:text-sm font-medium leading-tight">
                    <T>{stat.label}</T>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
    </section>
  )
}
