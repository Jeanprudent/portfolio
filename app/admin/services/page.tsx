"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { PROJECT_CATEGORIES } from "@/data/portfolio-data"
import type { Service } from "@/types/portfolio"
import { cn } from "@/lib/utils"

export { PROJECT_CATEGORIES }

const ICON_OPTIONS = [
  "line-md:laptop-twotone",
  "line-md:search-twotone",
  "line-md:cog-loop",
  "line-md:lightning-twotone-loop",
  "line-md:star-twotone",
  "line-md:briefcase-twotone",
  "line-md:pencil-alt-twotone",
  "line-md:phone-twotone",
  "line-md:document-list-twotone",
  "line-md:grid-3-twotone",
]

function ServiceForm({
  service,
  isNew,
  onSave,
  onCancel,
}: {
  service: Service | Omit<Service, "id">
  isNew: boolean
  onSave: (s: Service) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Service>({
    id: "id" in service ? service.id : "",
    ...service,
  })
  const [saving, setSaving] = useState(false)

  const set = (key: keyof Service) => (v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Titre et description requis")
      return
    }
    setSaving(true)
    const payload = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      order_index: form.order_index,
      visible: form.visible,
    }
    if (isNew) {
      const { data, error } = await supabase
        .from("services")
        .insert(payload)
        .select()
        .single()
      if (error) { toast.error(error.message); setSaving(false); return }
      onSave(data as Service)
    } else {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", form.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      onSave(form)
    }
    setSaving(false)
    toast.success("Service sauvegardé !")
  }

  return (
    <div
      className="rounded-xl p-6 space-y-5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">
          {isNew ? "Nouveau service" : "Modifier le service"}
        </h2>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <Icon icon="line-md:close" width={18} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Titre</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title")(e.target.value)}
          placeholder="Nom du service"
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder="Description du service…"
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] resize-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-2">Icône</label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map((ico) => (
            <button
              key={ico}
              onClick={() => set("icon")(ico)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                form.icon === ico ? "text-white scale-110" : "text-white/40 hover:text-white/70"
              )}
              style={
                form.icon === ico
                  ? { background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
              }
              title={ico}
            >
              <Icon icon={ico} width={20} />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={form.icon}
          onChange={(e) => set("icon")(e.target.value)}
          placeholder="Ou saisissez un identifiant Iconify…"
          className="mt-2 w-full h-9 px-3 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | "new" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else setServices((data as Service[]) ?? [])
        setLoading(false)
      })
  }, [])

  const handleSave = (s: Service) => {
    setServices((prev) =>
      prev.find((x) => x.id === s.id)
        ? prev.map((x) => (x.id === s.id ? s : x))
        : [...prev, { ...s, order_index: prev.length }]
    )
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setServices((prev) => prev.filter((s) => s.id !== id))
    setConfirmDelete(null)
    toast.success("Service supprimé")
  }

  const toggleVisible = async (id: string) => {
    const svc = services.find((s) => s.id === id)
    if (!svc) return
    const { error } = await supabase.from("services").update({ visible: !svc.visible }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)))
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const next = [...services]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    const updated = next.map((s, i) => ({ ...s, order_index: i }))
    await Promise.all([
      supabase.from("services").update({ order_index: updated[index - 1].order_index }).eq("id", updated[index - 1].id),
      supabase.from("services").update({ order_index: updated[index].order_index }).eq("id", updated[index].id),
    ])
    setServices(updated)
  }

  const moveDown = async (index: number) => {
    if (index === services.length - 1) return
    const next = [...services]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    const updated = next.map((s, i) => ({ ...s, order_index: i }))
    await Promise.all([
      supabase.from("services").update({ order_index: updated[index].order_index }).eq("id", updated[index].id),
      supabase.from("services").update({ order_index: updated[index + 1].order_index }).eq("id", updated[index + 1].id),
    ])
    setServices(updated)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Services</h1>
          <p className="text-white/50 text-sm">{services.length} service{services.length > 1 ? "s" : ""} — utilisez les flèches pour réorganiser</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            <Icon icon="line-md:plus-circle-twotone" width={16} />
            Nouveau service
          </button>
        )}
      </div>

      {editing && (
        <ServiceForm
          service={
            editing === "new"
              ? { title: "", description: "", icon: "line-md:star-twotone", order_index: services.length, visible: true }
              : editing
          }
          isNew={editing === "new"}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {!editing && (
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" />
            </div>
          )}
          {!loading && services.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl transition-opacity duration-200",
                !service.visible && "opacity-50"
              )}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex flex-col gap-0.5 shrink-0 pt-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="w-6 h-5 flex items-center justify-center text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
                >
                  <Icon icon="line-md:chevron-up" width={12} />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === services.length - 1}
                  className="w-6 h-5 flex items-center justify-center text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
                >
                  <Icon icon="line-md:chevron-down" width={12} />
                </button>
              </div>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <Icon icon={service.icon} width={22} className="text-[#A855F7]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-0.5">{service.title}</p>
                <p className="text-white/50 text-xs line-clamp-2">{service.description}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisible(service.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/5"
                  title={service.visible ? "Masquer" : "Afficher"}
                >
                  <Icon icon={service.visible ? "line-md:eye-twotone" : "line-md:eye-off-twotone"} width={16} className={service.visible ? "text-white/50" : "text-white/20"} />
                </button>
                <button
                  onClick={() => setEditing(service)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200"
                >
                  <Icon icon="line-md:pencil-twotone" width={16} />
                </button>
                {confirmDelete === service.id ? (
                  <>
                    <button onClick={() => handleDelete(service.id)} className="px-2 h-8 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                      Confirmer
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                      <Icon icon="line-md:close" width={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(service.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <Icon icon="line-md:close-circle-twotone" width={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
