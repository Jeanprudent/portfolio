"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { findExpertise, getExpertises, localPath, type Ville } from "@/lib/local-seo"
import { FaqAccordion } from "@/components/ui/FaqAccordion"
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP,
  whatsappLink,
} from "@/lib/contact-info"

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="section-label mb-5 inline-flex">{children}</span>
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-heading font-extrabold uppercase tracking-tight text-2xl md:text-4xl text-(--text-primary) leading-[1.05] ${className}`}>
      {children}
    </h2>
  )
}

export function LocalSeoPage({ expertiseSlug, ville }: { expertiseSlug: string; ville: Ville }) {
  const e = findExpertise(expertiseSlug)
  if (!e) return null
  const v = ville
  const autres = getExpertises().filter((x) => x.slug !== e.slug)
  const waMsg = `Bonjour Jean Prudent, je suis intéressé(e) par « ${e.nomCourt} » ${v.prep} ${v.nom}.`

  return (
    <div className="overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section className="relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden />
        <div className="container-max relative pt-28 md:pt-32 pb-14">
          <nav aria-label="Fil d'Ariane" className="text-xs text-(--text-muted) mb-6 flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span aria-hidden>/</span>
            <Link href={`/services/${e.serviceSlug}`} className="hover:text-primary">{e.nomCourt}</Link>
            <span aria-hidden>/</span>
            <span className="text-(--text-secondary)">{v.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <motion.div {...reveal} className="text-center lg:text-left">
              <Eyebrow>
                {e.nomCourt} · {v.nom}, {v.pays}
              </Eyebrow>
              <h1 className="font-heading font-extrabold uppercase tracking-tight text-4xl md:text-6xl leading-[0.98] text-(--text-primary)">
                {e.nom} <span className="text-primary">{v.prep} {v.nom}</span>
              </h1>
              <p className="mt-6 text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {e.accroche}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center lg:items-stretch lg:justify-start">
                <a href={whatsappLink(CONTACT_WHATSAPP, waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                  <Icon icon="prime:whatsapp" width={18} />
                  Discuter sur WhatsApp
                </a>
                <a href={`tel:${CONTACT_PHONE}`} className="btn-dark justify-center">
                  <Icon icon="line-md:phone-call-loop" width={18} />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>

              {/* Mots-clés couverts — utile SEO + clarté */}
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-(--text-muted) mb-2.5">
                  Ce que couvre cette page
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {e.motsCles(v.nom).map((m) => (
                    <span key={m} className="px-3 py-1.5 rounded-full border border-(--glass-border) text-xs text-(--text-secondary)">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.aside {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="rounded-3xl border border-(--glass-border) bg-(--bg) shadow-[0_24px_60px_-28px_rgba(18,18,18,0.20)] p-6 md:p-7 lg:sticky lg:top-24">
              <p className="font-heading font-extrabold uppercase text-lg text-(--text-primary) mb-4">
                Votre partenaire digital {v.prep} {v.nom}
              </p>
              <ul className="space-y-3 text-sm text-(--text-secondary)">
                {["Réponse rapide sur WhatsApp", "Devis clair, sans surprise", "Interlocuteur unique, en français", "PME, TPE et entrepreneurs"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Icon icon="line-md:confirm-circle" width={18} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/services/${e.serviceSlug}`} className="btn-ghost w-full justify-center mt-6 text-sm">
                Voir le détail de l'offre
                <Icon icon="line-md:arrow-right" width={16} />
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ---------------- POURQUOI C'EST DÉCISIF (texte + image) ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div {...reveal}>
            <H2 className="mb-5">{e.nomCourt} {v.prep} {v.nom} : pourquoi c'est décisif</H2>
            <p className="text-(--text-secondary) leading-relaxed mb-4">{e.intro(v.nom)}</p>
            <p className="text-(--text-secondary) leading-relaxed">{v.intro}</p>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-(--glass-border) bg-(--bg-secondary)">
            <Image
              src={e.image}
              alt={`${e.nom} ${v.prep} ${v.nom}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-y-0 right-0 w-1.5 bg-primary" aria-hidden />
          </motion.div>
        </div>
      </section>

      {/* ---------------- PROBLÈMES ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <motion.div {...reveal}><H2 className="mb-10 max-w-2xl">Les blocages que je règle</H2></motion.div>
        <div className="grid md:grid-cols-2 gap-5">
          {e.problemes.map((p, i) => (
            <motion.div key={p.titre} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6">
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mb-2 flex items-start gap-2.5">
                <Icon icon="line-md:alert-circle" width={20} className="text-primary shrink-0 mt-0.5" />
                {p.titre}
              </h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{p.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- BÉNÉFICES ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <motion.div {...reveal} className="mb-10 max-w-2xl">
          <Eyebrow><Icon icon="line-md:star-twotone" width={14} />Ce que vous y gagnez</Eyebrow>
          <H2>Des résultats concrets, pas des promesses</H2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {e.benefices.map((b, i) => (
            <motion.div key={b.titre} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6">
              <span className="w-11 h-11 rounded-2xl bg-[rgba(255,122,26,0.12)] text-primary flex items-center justify-center mb-4">
                <Icon icon="line-md:confirm-circle" width={22} aria-hidden />
              </span>
              <h3 className="font-heading font-bold text-base text-(--text-primary) mb-2">{b.titre}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{b.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- PRESTATIONS ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <motion.div {...reveal} className="mb-10 max-w-2xl">
          <Eyebrow><Icon icon="line-md:list-3" width={14} />Prestations</Eyebrow>
          <H2>Ce que comprend la prestation</H2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {e.prestations.map((p, i) => (
            <motion.div key={p.titre} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-2xl border border-(--glass-border) bg-(--bg) p-6">
              <span className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center mb-4">
                <Icon icon={e.icon} width={22} aria-hidden />
              </span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mb-2">{p.titre}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{p.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- CAS D'USAGE ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <motion.div {...reveal}>
            <Eyebrow><Icon icon="line-md:person-twotone" width={14} />Cas d'usage</Eyebrow>
            <H2>Pour qui, concrètement</H2>
            <p className="text-(--text-secondary) leading-relaxed mt-4">
              Quelques situations typiques où cette prestation change la donne pour une entreprise
              {" "}{v.prep} {v.nom} :
            </p>
          </motion.div>
          <motion.ul {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="space-y-3">
            {e.casUsage.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-2xl border border-(--glass-border) bg-(--bg) p-4 text-(--text-secondary)">
                <Icon icon="line-md:arrow-right" width={18} className="text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <motion.div {...reveal}><H2 className="mb-10 max-w-2xl">Comment ça se passe</H2></motion.div>
        <div className="grid md:grid-cols-4 gap-6">
          {e.process.map((s, i) => (
            <motion.div key={s.titre} {...reveal} transition={{ ...reveal.transition, delay: i * 0.07 }}>
              <span className="font-heading text-5xl font-black text-primary/25 leading-none">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-heading font-bold text-lg text-(--text-primary) mt-2 mb-2">{s.titre}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{s.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- ZONE LOCALE + POURQUOI MOI ---------------- */}
      <section className="container-max py-12 md:py-16 border-t border-(--glass-border)">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div {...reveal}>
            <Eyebrow><Icon icon="line-md:map-marker-twotone" width={14} />Zone desservie</Eyebrow>
            <H2 className="mb-5 !text-2xl md:!text-3xl">Qui j'accompagne {v.prep} {v.nom}</H2>
            <ul className="space-y-2.5">
              {v.secteurs.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-(--text-secondary)">
                  <Icon icon="line-md:confirm-circle" width={18} className="text-primary shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
            <Eyebrow><Icon icon="line-md:star-twotone" width={14} />Pourquoi moi</Eyebrow>
            <H2 className="mb-5 !text-2xl md:!text-3xl">Ce qui fait la différence</H2>
            <div className="space-y-4">
              {e.pourquoi.map((p) => (
                <div key={p.titre}>
                  <h3 className="font-heading font-bold text-(--text-primary) flex items-center gap-2">
                    <Icon icon="line-md:chevron-right" width={16} className="text-primary" />
                    {p.titre}
                  </h3>
                  <p className="text-(--text-secondary) text-sm leading-relaxed mt-1 pl-6">{p.texte}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- CTA BAND ---------------- */}
      <section className="container-max py-6">
        <motion.div {...reveal} className="rounded-3xl bg-secondary text-white p-8 md:p-12 text-center">
          <H2 className="!text-white">Lancez votre projet {v.prep} {v.nom}</H2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">
            Un échange rapide suffit pour y voir clair : parlons de votre besoin et de la meilleure
            solution pour vous.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappLink(CONTACT_WHATSAPP, waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
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

      {/* ---------------- FAQ ---------------- */}
      <section className="container-max py-12 md:py-16">
        <motion.div {...reveal} className="mb-8 max-w-2xl">
          <Eyebrow><Icon icon="line-md:question-circle" width={14} />Questions fréquentes</Eyebrow>
          <H2>{e.nomCourt} {v.prep} {v.nom} : vos questions</H2>
        </motion.div>
        <FaqAccordion items={e.faq(v.nom)} />
      </section>

      {/* ---------------- MAILLAGE INTERNE ---------------- */}
      <section className="container-max pb-16">
        <div className="border-t border-(--glass-border) pt-10">
          <h2 className="font-heading font-bold uppercase text-sm tracking-widest text-(--text-muted) mb-5">
            Autres expertises {v.prep} {v.nom}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {autres.map((x) => (
              <Link key={x.slug} href={localPath(x, v)} className="rounded-2xl border border-(--glass-border) bg-(--bg) p-5 flex items-center gap-4 group hover:border-primary/40 transition-colors">
                <span className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0">
                  <Icon icon={x.icon} width={22} aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="font-heading font-bold text-(--text-primary) block">{x.nom} {v.prep} {v.nom}</span>
                  <span className="text-(--text-muted) text-xs">Voir la prestation</span>
                </span>
                <Icon icon="line-md:arrow-right" width={18} className="text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
