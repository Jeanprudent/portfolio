"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"

type Item = { q: string; r: string }

/**
 * FAQ en deux colonnes INDÉPENDANTES.
 *
 * Chaque colonne est une pile autonome : ouvrir une question ne pousse que les
 * questions de SA colonne, l'autre colonne ne subit aucun décalage ni espace
 * vide. Plusieurs réponses peuvent rester ouvertes en même temps.
 */
export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const indexed = items.map((item, i) => ({ ...item, i }))
  const mid = Math.ceil(indexed.length / 2)
  const columns = [indexed.slice(0, mid), indexed.slice(mid)]

  return (
    <div className="grid md:grid-cols-2 gap-x-5 gap-y-3 items-start">
      {columns.map((col, c) => (
        <div key={c} className="space-y-3">
          {col.map((item) => {
            const isOpen = open.has(item.i)
            return (
              <div
                key={item.i}
                className={`rounded-2xl border bg-(--bg) transition-colors ${
                  isOpen ? "border-primary/40" : "border-(--glass-border)"
                }`}
              >
                <button
                  onClick={() => toggle(item.i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left p-5"
                >
                  <span className="font-heading font-bold text-(--text-primary)">{item.q}</span>
                  <Icon
                    icon="line-md:chevron-down"
                    width={20}
                    className={`text-primary shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1 text-(--text-secondary) text-sm leading-relaxed">
                    {item.r}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
