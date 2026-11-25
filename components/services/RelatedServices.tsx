import Link from "next/link"
import { Icon } from "@iconify/react"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"

/**
 * Maillage horizontal : chaque fiche renvoie vers les autres.
 *
 * Les slugs viennent de serviceSlug(), la même fonction que
 * generateStaticParams — un lien ne peut donc pas pointer vers une fiche
 * inexistante.
 */
export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const autres = SERVICES.filter(
    (s) => s.visible && serviceSlug(s) !== currentSlug
  )
  if (autres.length < 1) return null

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-balance">
        Autres services
      </h2>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {autres.map((s) => (
          <li key={s.id}>
            <Link
              href={`/services/${serviceSlug(s)}`}
              className="glass-card group flex h-full flex-col p-6"
            >
              <span
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(255, 122, 26,0.12)",
                  border: "1px solid rgba(255, 122, 26,0.25)",
                }}
              >
                <Icon icon={s.icon} width={20} aria-hidden className="text-primary" />
              </span>

              <h3 className="font-heading font-semibold text-base mb-1.5 text-(--text-primary)">
                {s.title}
              </h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed line-clamp-3">
                {s.description}
              </p>

              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:gap-3">
                En savoir plus
                <Icon icon="line-md:arrow-right" width={14} aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
