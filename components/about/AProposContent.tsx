"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import type { PortfolioConfig } from "@/lib/supabase-data"
import { EXPERTISES } from "@/data/local-seo"
import { SKILLS } from "@/data/portfolio-data"
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP,
  CONTACT_LOCATION,
  whatsappLink,
} from "@/lib/contact-info"

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

// Récit du parcours : propre à cette page (volontairement différent du
// teaser « À propos » de la page d'accueil), il met en avant l'approche
// vibe coding et l'usage de l'IA dans la conception des projets.
const PARCOURS = [
  "Mon aventure dans le web a commencé par une curiosité simple : comprendre comment un site, derrière son écran, pouvait faire vivre une activité réelle. De cette curiosité est né un métier. Aujourd'hui, j'accompagne les PME, TPE et entrepreneurs du Bénin à bâtir une présence en ligne qui travaille vraiment pour eux.",
  "J'ai d'abord appris à concevoir et déployer des sites avec WordPress et Elementor, avant d'élargir mon terrain à l'écosystème moderne du développement : React, Next.js et Tailwind CSS. Cette double culture, du no-code au code sur mesure, me permet de choisir à chaque projet l'outil le plus juste plutôt que le plus à la mode.",
  "Je pratique aussi le vibe coding : une manière de concevoir où l'intelligence artificielle devient mon copilote. Elle me permet de transformer une idée en prototype fonctionnel en un temps record, d'itérer plus vite et de garder le cap sur l'essentiel, l'expérience utilisateur et le résultat. L'IA n'écrit pas le projet à ma place, elle décuple ma capacité à explorer, tester et livrer. J'intègre ces outils directement dans la conception (génération assistée, automatisations n8n, agents intelligents) pour des sites plus malins et des processus qui tournent tout seuls.",
  "Au fil de plus de quinze projets, une conviction s'est imposée : la technologie n'a de valeur que par les résultats qu'elle produit. Plus de visibilité sur Google, plus de demandes de devis, du temps gagné sur les tâches répétitives. C'est cette exigence de résultat, bien plus que la prouesse technique, qui guide chacune de mes réalisations.",
]

const VALEURS = [
  { icon: "line-md:person-twotone", titre: "Proximité", texte: "Une relation directe, en français et sur WhatsApp, du premier échange au suivi après livraison." },
  { icon: "line-md:confirm-circle-twotone", titre: "Transparence", texte: "Des devis clairs, des délais annoncés et aucune dépense cachée. Vous savez toujours où va votre budget." },
  { icon: "line-md:speed-twotone", titre: "Résultats concrets", texte: "Chaque projet vise un objectif mesurable, pas seulement un rendu « joli »." },
  { icon: "line-md:star-twotone", titre: "Pédagogie", texte: "Je vous forme et vous explique, pour que vous restiez autonome et maître de vos outils." },
]

// Regroupement des stacks maîtrisées par famille, pour la section
// « Mes compétences ». Les données viennent de data/portfolio-data.ts.
const STACK_GROUPES = [
  { cat: "frontend", label: "Développement front-end", icon: "line-md:laptop-twotone" },
  { cat: "cms", label: "CMS & no-code", icon: "line-md:document-twotone" },
  { cat: "seo", label: "SEO & analytics", icon: "line-md:search-twotone" },
  { cat: "tools", label: "Outils & automatisation", icon: "line-md:cog-loop" },
]

