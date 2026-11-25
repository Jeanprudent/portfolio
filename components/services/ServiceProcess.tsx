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

      {/* Étapes disposées horizontalement (grille qui s'enroule) plutôt qu'en
          colonne : le déroulé tient sur peu de hauteur et se lit d'un coup.
          Le numéro reste le repère d'ordre. */}
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="group relative flex flex-col rounded-2xl border border-(--glass-border) bg-(--card-bg) p-6 transition-colors duration-200 hover:border-primary/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-heading font-bold text-white tabular-nums"
                style={{ background: "linear-gradient(135deg, #ff7a1a, #e66b0d)" }}
              >
                {i + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                Étape {i + 1}/{steps.length}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-lg mb-1.5 text-(--text-primary)">
              {step.title}
            </h3>
            {step.text && (
              <p className="text-(--text-secondary) text-sm leading-relaxed">{step.text}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
