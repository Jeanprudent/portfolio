"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"

import { supabase } from "@/lib/supabase"
import { parseServiceContent, toStored } from "@/lib/service-content"
import type { ServiceContent } from "@/lib/service-content"
import { slugify } from "@/lib/slug"
import { RichTextEditor } from "@/components/gestion/RichTextEditor"
import { RepeatableList } from "@/components/gestion/RepeatableList"
import { IconPicker } from "@/components/gestion/IconPicker"
import { ImageUpload } from "@/components/gestion/ImageUpload"
import type { Service, Offer } from "@/types/portfolio"
import { cn } from "@/lib/utils"

const ICONES_SUGGEREES = [
  "line-md:laptop-twotone",
  "line-md:search-twotone",
  "line-md:cog-loop",
  "line-md:speed-twotone",
  "line-md:star-twotone",
  "line-md:briefcase-twotone",
  "line-md:document-list-twotone",
  "line-md:cloud-up-twotone",
]

const ONGLETS = ["Général", "Contenu", "Offres", "FAQ"] as const
type Onglet = (typeof ONGLETS)[number]

const NOUVEAU: Omit<Service, "id"> = {
  title: "",
  description: "",
  icon: "line-md:star-twotone",
  order_index: 0,
  visible: true,
}

/* --------------------------------- champs -------------------------------- */

function Champ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  multiline?: boolean
}) {
  const commun =
    "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
  const style = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(commun, "resize-y")}
          style={style}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(commun, "h-11 py-0")}
          style={style}
        />
      )}
      {hint && <p className="mt-1 text-xs text-white/25">{hint}</p>}
    </div>
  )
}

function Bloc({ titre, aide, children }: { titre: string; aide?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-heading font-semibold text-white text-sm">{titre}</h2>
        {aide && <p className="mt-0.5 text-xs text-white/35">{aide}</p>}
      </div>
      {children}
    </section>
  )
}

/* ---------------------------------- page --------------------------------- */

