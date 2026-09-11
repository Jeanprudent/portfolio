"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_WHATSAPP,
  CONTACT_PHONE_DISPLAY,
  whatsappLink,
} from "@/lib/contact-info"

// Ancres préfixées par « / » : sans le slash, ces liens cherchent la section
// sur la page courante et ne font rien depuis /blog ou une fiche service.
const FOOTER_LINKS = [
  { label: "Accueil", href: "/#accueil" },
  { label: "Services", href: "/services" },
  { label: "Projets", href: "/projets" },
  { label: "À propos", href: "/#a-propos" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
]

export function Footer({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const email = config?.email || CONTACT_EMAIL
  const whatsapp = config?.whatsapp || CONTACT_WHATSAPP
  const location = config?.location || CONTACT_LOCATION
  const disponible = config?.disponible !== false
  const github = config?.github_url || "https://github.com/Jeanprudent"
  const linkedin = config?.linkedin_url || "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287"
  const facebook = config?.facebook_url || "https://www.facebook.com/jean.prudent.2025"

  const socialLinks = [
    { label: "GitHub", href: github, icon: "line-md:github-loop" },
    { label: "LinkedIn", href: linkedin, icon: "line-md:linkedin" },
    { label: "Facebook", href: facebook, icon: "line-md:facebook" },
  ]

  // Les liens pointent vers les fiches générées depuis SERVICES : on calcule
  // le slug avec la même fonction que generateStaticParams, sans quoi le lien
  // mènerait à une fiche inexistante.
  const services = SERVICES.filter((s) => s.visible)

  return (
    <footer className="relative border-t border-(--glass-border) mt-0">
      {/* Gradient glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      <div className="container-max py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr] mb-12">
          {/* Marque */}
          <div className="space-y-4">
            <Link href="/" className="inline-block font-heading font-bold text-2xl">
              <span className="gradient-text">Jean </span>
              <span className="text-(--text-primary)">Prudent</span>
            </Link>

            <p className="text-(--text-secondary) text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>

            <p className="text-(--text-secondary) text-sm leading-relaxed max-w-xs">
              Développeur web &amp; designer freelance. J&apos;accompagne les PME, artisans et
              entrepreneurs, de la conception du site à son référencement.
            </p>

            <div className="flex items-center gap-2 text-(--text-muted) text-sm">
              <Icon icon="line-md:map-marker-twotone" width={16} className="text-primary shrink-0" />
              {location}
            </div>

            {disponible && (
              <div className="inline-flex items-center gap-2 rounded-full border border-(--glass-border) px-3 py-1.5">
                <span className="relative flex w-2 h-2 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                  <span className="relative w-full h-full rounded-full bg-green-400" />
                </span>
                <span className="text-(--text-secondary) text-xs">
                  Disponible pour de nouveaux projets
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h2 className="font-heading font-semibold text-(--text-primary) mb-4 text-sm uppercase tracking-widest">
              {t("footer.nav_title")}
            </h2>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="font-heading font-semibold text-(--text-primary) mb-4 text-sm uppercase tracking-widest">
              Services
            </h2>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${serviceSlug(service)}`}
                    className="text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200 inline-flex items-start gap-2 group"
                  >
                    <Icon
                      icon={service.icon}
                      width={15}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-primary/70 group-hover:text-primary transition-colors duration-200"
                    />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/services"
                  className="text-primary text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
                >
                  Voir tous les services
                  <Icon icon="line-md:arrow-right" width={14} aria-hidden />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading font-semibold text-(--text-primary) mb-4 text-sm uppercase tracking-widest">
              {t("footer.contact_title")}
            </h2>
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200 break-all"
              >
                <Icon icon="line-md:email-twotone" width={16} className="text-secondary shrink-0" />
                {email}
              </a>
              <a
                href={`tel:${whatsapp}`}
                className="flex items-center gap-2 text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200"
              >
                <Icon icon="line-md:phone-call-loop" width={16} className="text-secondary shrink-0" />
                {config?.whatsapp ? `${whatsapp}` : CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={whatsappLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200"
              >
                <Icon icon="prime:whatsapp" width={16} className="text-secondary shrink-0" />
                WhatsApp
              </a>
            </div>

            <Link href="/#contact" className="btn-primary text-xs mt-5 py-2 px-4">
              <Icon icon="line-md:telegram" width={15} aria-hidden />
              Démarrer un projet
            </Link>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass border border-(--glass-border) flex items-center justify-center text-(--text-secondary) hover:text-primary hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon icon={s.icon} width={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar — la marge basse et le retrait à droite réservent la
            place du bouton WhatsApp flottant, qui recouvrait la signature
            une fois arrivé en bas de page. */}
        <div className="pt-6 pb-16 md:pb-0 md:pr-20 border-t border-(--glass-border) flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-(--text-muted) text-sm text-center md:text-left">
            © {year} Jean Prudent IDOHOU. {t("footer.rights")}
          </p>
          <p className="text-(--text-muted) text-xs text-center md:text-right">
            {"Conçu et développé par "}
            <span className="text-primary">Jean Prudent</span> à Cotonou
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink(whatsapp, "Bonjour Jean Prudent, je souhaite discuter d'un projet web.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter via WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: "0 4px 24px rgba(37, 211, 102, 0.4)",
        }}
      >
        <Icon icon="line-md:phone-call-loop" width={26} />
      </a>
    </footer>
  )
}
