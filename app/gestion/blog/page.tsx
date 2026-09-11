"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { ImageUpload } from "@/components/gestion/ImageUpload"
import type { BlogPost } from "@/types/portfolio"
import { formatDate, slugify, cn, datePublication } from "@/lib/utils"

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
    <div className="rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* top-14 : hauteur de la barre superieure du back-office, elle-meme
          collante. A 0 la barre d'edition passerait dessous. Fond opaque,
          sinon le texte defilant se lirait au travers. */}
      <div
        className="sticky top-14 z-20 flex flex-wrap gap-1 rounded-t-xl p-2"
        style={{
          background: "rgba(20,17,31,0.97)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.title} type="button" title={action.title} onClick={() => action.command(editor)}
            className={cn("min-w-[32px] h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all duration-150", action.active(editor) ? "text-white" : "text-white/40 hover:text-white/70")}
            style={action.active(editor) ? { background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" } : { background: "rgba(255,255,255,0.04)" }}
          >
            {action.label}
          </button>
        ))}
        <div className="w-px mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        <button type="button" title="Trait horizontal" onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="min-w-[32px] h-8 px-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          ──
        </button>
      </div>
      <div className="rounded-b-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        <EditorContent editor={editor} className="prose-jp prose-admin min-h-[240px] px-4 py-3 focus-within:outline-none" />
      </div>
    </div>
  )
}

