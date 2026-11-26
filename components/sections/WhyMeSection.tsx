"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

const PILIERS = [
  {
    icon: "line-md:person-twotone",
    titre: "Interlocuteur unique",
    texte:
      "Vous parlez directement à la personne qui conçoit votre projet, en français et sur WhatsApp. Pas de commercial intermédiaire, pas de projet qui passe de main en main.",
  },
  {
    icon: "line-md:speed-twotone",
    titre: "Orienté résultats",
    texte:
      "Chaque décision vise un objectif concret : plus de contacts, plus de ventes, du temps gagné. La technique est un moyen, jamais une fin.",
  },
  {
    icon: "line-md:grid-3-twotone",
    titre: "Expertise 360°",
    texte:
      "Site web, référencement Google et automatisation réunis chez une seule personne. Vos leviers digitaux avancent ensemble, de façon cohérente.",
  },
  {
    icon: "line-md:confirm-circle-twotone",
    titre: "Accompagnement durable",
    texte:
      "Formation à la prise en main, disponibilité après la livraison et évolutions possibles : je reste votre partenaire, pas seulement votre prestataire.",
  },
]

export function WhyMeSection() {
  return (
    <section id="pourquoi" className="section-spacing border-t border-(--glass-border)">
      <div className="container-max">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:star-twotone" width={14} />
            Pourquoi me choisir
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Je m&apos;engage sur vos <span className="gradient-text">résultats</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Pas de site « à la chaîne » ni de promesses en l&apos;air. Un interlocuteur unique, des
            décisions guidées par le concret et un accompagnement qui dure : mon objectif, c&apos;est
            que votre présence en ligne vous apporte des résultats, pas qu&apos;elle fasse joli.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILIERS.map((p, i) => (
            <motion.div
              key={p.titre}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6"
            >
              <span className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mb-5">
                <Icon icon={p.icon} width={24} aria-hidden />
              </span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mb-2">{p.titre}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{p.texte}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
