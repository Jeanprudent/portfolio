"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

/**
 * Gestion du thème clair/sombre, sans dépendance externe.
 *
 * Pourquoi ne plus passer par next-themes : sous React 19, le <script>
 * anti-FOUC que next-themes injecte DANS l'arbre d'un composant client
 * déclenche l'avertissement « Encountered a script tag while rendering React
 * component ». Ici, le script qui applique le thème avant le premier rendu
 * vit dans le <head> (composant serveur, voir app/layout.tsx) : c'est du HTML
 * statique, jamais rendu côté client, donc plus d'avertissement.
 *
 * Ce contexte ne gère que l'état réactif (toggle de l'en-tête, recoloration du
 * canvas). L'anti-flash, lui, est déjà fait par le script du <head>.
 */

type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "jp_theme"

interface ThemeContextValue {
  theme: Theme
  /** Identique à `theme` : pas de détection « système » sur ce site. */
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function appliquer(theme: Theme) {
  const racine = document.documentElement
  racine.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Toujours "light" au premier rendu (serveur + hydratation) pour coïncider
  // avec le HTML envoyé. La valeur réelle (éventuellement "dark", déjà posée
  // sur <html> par le script du <head>) est relue juste après le montage.
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    let stocke: Theme = "light"
    try {
      const v = localStorage.getItem(THEME_STORAGE_KEY)
      if (v === "dark" || v === "light") stocke = v
    } catch {
      // localStorage indisponible (navigation privée, cookies bloqués) : on
      // reste sur le thème clair par défaut.
    }
    setThemeState(stocke)
    appliquer(stocke)
  }, [])

  const setTheme = useCallback((valeur: Theme) => {
    setThemeState(valeur)
    appliquer(valeur)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, valeur)
    } catch {
      // Écriture impossible : le thème s'applique quand même pour la session.
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  // Repli neutre si le hook est appelé hors du provider (ne devrait pas
  // arriver, mais évite un crash et garde les composants rendus en isolation).
  if (!ctx) {
    return { theme: "light", resolvedTheme: "light", setTheme: () => {} }
  }
  return ctx
}
