"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { TESTIMONIALS } from "@/data/portfolio-data"
import type { Testimonial } from "@/types/portfolio"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          icon={i < rating ? "line-md:star-twotone" : "line-md:star-outline"}
          width={16}
          className={i < rating ? "text-yellow-400" : "text-(--text-muted)"}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection({ testimonials = TESTIMONIALS.filter((t) => t.visible) }: { testimonials?: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const visible = testimonials

  const prev = () => setActiveIndex((i) => (i - 1 + visible.length) % visible.length)
  const next = () => setActiveIndex((i) => (i + 1) % visible.length)

  return (
    <section id="temoignages" className="section-spacing">
      <div className="container-max">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:chat-arrow-up-twotone" width={14} />
            Témoignages
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Ce que disent <span className="gradient-text">mes clients</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            La satisfaction de mes clients est ma plus grande récompense.
          </p>
        </motion.div>

        {/* Main testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="glass-card p-8 md:p-10 text-center"
              >
                {/* Quote icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <Icon icon="line-md:chat-twotone" width={24} className="text-primary" />
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-5">
                  <StarRating rating={visible[activeIndex].rating} />
                </div>

                {/* Text */}
                <blockquote className="text-(--text-secondary) text-base md:text-lg leading-relaxed mb-8 italic">
                  &ldquo;{visible[activeIndex].text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.2))",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  >
                    <Icon icon="line-md:person-twotone" width={22} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-(--text-primary) text-sm">
                      {visible[activeIndex].name}
                    </p>
                    <p className="text-(--text-muted) text-xs">
                      {visible[activeIndex].role} — {visible[activeIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200"
              aria-label="Précédent"
            >
              <Icon icon="line-md:arrow-left" width={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {visible.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-300"
                  aria-label={`Témoignage ${i + 1}`}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? "24px" : "8px",
                      background: i === activeIndex ? "#7C3AED" : "var(--glass-border)",
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200"
              aria-label="Suivant"
            >
              <Icon icon="line-md:arrow-right" width={18} />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto">
          {visible.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(i)}
              className={`glass rounded-xl p-4 text-center transition-all duration-200 border ${
                i === activeIndex
                  ? "border-primary/40 bg-[rgba(124,58,237,0.08)]"
                  : "border-(--glass-border) hover:border-primary/20"
              }`}
            >
              <p className="font-semibold text-(--text-primary) text-xs mb-0.5">{t.name}</p>
              <p className="text-(--text-muted) text-xs truncate">{t.company}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
