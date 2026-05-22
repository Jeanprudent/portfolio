"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { BLOG_POSTS } from "@/data/blog-data"
import type { BlogPost } from "@/types/portfolio"
import { formatDate, slugify, cn } from "@/lib/utils"

const TOOLBAR_ACTIONS = [
  { label: "B", title: "Gras", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bold") },
  { label: "I", title: "Italique", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("italic") },
  { label: "H2", title: "Titre 2", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 2 }).run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("heading", { level: 2 }) },
  { label: "H3", title: "Titre 3", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 3 }).run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("heading", { level: 3 }) },
  { label: "≡", title: "Liste à puces", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bulletList") },
  { label: "1.", title: "Liste numérotée", command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleOrderedList().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("orderedList") },
]

function Editor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            title={action.title}
            onClick={() => action.command(editor)}
            className={cn(
              "min-w-[32px] h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all duration-150",
              action.active(editor)
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            )}
            style={action.active(editor) ? { background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" } : { background: "rgba(255,255,255,0.04)" }}
          >
            {action.label}
          </button>
        ))}
        <div className="w-px mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        <button
          type="button"
          title="Trait horizontal"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="min-w-[32px] h-8 px-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          ──
        </button>
      </div>

      {/* Editor area */}
      <div style={{ background: "rgba(255,255,255,0.03)" }}>
        <EditorContent
          editor={editor}
          className="prose-jp min-h-[240px] px-4 py-3 focus-within:outline-none text-white/80"
        />
      </div>
    </div>
  )
}

function PostForm({
  post,
  onSave,
  onCancel,
}: {
  post?: BlogPost
  onSave: (p: BlogPost) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<BlogPost>(
    post ?? {
      id: String(Date.now()),
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_url: "",
      tags: [],
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  )
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof BlogPost>(key: K) => (v: BlogPost[K]) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleTitleChange = (v: string) => {
    setForm((prev) => ({
      ...prev,
      title: v,
      slug: post ? prev.slug : slugify(v),
    }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      set("tags")([...form.tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => set("tags")(form.tags.filter((t) => t !== tag))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Le titre est requis"); return }
    if (!form.content || form.content === "<p></p>") { toast.error("Le contenu est requis"); return }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    onSave({ ...form, updated_at: new Date().toISOString() })
    toast.success(form.published ? "Article publié !" : "Brouillon sauvegardé !")
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
          <Icon icon="line-md:arrow-left" width={14} /> Retour à la liste
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { set("published")(false); handleSave() }}
            className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Brouillon
          </button>
          <button
            onClick={() => { set("published")(true); handleSave() }}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
            Publier
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Titre de l'article…"
          className="w-full px-0 py-2 text-2xl font-heading font-bold text-white placeholder:text-white/20 focus:outline-none bg-transparent border-b transition-colors duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        />
        <input
          type="text"
          value={form.slug}
          onChange={(e) => set("slug")(e.target.value)}
          placeholder="slug-de-l-article"
          className="mt-1.5 w-full px-0 py-1 text-xs font-mono text-white/30 placeholder:text-white/15 focus:outline-none bg-transparent"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Résumé</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt")(e.target.value)}
          placeholder="Courte description affichée dans la liste du blog…"
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] resize-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Content editor */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Contenu</label>
        <Editor content={form.content} onChange={set("content")} />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Tags</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: "rgba(124,58,237,0.2)", color: "#A855F7" }}
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                <Icon icon="line-md:close" width={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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

      {/* Cover */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Image de couverture (URL)</label>
        <input
          type="text"
          value={form.cover_url || ""}
          onChange={(e) => set("cover_url")(e.target.value)}
          placeholder="https://... ou Cloudinary URL"
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>
    </div>
  )
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS)
  const [editing, setEditing] = useState<BlogPost | "new" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleSave = (p: BlogPost) => {
    setPosts((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.map((x) => (x.id === p.id ? p : x))
        : [p, ...prev]
    )
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setConfirmDelete(null)
    toast.success("Article supprimé")
  }

  const togglePublish = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)))
  }

  if (editing) {
    return (
      <div className="max-w-3xl">
        <Toaster position="top-right" />
        <PostForm
          post={editing === "new" ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Blog</h1>
          <p className="text-white/50 text-sm">
            {posts.filter((p) => p.published).length} publié{posts.filter((p) => p.published).length > 1 ? "s" : ""},&nbsp;
            {posts.filter((p) => !p.published).length} brouillon{posts.filter((p) => !p.published).length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          <Icon icon="line-md:plus-circle-twotone" width={16} />
          Nouvel article
        </button>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <div
            className="rounded-xl p-12 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <Icon icon="line-md:pencil-alt-twotone" width={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Aucun article — commencez à écrire !</p>
          </div>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-4 p-4 rounded-xl group"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <Icon icon="line-md:pencil-alt-twotone" width={20} className="text-[#7C3AED]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm truncate">{post.title}</p>
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-medium shrink-0"
                  style={post.published
                    ? { background: "rgba(34,197,94,0.15)", color: "#4ADE80" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {post.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <p className="text-white/40 text-xs mb-1.5 line-clamp-1">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <time>{formatDate(post.created_at)}</time>
                {post.tags.length > 0 && (
                  <span>{post.tags.slice(0, 2).join(", ")}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => togglePublish(post.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/5"
                title={post.published ? "Dépublier" : "Publier"}
              >
                <Icon icon={post.published ? "line-md:eye-off-twotone" : "line-md:eye-twotone"} width={16} className={post.published ? "text-green-400" : "text-white/30"} />
              </button>
              <button
                onClick={() => setEditing(post)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                <Icon icon="line-md:pencil-twotone" width={16} />
              </button>
              {confirmDelete === post.id ? (
                <>
                  <button onClick={() => handleDelete(post.id)} className="px-2 h-8 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    Supprimer
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                    <Icon icon="line-md:close" width={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDelete(post.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <Icon icon="line-md:close-circle-twotone" width={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
