"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Projets", href: "#projets" },
  { label: "À propos", href: "#a-propos" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={cn(
          "container-max mx-auto transition-all duration-300 mt-4",
          scrolled
            ? "glass rounded-2xl border border-(--glass-border) mx-4 lg:mx-auto"
            : "bg-transparent"
        )}
      >
        <nav className="flex items-center justify-between px-5 h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-xl select-none"
          >
            <span className="gradient-text">Jean</span>
            <span className="text-(--text-primary)">Prudent</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--glass-bg) transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
              Me contacter
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
            className="md:hidden mt-2 mx-4 glass rounded-2xl border border-(--glass-border) p-3"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--glass-bg) transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-(--glass-border)">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                <Icon icon="line-md:telegram" width={16} />
                Me contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
