"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Icon } from "@iconify/react"

/**
 * Bouton « remonter en haut » flottant.
 *
 * N'apparaît qu'après avoir défilé (seuil 400 px), avec une entrée/sortie
 * animée. L'icône line-md:arrow-up est elle-même animée (tracé). Le défilement
 * respecte prefers-reduced-motion.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Remonter en haut de la page"
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-white shadow-[0_4px_24px_rgba(18,18,18,0.35)] border border-white/10"
        >
          <Icon icon="line-md:arrow-up" width={24} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
