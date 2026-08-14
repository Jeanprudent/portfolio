"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { PROJECT_CATEGORIES } from "@/data/portfolio-data"
import type { Project } from "@/types/portfolio"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/gestion/ImageUpload"

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  description: "",
  image_url: "",
  project_url: "",
  github_url: "",
  tags: [],
  category: "web",
  featured: false,
  order_index: 0,
}

function Field({
  label, id, value, onChange, placeholder, textarea,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] resize-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      ) : (
        <input
          id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      )}
    </div>
  )
}

function ProjectForm({
  project, isNew, onSave, onCancel,
}: {
  project: Project | Omit<Project, "id">; isNew: boolean; onSave: (p: Project) => void; onCancel: () => void
}) {
  const [form, setForm] = useState<Project>({ id: "id" in project ? project.id : "", ...project })
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (key: keyof Project) => (v: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) { set("tags")([...form.tags, tag]); setTagInput("") }
  }
  const removeTag = (tag: string) => set("tags")(form.tags.filter((t) => t !== tag))

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) { toast.error("Titre et description requis"); return }
    setSaving(true)
    const payload = {
      title: form.title, description: form.description, image_url: form.image_url || null,
      project_url: form.project_url || null, github_url: form.github_url || null,
      tags: form.tags, category: form.category, featured: form.featured, order_index: form.order_index,
    }
    if (isNew) {
      const { data, error } = await supabase.from("projects").insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      onSave(data as Project)
    } else {
      const { error } = await supabase.from("projects").update(payload).eq("id", form.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      onSave(form)
    }
    setSaving(false)
    toast.success("Projet sauvegardé !")
  }

  return (
    <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">{isNew ? "Nouveau projet" : "Modifier le projet"}</h2>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <Icon icon="line-md:close" width={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Titre" id="p_title" value={form.title} onChange={set("title") as (v: string) => void} placeholder="Nom du projet" />
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Catégorie</label>
          <select
            value={form.category} onChange={(e) => set("category")(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {PROJECT_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Field label="Description" id="p_desc" value={form.description} onChange={set("description") as (v: string) => void} placeholder="Description du projet…" textarea />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="URL du projet" id="p_url" value={form.project_url || ""} onChange={set("project_url") as (v: string) => void} placeholder="https://..." />
        <Field label="GitHub" id="p_github" value={form.github_url || ""} onChange={set("github_url") as (v: string) => void} placeholder="https://github.com/..." />
      </div>

      <ImageUpload
        label="Image du projet"
        currentUrl={form.image_url || null}
        folder="projects"
        onUpload={(url) => set("image_url")(url)}
        hint="Glissez une image ou cliquez · JPG, PNG, WebP · 5 Mo max"
      />

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Tags</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(124,58,237,0.2)", color: "#A855F7" }}>
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors"><Icon icon="line-md:close" width={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag…"
            className="flex-1 h-9 px-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <button onClick={addTag} className="px-3 h-9 rounded-lg text-sm text-white/60 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Icon icon="line-md:plus" width={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Projet mis en avant</p>
          <p className="text-white/40 text-xs">Apparaît en premier dans la section projets</p>
        </div>
        <button
          onClick={() => set("featured")(!form.featured)}
          className={cn("relative w-11 h-6 rounded-full transition-colors duration-200", form.featured ? "bg-[#7C3AED]" : "bg-white/10")}
        >
          <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200", form.featured ? "left-5.5" : "left-0.5")} />
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">Annuler</button>
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | "new" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else setProjects((data as Project[]) ?? [])
        setLoading(false)
      })
  }, [])

  const handleSave = (p: Project) => {
    setProjects((prev) =>
      prev.find((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]
    )
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setConfirmDelete(null)
    toast.success("Projet supprimé")
  }

  const toggleFeatured = async (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return
    const { error } = await supabase.from("projects").update({ featured: !project.featured }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Projets</h1>
          <p className="text-white/50 text-sm">{projects.length} projet{projects.length > 1 ? "s" : ""} au total</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            <Icon icon="line-md:plus-circle-twotone" width={16} />
            Nouveau projet
          </button>
        )}
      </div>

      {editing && (
        <ProjectForm
          project={editing === "new" ? { ...EMPTY_PROJECT, order_index: projects.length } : editing}
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
          {!loading && projects.length === 0 && (
            <div className="rounded-xl p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <Icon icon="line-md:briefcase-twotone" width={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Aucun projet, ajoutez votre premier projet !</p>
            </div>
          )}
          {!loading && projects.map((project) => (
            <div
              key={project.id}
              className="flex items-start gap-4 p-4 rounded-xl group"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Icon icon="line-md:briefcase-twotone" width={24} className="text-[#7C3AED]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-white font-semibold text-sm">{project.title}</p>
                  {project.featured && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(245,158,11,0.15)", color: "#FCD34D" }}>★ Vedette</span>
                  )}
                  <span className="px-1.5 py-0.5 rounded text-xs text-white/40" style={{ background: "rgba(255,255,255,0.06)" }}>{project.category}</span>
                </div>
                <p className="text-white/50 text-xs line-clamp-1 mb-1.5">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(124,58,237,0.1)", color: "#A855F7" }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => toggleFeatured(project.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/5"
                  title={project.featured ? "Retirer de la vedette" : "Mettre en vedette"}
                >
                  <Icon icon="line-md:star-twotone" width={16} style={{ color: project.featured ? "#FCD34D" : "rgba(255,255,255,0.3)" }} />
                </button>
                <button onClick={() => setEditing(project)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200">
                  <Icon icon="line-md:pencil-twotone" width={16} />
                </button>
                {confirmDelete === project.id ? (
                  <>
                    <button onClick={() => handleDelete(project.id)} className="px-2 h-8 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">Confirmer</button>
                    <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                      <Icon icon="line-md:close" width={14} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(project.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200">
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
