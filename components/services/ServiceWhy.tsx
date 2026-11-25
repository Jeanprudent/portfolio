import Link from "next/link"
import { Icon } from "@iconify/react"
import type { ServiceContent } from "@/lib/service-content"

/**
 * Section « Pourquoi en avez-vous besoin ? » — argumentaire en quatre temps.
 *
 * RÈGLE ABSOLUE : les mots « Problème », « Aggravation », « Solution » et
 * « Action » n'apparaissent NULLE PART côté visiteur. Ils ne servent qu'à
 * nommer les clés et à guider la rédaction dans le back-office. Chaque temps
 * porte le sous-titre que l'auteur a écrit.
 *
 * La tension est portée par une progression visuelle, jamais par une
 * numérotation : l'ordre se lit, il n'a pas à être compté.
 *
 * Les cartes de bénéfices illustrent le troisième temps — elles ne forment
 * pas une section à part (décision du 20/08, pour ne pas dire deux fois la
 * même chose à dix centimètres d'écart).
 */
export default function ServiceWhy({ content }: { content: ServiceContent }) {
  if (!content.hasWhy) return null

  const { title, problem, aggravation, solution, action } = content.why
  const rempli = (b: { title: string; text: string }) => b.title || b.text

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-balance">
        {title || "Pourquoi en avez-vous besoin ?"}
      </h2>

      <div className="flex flex-col gap-5 max-w-3xl">
        {/* Temps 1 — la situation. Teinte neutre, on décrit sans dramatiser. */}
        {rempli(problem) && (
          <div className="rounded-xl border border-(--glass-border) p-6">
            {problem.title && (
              <h3 className="font-heading font-semibold text-lg mb-2 text-(--text-primary)">
                {problem.title}
              </h3>
            )}
            <p className="text-(--text-secondary) leading-relaxed">{problem.text}</p>
          </div>
        )}

        {/* Temps 2 — ce qui empire. Bord d'alerte discret, la tension monte. */}
        {rempli(aggravation) && (
          <div
            className="rounded-xl border border-(--glass-border) border-l-4 p-6"
            style={{ borderLeftColor: "#C2760B" }}
          >
            {aggravation.title && (
              <h3 className="font-heading font-semibold text-lg mb-2 text-(--text-primary)">
                {aggravation.title}
              </h3>
            )}
            <p className="text-(--text-secondary) leading-relaxed">
              {aggravation.text}
            </p>
          </div>
        )}

        {/* Temps 3 — la réponse. Bascule sur l'accent de la marque. */}
        {(rempli(solution) || solution.benefits.length > 0) && (
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: "rgba(255, 122, 26,0.35)",
              background: "rgba(255, 122, 26,0.06)",
            }}
          >
            {solution.title && (
              <h3 className="font-heading font-semibold text-lg mb-2 text-(--text-primary)">
                {solution.title}
              </h3>
            )}
            {solution.text && (
              <p className="text-(--text-secondary) leading-relaxed">
                {solution.text}
              </p>
            )}

            {solution.benefits.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 mt-6">
                {solution.benefits.map((b) => (
                  <li
                    key={b.title}
                    className="rounded-lg border border-(--glass-border) bg-(--card-bg) p-4"
                  >
                    <h3 className="font-semibold text-sm text-(--text-primary) mb-1 flex items-center gap-2">
                      {b.icon && (
                        <Icon
                          icon={b.icon}
                          width={17}
                          aria-hidden
                          className="text-primary shrink-0"
                        />
                      )}
                      {b.title}
                    </h3>
                    {b.text && (
                      <p className="text-(--text-secondary) text-sm leading-relaxed">
                        {b.text}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Temps 4 — passage à l'action. Bloc plein, l'argumentaire aboutit. */}
        {rempli(action) && (
          <div className="rounded-xl p-6 gradient-bg text-white">
            {action.title && (
              <h3 className="font-heading font-semibold text-lg mb-2">
                {action.title}
              </h3>
            )}
            {action.text && (
              <p className="text-white/90 leading-relaxed mb-5">{action.text}</p>
            )}
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#4C1D95] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Icon icon="line-md:telegram" width={16} aria-hidden />
              {action.ctaLabel || "Discutons de votre projet"}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