export function AProposContent({ config }: { config?: PortfolioConfig | null }) {
  const location = config?.location || CONTACT_LOCATION
  const waMsg = "Bonjour Jean Prudent, j'aimerais échanger sur un projet."

  return (
    // overflow-x-clip (et non overflow-hidden) : hidden ferait de ce conteneur
    // un conteneur de defilement et casserait le position:sticky de la photo
    // du parcours ; clip borne le debordement horizontal sans cet effet.
    <div className="overflow-x-clip">
      {/* HERO — centré */}
      <section className="relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden />
        <div className="container-max relative pt-28 md:pt-32 pb-14">
          <motion.div {...reveal} className="max-w-3xl mx-auto text-center">
            <span className="section-label mb-5 inline-flex">
              <Icon icon="line-md:person-twotone" width={14} />
              À propos
            </span>
            <h1 className="font-heading font-extrabold uppercase tracking-tight text-4xl md:text-6xl leading-[0.98] text-(--text-primary)">
              Jean Prudent, votre <span className="text-primary">partenaire digital</span> au Bénin
            </h1>
            <p className="mt-6 text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Conseil, création de site web, référencement et automatisation : j&apos;accompagne les
              PME, TPE et entrepreneurs à transformer leur présence en ligne en moteur de croissance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={whatsappLink(CONTACT_WHATSAPP, waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                <Icon icon="prime:whatsapp" width={18} />
                Discuter sur WhatsApp
              </a>
              <Link href="/services" className="btn-dark justify-center">
                <Icon icon="line-md:star-twotone" width={18} />
                Voir mes services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MON PARCOURS — photo à gauche, titre + badge à droite au-dessus du contenu */}
      <section className="container-max py-14 md:py-20 border-t border-(--glass-border)">
        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-5 lg:gap-8 items-start">
          {/* Photo / placeholder */}
          <motion.div {...reveal} className="mx-auto w-full max-w-[20rem] lg:sticky lg:top-28">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-(--glass-border) bg-(--bg-secondary)">
              {config?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.avatar_url} alt="Jean Prudent IDOHOU" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(135deg,rgba(255,122,26,0.15),rgba(18,18,18,0.08))]">
                  <Icon icon="line-md:person-twotone" width={88} className="text-primary opacity-70" />
                  <p className="font-heading font-extrabold uppercase text-(--text-primary)">Jean Prudent</p>
                </div>
              )}
              <span className="absolute bottom-0 inset-x-0 h-1.5 bg-primary" aria-hidden />
              {/* Pastille de localisation posée sur la photo (comme dans la bannière) */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-(--glass-border) bg-(--bg) shadow-lg px-4 py-3 flex items-center gap-2 text-sm">
                <Icon icon="line-md:map-marker-twotone" width={18} className="text-primary shrink-0" />
                <span className="text-(--text-secondary)">Basé à {location} · disponible à distance</span>
              </div>
            </div>
          </motion.div>

          {/* Texte : badge + titre au-dessus du contenu */}
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
            <span className="section-label mb-4 inline-flex">
              <Icon icon="line-md:pencil-twotone" width={14} />
              Mon parcours
            </span>
            <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-(--text-primary) leading-[1.05] mb-6">
              D&apos;une curiosité à une mission
            </h2>
            <div className="space-y-4 text-(--text-secondary) leading-relaxed text-base md:text-lg">
              {PARCOURS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="container-max py-14 md:py-20 border-t border-(--glass-border)">
        <motion.div {...reveal} className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:star-twotone" width={14} />
            Ce qui me guide
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Mes <span className="gradient-text">valeurs</span> de travail
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Quatre principes simples qui cadrent chaque collaboration, du premier échange jusqu&apos;au
            suivi après livraison.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALEURS.map((v, i) => (
            <motion.div key={v.titre} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6">
              <span className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mb-5">
                <Icon icon={v.icon} width={24} aria-hidden />
              </span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mb-2">{v.titre}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{v.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="container-max py-14 md:py-20 border-t border-(--glass-border)">
        <motion.div {...reveal} className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:grid-3-twotone" width={14} />
            Mon expertise
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Trois leviers, <span className="gradient-text">une cohérence</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Réunir ces trois expertises chez une seule personne évite les silos : votre site, votre
            visibilité et vos automatisations avancent ensemble.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {EXPERTISES.map((e, i) => (
            <motion.div key={e.slug} {...reveal} transition={{ ...reveal.transition, delay: i * 0.07 }}>
              <Link href={`/services/${e.serviceSlug}`} className="block h-full rounded-2xl border border-(--glass-border) bg-(--bg) p-6 hover:border-primary/40 transition-colors group">
                <span className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mb-5">
                  <Icon icon={e.icon} width={24} aria-hidden />
                </span>
                <h3 className="font-heading font-bold text-lg text-(--text-primary) mb-2">{e.nomCourt}</h3>
                <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">{e.accroche}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  En savoir plus
                  <Icon icon="line-md:arrow-right" width={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MES COMPÉTENCES — stacks maîtrisées */}
      <section className="container-max py-14 md:py-20 border-t border-(--glass-border)">
        <motion.div {...reveal} className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:cog-loop" width={14} />
            Mes compétences
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            Les stacks que je <span className="gradient-text">maîtrise</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Du no-code au code sur mesure, en passant par le SEO et l&apos;automatisation : une boîte à
            outils complète pour choisir la bonne solution à chaque projet.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-5">
          {STACK_GROUPES.map((groupe, gi) => {
            const items = SKILLS.filter((s) => s.category === groupe.cat)
            if (items.length === 0) return null
            return (
              <motion.div
                key={groupe.cat}
                {...reveal}
                transition={{ ...reveal.transition, delay: gi * 0.06 }}
                className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0">
                    <Icon icon={groupe.icon} width={22} aria-hidden />
                  </span>
                  <h3 className="font-heading font-bold text-lg text-(--text-primary)">{groupe.label}</h3>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-full border border-(--glass-border) bg-(--bg-secondary) px-3.5 py-1.5 text-sm text-(--text-primary)"
                    >
                      <Icon icon={skill.icon} width={18} aria-hidden />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-max py-14 md:py-20">
        <motion.div {...reveal} className="rounded-3xl bg-secondary text-white p-10 md:p-14 text-center">
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl md:text-5xl leading-[1.02]">
            Travaillons ensemble
          </h2>
          <p className="text-white/70 mt-4 max-w-xl mx-auto">
            Vous avez un projet, une idée ou simplement une question ? Le premier échange est gratuit
            et sans engagement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappLink(CONTACT_WHATSAPP, waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
              <Icon icon="prime:whatsapp" width={18} />
              Discuter sur WhatsApp
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
