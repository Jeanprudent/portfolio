"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Logo } from "@/components/layout/Logo"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import { EXPERTISES } from "@/data/local-seo"
import { localPath, type Ville } from "@/lib/local-seo"
import "@/lib/i18n"

const SECTION_IDS = ["accueil", "services", "projets", "a-propos", "faq", "contact"]

const NAV_KEYS = [
  { key: "nav.accueil", href: "/#accueil", id: "accueil" },
  { key: "nav.apropos", href: "/a-propos", id: "a-propos" },
  { key: "nav.services", href: "/services", id: "services" },
  { key: "nav.zones", href: "/services", id: "zones" },
  { key: "nav.projets", href: "/projets", id: "projets" },
  { key: "nav.blog", href: "/blog", id: "" },
  { key: "nav.contact", href: "/#contact", id: "contact" },
]

// Sous-menu Services : les fiches prestations.
const SERVICE_LINKS = SERVICES.filter((s) => s.visible).map((s) => ({
  label: s.title,
  href: `/services/${serviceSlug(s)}`,
}))

// Sous-menu « Zones » : construit à partir des villes actives reçues en prop.
function buildLocalLinks(villes: Ville[]) {
  return EXPERTISES.flatMap((e) =>
    villes.map((v) => ({
      label: `${e.nomCourt} ${v.prep} ${v.nom}`,
      href: localPath(e, v),
    }))
  )
}

