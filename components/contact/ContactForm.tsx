"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Icon } from "@iconify/react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { BESOINS, BESOIN_VALUES, type BesoinValue } from "@/lib/contact-options"

/**
 * Formulaire de contact, source unique.
 *
 * Il ne vivait que dans ContactSection. La fiche service, elle, ouvrait un
 * `mailto:` — qui ne fait rien du tout chez un visiteur sans client mail
 * configuré, cas courant sur mobile et depuis un webmail. La demande partait
 * donc dans le vide, sans le moindre signe d'échec.
 *
 * Les deux points d'entrée partagent désormais ce composant : même
 * validation, même route API, même retour visuel.
 */

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  besoin: z.enum(BESOIN_VALUES, { message: "Sélectionnez votre besoin" }),
  budget: z.string().min(2, "Indiquez un budget, même approximatif").max(80),
  message: z.string().min(20, "Message trop court (20 caractères min.)"),
  // Honeypot anti-spam : invisible pour les humains, doit rester vide.
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const CHAMP =
  "w-full h-11 px-4 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"

const LABEL = "block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide"

const TOAST_SUCCES = {
  style: {
    background: "rgba(5,5,16,0.95)",
    color: "#fff",
    border: "1px solid rgba(124,58,237,0.4)",
    backdropFilter: "blur(12px)",
  },
  iconTheme: { primary: "#7C3AED", secondary: "#fff" },
}

const TOAST_ERREUR = {
  style: {
    background: "rgba(5,5,16,0.95)",
    color: "#fff",
    border: "1px solid rgba(239,68,68,0.4)",
  },
}

export function ContactForm({
  besoinParDefaut,
  service,
  compact = false,
  onSuccess,
  idPrefix = "contact",
}: {
  /** Pré-sélectionne le besoin — sur une fiche service, on sait déjà ce qui intéresse. */
  besoinParDefaut?: BesoinValue
  /** Service concerné, repris dans l'objet et le corps de l'email. */
  service?: string
  /** Une seule colonne, pour les contextes étroits comme le modal. */
  compact?: boolean
  onSuccess?: () => void
  /** Les id restent uniques si deux formulaires coexistent sur une page. */
  idPrefix?: string
}) {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { besoin: besoinParDefaut },
  })

  // Le <select> n'a pas de placeholder natif : tant que rien n'est choisi, on
  // grise le texte comme sur les autres champs. useWatch (et non watch) pour
  // ne réabonner que ce champ.
  const besoinChoisi = Boolean(useWatch({ control, name: "besoin" }))

  const id = (nom: string) => `${idPrefix}-${nom}`

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service }),
      })

      if (!res.ok) {
        // Le serveur sait pourquoi il refuse (limite de débit, configuration
        // absente…). Le taire laissait le visiteur sans la moindre piste.
        const detail = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(detail?.error || t("contact.form_error"))
      }

      toast.success(t("contact.form_success"), TOAST_SUCCES)
      reset({ besoin: besoinParDefaut })
      onSuccess?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("contact.form_error"), TOAST_ERREUR)
    } finally {
      setSubmitting(false)
    }
  }

  const colonnes = compact ? "grid gap-4 mb-4" : "grid sm:grid-cols-2 gap-4 mb-4"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot anti-bot : caché, hors flux et ignoré par l'autofill */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0 w-px h-px"
        {...register("website")}
      />

      <div className={colonnes}>
        <div>
          <label htmlFor={id("name")} className={LABEL}>
            {t("contact.form_name")} *
          </label>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            placeholder={t("contact.form_placeholder_name")}
            {...register("name")}
            className={CHAMP}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor={id("email")} className={LABEL}>
            {t("contact.form_email")} *
          </label>
          <input
            id={id("email")}
            type="email"
            autoComplete="email"
            placeholder={t("contact.form_placeholder_email")}
            {...register("email")}
            className={CHAMP}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className={colonnes}>
        <div>
          <label htmlFor={id("besoin")} className={LABEL}>
            {t("contact.form_besoin")} *
          </label>
          <div className="relative">
            <select
              id={id("besoin")}
              defaultValue={besoinParDefaut ?? ""}
              {...register("besoin")}
              className={`w-full h-11 pl-4 pr-10 rounded-xl glass border border-(--glass-border) bg-transparent text-sm appearance-none cursor-pointer focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 ${
                besoinChoisi ? "text-(--text-primary)" : "text-(--text-muted)"
              }`}
            >
              <option value="" disabled className="bg-(--bg) text-(--text-muted)">
                {t("contact.form_besoin_placeholder")}
              </option>
              {BESOINS.map((b) => (
                <option key={b.value} value={b.value} className="bg-(--bg) text-(--text-primary)">
                  {t(b.i18nKey)}
                </option>
              ))}
            </select>
            <Icon
              icon="line-md:chevron-down"
              width={16}
              aria-hidden
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)"
            />
          </div>
          {errors.besoin && <p className="mt-1 text-xs text-red-400">{errors.besoin.message}</p>}
        </div>

        <div>
          <label htmlFor={id("budget")} className={LABEL}>
            {t("contact.form_budget")} *
          </label>
          <input
            id={id("budget")}
            type="text"
            inputMode="text"
            placeholder={t("contact.form_placeholder_budget")}
            {...register("budget")}
            className={CHAMP}
          />
          {errors.budget ? (
            <p className="mt-1 text-xs text-red-400">{errors.budget.message}</p>
          ) : (
            <p className="mt-1 text-xs text-(--text-muted)">{t("contact.form_budget_hint")}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor={id("message")} className={LABEL}>
          {t("contact.form_message")} *
        </label>
        <textarea
          id={id("message")}
          rows={compact ? 4 : 5}
          placeholder={t("contact.form_placeholder_message")}
          {...register("message")}
          className="w-full px-4 py-3 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 resize-none"
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:transform-none"
      >
        {submitting ? (
          <>
            <Icon icon="line-md:loading-loop" width={18} />
            {t("contact.form_submitting")}
          </>
        ) : (
          <>
            <Icon icon="line-md:confirm-circle-twotone" width={18} />
            {t("contact.form_submit")}
          </>
        )}
      </button>
    </form>
  )
}
