import type { ServiceContent } from "@/lib/service-content"

/**
 * Section « Comment ça se passe » — étapes du projet.
 *
 * Seule section numérotée de la page, et c'est délibéré : l'ordre porte ici
 * une information que le lecteur a besoin de compter (le déroulé d'un
 * projet). Ailleurs, numéroter serait décoratif.
 */
export default function ServiceProcess({ content }: { content: ServiceContent }) {
  if (!content.hasProcess) return null

  const { title, steps } = content.process

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-balance">
        {title || "Comment ça se passe"}
      </h2>

      <ol className="relative flex flex-col gap-8 max-w-3xl">
        {steps.map((step, i) => (
          <li key={step.title} className="relative grid grid-cols-[auto_1fr] gap-5">
            <div className="flex flex-col items-center">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading font-bold text-sm text-white tabular-nums"
                style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
              >
                {i + 1}
              </span>
              {/* Trait de liaison, sauf sous la dernière étape. */}
              {i < steps.length - 1 && (
                <span
                  className="mt-2 w-px flex-1"
                  style={{ background: "var(--glass-border)" }}
                  aria-hidden
                />
              )}
            </div>

            <div className="pb-1">
              <h3 className="font-heading font-semibold text-lg mb-1.5 text-(--text-primary)">
                {step.title}
              </h3>
              {step.text && (
                <p className="text-(--text-secondary) leading-relaxed">{step.text}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
