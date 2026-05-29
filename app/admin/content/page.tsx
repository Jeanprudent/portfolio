"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import type { Stat, Testimonial } from "@/types/portfolio"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/admin/ImageUpload"

const TABS = ["Hero & Bio", "Stats", "Témoignages"] as const
type Tab = (typeof TABS)[number]

function Field({
  label, id, value, onChange, placeholder, textarea,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] resize-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
      )}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {children}
    </div>
  )
}

// ─── Hero & Bio Tab ───────────────────────────────────────────────────────────

function HeroTab() {
  const [configId, setConfigId] = useState<string | null>(null)
  const [form, setForm] = useState({ tagline: "", bio: "", location: "", disponible: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("portfolio_config")
      .select("id, tagline, bio, location, disponible")
      .single()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else if (data) {
          setConfigId(data.id)
          setForm({
            tagline: data.tagline ?? "",
            bio: data.bio ?? "",
            location: data.location ?? "",
            disponible: data.disponible ?? true,
          })
        }
        setLoading(false)
      })
  }, [])

  const set = (key: keyof typeof form) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    if (!configId) return
    setSaving(true)
    const { error } = await supabase
      .from("portfolio_config")
      .update({ tagline: form.tagline, bio: form.bio, location: form.location, disponible: form.disponible })
      .eq("id", configId)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success("Section Hero sauvegardée !")
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" /></div>

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-white font-semibold text-sm">Texte principal</h2>
        <Field label="Accroche / Tagline" id="tagline" value={form.tagline} onChange={set("tagline") as (v: string) => void} placeholder="Votre proposition de valeur…" textarea />
        <Field label="Bio courte" id="bio" value={form.bio} onChange={set("bio") as (v: string) => void} placeholder="Description de vous-même…" textarea />
        <Field label="Localisation" id="location" value={form.location} onChange={set("location") as (v: string) => void} placeholder="Ville, Pays" />
      </Card>
      <Card>
        <h2 className="text-white font-semibold text-sm">Disponibilité</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Disponible pour des projets</p>
            <p className="text-white/40 text-xs mt-0.5">Affiché dans le badge Hero</p>
          </div>
          <button
            onClick={() => set("disponible")(!form.disponible)}
            className={cn("relative w-11 h-6 rounded-full transition-colors duration-200", form.disponible ? "bg-[#7C3AED]" : "bg-white/10")}
          >
            <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200", form.disponible ? "left-5.5" : "left-0.5")} />
          </button>
        </div>
      </Card>
      <div className="flex justify-end">
        <button
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("stats")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else setStats((data as Stat[]) ?? [])
        setLoading(false)
      })
  }, [])

  const update = (id: string, field: keyof Stat, value: string | number) =>
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))

  const handleSave = async () => {
    setSaving(true)
    const results = await Promise.all(
      stats.map((stat) =>
        supabase.from("stats").update({ label: stat.label, value: stat.value, suffix: stat.suffix }).eq("id", stat.id)
      )
    )
    setSaving(false)
    const err = results.find((r) => r.error)
    if (err?.error) toast.error(err.error.message)
    else toast.success("Stats sauvegardées !")
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" /></div>

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.id} className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Icon icon={stat.icon} width={20} className="text-[#A855F7]" />
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1 w-full">
            <div>
              <label className="block text-xs text-white/40 mb-1">Valeur</label>
              <input type="number" value={stat.value} onChange={(e) => update(stat.id, "value", Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Suffixe</label>
              <input type="text" value={stat.suffix} onChange={(e) => update(stat.id, "suffix", e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Label</label>
              <input type="text" value={stat.label} onChange={(e) => update(stat.id, "label", e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | "new" | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at")
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else setItems((data as Testimonial[]) ?? [])
        setLoading(false)
      })
  }, [])

  const editingItem = editing === "new"
    ? { id: "", name: "", role: "", company: "", text: "", rating: 5, visible: true }
    : (editing as Testimonial | null)

  const handleSave = async () => {
    if (!editingItem) return
    setSaving(true)
    const payload = {
      name: editingItem.name, role: editingItem.role, company: editingItem.company,
      text: editingItem.text, rating: editingItem.rating, visible: editingItem.visible,
    }
    if (editing === "new") {
      const { data, error } = await supabase.from("testimonials").insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setItems((prev) => [...prev, data as Testimonial])
    } else {
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editingItem.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      setItems((prev) => prev.map((t) => (t.id === editingItem.id ? { ...t, ...payload } : t)))
    }
    setSaving(false)
    setEditing(null)
    toast.success("Témoignage sauvegardé !")
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setItems((prev) => prev.filter((t) => t.id !== id))
    toast.success("Témoignage supprimé")
  }

  const toggleVisible = async (id: string) => {
    const t = items.find((x) => x.id === id)
    if (!t) return
    const { error } = await supabase.from("testimonials").update({ visible: !t.visible }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)))
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" /></div>

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
          <Icon icon="line-md:arrow-left" width={14} /> Retour
        </button>
        <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {editingItem && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Nom" id="t_name" value={editingItem.name} onChange={(v) => setEditing(editing === "new" ? { ...editingItem!, name: v } : { ...(editing as Testimonial), name: v })} />
                <Field label="Rôle" id="t_role" value={editingItem.role} onChange={(v) => setEditing(editing === "new" ? { ...editingItem!, role: v } : { ...(editing as Testimonial), role: v })} />
                <Field label="Entreprise" id="t_company" value={editingItem.company} onChange={(v) => setEditing(editing === "new" ? { ...editingItem!, company: v } : { ...(editing as Testimonial), company: v })} />
              </div>
              <Field label="Témoignage" id="t_text" value={editingItem.text} onChange={(v) => setEditing(editing === "new" ? { ...editingItem!, text: v } : { ...(editing as Testimonial), text: v })} textarea />
              <ImageUpload
                label="Photo du client (optionnel)"
                currentUrl={(editingItem as Testimonial & { avatar_url?: string }).avatar_url || null}
                folder="testimonials"
                onUpload={(url) => setEditing(editing === "new" ? { ...editingItem!, avatar_url: url } as Testimonial : { ...(editing as Testimonial), avatar_url: url })}
                hint="Photo de profil du client"
              />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setEditing(editing === "new" ? { ...editingItem!, rating: n } : { ...(editing as Testimonial), rating: n })} className="w-8 h-8">
                      <Icon icon="line-md:star-twotone" width={20} style={{ color: n <= editingItem.rating ? "#F59E0B" : "rgba(255,255,255,0.2)" }} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">Annuler</button>
          <button
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
            Sauvegarder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          <Icon icon="line-md:plus-circle-twotone" width={15} />
          Nouveau témoignage
        </button>
      </div>
      {items.length === 0 && (
        <div className="rounded-xl p-10 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p className="text-white/40 text-sm">Aucun témoignage</p>
        </div>
      )}
      {items.map((t) => (
        <div key={t.id} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "rgba(124,58,237,0.2)" }}>
            {t.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-white text-sm font-medium">{t.name}</p>
              <span className="text-white/30 text-xs">·</span>
              <p className="text-white/50 text-xs">{t.role}, {t.company}</p>
            </div>
            <p className="text-white/50 text-xs line-clamp-2">{t.text}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => toggleVisible(t.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/5" title={t.visible ? "Masquer" : "Afficher"}>
              <Icon icon={t.visible ? "line-md:eye-twotone" : "line-md:eye-off-twotone"} width={16} className={t.visible ? "text-white/50" : "text-white/20"} />
            </button>
            <button onClick={() => setEditing(t)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200">
              <Icon icon="line-md:pencil-twotone" width={16} />
            </button>
            <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200">
              <Icon icon="line-md:close-circle-twotone" width={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>("Hero & Bio")

  return (
    <div className="space-y-6 max-w-3xl">
      <Toaster position="top-right" />

      <div>
        <h1 className="font-heading font-bold text-2xl text-white mb-1">Contenu</h1>
        <p className="text-white/50 text-sm">Gérez le texte et les données de votre portfolio.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200", tab === t ? "text-white" : "text-white/50 hover:text-white/80")}
            style={tab === t ? { background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.3)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Hero & Bio" && <HeroTab />}
      {tab === "Stats" && <StatsTab />}
      {tab === "Témoignages" && <TestimonialsTab />}
    </div>
  )
}
