import { Icon } from "@iconify/react"
import type { ServiceContent } from "@/lib/service-content"

/** Section « Ce qui est inclus » — grille de cartes. */
export default function ServiceIncludes({ content }: { content: ServiceContent }) {
  if (!content.hasIncludes) return null

  const { title, items } = content.includes

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-balance">
        {title || "Ce qui est inclus"}
      </h2>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="glass-card p-6">
            {item.icon && (
              <span
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(255, 122, 26,0.12)",
                  border: "1px solid rgba(255, 122, 26,0.25)",
                }}
              >
                <Icon icon={item.icon} width={20} aria-hidden className="text-primary" />
              </span>
            )}
            <h3 className="font-heading font-semibold text-base mb-1.5 text-(--text-primary)">
              {item.title}
            </h3>
            {item.text && (
              <p className="text-(--text-secondary) text-sm leading-relaxed">
                {item.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
