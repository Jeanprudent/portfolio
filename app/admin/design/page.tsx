"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"

const DEFAULT_COLORS = { primary: "#7C3AED", secondary: "#06B6D4", accent: "#A855F7" }

const FONT_PAIRS = [
  { id: "syne-dm", heading: "Syne", body: "DM Sans", label: "Syne + DM Sans (actuel)" },
  { id: "outfit-inter", heading: "Outfit", body: "Inter", label: "Outfit + Inter" },
  { id: "space-inter", heading: "Space Grotesk", body: "Inter", label: "Space Grotesk + Inter" },
  { id: "plus-manrope", heading: "Plus Jakarta Sans", body: "Manrope", label: "Plus Jakarta + Manrope" },
]

const STYLE_PRESETS = [
  { id: "dark-premium", label: "Dark Premium", desc: "Glassmorphisme, violet/cyan, particules", primary: "#7C3AED", secondary: "#06B6D4", accent: "#A855F7" },
  { id: "midnight-blue", label: "Midnight Blue", desc: "Sombre, bleu profond, épuré", primary: "#3B82F6", secondary: "#06B6D4", accent: "#60A5FA" },
  { id: "emerald-dark", label: "Emerald Dark", desc: "Sombre, vert émeraude, minimaliste", primary: "#10B981", secondary: "#06B6D4", accent: "#34D399" },
  { id: "rose-gold", label: "Rose Gold", desc: "Sombre, rose/doré, luxueux", primary: "#F43F5E", secondary: "#F59E0B", accent: "#FB7185" },
]

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border-2 border-white/20 shrink-0" style={{ background: value }} />
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-white/40 text-xs font-mono">{value}</p>
        </div>
      </div>
      <div className="relative">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer opacity-0 absolute inset-0" title={`Choisir ${label}`} />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Icon icon="line-md:paint-drop-twotone" width={16} className="text-white/50" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDesignPage() {
  const [configId, setConfigId] = useState<string | null>(null)
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [fontPair, setFontPair] = useState("syne-dm")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("portfolio_config")
      .select("id, primary_color, secondary_color, accent_color")
      .single()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else if (data) {
          setConfigId(data.id)
          setColors({
            primary: data.primary_color ?? DEFAULT_COLORS.primary,
            secondary: data.secondary_color ?? DEFAULT_COLORS.secondary,
            accent: data.accent_color ?? DEFAULT_COLORS.accent,
          })
        }
        setLoading(false)
      })
  }, [])

  const setColor = (key: keyof typeof DEFAULT_COLORS) => (v: string) =>
    setColors((prev) => ({ ...prev, [key]: v }))

  const applyPreset = (preset: (typeof STYLE_PRESETS)[number]) => {
    setColors({ primary: preset.primary, secondary: preset.secondary, accent: preset.accent })
    toast.success(`Preset "${preset.label}" appliqué — cliquez Sauvegarder pour confirmer`)
  }

  const handleSave = async () => {
    if (!configId) return
    setSaving(true)
    const { error } = await supabase
      .from("portfolio_config")
      .update({ primary_color: colors.primary, secondary_color: colors.secondary, accent_color: colors.accent })
      .eq("id", configId)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success("Design sauvegardé !")
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Design</h1>
          <p className="text-white/50 text-sm">Personnalisez les couleurs de votre portfolio.</p>
        </div>
        <button
          onClick={handleSave} disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 disabled:opacity-60 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
          Sauvegarder
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" />
        </div>
      ) : (
        <>
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-white font-semibold text-sm mb-4">Presets de style</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id} onClick={() => applyPreset(preset)}
                  className="flex items-center gap-3 p-3.5 rounded-xl text-left group transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex gap-1 shrink-0">
                    {[preset.primary, preset.secondary, preset.accent].map((c) => (
                      <div key={c} className="w-4 h-4 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{preset.label}</p>
                    <p className="text-white/40 text-xs">{preset.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-white font-semibold text-sm mb-4">Couleurs personnalisées</h2>
            <div className="space-y-2">
              <ColorInput label="Couleur principale" value={colors.primary} onChange={setColor("primary")} />
              <ColorInput label="Couleur secondaire" value={colors.secondary} onChange={setColor("secondary")} />
              <ColorInput label="Couleur d'accentuation" value={colors.accent} onChange={setColor("accent")} />
            </div>
            <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-white/40 text-xs mb-3">Aperçu</p>
              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}>Bouton principal</div>
                <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.primary}50`, color: colors.accent }}>Bouton secondaire</div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${colors.primary}20`, color: colors.accent }}>Badge</span>
              </div>
              <div className="mt-3 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})` }} />
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-white font-semibold text-sm mb-4">Typographie</h2>
            <div className="space-y-2">
              {FONT_PAIRS.map((pair) => (
                <button
                  key={pair.id} onClick={() => setFontPair(pair.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200"
                  style={fontPair === pair.id ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{pair.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">Titres : {pair.heading} · Corps : {pair.body}</p>
                  </div>
                  {fontPair === pair.id && <Icon icon="line-md:confirm-circle-twotone" width={18} className="text-[#A855F7] shrink-0" />}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs flex items-center gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#FCD34D" }}>
              <Icon icon="line-md:alert-twotone" width={14} className="shrink-0" />
              Le changement de police nécessite une modification dans <code className="font-mono">app/layout.tsx</code>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
