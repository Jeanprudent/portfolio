"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { EXPERTISES } from "@/data/local-seo"
import { cn } from "@/lib/utils"

type VilleRow = {
  id: string
  slug: string
  nom: string
  prep: string
  region: string
  pays: string
  intro: string
  secteurs: string[]
  active: boolean
  order_index: number
}

const EMPTY: Omit<VilleRow, "id"> = {
  slug: "",
  nom: "",
  prep: "à",
  region: "",
  pays: "Bénin",
  intro: "",
  secteurs: [],
  active: false,
  order_index: 0,
}

const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function Field({
  label, id, value, onChange, placeholder, textarea, rows = 3,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean; rows?: number
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(255,122,26,0.5)] resize-none" style={inputStyle} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(255,122,26,0.5)]" style={inputStyle} />
      )}
    </div>
  )
}

function VilleForm({ ville, isNew, onSave, onCancel }: {
  ville: VilleRow | Omit<VilleRow, "id">; isNew: boolean; onSave: (v: VilleRow) => void; onCancel: () => void
}) {
  const [form, setForm] = useState<VilleRow>({ id: "id" in ville ? ville.id : "", ...ville })
  const [secteurInput, setSecteurInput] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (key: keyof VilleRow) => (v: string | boolean | string[] | number) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const addSecteur = () => {
    const s = secteurInput.trim()
    if (s && !form.secteurs.includes(s)) { set("secteurs")([...form.secteurs, s]); setSecteurInput("") }
  }
  const removeSecteur = (s: string) => set("secteurs")(form.secteurs.filter((x) => x !== s))

  const messageErreur = (error: { code?: string; message: string }) =>
    error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204"
      ? "Table manquante : exécutez supabase/migrations/009_local_villes.sql dans le SQL Editor Supabase."
      : error.message

  const handleSave = async () => {
    const slug = (form.slug || slugify(form.nom)).trim()
    if (!form.nom.trim() || !slug) { toast.error("Nom (et slug) requis"); return }
    if (form.active && (!form.intro.trim() || form.secteurs.length === 0)) {
      toast.error("Pour activer une ville, renseignez l'intro et au moins un secteur."); return
    }
    setSaving(true)
    const payload = {
      slug, nom: form.nom.trim(), prep: form.prep.trim() || "à",
      region: form.region.trim() || null, pays: form.pays.trim() || "Bénin",
      intro: form.intro.trim(), secteurs: form.secteurs,
      active: form.active, order_index: form.order_index,
    }
    if (isNew) {
      // local_villes n'est pas (encore) dans les types générés : cast du payload.
      const { data, error } = await supabase.from("local_villes").insert(payload as never).select().single()
      if (error) { toast.error(messageErreur(error)); setSaving(false); return }
      onSave(data as VilleRow)
    } else {
      const { error } = await supabase.from("local_villes").update(payload as never).eq("id", form.id)
      if (error) { toast.error(messageErreur(error)); setSaving(false); return }
      onSave({ ...form, slug })
    }
    setSaving(false)
    toast.success("Ville sauvegardée !")
  }

  return (
    <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">{isNew ? "Nouvelle ville" : "Modifier la ville"}</h2>
        <button onClick={onCancel} className="text-white/40 hover:text-white"><Icon icon="line-md:close" width={18} /></button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom" id="v_nom" value={form.nom} onChange={(v) => { set("nom")(v); if (isNew && !form.slug) set("slug")(slugify(v)) }} placeholder="Cotonou" />
        <Field label="Slug (URL)" id="v_slug" value={form.slug} onChange={(v) => set("slug")(slugify(v))} placeholder="cotonou" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Préposition" id="v_prep" value={form.prep} onChange={set("prep") as (v: string) => void} placeholder="à" />
        <Field label="Région" id="v_region" value={form.region} onChange={set("region") as (v: string) => void} placeholder="Littoral" />
        <Field label="Pays" id="v_pays" value={form.pays} onChange={set("pays") as (v: string) => void} placeholder="Bénin" />
      </div>

      <p className="text-xs text-white/35 -mb-2">
        Aperçu des URLs : {EXPERTISES.map((e) => `/${e.slug}-${form.slug || "ville"}`).join("  ·  ")}
      </p>

      <Field label="Introduction locale (contexte réel de la ville)" id="v_intro" value={form.intro} onChange={set("intro") as (v: string) => void} placeholder="Décrivez le tissu économique local, les quartiers, les types d'entreprises…" textarea rows={5} />

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Secteurs / quartiers desservis</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.secteurs.map((s) => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(255,122,26,0.2)", color: "#ff7a1a" }}>
              {s}
              <button onClick={() => removeSecteur(s)} className="hover:text-white"><Icon icon="line-md:close" width={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={secteurInput} onChange={(e) => setSecteurInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSecteur())}
            placeholder="Ajouter un secteur…"
            className="flex-1 h-9 px-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none" style={inputStyle} />
          <button onClick={addSecteur} className="px-3 h-9 rounded-lg text-sm text-white/60 hover:text-white" style={inputStyle}><Icon icon="line-md:plus" width={14} /></button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Ville active</p>
          <p className="text-white/40 text-xs">Publie les pages de la ville (intro + secteurs requis)</p>
        </div>
        <button onClick={() => set("active")(!form.active)} className={cn("relative w-11 h-6 rounded-full transition-colors", form.active ? "bg-[#ff7a1a]" : "bg-white/10")}>
          <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", form.active ? "left-5.5" : "left-0.5")} />
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5">Annuler</button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: "#ff7a1a" }}>
          {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

export default function AdminZonesPage() {
  const [villes, setVilles] = useState<VilleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<VilleRow | "new" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    supabase.from("local_villes").select("*").order("order_index").then(({ data, error }) => {
      if (error) {
        if (error.code === "42P01" || error.code === "PGRST205") setMissing(true)
        else toast.error(error.message)
      } else {
        setVilles((data as VilleRow[]) ?? [])
      }
      setLoading(false)
    })
  }, [])

  const handleSave = (v: VilleRow) => {
    setVilles((prev) => prev.find((x) => x.id === v.id) ? prev.map((x) => (x.id === v.id ? v : x)) : [...prev, v])
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("local_villes").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setVilles((prev) => prev.filter((v) => v.id !== id))
    setConfirmDelete(null)
    toast.success("Ville supprimée")
  }

  const toggleActive = async (id: string) => {
    const v = villes.find((x) => x.id === id)
    if (!v) return
    if (!v.active && (!v.intro?.trim() || (v.secteurs ?? []).length === 0)) {
      toast.error("Renseignez l'intro et un secteur avant d'activer (via Modifier)."); return
    }
    const { error } = await supabase.from("local_villes").update({ active: !v.active } as never).eq("id", id)
    if (error) { toast.error(error.message); return }
    setVilles((prev) => prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Zones (villes SEO)</h1>
          <p className="text-white/50 text-sm">
            {villes.length} ville{villes.length > 1 ? "s" : ""} · chaque ville active ouvre {EXPERTISES.length} pages
          </p>
        </div>
        {!editing && !missing && (
          <button onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 hover:scale-[1.03] transition-transform" style={{ background: "#ff7a1a" }}>
            <Icon icon="line-md:plus-circle-twotone" width={16} />
            Nouvelle ville
          </button>
        )}
      </div>

      {missing && (
        <div className="rounded-xl p-6" style={{ background: "rgba(255,122,26,0.08)", border: "1px solid rgba(255,122,26,0.25)" }}>
          <p className="text-white font-medium mb-1">Table absente</p>
          <p className="text-white/60 text-sm">
            Exécutez <code className="text-[#ff7a1a]">supabase/migrations/009_local_villes.sql</code> dans le
            SQL Editor Supabase, puis rechargez cette page. En attendant, le site utilise le repli
            <code className="text-white/70"> data/local-seo.ts</code>.
          </p>
        </div>
      )}

      {editing && (
        <VilleForm
          ville={editing === "new" ? { ...EMPTY, order_index: villes.length } : editing}
          isNew={editing === "new"}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {!editing && !missing && (
        <div className="space-y-3">
          {loading && <div className="flex items-center justify-center py-12"><Icon icon="line-md:loading-loop" width={28} className="text-[#ff7a1a]" /></div>}
          {!loading && villes.length === 0 && (
            <div className="rounded-xl p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <Icon icon="line-md:map-marker-twotone" width={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Aucune ville, ajoutez votre première ville !</p>
            </div>
          )}
          {!loading && villes.map((v) => (
            <div key={v.id} className="flex flex-wrap items-start gap-3 sm:gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,122,26,0.1)", border: "1px solid rgba(255,122,26,0.2)" }}>
                <Icon icon="line-md:map-marker-twotone" width={24} className="text-[#ff7a1a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-white font-semibold text-sm">{v.nom}</p>
                  <span className={cn("px-1.5 py-0.5 rounded text-xs font-medium", v.active ? "text-emerald-300" : "text-white/40")}
                    style={{ background: v.active ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)" }}>
                    {v.active ? "Active" : "Inactive"}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs text-white/40" style={{ background: "rgba(255,255,255,0.06)" }}>{v.slug}</span>
                </div>
                <p className="text-white/50 text-xs line-clamp-1 mb-1">{v.region ? `${v.region}, ` : ""}{v.pays} · {(v.secteurs ?? []).length} secteur(s)</p>
                <p className="text-white/35 text-xs line-clamp-1">{v.intro || "Intro non renseignée"}</p>
              </div>
              <div className="flex w-full shrink-0 items-center justify-end gap-1 border-t border-white/[0.07] pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
                <button onClick={() => toggleActive(v.id)} title={v.active ? "Désactiver" : "Activer"}
                  className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center hover:bg-white/5">
                  <Icon icon={v.active ? "line-md:confirm-circle" : "line-md:watch-off"} width={16} style={{ color: v.active ? "#34d399" : "rgba(255,255,255,0.3)" }} />
                </button>
                <button onClick={() => setEditing(v)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5">
                  <Icon icon="line-md:pencil-twotone" width={16} />
                </button>
                {confirmDelete === v.id ? (
                  <>
                    <button onClick={() => handleDelete(v.id)} className="h-9 px-2.5 max-sm:bg-white/[0.06] sm:h-8 sm:px-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10">Confirmer</button>
                    <button onClick={() => setConfirmDelete(null)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5"><Icon icon="line-md:close" width={14} /></button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(v.id)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10"><Icon icon="line-md:close-circle-twotone" width={16} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
