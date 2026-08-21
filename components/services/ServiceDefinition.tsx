import { sanitizeHtml } from "@/lib/sanitize"
import type { ServiceContent } from "@/lib/service-content"

/**
 * Section « C'est quoi ? » — définit le service avant d'argumenter.
 * S'efface entièrement si aucun contenu n'a été saisi.
 */
export default function ServiceDefinition({ content }: { content: ServiceContent }) {
  if (!content.hasDefinition) return null

  const { title, body, highlight } = content.definition

  return (
    <section className="mt-14">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-5 text-balance">
        {title || "C'est quoi, exactement ?"}
      </h2>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {body && (
          <div
            className="prose-jp max-w-none"
            // Saisi via l'éditeur riche du back-office : assaini comme le
            // contenu des articles, jamais injecté brut.
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
          />
        )}

        {highlight && (
          <figure className="glass-card p-6 lg:sticky lg:top-24">
            <blockquote className="text-(--text-primary) text-base leading-relaxed border-l-2 border-primary pl-4 italic">
              {highlight}
            </blockquote>
          </figure>
        )}
      </div>
    </section>
  )
}
