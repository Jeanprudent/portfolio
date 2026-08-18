import { Icon } from "@iconify/react"
import type { Offer } from "@/types/portfolio"

const mailto = (subject: string, intro: string) =>
  `mailto:jeanprudent03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Bonjour,\n\n${intro}\n\nMon nom :\nEmail :\nMessage :\n\n`,
  )}`

export default function ServiceOffers({
  offers,
  serviceTitle,
}: {
  offers: Offer[]
  serviceTitle: string
}) {
  if (!offers.length) return null

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <div key={offer.id} className="glass-card flex flex-col p-6">
          <h4 className="font-heading font-semibold text-lg mb-2">{offer.name}</h4>
          <p className="text-sm text-(--text-secondary) leading-relaxed">{offer.description}</p>

          <dl className="mt-5 space-y-3 border-t border-(--glass-border) pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-xs uppercase tracking-wide text-(--text-muted)">Durée</dt>
              <dd className="font-semibold text-sm whitespace-nowrap">{offer.duration_days} jours</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-(--text-muted) mb-1">
                Prix indicatif
              </dt>
              {/* Le prix passe sur sa propre ligne : « 1 200 000 à 3 000 000 XOF »
                  se coupait en deux dans l'ancienne rangée. */}
              <dd className="font-heading font-bold text-base leading-snug">{offer.price}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-col gap-2 pt-5">
            <a
              href={mailto(
                `Demande de devis : ${serviceTitle} — ${offer.name}`,
                `Je souhaite en savoir plus sur l'offre ${offer.name} pour le service ${serviceTitle}.`,
              )}
              className="btn-primary justify-center text-xs"
            >
              <Icon icon="line-md:confirm-circle-twotone" width={15} aria-hidden />
              Choisir cette offre
            </a>
            <a
              href={mailto(
                `Demande d'information : ${serviceTitle}`,
                "J'aimerais discuter de mon projet.",
              )}
              className="btn-ghost justify-center text-xs"
            >
              Demander plus d&apos;infos
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
