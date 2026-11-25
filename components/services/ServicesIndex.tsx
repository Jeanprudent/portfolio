"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import { EXPERTISES } from "@/data/local-seo"
import { localPath, type Ville } from "@/lib/local-seo"
import { FaqAccordion } from "@/components/ui/FaqAccordion"
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP, whatsappLink } from "@/lib/contact-info"
import type { Service } from "@/types/portfolio"

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

const WA = (txt: string) => whatsappLink(CONTACT_WHATSAPP, txt)

const TRUST = [
  { icon: "line-md:person-twotone", label: "Interlocuteur unique" },
  { icon: "line-md:confirm-circle", label: "Devis gratuit, sans surprise" },
  { icon: "prime:whatsapp", label: "Réponse rapide sur WhatsApp" },
  { icon: "line-md:map-marker-twotone", label: "PME & TPE au Bénin" },
]

const METHODE = [
  { t: "Découverte", d: "On cerne votre besoin, vos objectifs et votre budget. Vous repartez avec une vision claire, même si on ne travaille pas ensemble." },
  { t: "Proposition", d: "Devis précis et plan d'action, sans jargon. Vous savez quoi, quand et pour combien avant de vous engager." },
  { t: "Réalisation", d: "Je construis votre solution avec des points d'étape réguliers. Vous gardez la main et validez à chaque étape clé." },
  { t: "Lancement & suivi", d: "Mise en ligne, formation à la prise en main, et accompagnement après livraison pour les évolutions." },
]

const FAQ = [
  {
    q: "Combien coûtent vos services ?",
    r: "Chaque projet est différent : le tarif dépend de vos besoins, du périmètre et des fonctionnalités. Je travaille avec des budgets réalistes pour PME et TPE, avec des packs clairs et un devis détaillé avant de commencer. Le plus simple est de m'écrire sur WhatsApp pour une estimation adaptée.",
  },
  {
    q: "Travaillez-vous uniquement à Cotonou ?",
    r: "Je suis basé à Cotonou et j'y accompagne de nombreuses entreprises en direct, mais je travaille aussi à distance partout au Bénin et à l'international. Les échanges se font par WhatsApp, e-mail ou rendez-vous selon votre préférence.",
  },
  {
    q: "Quels sont les délais ?",
    r: "Un site vitrine se livre généralement en 1 à 3 semaines, un projet plus complexe (e-commerce, automatisation) demande davantage. Le délai exact est fixé dès le cadrage, en fonction de votre réactivité sur les contenus et validations.",
  },
  {
    q: "Pourrai-je gérer mon site moi-même ?",
    r: "Oui. Je livre des sites avec un back-office simple et je vous forme à la prise en main : modifier un texte, un prix ou une photo se fait sans développeur et sans frais récurrents obligatoires.",
  },
  {
    q: "Comment se passe la prise de contact ?",
    r: "Vous m'écrivez votre besoin en quelques lignes sur WhatsApp ou par e-mail. Je reviens vers vous rapidement avec une première analyse et, si besoin, un rendez-vous pour cadrer le projet. Le premier échange est gratuit et sans engagement.",
  },
]

/** Prestations incluses : issues de l'expertise liée, sinon des offres du service. */
function inclus(service: Service): string[] {
  const exp = EXPERTISES.find((e) => e.serviceSlug === (service.slug ?? serviceSlug(service)))
  if (exp) return exp.prestations.map((p) => p.titre)
  return (service.offers ?? []).map((o) => o.name).slice(0, 5)
}

