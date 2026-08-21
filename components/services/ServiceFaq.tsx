import type { ServiceContent } from "@/lib/service-content"

/**
 * Section FAQ, en <details>/<summary> natifs.
 *
 * Ce choix n'est pas de la paresse : l'accordéon natif est accessible au
 * clavier sans effort, fonctionne sans JavaScript, reste indexable par
 * Google, et ne coûte rien en INP. Un accordéon React ferait moins bien
 * sur les quatre points.
 *
 * Le <h3> va DANS le <summary>, jamais autour : l'inverse casserait la
 * hiérarchie Hn vérifiée par les tests e2e.
 */
export default function ServiceFaq({ content }: { content: ServiceContent }) {
  if (!content.hasFaq) return null

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-balance">
        Questions fréquentes
      </h2>

      <div className="flex flex-col gap-3 max-w-3xl">
        {content.faq.map((item) => (
          <details
            key={item.q}
            className="group glass-card overflow-hidden [&[open]]:border-primary/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current">
              <h3 className="font-semibold text-base text-(--text-primary)">
                {item.q}
              </h3>
              <span
                aria-hidden
                className="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45 text-xl leading-none"
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-(--text-secondary) leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
