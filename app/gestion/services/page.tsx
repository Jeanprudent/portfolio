"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { parseServiceContent } from "@/lib/service-content"
import type { Service } from "@/types/portfolio"
import { cn } from "@/lib/utils"

/**
 * Liste des services. L'édition vit sur /gestion/services/[id] : avec une
 * quarantaine de champs, une carte dépliable dans cette page n'était plus
 * tenable.
 */
export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) {
      toast.error(error.message)
      return
    }
    setServices((prev) => prev.filter((s) => s.id !== id))
    setConfirmDelete(null)
    toast.success("Service supprimé")
  }

  const toggleVisible = async (id: string) => {
    const svc = services.find((s) => s.id === id)
    if (!svc) return
    const { error } = await supabase
      .from("services")
      .update({ visible: !svc.visible })
      .eq("id", id)
    if (error) {
      toast.error(error.message)
      return
    }
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    )
  }

  const deplacer = async (index: number, delta: number) => {
    const cible = index + delta
    if (cible < 0 || cible >= services.length) return

    const next = [...services]
    ;[next[index], next[cible]] = [next[cible], next[index]]
    const ordonne = next.map((s, i) => ({ ...s, order_index: i }))

    setServices(ordonne)

    // Deux `update` ciblés plutôt qu'un `upsert` : ce dernier exigerait la
    // ligne complète (title, description…), qu'on n'a aucune raison de
    // réécrire pour un simple changement d'ordre.
    const [a, b] = await Promise.all([
      supabase
        .from("services")
        .update({ order_index: ordonne[index].order_index })
        .eq("id", ordonne[index].id),
      supabase
        .from("services")
        .update({ order_index: ordonne[cible].order_index })
        .eq("id", ordonne[cible].id),
    ])
    const erreur = a.error ?? b.error
    if (erreur) toast.error(erreur.message)
  }

  /** Combien de sections ont du contenu — repère visuel de complétude. */
  const remplissage = (s: Service) => {
    const c = parseServiceContent(s.content)
    const drapeaux = [c.hasDefinition, c.hasWhy, c.hasIncludes, c.hasProcess, c.hasFaq]
    return { faites: drapeaux.filter(Boolean).length, total: drapeaux.length }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-1">Services</h1>
          <p className="text-white/50 text-sm">
            {services.length} service{services.length > 1 ? "s" : ""}, les flèches
            réorganisent l&apos;affichage sur le site
          </p>
        </div>

        <Link
          href="/gestion/services/nouveau"
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg, #ff7a1a, #ff7a1a)" }}
        >
          <Icon icon="line-md:plus-circle-twotone" width={16} />
          Nouveau service
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Icon icon="line-md:loading-loop" width={28} className="text-[#ff7a1a]" />
        </div>
      )}

      {!loading && services.length === 0 && (
        <p className="py-12 text-center text-white/30 text-sm">
          Aucun service. Commencez par en créer un.
        </p>
      )}

      <div className="space-y-3">
        {!loading &&
          services.map((service, index) => {
            const { faites, total } = remplissage(service)

            return (
              <div
                key={service.id}
                className={cn(
                  "flex flex-wrap items-start gap-3 rounded-xl p-4 transition-opacity duration-200 sm:gap-4",
                  !service.visible && "opacity-50"
                )}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(255, 122, 26,0.12)",
                    border: "1px solid rgba(255, 122, 26,0.25)",
                  }}
                >
                  <Icon icon={service.icon} width={20} className="text-[#ff7a1a]" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white text-sm">
                    {service.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-white/40 text-xs">
                    {service.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-xs"
                      style={{
                        background:
                          faites === total
                            ? "rgba(4,108,78,0.25)"
                            : "rgba(255,255,255,0.06)",
                        color: faites === total ? "#58D9A8" : "rgba(255,255,255,0.45)",
                      }}
                      title="Sections de la fiche déjà renseignées"
                    >
                      {faites}/{total} sections
                    </span>
                    {service.slug && (
                      <span className="font-mono text-xs text-white/25">
                        /{service.slug}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex w-full shrink-0 items-center justify-end gap-1 border-t border-white/[0.07] pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
                  <button
                    onClick={() => deplacer(index, -1)}
                    disabled={index === 0}
                    aria-label="Monter"
                    className="flex h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <Icon icon="line-md:chevron-up" width={16} />
                  </button>
                  <button
                    onClick={() => deplacer(index, 1)}
                    disabled={index === services.length - 1}
                    aria-label="Descendre"
                    className="flex h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <Icon icon="line-md:chevron-down" width={16} />
                  </button>
                  <button
                    onClick={() => toggleVisible(service.id)}
                    aria-label={service.visible ? "Masquer" : "Afficher"}
                    title={service.visible ? "Visible sur le site" : "Masqué"}
                    className="flex h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                  >
                    <Icon
                      icon={service.visible ? "line-md:watch" : "line-md:watch-off"}
                      width={16}
                      className={service.visible ? "text-white/50" : "text-white/20"}
                    />
                  </button>

                  <Link
                    href={`/gestion/services/${service.id}`}
                    aria-label="Éditer"
                    className="flex h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
                  >
                    <Icon icon="line-md:pencil-twotone" width={16} />
                  </Link>

                  <button
                    onClick={() => setConfirmDelete(service.id)}
                    aria-label="Supprimer"
                    className="flex h-9 w-9 max-sm:bg-white/[0.06] sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Icon icon="line-md:close-circle-twotone" width={16} />
                  </button>
                </div>
              </div>
            )
          })}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmDelete(null)}
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#16121F", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="mb-1 font-semibold text-white">Supprimer ce service ?</p>
            <p className="mb-5 text-sm text-white/50">
              Son contenu et ses offres seront perdus. Cette action est définitive.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
