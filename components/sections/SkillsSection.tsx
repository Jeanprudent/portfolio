"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SKILLS } from "@/data/portfolio-data"

const CATEGORIES = [
  { id: "all", label: "Toutes" },
  { id: "frontend", label: "Frontend" },
  { id: "cms", label: "CMS" },
  { id: "seo", label: "SEO" },
  { id: "design", label: "Design" },
  { id: "tools", label: "Outils" },
]

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "#ff7a1a",
  cms: "#e66b0d",
  seo: "#10B981",
  design: "#F59E0B",
  tools: "#ff7a1a",
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered =
    activeCategory === "all"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory)

  return (
    <section id="competences" className="section-spacing">
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
            <Icon icon="line-md:cog-loop" width={14} />
            Compétences
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Ma <span className="gradient-text">stack technique</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Les technologies et outils que j&apos;utilise pour créer des solutions web performantes.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-[0_4px_12px_rgba(255, 122, 26,0.4)]"
                  : "glass border border-(--glass-border) text-(--text-secondary) hover:text-(--text-primary)"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((skill, i) => {
            const color = CATEGORY_COLORS[skill.category] || "#ff7a1a"
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-4 flex flex-col items-center gap-3 text-center cursor-default"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon icon={skill.icon} width={26} style={{ color }} />
                </div>

                {/* Name */}
                <p className="text-(--text-primary) text-xs font-semibold leading-tight">
                  {skill.name}
                </p>

                {/* Level bar */}
                <div className="w-full h-1 rounded-full bg-(--glass-border) overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
