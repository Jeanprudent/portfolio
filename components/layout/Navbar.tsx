"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

const SECTION_IDS = ["accueil", "services", "projets", "a-propos", "faq", "contact"]

const NAV_KEYS = [
  { key: "nav.accueil", href: "/#accueil", id: "accueil" },
  { key: "nav.apropos", href: "/#a-propos", id: "a-propos" },
  { key: "nav.services", href: "/#services", id: "services" },
  { key: "nav.projets", href: "/#projets", id: "projets" },
  { key: "nav.faq", href: "/#faq", id: "faq" },
  { key: "nav.blog", href: "/blog", id: "" },
  { key: "nav.contact", href: "/#contact", id: "contact" },
]

export function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      let current = "accueil"
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 80) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
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
              className="flex items-center gap-2 font-heading font-bold text-xl select-none z-10"
              onClick={() => setMenuOpen(false)}
            >
              <span className="gradient-text">Jean</span>
              <span className="text-(--text-primary)">Prudent</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_KEYS.map((link) => {
                const isActive = link.id && activeSection === link.id
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

              <a
                href="/#contact"
                className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
              >
                <Icon icon="line-md:telegram" width={16} />
                {t("nav.cta")}
              </a>

              {/* Hamburger — mobile & tablet uniquement */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center glass border border-(--glass-border) text-(--text-primary) z-10 relative"
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

      {/* Mobile Menu — plein écran, fond opaque + blur */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-40 flex flex-col backdrop-blur-2xl dark:bg-[#050510]/97 bg-[#F8F7FF]/97"
          >
            {/* Espace réservé pour la navbar */}
            <div className="h-16 shrink-0" />

            {/* Liens de navigation */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {NAV_KEYS.map((link, i) => {
                const isActive = link.id && activeSection === link.id
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
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
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
