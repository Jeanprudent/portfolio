"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"

type SeoForm = {
  seo_title: string
  seo_description: string
  google_analytics_id: string
  robots: string
}

const DEFAULT: SeoForm = {
  seo_title: "Jean Prudent IDOHOU — Développeur Web & Designer | Cotonou, Bénin",
  seo_description: "Je crée des sites web qui transforment votre présence en ligne en moteur de croissance. Développeur Next.js, expert SEO et intégrateur WordPress basé à Cotonou.",
  google_analytics_id: "",
  robots: "index, follow",
}

function InputField({
  label, id, value, onChange, placeholder, maxLength, hint, textarea,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void
  placeholder?: string; maxLength?: number; hint?: string; textarea?: boolean
}) {
  const count = value.length
  const over = maxLength ? count > maxLength : false

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-white/50">{label}</label>
        {maxLength && <span className={`text-xs ${over ? "text-red-400" : "text-white/30"}`}>{count}/{maxLength}</span>}
      </div>
      {textarea ? (
        <textarea
          id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200 resize-none"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${over ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}` }}
        />
      ) : (
        <input
          id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${over ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}` }}
        />
      )}
      {hint && <p className="mt-1 text-xs text-white/30">{hint}</p>}
    </div>
  )
}

export default function AdminSeoPage() {
  const [configId, setConfigId] = useState<string | null>(null)
  const [form, setForm] = useState<SeoForm>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("portfolio_config")
      .select("id, seo_title, seo_description, google_analytics_id")
      .single()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else if (data) {
          setConfigId(data.id)
          setForm({
            seo_title: data.seo_title ?? DEFAULT.seo_title,
            seo_description: data.seo_description ?? DEFAULT.seo_description,
            google_analytics_id: data.google_analytics_id ?? "",
            robots: "index, follow",
          })
        }
        setLoading(false)
      })
  }, [])

  const set = (key: keyof SeoForm) => (v: string) => setForm((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    if (!configId) return
    setSaving(true)
    const { error } = await supabase
      .from("portfolio_config")
      .update({
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        google_analytics_id: form.google_analytics_id || null,
      })
      .eq("id", configId)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success("Paramètres SEO sauvegardés !")
  }

  const titleLen = form.seo_title.length
  const descLen = form.seo_description.length

  return (
    <div className="space-y-8 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">SEO &amp; Méta</h1>
          <p className="text-white/50 text-sm">Optimisez votre référencement naturel et les aperçus sur les réseaux sociaux.</p>
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
          {/* Google Preview */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50 mb-4">Aperçu Google</p>
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-[#202124] mb-0.5">jeanprudent.dev</p>
              <p className="text-lg font-medium leading-snug mb-1" style={{ color: titleLen > 60 ? "#c5221f" : "#1a0dab" }}>
                {form.seo_title || "Titre de la page"}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: descLen > 160 ? "#c5221f" : "#4d5156" }}>
                {form.seo_description || "Description meta…"}
              </p>
            </div>
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${titleLen <= 60 ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-white/50">Titre : {titleLen}/60{titleLen > 60 ? " — trop long" : " — OK"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${descLen >= 120 && descLen <= 160 ? "bg-green-400" : descLen < 120 ? "bg-yellow-400" : "bg-red-400"}`} />
                <span className="text-white/50">Description : {descLen}/160{descLen < 120 ? " — trop court" : descLen > 160 ? " — trop long" : " — OK"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-white font-semibold text-sm">Balises meta</h2>
            <InputField label="Titre SEO" id="seo_title" value={form.seo_title} onChange={set("seo_title")} maxLength={60} placeholder="Titre | Sous-titre — Site" />
            <InputField label="Description meta" id="seo_description" value={form.seo_description} onChange={set("seo_description")} maxLength={160} placeholder="Description concise de votre site…" textarea />
          </div>

          <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-white font-semibold text-sm">Tracking &amp; Analytics</h2>
            <InputField label="ID Google Analytics 4" id="ga_id" value={form.google_analytics_id} onChange={set("google_analytics_id")} placeholder="G-XXXXXXXXXX" hint="Laissez vide pour désactiver le tracking" />
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Robots</label>
              <select
                value={form.robots} onChange={(e) => set("robots")(e.target.value)}
                className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value="index, follow">index, follow (recommandé)</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
