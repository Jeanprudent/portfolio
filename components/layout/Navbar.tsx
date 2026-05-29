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
  { key: "nav.accueil", href: "#accueil", id: "accueil" },
  { key: "nav.services", href: "#services", id: "services" },
  { key: "nav.projets", href: "#projets", id: "projets" },
  { key: "nav.apropos", href: "#a-propos", id: "a-propos" },
  { key: "nav.faq", href: "#faq", id: "faq" },
  { key: "nav.blog", href: "/blog", id: "" },
  { key: "nav.contact", href: "#contact", id: "contact" },
]

export function Navbar() {
  const { t, i18n } = useTranslation()
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
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80) current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr")
  }

  const currentLang = mounted ? i18n.language : "fr"
  const nextLang = currentLang === "fr" ? "en" : "fr"

  return (
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
            className="flex items-center gap-2 font-heading font-bold text-xl select-none"
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
            {/* Language toggle */}
            {mounted && (
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg glass border border-(--glass-border) text-(--text-secondary) hover:text-(--text-primary) transition-all duration-200 text-xs font-semibold"
                aria-label="Toggle language"
              >
                <img
                  src={`https://flagcdn.com/w20/${currentLang === "fr" ? "fr" : "gb"}.png`}
                  width={16}
                  height={12}
                  alt={currentLang}
                  className="rounded-sm"
                />
                <span className="uppercase">{nextLang}</span>
              </button>
            )}

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
              href="#contact"
              className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
            >
              <Icon icon="line-md:telegram" width={16} />
              {t("nav.cta")}
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center glass border border-(--glass-border) text-(--text-secondary)"
              aria-label="Menu mobile"
            >
              <Icon icon={menuOpen ? "line-md:close" : "line-md:menu"} width={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mx-4 mt-1 glass rounded-2xl border border-(--glass-border) p-3"
          >
            <ul className="flex flex-col gap-1">
              {NAV_KEYS.map((link) => {
                const isActive = link.id && activeSection === link.id
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-(--text-primary) bg-(--glass-bg)"
                          : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--glass-bg)"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-2 pt-2 border-t border-(--glass-border)">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                <Icon icon="line-md:telegram" width={16} />
                {t("nav.cta")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
