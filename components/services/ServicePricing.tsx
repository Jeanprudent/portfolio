import { Icon } from "@iconify/react"
import ServiceOffers from "./ServiceOffers"
import type { Service } from "@/types/portfolio"
import type { ServiceContent } from "@/lib/service-content"

/**
 * Section « Tarifs » — englobe les offres existantes et y ajoute le contexte
 * de prix (ce qui fait varier un devis).
 *
 * Les cartes d'offres émettent leurs propres <h3> : ce composant ne doit
 * donc émettre que le <h2>.
 */
export default function ServicePricing({
  service,
  content,
}: {
  service: Service
  content: ServiceContent
}) {
  const offers = service.offers ?? []
  if (!offers.length) return null

  const { intro, factors } = content.pricing

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2 text-balance">
        Tarifs
      </h2>

      <p className="text-(--text-secondary) text-sm mb-6 max-w-2xl leading-relaxed">
        {intro ||
          "Des formules claires, ajustables à votre contexte. Les prix sont indicatifs et confirmés après un premier échange."}
      </p>

      <ServiceOffers offers={offers} serviceTitle={service.title} />

      {factors.length > 0 && (
        <div className="glass-card mt-6 p-6">
          <p className="text-(--text-primary) font-semibold text-sm mb-3">
            Ce qui fait varier le devis
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {factors.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-(--text-secondary) text-sm"
              >
                <Icon
                  icon="line-md:chevron-right"
                  width={15}
                  aria-hidden
                  className="mt-1 shrink-0 text-primary"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
