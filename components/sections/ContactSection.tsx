"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { ContactForm } from "@/components/contact/ContactForm"
import type { PortfolioConfig } from "@/lib/supabase-data"
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_LOCATION,
  whatsappLink,
} from "@/lib/contact-info"

export function ContactSection({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const email = config?.email || CONTACT_EMAIL
  const whatsapp = config?.whatsapp || CONTACT_WHATSAPP
  const location = config?.location || CONTACT_LOCATION

  const CONTACT_INFO = [
    {
      icon: "line-md:email-twotone",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: "line-md:phone-call-loop",
      label: "Téléphone",
      value: CONTACT_PHONE_DISPLAY,
      href: `tel:${CONTACT_PHONE}`,
    },
    {
      icon: "prime:whatsapp",
      label: "WhatsApp",
      value: config?.whatsapp ? `${whatsapp}` : CONTACT_WHATSAPP_DISPLAY,
      href: whatsappLink(whatsapp),
    },
    {
      icon: "line-md:map-marker-twotone",
      label: t("contact.label_location"),
      value: location,
      href: null,
    },
  ]
  return (
    <section id="contact" className="section-spacing">
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
            <span className="gradient-text">{t("contact.title_highlight")} </span> 
            sur votre projet
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
                  style={{ background: "rgba(255, 122, 26,0.1)", border: "1px solid rgba(255, 122, 26,0.2)" }}
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
          <motion.div
            className="lg:col-span-3 glass-card p-7 md:p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
