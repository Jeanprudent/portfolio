"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { ImageUpload } from "@/components/gestion/ImageUpload"

type Profile = {
  id: string
  site_name: string
  bio: string
  email: string
  whatsapp: string
  location: string
  avatar_url: string
  github_url: string
  linkedin_url: string
  facebook_url: string
}

const DEFAULT_PROFILE: Profile = {
  id: "",
  site_name: "Jean Prudent IDOHOU",
  bio: "Développeur web et designer basé à Cotonou. Je crée des sites web modernes, performants et optimisés pour aider les entrepreneurs et PME à développer leur présence en ligne.",
  email: "jeanprudent03@gmail.com",
  whatsapp: "+2290192175002",
  location: "Cotonou, Bénin",
  avatar_url: "",
  github_url: "https://github.com/Jeanprudent",
  linkedin_url: "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287",
  facebook_url: "https://www.facebook.com/jean.prudent.2025",
}

function Field({
  label, id, value, onChange, placeholder, type = "text", textarea, hint,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; textarea?: boolean; hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] transition-all duration-200 resize-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      ) : (
        <input
          id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
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
    <div className="rounded-xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon icon={icon} width={18} className="text-[#A855F7]" />
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from("portfolio_config")
      .select("id, site_name, bio, email, whatsapp, location, avatar_url, github_url, linkedin_url, facebook_url")
      .single()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        else if (data) {
          setProfile({
            id: data.id,
            site_name: data.site_name ?? DEFAULT_PROFILE.site_name,
            bio: data.bio ?? DEFAULT_PROFILE.bio,
            email: data.email ?? DEFAULT_PROFILE.email,
            whatsapp: data.whatsapp ?? DEFAULT_PROFILE.whatsapp,
            location: data.location ?? DEFAULT_PROFILE.location,
            avatar_url: data.avatar_url ?? "",
            github_url: data.github_url ?? DEFAULT_PROFILE.github_url,
            linkedin_url: data.linkedin_url ?? DEFAULT_PROFILE.linkedin_url,
            facebook_url: data.facebook_url ?? DEFAULT_PROFILE.facebook_url,
          })
        }
        setLoading(false)
      })
  }, [])

  const set = (key: keyof Profile) => (v: string) =>
    setProfile((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    if (!profile.id) return
    setSaving(true)
    const { error } = await supabase
      .from("portfolio_config")
      .update({
        site_name: profile.site_name,
        bio: profile.bio,
        email: profile.email,
        whatsapp: profile.whatsapp,
        location: profile.location,
        avatar_url: profile.avatar_url || null,
        github_url: profile.github_url || null,
        linkedin_url: profile.linkedin_url || null,
        facebook_url: profile.facebook_url || null,
      })
      .eq("id", profile.id)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success("Paramètres sauvegardés !")
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Paramètres</h1>
          <p className="text-white/50 text-sm">Gérez votre profil, vos coordonnées et vos liens sociaux.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
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
          <Section title="Profil" icon="line-md:person-twotone">
            <ImageUpload
              label="Photo de profil"
              currentUrl={profile.avatar_url || null}
              folder="avatars"
              aspectRatio="square"
              onUpload={(url) => {
                set("avatar_url")(url)
              }}
              hint="Taille recommandée : 400×400 px"
            />
            <Field label="Nom complet" id="site_name" value={profile.site_name} onChange={set("site_name")} placeholder="Jean Prudent IDOHOU" />
            <Field label="Bio" id="bio" value={profile.bio} onChange={set("bio")} placeholder="Votre présentation courte…" textarea />
          </Section>

          <Section title="Coordonnées" icon="line-md:phone-twotone">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email professionnel" id="email" type="email" value={profile.email} onChange={set("email")} placeholder="vous@exemple.com" />
              <Field label="WhatsApp" id="whatsapp" value={profile.whatsapp} onChange={set("whatsapp")} placeholder="+229..." />
            </div>
            <Field label="Localisation" id="location" value={profile.location} onChange={set("location")} placeholder="Ville, Pays" />
          </Section>

          <Section title="Liens sociaux" icon="line-md:link">
            <Field label="GitHub" id="github" value={profile.github_url} onChange={set("github_url")} placeholder="https://github.com/votre-profil" />
            <Field label="LinkedIn" id="linkedin" value={profile.linkedin_url} onChange={set("linkedin_url")} placeholder="https://linkedin.com/in/votre-profil" />
            <Field label="Facebook" id="facebook" value={profile.facebook_url} onChange={set("facebook_url")} placeholder="https://facebook.com/votre-profil" />
          </Section>

          <Section title="Sécurité" icon="line-md:security-twotone">
            <p className="text-white/40 text-sm">Pour changer votre mot de passe, utilisez le lien "Mot de passe oublié" sur la page de connexion.</p>
            <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <Icon icon="line-md:security-twotone" width={18} className="text-cyan-400 shrink-0" />
              <span className="text-white/60">
                Authentification gérée par <span className="text-cyan-400 font-medium">Supabase Auth</span> — double facteur disponible depuis le dashboard Supabase.
              </span>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
