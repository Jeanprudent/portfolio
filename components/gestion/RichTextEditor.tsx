"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { cn } from "@/lib/utils"

/**
 * Éditeur de texte riche du back-office.
 *
 * Extrait de app/gestion/blog/page.tsx, où il était défini localement et
 * donc inutilisable ailleurs. Les fiches services en ont besoin pour la
 * définition et la prose libre.
 *
 * Le HTML produit est assaini à l'affichage par lib/sanitize.ts, jamais
 * injecté brut.
 */

// useEditor renvoie null au premier rendu : le type doit le refléter,
// sinon les callbacks de la barre d'outils ne compilent pas.
type Editeur = ReturnType<typeof useEditor> | null

const ACTIONS = [
  { label: "B", title: "Gras", cmd: (e: Editeur) => e?.chain().focus().toggleBold().run(), on: (e: Editeur) => !!e?.isActive("bold") },
  { label: "I", title: "Italique", cmd: (e: Editeur) => e?.chain().focus().toggleItalic().run(), on: (e: Editeur) => !!e?.isActive("italic") },
  { label: "H2", title: "Titre 2", cmd: (e: Editeur) => e?.chain().focus().toggleHeading({ level: 2 }).run(), on: (e: Editeur) => !!e?.isActive("heading", { level: 2 }) },
  { label: "H3", title: "Titre 3", cmd: (e: Editeur) => e?.chain().focus().toggleHeading({ level: 3 }).run(), on: (e: Editeur) => !!e?.isActive("heading", { level: 3 }) },
  { label: "≡", title: "Liste à puces", cmd: (e: Editeur) => e?.chain().focus().toggleBulletList().run(), on: (e: Editeur) => !!e?.isActive("bulletList") },
  { label: "1.", title: "Liste numérotée", cmd: (e: Editeur) => e?.chain().focus().toggleOrderedList().run(), on: (e: Editeur) => !!e?.isActive("orderedList") },
]

export function RichTextEditor({
  content,
  onChange,
  minHeight = 240,
}: {
  content: string
  onChange: (html: string) => void
  minHeight?: number
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content,
    // Sans ceci, Next signale une différence d'hydratation : TipTap rend le
    // même contenu différemment côté serveur et côté client.
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div
        className="flex flex-wrap gap-1 p-2"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {ACTIONS.map((a) => (
          <button
            key={a.title}
            type="button"
            title={a.title}
            onClick={() => a.cmd(editor)}
            className={cn(
              "min-w-[32px] h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all duration-150",
              a.on(editor) ? "text-white" : "text-white/40 hover:text-white/70"
            )}
            style={
              a.on(editor)
                ? {
                    background: "rgba(255, 122, 26,0.3)",
                    border: "1px solid rgba(255, 122, 26,0.4)",
                  }
                : { background: "rgba(255,255,255,0.04)" }
            }
          >
            {a.label}
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

      <div style={{ background: "rgba(255,255,255,0.03)" }}>
        <EditorContent
          editor={editor}
          className="prose-jp prose-admin px-4 py-3 focus-within:outline-none"
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
