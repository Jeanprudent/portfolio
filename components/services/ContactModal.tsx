"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@iconify/react"
import { ContactForm } from "@/components/contact/ContactForm"
import type { BesoinValue } from "@/lib/contact-options"

export default function ContactModal({
  projectType,
  besoin,
}: {
  projectType?: string
  /** Besoin pré-sélectionné, déduit du service depuis la fiche. */
  besoin?: BesoinValue
}) {
  const [open, setOpen] = useState(false)

  const openerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    openerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)

    // Empêche la page de défiler derrière la boîte de dialogue.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Le premier champ est rendu par ContactForm : on le cherche dans le
    // dialogue plutôt que de faire remonter une ref à travers le composant.
    dialogRef.current?.querySelector<HTMLInputElement>("input:not([aria-hidden])")?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-(--glass-border) bg-(--bg) p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-(--text-muted) hover:text-(--text-primary) transition-colors"
        >
          <Icon icon="line-md:close" width={20} />
        </button>

        <h3 id="contact-modal-title" className="font-heading font-bold text-lg mb-1 pr-8">
          Demande de devis
        </h3>
        <p className="text-sm text-(--text-secondary) mb-5">{projectType}</p>

        {/*
          `compact` : raccourcit la zone de message pour que le formulaire
          tienne dans la boîte sans défilement (la boîte, élargie à 36rem,
          laisse désormais la place aux deux colonnes nom/email et besoin/budget).
          `idPrefix` distinct de celui de la page d'accueil, au cas où les deux
          formulaires se retrouveraient un jour sur la même page — des id
          dupliqués casseraient les <label for>.
        */}
        <ContactForm
          compact
          idPrefix="devis"
          service={projectType}
          besoinParDefaut={besoin}
          onSuccess={close}
        />
      </div>
    </div>
  )

  return (
    <>
      <button
        ref={openerRef}
        className="btn-primary w-full justify-center"
        onClick={() => setOpen(true)}
      >
        <Icon icon="line-md:telegram" width={16} />
        Contactez-moi
      </button>

      {/*
        Portail vers <body> : indispensable ici. Le modal est rendu depuis une
        carte `.glass-card`, dont le `backdrop-filter` crée un bloc conteneur
        pour les descendants `position: fixed`. Sans portail, `inset-0` se
        calait sur la carte au lieu de la fenêtre — d'où la boîte mal placée
        qui suivait le défilement.

        Pas de garde « monté » nécessaire : `open` ne passe à true que sur un
        clic, donc toujours après l'hydratation, quand `document` existe.
      */}
      {open ? createPortal(dialog, document.body) : null}
    </>
  )
}
