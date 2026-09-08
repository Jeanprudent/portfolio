/**
 * Tag Google Analytics injecte par app/layout.tsx.
 *
 * Declare ici plutot qu'importe : le script est charge par <Script>, la
 * fonction n'existe donc pas au premier rendu. Tout appel doit passer par
 * l'appel optionnel `window.gtag?.(...)`.
 */
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      cible: string,
      parametres?: Record<string, unknown>
    ) => void
  }
}

export {}