function ServiceBlock({ service, index, villes }: { service: Service; index: number; villes: Ville[] }) {
  const slug = service.slug ?? serviceSlug(service)
  const exp = EXPERTISES.find((e) => e.serviceSlug === slug)
  const items = inclus(service)
  const number = String(index + 1).padStart(2, "0")

  return (
    <motion.article
      {...reveal}
      className="grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-10 rounded-3xl border border-(--glass-border) bg-(--bg) p-7 md:p-10 shadow-[0_24px_60px_-28px_rgba(18,18,18,0.20)]"
    >
      {/* Colonne gauche : titre + description + inclus */}
      <div>
        <span className="font-heading text-5xl font-black leading-none text-primary/25 block mb-3">{number}</span>
        <h2 className="font-heading font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-(--text-primary) leading-[1.05] mb-3">
          {service.title}
        </h2>
        <p className="text-(--text-secondary) leading-relaxed mb-6 max-w-prose">{service.description}</p>

        {items.length > 0 && (
          <div>
            <p className="font-heading font-bold uppercase text-xs tracking-widest text-(--text-muted) mb-3">
              Inclus dans la prestation
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {items.map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-(--text-secondary) text-sm">
                  <Icon icon="line-md:confirm-circle" width={18} className="text-primary shrink-0 mt-0.5" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Colonne droite : panneau d'action + maillage local */}
      <div className="flex flex-col gap-4 lg:border-l lg:border-(--glass-border) lg:pl-10">
        <div className="flex flex-col gap-2.5">
          <Link href={`/services/${slug}`} className="btn-primary justify-center">
            En savoir plus
            <Icon icon="line-md:arrow-right" width={16} />
          </Link>
          <a
            href={WA(`Bonjour Jean Prudent, je suis intéressé(e) par « ${service.title} ».`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center"
          >
            <Icon icon="prime:whatsapp" width={18} />
            Me contacter
          </a>
        </div>

        {exp && villes.length > 0 && (
          <div className="mt-2">
            <p className="font-heading font-bold uppercase text-xs tracking-widest text-(--text-muted) mb-2.5">
              Disponible à
            </p>
            <div className="flex flex-wrap gap-2">
              {villes.map((v) => (
                <Link
                  key={v.slug}
                  href={localPath(exp, v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-(--glass-border) text-xs font-semibold text-(--text-secondary) hover:border-primary/50 hover:text-primary transition"
                >
                  <Icon icon="line-md:map-marker-twotone" width={14} />
                  {v.nom}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function ServicesIndex({ villes }: { villes: Ville[] }) {
  const services = SERVICES.filter((s) => s.visible)

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden />
        <div className="container-max relative pt-28 md:pt-32 pb-12">
          <motion.div {...reveal} className="max-w-3xl">
            <span className="section-label mb-5 inline-flex">
              <Icon icon="line-md:star-twotone" width={14} />
              Mes services
            </span>
            <h1 className="font-heading font-extrabold uppercase tracking-tight text-4xl md:text-6xl leading-[0.98] text-(--text-primary)">
              Ce que je peux faire <span className="text-primary">pour votre entreprise</span>
            </h1>
            <p className="mt-6 text-(--text-secondary) text-base md:text-lg leading-relaxed">
              Création de site web, référencement sur Google et automatisation : des solutions
              digitales concrètes pour gagner en visibilité, convertir plus de clients et gagner du
              temps, pensées pour les PME, TPE et entrepreneurs au Bénin.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={WA("Bonjour Jean Prudent, j'aimerais discuter d'un projet.")} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                <Icon icon="prime:whatsapp" width={18} />
                Démarrer un projet
              </a>
              <a href={`tel:${CONTACT_PHONE}`} className="btn-dark justify-center">
                <Icon icon="line-md:phone-call-loop" width={18} />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            {/* Barre de réassurance */}
            <ul className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                  <Icon icon={t.icon} width={18} className="text-primary shrink-0" />
                  {t.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* BLOCS SERVICES */}
      <section className="container-max py-8 md:py-10 space-y-6">
        {services.map((service, i) => (
          <ServiceBlock key={service.id} service={service} index={i} villes={villes} />
        ))}
      </section>

      {/* MÉTHODOLOGIE */}
      <section className="container-max py-14 md:py-20 border-t border-(--glass-border)">
        <motion.div {...reveal} className="max-w-2xl mb-10">
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:list-3" width={14} />
            Méthode
          </span>
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-(--text-primary) leading-[1.05]">
            Comment on avance ensemble
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6">
          {METHODE.map((s, i) => (
            <motion.div key={s.t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.07 }}>
              <span className="font-heading text-5xl font-black text-primary/25 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mt-2 mb-2">{s.t}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ZONE GÉOGRAPHIQUE */}
      <section className="container-max py-14 md:py-16 border-t border-(--glass-border)">
        <motion.div {...reveal} className="rounded-3xl bg-(--bg-secondary) border border-(--glass-border) p-8 md:p-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <span className="section-label mb-4 inline-flex">
                <Icon icon="line-md:map-marker-twotone" width={14} />
                Zone desservie
              </span>
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-(--text-primary) leading-[1.05] mb-3">
                Basé à Cotonou, au service de tout le Bénin
              </h2>
              <p className="text-(--text-secondary) leading-relaxed">
                J'accompagne les entreprises de Cotonou en direct, et le reste du Bénin comme
                l'international à distance. Découvrez mes prestations par ville :
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {EXPERTISES.map((e) =>
                villes.map((v) => (
                  <Link
                    key={`${e.slug}-${v.slug}`}
                    href={localPath(e, v)}
                    className="glass-card p-4 text-sm font-semibold text-(--text-primary) hover:text-primary flex items-center justify-between gap-2"
                  >
                    <span>
                      {e.nomCourt}
                      <span className="block text-xs font-normal text-(--text-muted)">{v.nom}</span>
                    </span>
                    <Icon icon="line-md:arrow-right" width={16} className="text-primary shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="container-max py-8 md:py-10">
        <motion.div {...reveal} className="max-w-2xl mb-8">
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:question-circle" width={14} />
            Questions fréquentes
          </span>
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-(--text-primary) leading-[1.05]">
            Vos questions avant de démarrer
          </h2>
        </motion.div>
        <FaqAccordion items={FAQ} />
      </section>

      {/* CTA FINAL */}
      <section className="container-max py-14 md:py-20">
        <motion.div {...reveal} className="rounded-3xl bg-secondary text-white p-10 md:p-14 text-center">
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl md:text-5xl leading-[1.02]">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-white/70 mt-4 max-w-xl mx-auto">
            Décrivez-moi votre besoin en quelques lignes. Je reviens vers vous rapidement avec une
            première analyse gratuite et sans engagement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WA("Bonjour Jean Prudent, je souhaite un devis pour mon projet.")} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
              <Icon icon="prime:whatsapp" width={18} />
              Demander un devis gratuit
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/25 text-white font-semibold hover:bg-white/10 transition">
              <Icon icon="line-md:phone-call-loop" width={18} />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