export function Navbar({ villes = [] }: { villes?: Ville[] }) {
  const { t } = useTranslation()
  const LOCAL_LINKS = buildLocalLinks(villes)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      // Choose the section whose top is closest to the header offset (80px)
      let current = "accueil"
      let minDistance = Infinity
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el) {
          const rectTop = el.getBoundingClientRect().top
          const distance = Math.abs(rectTop - 80)
          if (distance < minDistance) {
            minDistance = distance
            current = id
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // Run once to set the correct active section on mount
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={cn(
            "w-full transition-all duration-300",
            scrolled
              ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--glass-border)] shadow-sm"
              : "bg-transparent"
          )}
        >
          <nav className="container-max mx-auto flex items-center justify-between px-6 h-16">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Jean Prudent, accueil"
              className="flex items-center z-10"
              onClick={() => setMenuOpen(false)}
            >
              <Logo className="h-9" />
            </Link>

            {/* Desktop Nav - show only on large screens */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_KEYS.map((link) => {
                const isActive = link.id && activeSection === link.id

                // Menus déroulants : Services (fiches) et Zones (pages villes).
                const dropdown =
                  link.id === "services"
                    ? { heading: "Prestations", items: SERVICE_LINKS, footer: { label: "Tous les services →", href: "/services" } }
                    : link.id === "zones"
                      ? { heading: "Prestations par ville", items: LOCAL_LINKS, footer: { label: "Tous les services →", href: "/services" } }
                      : null

                const triggerClass =
                  "px-3.5 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1 text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200"

                if (dropdown) {
                  const navLabel = link.id === "zones" ? "Zones" : t(link.key)
                  return (
                    <li key={link.id} className="relative group">
                      {/* Zones n'a pas de page propre : bouton. Services pointe vers /services. */}
                      {link.id === "zones" ? (
                        <button type="button" className={triggerClass}>
                          {navLabel}
                          <Icon icon="line-md:chevron-down" width={14} className="transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                      ) : (
                        <Link href={link.href} className={triggerClass}>
                          {navLabel}
                          <Icon icon="line-md:chevron-down" width={14} className="transition-transform duration-200 group-hover:rotate-180" />
                        </Link>
                      )}

                      {/* Panneau OPAQUE (indépendant du fond de page) */}
                      <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
                        <div className="w-72 p-2 rounded-2xl border border-(--glass-border) bg-(--bg) shadow-2xl">
                          <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-(--text-muted)">
                            {dropdown.heading}
                          </p>
                          {dropdown.items.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              className="block px-3 py-2 rounded-lg text-sm font-medium text-(--text-primary) hover:text-primary hover:bg-[rgba(255,122,26,0.10)] transition-colors"
                            >
                              {s.label}
                            </Link>
                          ))}
                          <Link
                            href={dropdown.footer.href}
                            className="block mt-1 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-[rgba(255,122,26,0.10)] border-t border-(--glass-border)"
                          >
                            {dropdown.footer.label}
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                }

                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-(--text-primary)"
                          : "text-(--text-secondary) hover:text-(--text-primary)"
                      )}
                    >
                      {t(link.key)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-lg flex items-center justify-center glass text-(--text-secondary) hover:text-primary transition-all duration-200 border border-(--glass-border)"
                  aria-label="Basculer le thème"
                >
                  <Icon
                    icon={
                      theme === "dark"
                        ? "line-md:moon-rising-twotone-loop"
                        : "line-md:sun-rising-twotone-loop"
                    }
                    width={18}
                    height={18}
                  />
                </button>
              )}

              <a href="/#contact" className="hidden lg:inline-flex btn-primary text-sm py-2 px-4">
                <Icon icon="line-md:telegram" width={16} />
                {t("nav.cta")}
              </a>

              {/* Hamburger — mobile & tablet (hidden on large) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center glass border border-(--glass-border) text-(--text-primary) z-10 relative"
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={menuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Icon icon={menuOpen ? "line-md:close" : "line-md:menu"} width={20} />
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile / Tablet Menu — plein écran, fond opaque + blur (hidden on large) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col backdrop-blur-2xl dark:bg-[#0f0f0f]/97 bg-white/97"
          >
            {/* Espace réservé pour la navbar */}
            <div className="h-16 shrink-0" />

            {/* Liens de navigation */}
            <nav className="flex-1 flex flex-col justify-center overflow-y-auto px-8 gap-1">
              {NAV_KEYS.map((link, i) => {
                const isActive = link.id && activeSection === link.id

                // Services et Zones : ligne + sous-menu repliable.
                const subItems =
                  link.id === "services" ? SERVICE_LINKS : link.id === "zones" ? LOCAL_LINKS : null

                if (subItems) {
                  const isSubOpen = mobileSub === link.id
                  const navLabel = link.id === "zones" ? "Zones" : t(link.key)
                  const toggleSub = () => setMobileSub((o) => (o === link.id ? null : link.id))
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-(--glass-border)"
                    >
                      <div className="flex items-center justify-between">
                        {link.id === "zones" ? (
                          <button
                            onClick={toggleSub}
                            className="flex-1 text-left py-3.5 text-lg font-heading font-bold text-(--text-primary)"
                          >
                            {navLabel}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex-1 py-3.5 text-lg font-heading font-bold text-(--text-primary)"
                          >
                            {navLabel}
                          </Link>
                        )}
                        <button
                          onClick={toggleSub}
                          aria-label={`Afficher ${navLabel}`}
                          aria-expanded={isSubOpen}
                          className="p-2 text-(--text-secondary)"
                        >
                          <Icon
                            icon="line-md:chevron-down"
                            width={22}
                            className={cn("transition-transform", isSubOpen && "rotate-180")}
                          />
                        </button>
                      </div>
                      {isSubOpen && (
                        <div className="pb-3 pl-3 flex flex-col gap-0.5">
                          {subItems.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              onClick={() => setMenuOpen(false)}
                              className="py-2 text-sm text-(--text-secondary) hover:text-primary"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-3.5 border-b border-(--glass-border) text-lg font-heading font-bold transition-colors duration-200",
                        isActive ? "text-primary" : "text-(--text-primary) hover:text-primary"
                      )}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      {t(link.key)}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* CTA bas de page */}
            <motion.div
              className="px-8 pb-12 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full justify-center text-base py-3.5"
              >
                <Icon icon="line-md:telegram" width={18} />
                {t("nav.cta")}
              </a>

              {/* Theme toggle dans le menu mobile */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl glass border border-(--glass-border) text-(--text-secondary) text-sm font-medium transition-all duration-200"
                >
                  <Icon
                    icon={theme === "dark" ? "line-md:moon-rising-twotone-loop" : "line-md:sun-rising-twotone-loop"}
                    width={18}
                  />
                  {theme === "dark" ? "Mode clair" : "Mode sombre"}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
