"use client"

import { useState, useRef, useCallback } from "react"
import { Icon } from "@iconify/react"
import { supabase } from "@/lib/supabase"

interface ImageUploadProps {
  currentUrl?: string | null
  bucket?: string
  folder?: string
  onUpload: (url: string) => void
  label?: string
  hint?: string
  aspectRatio?: "wide" | "square"
}

export function ImageUpload({
  currentUrl,
  bucket = "portfolio-images",
  folder = "uploads",
  onUpload,
  label,
  hint,
  aspectRatio = "wide",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Fichier invalide — sélectionnez une image")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image trop lourde — 5 Mo maximum")
        return
      }
      setError(null)

      // Prévisualisation immédiate
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      // Upload Supabase Storage
      setUploading(true)
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onUpload(data.publicUrl)
      setUploading(false)
    },
    [bucket, folder, onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const imgHeight = aspectRatio === "square" ? "h-40 w-40 rounded-full" : "h-44 w-full rounded-xl"

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">
          {label}
        </label>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative overflow-hidden cursor-pointer transition-all duration-200 group ${
          aspectRatio === "square" ? "w-40 h-40 rounded-full mx-auto" : "rounded-xl"
        }`}
        style={{
          border: "2px dashed rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.03)",
          minHeight: aspectRatio === "square" ? undefined : "160px",
        }}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Aperçu"
              className={`object-cover ${imgHeight} transition-transform duration-300 group-hover:scale-105`}
              style={aspectRatio === "square" ? { width: "100%", height: "100%" } : undefined}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center gap-1.5 text-white">
                <Icon icon="line-md:upload-loop" width={22} />
                <span className="text-xs font-semibold">Changer</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-44 gap-3 px-4 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <Icon icon="line-md:image-twotone" width={24} className="text-[#A855F7]" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Glisser-déposer</p>
              <p className="text-white/30 text-xs mt-0.5">ou cliquer pour parcourir</p>
            </div>
            <p className="text-white/20 text-xs">JPG, PNG, WebP · 5 Mo max</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center gap-2 text-white">
              <Icon icon="line-md:loading-loop" width={28} />
              <span className="text-xs font-semibold">Upload en cours…</span>
            </div>
          </div>
        )}
      </div>

      {/* Supprimer l'image */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPreview(null)
            onUpload("")
          }}
          className="mt-2 flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors mx-auto"
        >
          <Icon icon="line-md:close-circle" width={12} />
          Supprimer l&apos;image
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <Icon icon="line-md:alert-circle" width={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-white/30">{hint}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
