import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { Service } from "@/types/portfolio"
import type { ServiceContent } from "@/lib/service-content"
import { fromPrice } from "@/lib/service-price"

/**
 * En-tête de fiche service. Remplace ServiceBanner.
 *
 * SEUL composant de la page autorisé à émettre un <h1> — l'invariant est
 * vérifié par tests/e2e/service-page.spec.ts.
 */
export default function ServiceHero({
  service,
  content,
}: {
  service: Service
  content: ServiceContent
}) {
  const prix = fromPrice(service.offers)

  return (
    <header className="relative w-full overflow-hidden rounded-2xl mb-12">
      <div className="relative min-h-[20rem] md:min-h-[24rem]">
        {service.banner ? (
          <Image
            src={service.banner}
            alt=""
            fill
            priority
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-(--bg-secondary)" />
        )}

        {/* Voile au-dessus de la photo, sinon le titre repose sur l'image brute. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.30) 100%)",
          }}
        />

        <div className="relative flex flex-col items-start justify-center gap-4 p-6 md:p-10 min-h-[20rem] md:min-h-[24rem]">
          <span className="inline-flex items-center gap-2 text-sm text-white/80">
            <Icon icon={service.icon} width={18} aria-hidden />
            Service
          </span>

          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white text-balance max-w-3xl">
            {service.title}
          </h1>

          <p className="text-white/90 max-w-2xl text-base md:text-lg leading-relaxed">
            {content.hero.tagline || service.description}
          </p>

          {content.hero.badges.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {content.hero.badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/#contact" className="btn-primary">
              <Icon icon="line-md:telegram" width={17} aria-hidden />
              Demander un devis gratuit
            </Link>

            {prix && (
              <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
                {prix}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
