"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { FONT_PAIRS, DEFAULT_FONT_PAIR, resolveFontPair, type FontPair } from "@/lib/font-pairs"

/**
 * Choix de la typographie du site.
 *
 * Les sélecteurs de couleurs ont été retirés : ils écrivaient bien dans
 * portfolio_config, mais aucun composant ne lisait ces colonnes — la palette
 * vit dans globals.css. Le bouton donnait donc l'illusion d'un réglage.
 *
 * Les polices, elles, sont réellement appliquées : app/layout.tsx lit
 * font_pair et branche --font-heading-family / --font-body-family sur <html>.
 */

/** Les familles sont chargées par le layout racine, leurs variables sont donc disponibles ici. */
const familyOf = (variable: string) => `var(${variable}), sans-serif`

function PairCard({
  pair,
  selected,
  onSelect,
}: {
  pair: FontPair
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className="w-full rounded-xl p-4 text-left transition-all duration-200"
      style={
        selected
          ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)" }
          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white text-sm font-medium">{pair.label}</p>
          <p className="text-white/40 text-xs mt-0.5">
            Titres : {pair.heading} · Corps : {pair.body}
          </p>
        </div>
        {selected && (
          <Icon icon="line-md:confirm-circle-twotone" width={18} className="text-[#A855F7] shrink-0" />
        )}
      </div>

      {/* Aperçu rendu dans les vraies polices, pas seulement leur nom. */}
      <p
        className="text-white text-lg mt-3 leading-tight"
        style={{ fontFamily: familyOf(pair.headingVar), fontWeight: 700 }}
      >
        Développeur web &amp; SEO
      </p>
      <p
        className="text-white/50 text-sm mt-1"
        style={{ fontFamily: familyOf(pair.bodyVar) }}
      >
        Des sites qui convertissent, pensés pour vos clients.
      </p>
    </button>
  )
}

export default function AdminDesignPage() {
  const [configId, setConfigId] = useState<string | null>(null)
  const [fontPair, setFontPair] = useState<FontPair>(DEFAULT_FONT_PAIR)
  const [saved, setSaved] = useState<string>(DEFAULT_FONT_PAIR.id)
  const [colonneManquante, setColonneManquante] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("portfolio_config")
      .select("id, font_pair")
      .single()
      .then(({ data, error }) => {
        if (error) {
          // 42703 = colonne inexistante : la migration 006 n'a pas été jouée.
          if (error.code === "42703") setColonneManquante(true)
          else toast.error(error.message)
        } else if (data) {
          setConfigId(data.id)
          const pair = resolveFontPair(data.font_pair)
          setFontPair(pair)
          setSaved(pair.id)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    if (!configId) return
    setSaving(true)
    const { error } = await supabase
      .from("portfolio_config")
      .update({ font_pair: fontPair.id })
      .eq("id", configId)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSaved(fontPair.id)
    toast.success("Typographie enregistrée — visible sur le site sous 30 s")
  }

  const modifie = fontPair.id !== saved

  return (
    <div className="space-y-8 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Design</h1>
          <p className="text-white/50 text-sm">
            Choisissez la typographie de votre portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading || !configId || !modifie}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 disabled:opacity-40 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? (
            <Icon icon="line-md:loading-loop" width={16} />
          ) : (
            <Icon icon="line-md:confirm-circle-twotone" width={16} />
          )}
          {modifie ? "Sauvegarder" : "Enregistré"}
        </button>
      </div>

      {colonneManquante && (
        <div
          className="rounded-xl p-4 text-xs flex items-start gap-2"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#FCD34D",
          }}
        >
          <Icon icon="line-md:alert-twotone" width={16} className="shrink-0 mt-0.5" />
          <span>
            La colonne <code className="font-mono">font_pair</code> n&apos;existe pas encore.
            Exécutez <code className="font-mono">supabase/migrations/006_config_font_pair.sql</code>{" "}
            dans le SQL Editor Supabase, puis rechargez cette page.
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" />
        </div>
      ) : (
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-1">Typographie</h2>
          <p className="text-white/40 text-xs mb-4">
            Les titres et le corps de texte de tout le site suivent la paire sélectionnée.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {FONT_PAIRS.map((pair) => (
              <PairCard
                key={pair.id}
                pair={pair}
                selected={pair.id === fontPair.id}
                onSelect={() => setFontPair(pair)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
