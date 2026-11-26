"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { CONTACT_WHATSAPP, whatsappLink } from "@/lib/contact-info"

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

const ETAPES = [
  {
    t: "Découverte",
    d: "On clarifie votre besoin, vos objectifs et votre budget. Vous repartez avec une vision claire, même si on ne travaille pas ensemble.",
  },
  {
    t: "Proposition",
    d: "Devis précis et plan d'action, sans jargon. Vous savez quoi, quand et pour combien avant de vous engager.",
  },
  {
    t: "Réalisation",
    d: "Je construis votre solution avec des points d'étape réguliers. Vous validez à chaque étape clé, sans mauvaise surprise.",
  },
  {
    t: "Lancement & suivi",
    d: "Mise en ligne, formation à la prise en main, puis accompagnement pour les évolutions et la maintenance.",
  },
]

export function ProcessSection() {
  return (
    <section id="methode" className="section-spacing border-t border-(--glass-border)">
      <div className="container-max">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:list-3" width={14} />
            Ma méthode
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Comment on <span className="gradient-text">avance ensemble</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Une démarche simple et transparente, du premier échange jusqu&apos;à l&apos;autonomie.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {ETAPES.map((e, i) => (
            <motion.div
              key={e.t}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.07 }}
              className="relative"
            >
              <span className="font-heading text-6xl font-black text-primary/20 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mt-2 mb-2">{e.t}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{e.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal}
          className="mt-12 rounded-3xl bg-secondary text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-heading font-extrabold uppercase tracking-tight text-xl md:text-2xl">
              Un projet en tête ?
            </h3>
            <p className="text-white/70 mt-2 max-w-md">
              Le premier échange est gratuit et sans engagement. Décrivez-moi votre besoin, je
              reviens vers vous rapidement.
            </p>
          </div>
          <a
            href={whatsappLink(CONTACT_WHATSAPP, "Bonjour Jean Prudent, j'aimerais échanger sur un projet.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0 justify-center"
          >
            <Icon icon="prime:whatsapp" width={18} />
            Discutons de votre projet
          </a>
        </motion.div>
      </div>
    </section>
  )
}
