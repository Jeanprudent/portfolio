"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Icon } from "@iconify/react"
import { STATS } from "@/data/portfolio-data"
import type { Stat } from "@/types/portfolio"

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

export function StatsSection({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <section className="py-12 relative overflow-hidden">
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
                    {stat.label}
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
