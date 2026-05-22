"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"

const DEFAULT_PROFILE = {
  first_name: "Jean Prudent",
  last_name: "IDOHOU",
  email: "jeanprudent03@gmail.com",
  whatsapp: "+2290192175002",
  location: "Cotonou, Bénin",
  bio: "Développeur web et designer basé à Cotonou. Je crée des sites web modernes, performants et optimisés pour aider les entrepreneurs et PME à développer leur présence en ligne.",
  avatar_url: "",
  github: "https://github.com/Jeanprudent",
  linkedin: "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287",
  facebook: "https://www.facebook.com/jean.prudent.2025",
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
  hint,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200 resize-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      )}
      {hint && <p className="mt-1 text-xs text-white/30">{hint}</p>}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6 space-y-5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon icon={icon} width={18} className="text-[#A855F7]" />
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof DEFAULT_PROFILE) => (v: string) =>
    setProfile((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast.success("Paramètres sauvegardés !")
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Paramètres</h1>
          <p className="text-white/50 text-sm">
            Gérez votre profil, vos coordonnées et vos liens sociaux.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 disabled:opacity-60 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? (
            <Icon icon="line-md:loading-loop" width={16} />
          ) : (
            <Icon icon="line-md:confirm-circle-twotone" width={16} />
          )}
          Sauvegarder
        </button>
      </div>

      {/* Profile */}
      <Section title="Profil" icon="line-md:person-twotone">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Icon icon="line-md:person-twotone" width={28} className="text-[#A855F7]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Field
              label="URL Avatar / Photo"
              id="avatar_url"
              value={profile.avatar_url}
              onChange={set("avatar_url")}
              placeholder="https://... ou chemin Cloudinary"
              hint="Uploadez via Cloudinary et collez l'URL ici"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" id="first_name" value={profile.first_name} onChange={set("first_name")} placeholder="Jean Prudent" />
          <Field label="Nom" id="last_name" value={profile.last_name} onChange={set("last_name")} placeholder="IDOHOU" />
        </div>
        <Field
          label="Bio"
          id="bio"
          value={profile.bio}
          onChange={set("bio")}
          placeholder="Votre présentation courte…"
          textarea
        />
      </Section>

      {/* Contact */}
      <Section title="Coordonnées" icon="line-md:phone-twotone">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email professionnel" id="email" type="email" value={profile.email} onChange={set("email")} placeholder="vous@exemple.com" />
          <Field label="WhatsApp" id="whatsapp" value={profile.whatsapp} onChange={set("whatsapp")} placeholder="+229..." />
        </div>
        <Field label="Localisation" id="location" value={profile.location} onChange={set("location")} placeholder="Ville, Pays" />
      </Section>

      {/* Social links */}
      <Section title="Liens sociaux" icon="line-md:link">
        <Field
          label="GitHub"
          id="github"
          value={profile.github}
          onChange={set("github")}
          placeholder="https://github.com/votre-profil"
        />
        <Field
          label="LinkedIn"
          id="linkedin"
          value={profile.linkedin}
          onChange={set("linkedin")}
          placeholder="https://linkedin.com/in/votre-profil"
        />
        <Field
          label="Facebook"
          id="facebook"
          value={profile.facebook}
          onChange={set("facebook")}
          placeholder="https://facebook.com/votre-profil"
        />
      </Section>

      {/* Security */}
      <Section title="Sécurité" icon="line-md:lock-twotone">
        <p className="text-white/40 text-sm">
          Pour changer votre mot de passe, utilisez la page de connexion Supabase ou le lien "Mot de passe oublié".
        </p>
        <div
          className="flex items-center gap-3 p-3 rounded-xl text-sm"
          style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
        >
          <Icon icon="line-md:shield-twotone" width={18} className="text-cyan-400 shrink-0" />
          <span className="text-white/60">
            Authentification gérée par{" "}
            <span className="text-cyan-400 font-medium">Supabase Auth</span> — double facteur disponible depuis le dashboard Supabase.
          </span>
        </div>
      </Section>
    </div>
  )
}
