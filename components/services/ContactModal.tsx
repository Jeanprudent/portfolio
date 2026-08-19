"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@iconify/react"
import { CONTACT_EMAIL } from "@/lib/contact-info"

export default function ContactModal({ projectType }: { projectType?: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const openerRef = useRef<HTMLButtonElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)

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

    firstFieldRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const subject = `Demande de devis: ${projectType ?? "Projet"}`
    const body = `Nom: ${name}%0AEmail: ${email}%0AType de projet: ${projectType}%0A%0AMessage:%0A${encodeURIComponent(
      message,
    )}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`
    close()
  }

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

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-(--glass-border) bg-(--bg) p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide">
              Votre nom *
            </label>
            <input
              id="modal-name"
              ref={firstFieldRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide">
              Email *
            </label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-message" className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <textarea
              id="modal-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input h-24"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button type="button" className="btn-ghost text-sm" onClick={close}>
              Annuler
            </button>
            <button type="submit" className="btn-primary text-sm">
              <Icon icon="line-md:email-twotone" width={16} />
              Envoyer par email
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <>
      <button ref={openerRef} className="btn-primary w-full justify-center" onClick={() => setOpen(true)}>
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
