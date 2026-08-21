"use client"

import { Icon } from "@iconify/react"

/**
 * Liste modifiable générique : ajouter, supprimer, réordonner.
 *
 * Sert aux badges, bénéfices, cartes « ce qui est inclus », étapes du
 * processus, offres et FAQ. Le rendu de chaque entrée est fourni par
 * l'appelant : ce composant ne s'occupe que de la mécanique de liste.
 *
 * L'ordre compte pour les étapes du processus et pour les offres, d'où les
 * boutons de déplacement plutôt qu'un simple ajout/suppression.
 */
export function RepeatableList<T>({
  items,
  onChange,
  renderItem,
  nouveau,
  labelAjout = "Ajouter",
  labelVide = "Aucun élément pour le moment.",
}: {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, set: (patch: Partial<T>) => void) => React.ReactNode
  nouveau: () => T
  labelAjout?: string
  labelVide?: string
}) {
  const deplacer = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    const copie = [...items]
    const [x] = copie.splice(from, 1)
    copie.splice(to, 0, x)
    onChange(copie)
  }

  const supprimer = (i: number) => onChange(items.filter((_, k) => k !== i))

  const set = (i: number) => (patch: Partial<T>) =>
    onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)))

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-white/30 text-sm italic py-2">{labelVide}</p>
      )}

      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-white/30 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => deplacer(i, i - 1)}
                disabled={i === 0}
                aria-label="Monter"
                title="Monter"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <Icon icon="line-md:chevron-up" width={15} />
              </button>
              <button
                type="button"
                onClick={() => deplacer(i, i + 1)}
                disabled={i === items.length - 1}
                aria-label="Descendre"
                title="Descendre"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <Icon icon="line-md:chevron-down" width={15} />
              </button>
              <button
                type="button"
                onClick={() => supprimer(i)}
                aria-label="Supprimer"
                title="Supprimer"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
              >
                <Icon icon="line-md:close" width={15} />
              </button>
            </div>
          </div>

          {renderItem(item, i, set(i))}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, nouveau()])}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
      >
        <Icon icon="line-md:plus-circle-twotone" width={17} />
        {labelAjout}
      </button>
    </div>
  )
}

export default RepeatableList
