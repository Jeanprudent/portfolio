"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Icon } from "@iconify/react"
import { STATS } from "@/data/portfolio-data"
import type { Stat } from "@/types/portfolio"
import { T } from "@/components/ui/T"

/**
 * useLayoutEffect n'existe pas au rendu serveur ; s'y rabattre sur useEffect
 * evite l'avertissement React sans rien changer au navigateur.
 */
const useEffetAvantPeinture = typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Compteur anime.
 *
 * Il demarre a la valeur reelle, et non a zero : le HTML rendu par le serveur
 * affichait « 0+ » et « 0% » a tout ce qui ne joue pas l'animation — les
 * robots d'indexation, les apercus de lien, un visiteur sans JavaScript ou
 * avant hydratation. Des chiffres a zero sur une page de presentation
 * detruisent la credibilite qu'ils sont censes construire.
 *
 * La remise a zero se fait donc cote client uniquement, avant la peinture :
 * l'animation reste identique, mais elle n'est plus la seule source du
 * nombre affiche.
 */
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffetAvantPeinture(() => {
    setCount(0)
  }, [])

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

export function StatsSection({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <section className="relative overflow-hidden">
      {/* Glowing separator line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-max">
        <div className="glass rounded-2xl border border-(--glass-border) px-6 py-8 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
