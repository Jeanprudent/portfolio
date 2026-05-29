"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import type { PortfolioConfig } from "@/lib/supabase-data"

const FOOTER_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Projets", href: "#projets" },
  { label: "À propos", href: "#a-propos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
]

export function Footer({ config }: { config?: PortfolioConfig | null }) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const email = config?.email || "jeanprudent03@gmail.com"
  const whatsapp = config?.whatsapp || "2290192175002"
  const location = config?.location || "Cotonou, Bénin"
  const github = config?.github_url || "https://github.com/Jeanprudent"
  const linkedin = config?.linkedin_url || "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287"
  const facebook = config?.facebook_url || "https://www.facebook.com/jean.prudent.2025"

  const socialLinks = [
    { label: "GitHub", href: github, icon: "line-md:github-loop" },
    { label: "LinkedIn", href: linkedin, icon: "line-md:linkedin" },
    { label: "Facebook", href: facebook, icon: "line-md:facebook" },
  ]

  return (
    <footer className="relative border-t border-(--glass-border) mt-0">
      {/* Gradient glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      <div className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block font-heading font-bold text-2xl">
              <span className="gradient-text">Jean</span>
              <span className="text-(--text-primary)">Prudent</span>
            </Link>
            <p className="text-(--text-secondary) text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-(--text-muted) text-sm">
              <Icon icon="line-md:map-marker-twotone" width={16} className="text-primary shrink-0" />
              {location}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-semibold text-(--text-primary) mb-4 text-sm uppercase tracking-widest">
              {t("footer.nav_title")}
            </h3>
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

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-(--text-primary) mb-4 text-sm uppercase tracking-widest">
              {t("footer.contact_title")}
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200"
              >
                <Icon icon="line-md:email-twotone" width={16} className="text-secondary shrink-0" />
                {email}
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-(--text-secondary) hover:text-primary text-sm transition-colors duration-200"
              >
                <Icon icon="line-md:phone-call-loop" width={16} className="text-secondary shrink-0" />
                +{whatsapp}
              </a>
            </div>

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

        {/* Bottom bar */}
        <div className="pt-6 border-t border-(--glass-border) flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-(--text-muted) text-sm text-center md:text-left">
            © {year} Jean Prudent IDOHOU. {t("footer.rights")}
          </p>
          <p className="text-(--text-muted) text-xs">
            {t("footer.built")}{" "}
            <span className="text-primary">♥</span> à Cotonou
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsapp}?text=Bonjour Jean Prudent, je souhaite discuter d'un projet web.`}
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
