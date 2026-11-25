import Link from "next/link"
import { Icon } from "@iconify/react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"

/**
 * Page 404 du site.
 *
 * Deux raisons d'exister plutôt que de laisser la page par défaut de Next :
 *
 * 1. Sur Vercel, `notFound()` appelé depuis une page renvoyait 500 au lieu
 *    de 404 — constaté le 21/08 sur /blog/[slug] et /services/[slug], alors
 *    qu'une URL sans route correspondante donnait bien 404. Déclarer une
 *    page explicite retire la dépendance à la page interne de Next.
 *
 * 2. La page par défaut est un texte nu sur fond blanc, sans navigation.
 *    Un visiteur qui suit un vieux lien se retrouvait dans une impasse.
 */
export default function NotFound() {
  const services = SERVICES.filter((s) => s.visible).slice(0, 4)

  return (
    <>
      <Navbar />

      <main className="container-max section-spacing min-h-[70vh] pt-32">
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-primary">
          Erreur 404
        </p>

        <h1 className="mb-4 max-w-2xl text-balance font-heading text-3xl font-bold text-(--text-primary) md:text-5xl">
          Cette page n&apos;existe pas ou a été déplacée
        </h1>

        <p className="mb-8 max-w-xl leading-relaxed text-(--text-secondary)">
          Le lien que vous avez suivi est peut-être ancien, ou l&apos;adresse
          comporte une faute de frappe. Voici de quoi retrouver votre chemin.
        </p>

        <div className="mb-12 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            <Icon icon="line-md:home-twotone" width={17} aria-hidden />
            Retour à l&apos;accueil
          </Link>
          <Link href="/#contact" className="btn-ghost">
            <Icon icon="line-md:telegram" width={17} aria-hidden />
            Me contacter
          </Link>
        </div>

        <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-widest text-(--text-primary)">
          Vous cherchiez peut-être
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id}>
              <Link
                href={`/services/${serviceSlug(s)}`}
                className="glass-card group flex h-full items-start gap-3 p-5"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(255, 122, 26,0.12)",
                    border: "1px solid rgba(255, 122, 26,0.25)",
                  }}
                >
                  <Icon icon={s.icon} width={18} aria-hidden className="text-primary" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-semibold text-(--text-primary)">
                    {s.title}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:gap-2.5">
                    En savoir plus
                    <Icon icon="line-md:arrow-right" width={13} aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/blog" className="glass-card group flex h-full items-start gap-3 p-5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(255, 122, 26,0.12)",
                  border: "1px solid rgba(255, 122, 26,0.25)",
                }}
              >
                <Icon
                  icon="line-md:pencil-alt-twotone"
                  width={18}
                  aria-hidden
                  className="text-primary"
                />
              </span>
              <span>
                <span className="block font-heading text-sm font-semibold text-(--text-primary)">
                  Le blog
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:gap-2.5">
                  Lire les articles
                  <Icon icon="line-md:arrow-right" width={13} aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </main>

      <Footer />
    </>
  )
}
