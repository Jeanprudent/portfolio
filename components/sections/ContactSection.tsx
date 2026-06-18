"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Icon } from "@iconify/react"
import toast, { Toaster } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "Sujet requis"),
  message: z.string().min(20, "Message trop court (20 caractères min.)"),
  // Honeypot anti-spam : invisible pour les humains, doit rester vide.
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ContactSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const email = config?.email || "jeanprudent03@gmail.com"
  const whatsapp = config?.whatsapp || "2290192175002"
  const location = config?.location || "Cotonou, Bénin"

  const CONTACT_INFO = [
    {
      icon: "line-md:email-twotone",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: "line-md:phone-call-loop",
      label: "Télephone",
      value: `${whatsapp}`,
      href: `tel:${whatsapp}`,
    },
    {
      icon: "prime:whatsapp",
      label: "WhatsApp",
      value: `${whatsapp}`,
      href: `https://wa.me/${whatsapp}`,
    },
    {
      icon: "line-md:map-marker-twotone",
      label: t("contact.label_location"),
      value: location,
      href: null,
    },
  ]
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("send failed")
      toast.success(t("contact.form_success"), {
        style: {
          background: "rgba(5,5,16,0.95)",
          color: "#fff",
          border: "1px solid rgba(124,58,237,0.4)",
          backdropFilter: "blur(12px)",
        },
        iconTheme: { primary: "#7C3AED", secondary: "#fff" },
      })
      reset()
    } catch {
      toast.error(t("contact.form_error"), {
        style: {
          background: "rgba(5,5,16,0.95)",
          color: "#fff",
          border: "1px solid rgba(239,68,68,0.4)",
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-spacing">
      <Toaster position="top-right" />

      <div className="container-max">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:telegram" width={14} />
            {t("contact.label")}
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            {t("contact.title")}{" "}
            <span className="gradient-text">{t("contact.title_highlight")}</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="glass-card p-5 flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <Icon icon={item.icon} width={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-(--text-muted) text-xs uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-(--text-primary) font-medium text-sm hover:text-primary transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-(--text-primary) font-medium text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Availability badge */}
            <div className="glass rounded-xl border border-(--glass-border) p-4 flex items-center gap-3">
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                <div className="relative rounded-full w-full h-full bg-green-400" />
              </div>
              <p className="text-(--text-secondary) text-sm">
                <strong className="text-(--text-primary)">Disponible</strong> pour de nouveaux projets
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            className="lg:col-span-3 glass-card p-7 md:p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Honeypot anti-bot : caché, hors flux et ignoré par l'autofill */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] opacity-0 w-px h-px"
              {...register("website")}
            />

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide"
                >
                  {t("contact.form_name")} *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("contact.form_placeholder_name")}
                  {...register("name")}
                  className="w-full h-11 px-4 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide"
                >
                  {t("contact.form_email")} *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("contact.form_placeholder_email")}
                  {...register("email")}
                  className="w-full h-11 px-4 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide"
              >
                {t("contact.form_subject")} *
              </label>
              <input
                id="subject"
                type="text"
                placeholder={t("contact.form_placeholder_subject")}
                {...register("subject")}
                className="w-full h-11 px-4 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-xs font-medium text-(--text-secondary) mb-1.5 uppercase tracking-wide"
              >
                {t("contact.form_message")} *
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder={t("contact.form_placeholder_message")}
                {...register("message")}
                className="w-full px-4 py-3 rounded-xl glass border border-(--glass-border) bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 resize-none"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
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
          </motion.form>
        </div>
      </div>
    </section>
  )
}
