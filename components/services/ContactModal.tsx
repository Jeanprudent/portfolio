"use client"

import { useState } from "react"

export default function ContactModal({ projectType }: { projectType?: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const submit = (e: any) => {
    e.preventDefault()
    const subject = `Demande de devis: ${projectType ?? "Projet"}`
    const body = `Nom: ${name}%0AEmail: ${email}%0AType de projet: ${projectType}%0A%0AMessage:%0A${encodeURIComponent(
      message,
    )}`
    window.location.href = `mailto:jeanprudent03@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
    setOpen(false)
  }

  return (
    <div>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        Contactez-moi
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 z-10 w-full max-w-md">
            <h3 className="font-heading font-bold text-lg mb-2">Contact — {projectType}</h3>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="text-sm">Votre nom</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" required />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input w-full" required />
              </div>
              <div>
                <label className="text-sm">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input w-full h-24" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Envoyer par email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