export default function EditionServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const estNouveau = id === "nouveau"
  const router = useRouter()

  const [service, setService] = useState<Service | null>(null)
  const [contenu, setContenu] = useState<ServiceContent | null>(null)
  const [onglet, setOnglet] = useState<Onglet>("Général")
  const [chargement, setChargement] = useState(!estNouveau)
  const [sauvegarde, setSauvegarde] = useState(false)

  useEffect(() => {
    if (estNouveau) {
      setService({ id: "", ...NOUVEAU })
      setContenu(parseServiceContent({}))
      return
    }
    supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        const s = data as Service | null
        setService(s)
        setContenu(parseServiceContent(s?.content))
        setChargement(false)
      })
  }, [id, estNouveau])

  const setChamp = <K extends keyof Service>(cle: K, v: Service[K]) =>
    setService((p) => (p ? { ...p, [cle]: v } : p))

  // Édition imbriquée du contenu : `maj(c => ...)` reçoit une copie et
  // renvoie le document modifié.
  const majContenu = (f: (c: ServiceContent) => ServiceContent) =>
    setContenu((p) => (p ? f({ ...p }) : p))

  const enregistrer = async () => {
    if (!service || !contenu) return
    if (!service.title.trim() || !service.description.trim()) {
      toast.error("Titre et description sont requis")
      setOnglet("Général")
      return
    }

    setSauvegarde(true)

    const payload = {
      title: service.title.trim(),
      // Le slug détermine l'URL publique : on le calcule si l'auteur ne l'a
      // pas saisi, avec la même fonction que le site.
      slug: (service.slug?.trim() || slugify(service.title)).toLowerCase(),
      description: service.description.trim(),
      long_description: service.long_description ?? "",
      icon: service.icon,
      banner: service.banner ?? "",
      order_index: service.order_index,
      visible: service.visible,
      offers: service.offers ?? [],
      // Revalidé par le même schéma qu'à la lecture : la donnée écrite ne
      // peut pas prendre une forme que la page ne saurait pas relire.
      content: toStored(parseServiceContent(toStored(contenu))),
    }

    const req = estNouveau
      ? supabase.from("services").insert(payload).select().single()
      : supabase.from("services").update(payload).eq("id", service.id).select().single()

    const { data, error } = await req
    setSauvegarde(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Service enregistré")
    if (estNouveau && data) router.replace(`/gestion/services/${(data as Service).id}`)
  }

  if (chargement || !service || !contenu) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon icon="line-md:loading-loop" width={28} className="text-[#ff7a1a]" />
      </div>
    )
  }

  const slugApercu = (service.slug?.trim() || slugify(service.title || "")).toLowerCase()

  return (
    <div className="max-w-3xl space-y-6 pb-24">
      <Toaster position="top-right" />

      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/gestion/services"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <Icon icon="line-md:chevron-up" width={13} className="-rotate-90" />
            Tous les services
          </Link>
          <h1 className="truncate font-heading font-bold text-2xl text-white">
            {estNouveau ? "Nouveau service" : service.title || "Sans titre"}
          </h1>
          {slugApercu && (
            <p className="mt-1 font-mono text-xs text-white/30">
              /services/{slugApercu}
            </p>
          )}
        </div>

        <button
          onClick={enregistrer}
          disabled={sauvegarde}
          className="flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ff7a1a, #ff7a1a)" }}
        >
          <Icon
            icon={sauvegarde ? "line-md:loading-loop" : "line-md:confirm-circle-twotone"}
            width={16}
          />
          {sauvegarde ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      {/* Onglets */}
      <div
        className="flex gap-1 overflow-x-auto rounded-xl p-1"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {ONGLETS.map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              onglet === o ? "text-white" : "text-white/40 hover:text-white/70"
            )}
            style={
              onglet === o
                ? {
                    background: "rgba(255, 122, 26,0.25)",
                    border: "1px solid rgba(255, 122, 26,0.35)",
                  }
                : undefined
            }
          >
            {o}
          </button>
        ))}
      </div>

      {/* ------------------------------ Général ------------------------------ */}
      {onglet === "Général" && (
        <div className="space-y-6">
          <Champ
            label="Titre *"
            value={service.title}
            onChange={(v) => setChamp("title", v)}
            placeholder="Création de sites web sur mesure"
          />
          <Champ
            label="Slug"
            value={service.slug ?? ""}
            onChange={(v) => setChamp("slug", v)}
            placeholder={slugify(service.title || "")}
            hint="Laisser vide pour le calculer depuis le titre. Le modifier change l'URL publique."
          />
          <Champ
            label="Description courte *"
            value={service.description}
            onChange={(v) => setChamp("description", v)}
            multiline
            hint="Affichée sur la carte d'accueil et utilisée comme meta description."
          />

          <IconPicker
            value={service.icon}
            onChange={(v) => setChamp("icon", v)}
            suggestions={ICONES_SUGGEREES}
          />

          <ImageUpload
            label="Bannière"
            currentUrl={service.banner}
            folder="services"
            onUpload={(url) => setChamp("banner", url)}
            hint="Idéalement 960 × 600 px. Sert aussi d'image de partage."
          />

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={service.visible}
              onChange={(e) => setChamp("visible", e.target.checked)}
              className="h-4 w-4 accent-[#ff7a1a]"
            />
            <span className="text-sm text-white/70">Visible sur le site</span>
          </label>
        </div>
      )}

      {/* ------------------------------ Contenu ------------------------------ */}
      {onglet === "Contenu" && (
        <div className="space-y-8">
          <Bloc titre="Accroche" aide="Sous le titre, dans le bandeau haut de page.">
            <Champ
              label="Phrase d'accroche"
              value={contenu.hero.tagline}
              onChange={(v) => majContenu((c) => ({ ...c, hero: { ...c.hero, tagline: v } }))}
              multiline
              hint="Vide : la description courte est utilisée."
            />
            <RepeatableList
              items={contenu.hero.badges}
              onChange={(badges) => majContenu((c) => ({ ...c, hero: { ...c.hero, badges } }))}
              nouveau={() => ""}
              labelAjout="Ajouter un badge"
              labelVide="Aucun badge."
              renderItem={(badge, i) => (
                <input
                  value={badge}
                  onChange={(e) =>
                    majContenu((c) => ({
                      ...c,
                      hero: {
                        ...c.hero,
                        badges: c.hero.badges.map((b, k) => (k === i ? e.target.value : b)),
                      },
                    }))
                  }
                  placeholder="Next.js"
                  className="h-10 w-full rounded-lg px-3 text-sm text-white placeholder:text-white/25 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              )}
            />
          </Bloc>

          <Bloc titre="C'est quoi ?" aide="Définit le service avant d'argumenter.">
            <Champ
              label="Titre de la section"
              value={contenu.definition.title}
              onChange={(v) =>
                majContenu((c) => ({ ...c, definition: { ...c.definition, title: v } }))
              }
              placeholder="C'est quoi, exactement ?"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                Texte
              </label>
              <RichTextEditor
                content={contenu.definition.body}
                minHeight={180}
                onChange={(html) =>
                  majContenu((c) => ({ ...c, definition: { ...c.definition, body: html } }))
                }
              />
            </div>
            <Champ
              label="Citation encadrée"
              value={contenu.definition.highlight}
              onChange={(v) =>
                majContenu((c) => ({ ...c, definition: { ...c.definition, highlight: v } }))
              }
              multiline
            />
          </Bloc>

          <Bloc
            titre="Pourquoi en avez-vous besoin ?"
            aide="Quatre temps. Les mots Problème / Aggravation / Solution / Action ne s'affichent JAMAIS sur le site : ils vous guident ici, le visiteur ne voit que vos sous-titres."
          >
            <Champ
              label="Titre de la section"
              value={contenu.why.title}
              onChange={(v) => majContenu((c) => ({ ...c, why: { ...c.why, title: v } }))}
              placeholder="Pourquoi en avez-vous besoin ?"
            />

            {(["problem", "aggravation"] as const).map((cle) => (
              <div key={cle} className="space-y-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  {cle === "problem" ? "1 · Problème" : "2 · Aggravation"}
                  <span className="ml-2 font-normal normal-case text-white/25">
                    {cle === "problem"
                      ? "la situation inconfortable actuelle"
                      : "ce qui empire si rien ne change"}
                  </span>
                </p>
                <Champ
                  label="Sous-titre affiché"
                  value={contenu.why[cle].title}
                  onChange={(v) =>
                    majContenu((c) => ({
                      ...c,
                      why: { ...c.why, [cle]: { ...c.why[cle], title: v } },
                    }))
                  }
                  placeholder="Vos clients vous cherchent et ne vous trouvent pas"
                />
                <Champ
                  label="Texte"
                  value={contenu.why[cle].text}
                  onChange={(v) =>
                    majContenu((c) => ({
                      ...c,
                      why: { ...c.why, [cle]: { ...c.why[cle], text: v } },
                    }))
                  }
                  multiline
                />
              </div>
            ))}

            <div className="space-y-3 rounded-xl p-4" style={{ background: "rgba(255, 122, 26,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                3 · Solution
                <span className="ml-2 font-normal normal-case text-white/25">
                  votre réponse, illustrée par les bénéfices
                </span>
              </p>
              <Champ
                label="Sous-titre affiché"
                value={contenu.why.solution.title}
                onChange={(v) =>
                  majContenu((c) => ({
                    ...c,
                    why: { ...c.why, solution: { ...c.why.solution, title: v } },
                  }))
                }
              />
              <Champ
                label="Texte"
                value={contenu.why.solution.text}
                onChange={(v) =>
                  majContenu((c) => ({
                    ...c,
                    why: { ...c.why, solution: { ...c.why.solution, text: v } },
                  }))
                }
                multiline
              />
              <RepeatableList
                items={contenu.why.solution.benefits}
                onChange={(benefits) =>
                  majContenu((c) => ({
                    ...c,
                    why: { ...c.why, solution: { ...c.why.solution, benefits } },
                  }))
                }
                nouveau={() => ({ icon: "", title: "", text: "" })}
                labelAjout="Ajouter un bénéfice"
                labelVide="Aucun bénéfice."
                renderItem={(b, _i, set) => (
                  <div className="space-y-3">
                    <Champ label="Titre" value={b.title} onChange={(v) => set({ title: v })} />
                    <Champ label="Texte" value={b.text} onChange={(v) => set({ text: v })} multiline />
                    <IconPicker
                      value={b.icon}
                      onChange={(v) => set({ icon: v })}
                      suggestions={ICONES_SUGGEREES}
                      label="Icône (facultative)"
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                4 · Action
                <span className="ml-2 font-normal normal-case text-white/25">
                  l&apos;invitation à passer à l&apos;acte
                </span>
              </p>
              <Champ
                label="Sous-titre affiché"
                value={contenu.why.action.title}
                onChange={(v) =>
                  majContenu((c) => ({ ...c, why: { ...c.why, action: { ...c.why.action, title: v } } }))
                }
              />
              <Champ
                label="Texte"
                value={contenu.why.action.text}
                onChange={(v) =>
                  majContenu((c) => ({ ...c, why: { ...c.why, action: { ...c.why.action, text: v } } }))
                }
                multiline
              />
              <Champ
                label="Libellé du bouton"
                value={contenu.why.action.ctaLabel}
                onChange={(v) =>
                  majContenu((c) => ({
                    ...c,
                    why: { ...c.why, action: { ...c.why.action, ctaLabel: v } },
                  }))
                }
                placeholder="Discutons de votre projet"
              />
            </div>
          </Bloc>

          <Bloc titre="Ce qui est inclus">
            <Champ
              label="Titre de la section"
              value={contenu.includes.title}
              onChange={(v) => majContenu((c) => ({ ...c, includes: { ...c.includes, title: v } }))}
              placeholder="Ce qui est inclus"
            />
            <RepeatableList
              items={contenu.includes.items}
              onChange={(items) => majContenu((c) => ({ ...c, includes: { ...c.includes, items } }))}
              nouveau={() => ({ icon: "", title: "", text: "" })}
              labelAjout="Ajouter une prestation"
              labelVide="Aucune prestation listée."
              renderItem={(it, _i, set) => (
                <div className="space-y-3">
                  <Champ label="Titre" value={it.title} onChange={(v) => set({ title: v })} />
                  <Champ label="Texte" value={it.text} onChange={(v) => set({ text: v })} multiline />
                  <IconPicker
                    value={it.icon}
                    onChange={(v) => set({ icon: v })}
                    suggestions={ICONES_SUGGEREES}
                    label="Icône (facultative)"
                  />
                </div>
              )}
            />
          </Bloc>

          <Bloc titre="Comment ça se passe" aide="Les étapes sont numérotées automatiquement.">
            <Champ
              label="Titre de la section"
              value={contenu.process.title}
              onChange={(v) => majContenu((c) => ({ ...c, process: { ...c.process, title: v } }))}
              placeholder="Comment ça se passe"
            />
            <RepeatableList
              items={contenu.process.steps}
              onChange={(steps) => majContenu((c) => ({ ...c, process: { ...c.process, steps } }))}
              nouveau={() => ({ title: "", text: "" })}
              labelAjout="Ajouter une étape"
              labelVide="Aucune étape."
              renderItem={(s, _i, set) => (
                <div className="space-y-3">
                  <Champ label="Titre" value={s.title} onChange={(v) => set({ title: v })} placeholder="Cadrage" />
                  <Champ label="Texte" value={s.text} onChange={(v) => set({ text: v })} multiline />
                </div>
              )}
            />
          </Bloc>

          <Bloc titre="Prose libre" aide="Texte long, affiché entre les sections. Facultatif.">
            <RichTextEditor
              content={service.long_description ?? ""}
              onChange={(html) => setChamp("long_description", html)}
            />
          </Bloc>
        </div>
      )}

      {/* ------------------------------- Offres ------------------------------ */}
      {onglet === "Offres" && (
        <div className="space-y-8">
          <Bloc
            titre="Formules"
            aide="Le prix le plus bas alimente automatiquement le « À partir de » du bandeau haut de page."
          >
            <RepeatableList
              items={service.offers ?? []}
              onChange={(offers) => setChamp("offers", offers as Offer[])}
              nouveau={() =>
                ({
                  id: `o-${Date.now()}`,
                  name: "",
                  description: "",
                  duration_days: 7,
                  currency: "XOF",
                }) as Offer
              }
              labelAjout="Ajouter une formule"
              labelVide="Aucune formule. La section Tarifs ne s'affichera pas."
              renderItem={(o, _i, set) => (
                <div className="space-y-3">
                  <Champ label="Nom" value={o.name} onChange={(v) => set({ name: v })} placeholder="Pack Starter" />
                  <Champ label="Description" value={o.description} onChange={(v) => set({ description: v })} multiline />
                  <Champ
                    label="Prix affiché"
                    value={o.price ?? ""}
                    onChange={(v) => set({ price: v })}
                    placeholder="150 000 à 300 000 XOF"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Champ
                      label="Prix mini"
                      value={String(o.price_min ?? "")}
                      onChange={(v) => set({ price_min: Number(v) || undefined })}
                      hint="Sert au « À partir de »"
                    />
                    <Champ
                      label="Prix maxi"
                      value={String(o.price_max ?? "")}
                      onChange={(v) => set({ price_max: Number(v) || undefined })}
                    />
                    <Champ
                      label="Durée (jours)"
                      value={String(o.duration_days ?? "")}
                      onChange={(v) => set({ duration_days: Number(v) || 0 })}
                    />
                  </div>
                </div>
              )}
            />
          </Bloc>

          <Bloc titre="Contexte de prix" aide="Affiché sous les formules.">
            <Champ
              label="Introduction"
              value={contenu.pricing.intro}
              onChange={(v) => majContenu((c) => ({ ...c, pricing: { ...c.pricing, intro: v } }))}
              multiline
            />
            <RepeatableList
              items={contenu.pricing.factors}
              onChange={(factors) => majContenu((c) => ({ ...c, pricing: { ...c.pricing, factors } }))}
              nouveau={() => ""}
              labelAjout="Ajouter un facteur"
              labelVide="Aucun facteur de coût."
              renderItem={(f, i) => (
                <input
                  value={f}
                  onChange={(e) =>
                    majContenu((c) => ({
                      ...c,
                      pricing: {
                        ...c.pricing,
                        factors: c.pricing.factors.map((x, k) => (k === i ? e.target.value : x)),
                      },
                    }))
                  }
                  placeholder="Nombre de pages"
                  className="h-10 w-full rounded-lg px-3 text-sm text-white placeholder:text-white/25 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              )}
            />
          </Bloc>
        </div>
      )}

      {/* -------------------------------- FAQ -------------------------------- */}
      {onglet === "FAQ" && (
        <Bloc
          titre="Questions fréquentes"
          aide="Propres à ce service. Une question sans réponse est ignorée à l'affichage."
        >
          <RepeatableList
            items={contenu.faq}
            onChange={(faq) => majContenu((c) => ({ ...c, faq }))}
            nouveau={() => ({ q: "", a: "" })}
            labelAjout="Ajouter une question"
            labelVide="Aucune question. La section FAQ ne s'affichera pas."
            renderItem={(item, _i, set) => (
              <div className="space-y-3">
                <Champ
                  label="Question"
                  value={item.q}
                  onChange={(v) => set({ q: v })}
                  placeholder="Combien de temps faut-il pour un site vitrine ?"
                />
                <Champ label="Réponse" value={item.a} onChange={(v) => set({ a: v })} multiline />
              </div>
            )}
          />
        </Bloc>
      )}
    </div>
  )
}
