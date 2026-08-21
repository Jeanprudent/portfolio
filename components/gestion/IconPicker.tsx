"use client"

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"

/**
 * Saisie d'un nom d'icône Iconify, avec aperçu et vérification d'existence.
 *
 * Raison d'être : un nom inexistant ne produit AUCUNE erreur — Iconify
 * renvoie du vide et l'icône disparaît en silence. Le projet a compté
 * 9 noms invalides, dont un proposé par ce formulaire même. Le contrôle est
 * fait ici, au moment de la saisie, plutôt que découvert en production.
 */

type Etat = "vide" | "verification" | "valide" | "introuvable"

type Verdict = { nom: string; existe: boolean }

export function IconPicker({
  value,
  onChange,
  suggestions = [],
  label = "Icône",
}: {
  value: string
  onChange: (v: string) => void
  suggestions?: string[]
  label?: string
}) {
  const nom = value.trim()
  const formatValide = nom.includes(":")

  // Seul le résultat de l'appel réseau vit dans un état. Le reste se déduit
  // du nom saisi à chaque rendu — pas de setState synchrone dans l'effet.
  const [verdict, setVerdict] = useState<Verdict | null>(null)

  useEffect(() => {
    if (!nom || !formatValide) return

    let annule = false
    // Laisse le temps de finir de taper avant d'interroger l'API.
    const t = setTimeout(async () => {
      const [prefixe, icone] = nom.split(":")
      try {
        const res = await fetch(
          `https://api.iconify.design/${prefixe}.json?icons=${icone}`
        )
        const data = await res.json()
        if (annule) return
        setVerdict({ nom, existe: Boolean(data?.icons?.[icone]) })
      } catch {
        // Hors ligne : on n'affirme pas que l'icône est fausse.
        if (!annule) setVerdict(null)
      }
    }, 400)

    return () => {
      annule = true
      clearTimeout(t)
    }
  }, [nom, formatValide])

  const etat: Etat = !nom
    ? "vide"
    : !formatValide
      ? "introuvable"
      : verdict?.nom === nom
        ? verdict.existe
          ? "valide"
          : "introuvable"
        : "verification"

  const message = {
    vide: null,
    verification: { texte: "Vérification…", couleur: "text-white/30" },
    valide: { texte: "Icône trouvée", couleur: "text-green-400" },
    introuvable: {
      texte: "Ce nom n'existe pas — l'icône s'affichera vide",
      couleur: "text-red-400",
    },
  }[etat]

  return (
    <div>
      <label
        htmlFor="icon-picker"
        className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5"
      >
        {label}
      </label>

      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "rgba(124,58,237,0.12)",
            border:
              etat === "introuvable"
                ? "1px solid rgba(239,68,68,0.5)"
                : "1px solid rgba(124,58,237,0.25)",
          }}
        >
          {nom ? (
            <Icon icon={nom} width={22} className="text-[#A855F7]" />
          ) : (
            <span className="text-white/20 text-xs">—</span>
          )}
        </span>

        <input
          id="icon-picker"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="line-md:laptop-twotone"
          spellCheck={false}
          className="h-11 flex-1 rounded-xl px-4 text-sm text-white placeholder:text-white/25 focus:outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      {message && (
        <p className={`mt-1.5 text-xs ${message.couleur}`}>{message.texte}</p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              title={s}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={{
                background:
                  nom === s
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(255,255,255,0.04)",
              }}
            >
              <Icon icon={s} width={16} className="text-white/70" />
            </button>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-xs text-white/25">
        Parcourir les icônes disponibles sur icon-sets.iconify.design
      </p>
    </div>
  )
}

export default IconPicker