function PostForm({
  post, isNew, onSave, onCancel,
}: {
  post?: BlogPost; isNew: boolean; onSave: (p: BlogPost) => void; onCancel: () => void
}) {
  const [form, setForm] = useState<BlogPost>(
    post ?? { id: "", title: "", slug: "", excerpt: "", content: "", cover_url: "", tags: [], published: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  )
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)

  /**
   * Une couverture peut aussi etre une URL collee a la main. Rien ne
   * garantissait qu'elle pointe vers une image : une adresse de page
   * (Pinterest, Google Images, un article) s'enregistrait sans broncher et
   * l'article s'affichait ensuite sans illustration, sans le moindre signe.
   *
   * Le navigateur est le seul juge fiable ici : si <img> ne sait pas
   * l'afficher, la couverture ne s'affichera pas non plus sur le site.
   */
  const [etatCouverture, setEtatCouverture] = useState<"vide" | "verification" | "ok" | "invalide">("vide")

  useEffect(() => {
    const url = (form.cover_url || "").trim()
    if (!url) {
      // Pas de setState synchrone dans le corps de l'effet : le timer ci-dessous
      // porte aussi la remise a zero.
      const vide = setTimeout(() => setEtatCouverture("vide"), 0)
      return () => clearTimeout(vide)
    }

    let annule = false
    const timer = setTimeout(() => {
      setEtatCouverture("verification")
      const test = new window.Image()
      test.onload = () => { if (!annule) setEtatCouverture("ok") }
      test.onerror = () => { if (!annule) setEtatCouverture("invalide") }
      test.src = url
    }, 500)

    return () => {
      annule = true
      clearTimeout(timer)
    }
  }, [form.cover_url])

  const set = <K extends keyof BlogPost>(key: K) => (v: BlogPost[K]) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleTitleChange = (v: string) => {
    setForm((prev) => ({ ...prev, title: v, slug: isNew ? slugify(v) : prev.slug }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) { set("tags")([...form.tags, tag]); setTagInput("") }
  }
  const removeTag = (tag: string) => set("tags")(form.tags.filter((t) => t !== tag))

  /**
   * PostgREST renvoie 42703 / PGRST204 quand published_at manque, c'est-a-dire
   * tant que la migration 008 n'a pas ete jouee. Le message brut ne dit pas
   * quoi faire, celui-ci si.
   */
  const messageErreur = (error: { code?: string; message: string }) =>
    error.code === "42703" || error.code === "PGRST204"
      ? "Colonne manquante : executez supabase/migrations/008_blog_published_at.sql dans le SQL Editor Supabase."
      : error.message

  const save = async (published: boolean) => {
    if (!form.title.trim()) { toast.error("Le titre est requis"); return }
    if (!form.content || form.content === "<p></p>") { toast.error("Le contenu est requis"); return }
    setSaving(true)
    const payload = {
      title: form.title, slug: form.slug || slugify(form.title), content: form.content,
      excerpt: form.excerpt, cover_url: form.cover_url || null, tags: form.tags, published,
      // Horodatee au premier passage en ligne seulement : depublier puis
      // republier ne doit pas reecrire l'histoire de l'article.
      ...(published && !form.published_at ? { published_at: new Date().toISOString() } : {}),
    }
    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select().single()
      if (error) { toast.error(messageErreur(error)); setSaving(false); return }
      onSave(data as BlogPost)
    } else {
      const { data, error } = await supabase.from("blog_posts").update(payload).eq("id", form.id).select().single()
      if (error) { toast.error(messageErreur(error)); setSaving(false); return }
      onSave(data as BlogPost)
    }
    setSaving(false)
    toast.success(published ? "Article publié !" : "Brouillon sauvegardé !")
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
          <Icon icon="line-md:arrow-left" width={14} /> Retour à la liste
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => save(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all duration-200" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Brouillon
          </button>
          <button
            onClick={() => save(true)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            {saving ? <Icon icon="line-md:loading-loop" width={16} /> : <Icon icon="line-md:confirm-circle-twotone" width={16} />}
            Publier
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <ImageUpload
          label="Image de couverture"
          currentUrl={form.cover_url || null}
          folder="blog"
          onUpload={(url) => set("cover_url")(url)}
          hint="Glissez une image ou cliquez - convertie en WebP et compressee automatiquement"
        />

        <div>
          <label htmlFor="cover_url" className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">
            ou coller l&apos;adresse d&apos;une image
          </label>
          <input
            id="cover_url"
            type="text"
            value={form.cover_url || ""}
            onChange={(e) => set("cover_url")(e.target.value)}
            placeholder="https://exemple.com/photo.jpg"
            className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />

          {etatCouverture === "verification" && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-white/40">
              <Icon icon="line-md:loading-loop" width={12} />
              Verification de l&apos;adresse...
            </p>
          )}
          {etatCouverture === "ok" && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400">
              <Icon icon="line-md:confirm-circle" width={12} />
              Image valide, elle s&apos;affichera sur l&apos;article.
            </p>
          )}
          {etatCouverture === "invalide" && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-300">
              <Icon icon="line-md:alert-twotone" width={13} className="mt-0.5 shrink-0" />
              <span>
                Cette adresse ne renvoie pas une image : l&apos;article s&apos;affichera sans
                couverture. Un lien de page (Pinterest, Google Images, un article) ne
                fonctionne pas - il faut l&apos;adresse du fichier lui-meme, qui finit par
                .jpg, .png ou .webp. Le plus sur reste de televerser l&apos;image ci-dessus.
              </span>
            </p>
          )}
        </div>
      </div>
      <div>
        <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Titre de l'article…"
          className="w-full px-0 py-2 text-2xl font-heading font-bold text-white placeholder:text-white/20 focus:outline-none bg-transparent border-b transition-colors duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <input type="text" value={form.slug} onChange={(e) => set("slug")(e.target.value)} placeholder="slug-de-l-article"
          className="mt-1.5 w-full px-0 py-1 text-xs font-mono text-white/30 placeholder:text-white/15 focus:outline-none bg-transparent" />
      </div>

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
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Ajouter un tag…"
            className="flex-1 h-9 px-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <button onClick={addTag} className="px-3 h-9 rounded-lg text-sm text-white/60 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Icon icon="line-md:plus" width={14} />
          </button>
        </div>
      </div>


      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Résumé</label>
        <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt")(e.target.value)} placeholder="Courte description affichée dans la liste du blog…"
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] resize-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">Contenu</label>
        <Editor content={form.content} onChange={set("content")} />
      </div>

    </div>
  )
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | "new" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else setPosts((data as BlogPost[]) ?? [])
        setLoading(false)
      })
  }, [])

  const handleSave = (p: BlogPost) => {
    setPosts((prev) =>
      prev.find((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]
    )
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setConfirmDelete(null)
    toast.success("Article supprimé")
  }

  const togglePublish = async (id: string) => {
    const post = posts.find((p) => p.id === id)
    if (!post) return
    const publie = !post.published
    const horodatage = publie && !post.published_at ? new Date().toISOString() : post.published_at

    const { error } = await supabase
      .from("blog_posts")
      .update({ published: publie, published_at: horodatage })
      .eq("id", id)
    if (error) { toast.error(error.message); return }
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: publie, published_at: horodatage } : p))
    )
  }

  if (editing) {
    return (
      <div className="max-w-3xl">
        <Toaster position="top-right" />
        <PostForm
          post={editing === "new" ? undefined : editing}
          isNew={editing === "new"}
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Icon icon="line-md:loading-loop" width={28} className="text-[#A855F7]" />
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <Icon icon="line-md:pencil-alt-twotone" width={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Aucun article — commencez à écrire !</p>
          </div>
        )}
        {!loading && posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-start gap-3 sm:gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Icon icon="line-md:pencil-alt-twotone" width={20} className="text-[#7C3AED]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-0.5">
                <p className="min-w-0 flex-1 sm:flex-initial text-white font-semibold text-sm line-clamp-2 sm:truncate">{post.title}</p>
                <span className="px-1.5 py-0.5 rounded text-xs font-medium shrink-0"
                  style={post.published ? { background: "rgba(34,197,94,0.15)", color: "#4ADE80" } : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
                  {post.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <p className="text-white/40 text-xs mb-1.5 line-clamp-2 sm:line-clamp-1">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <time>{formatDate(datePublication(post))}</time>
                {post.tags.length > 0 && <span>{post.tags.slice(0, 2).join(", ")}</span>}
              </div>
            </div>

            <div className="flex w-full shrink-0 items-center justify-end gap-1 border-t border-white/[0.07] pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
              <button onClick={() => togglePublish(post.id)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/5" title={post.published ? "Dépublier" : "Publier"}>
                <Icon icon={post.published ? "line-md:watch-off" : "line-md:watch"} width={16} className={post.published ? "text-green-400" : "text-white/30"} />
              </button>
              <button onClick={() => setEditing(post)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200">
                <Icon icon="line-md:pencil-twotone" width={16} />
              </button>
              {confirmDelete === post.id ? (
                <>
                  <button onClick={() => handleDelete(post.id)} className="h-9 px-2.5 max-sm:bg-white/[0.06] sm:h-8 sm:px-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">Supprimer</button>
                  <button onClick={() => setConfirmDelete(null)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                    <Icon icon="line-md:close" width={14} />
                  </button>
                </>
              ) : (
                <button onClick={() => setConfirmDelete(post.id)} className="h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200">
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
