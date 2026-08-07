"use client"

import React, { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import type { Service } from "@/types/portfolio"
import { T } from "@/components/ui/T"

const SERVICE_COLORS = [
  { from: "#7C3AED", to: "#A855F7", glow: "rgba(124,58,237,0.3)" },
  { from: "#8B5CF6", to: "#6D28D9", glow: "rgba(139,92,246,0.3)" },
  { from: "#A855F7", to: "#7C3AED", glow: "rgba(168,85,247,0.3)" },
  { from: "#6D28D9", to: "#9F67F5", glow: "rgba(109,40,217,0.25)" },
]

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const colors = SERVICE_COLORS[index % SERVICE_COLORS.length]
  const cardRef = useRef<HTMLDivElement | null>(null)
  const animeRef = useRef<any>(null)

  useEffect(() => {
    // Load animejs dynamically only on client
    let mounted = true
    ;(async () => {
      try {
        const mod = await import("animejs")
        if (mounted) animeRef.current = mod.default ?? mod
      } catch (err) {
        // fail gracefully if anime couldn't be loaded
        // console.warn("animejs failed to load", err)
      }
    })()

    const el = cardRef.current
    if (!el) return
    const node = el as HTMLDivElement

    // prepare 3D-friendly styles
    node.style.transformStyle = "preserve-3d"
    ;(node.style as any).webkitTransformStyle = "preserve-3d"
    node.style.perspective = "1000px"

    let rafId: number | null = null

    function applyFallbackTransform(rotateX: number, rotateY: number, scale = 1.02) {
      // apply transform/boxShadow directly when anime isn't available
      node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
      node.style.boxShadow = `0 18px 40px ${colors.glow}`
    }

    function resetFallback() {
      node.style.transform = ""
      node.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)"
    }

    function handleMouseMove(e: MouseEvent) {
      const anime = animeRef.current
      const rect = node.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height

      const rotateY = (px - 0.5) * 14
      const rotateX = (0.5 - py) * 10

      if (anime) {
        anime({
          targets: node,
          rotateX,
          rotateY,
          scale: 1.02,
          duration: 350,
          easing: "easeOutQuad",
        })

        anime({
          targets: node,
          boxShadow: [`0 6px 18px rgba(0,0,0,0.06)`, `0 18px 40px ${colors.glow}`],
          duration: 350,
          easing: "easeOutQuad",
        })
      } else {
        // fallback without anime: throttle with rAF
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => applyFallbackTransform(rotateX, rotateY, 1.02))
      }
    }

    function handleMouseLeave() {
      const anime = animeRef.current
      if (anime) {
        anime({
          targets: node,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          duration: 500,
          easing: "easeOutElastic(1, .7)",
        })
      } else {
        if (rafId) cancelAnimationFrame(rafId)
        resetFallback()
      }
    }

    // Attach handlers only for non-touch devices
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    if (!isTouch) {
      node.addEventListener("mousemove", handleMouseMove)
      node.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      mounted = false
      if (rafId) cancelAnimationFrame(rafId)
      if (!isTouch) {
        node.removeEventListener("mousemove", handleMouseMove)
        node.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [index])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="glass-card p-6 group cursor-pointer"
      style={{
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        {service.banner ? (
          <img
            src={service.banner}
            alt={service.title}
            className="w-full md:w-32 h-20 object-cover rounded-md mb-4 md:mb-0 md:mr-4 flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-full md:w-32 h-20 bg-gray-100 rounded-md mb-4 md:mb-0 md:mr-4 flex items-center justify-center text-(--text-secondary)" aria-hidden />
        )}

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}22)`,
              border: `1px solid ${colors.from}33`,
            }}
          >
            <Icon icon={service.icon} width={20} style={{ color: colors.from }} />
          </div>

          <h3 className="font-heading font-semibold text-lg md:text-xl text-(--text-primary) leading-snug">
            <T>{service.title}</T>
          </h3>
        </div>
      </div>

      <p className="text-(--text-secondary) text-sm leading-relaxed mt-3">
        <T>{service.description}</T>
      </p>

      <a
        href={`/services/${service.slug ?? slugify(service.title)}`}
        className="flex items-center gap-1.5 mt-5 text-xs font-semibold transition-all duration-200 group-hover:gap-3"
        style={{ color: colors.from }}
      >
        En savoir plus
        <Icon icon="line-md:arrow-right" width={14} />
      </a>
    </motion.div>
  )
}

export function ServicesSection({ services = SERVICES.filter((s) => s.visible) }: { services?: Service[] }) {
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
            Ce que je peux faire pour vous <span className="gradient-text"></span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Des solutions digitales sur mesure pour développer votre activité et maximiser votre présence en ligne.
          </p>
        </motion.div>

        {/* Service Cards grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
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
