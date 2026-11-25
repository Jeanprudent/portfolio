import { cn } from "@/lib/utils"

/**
 * Logo de marque (wordmark « JEAN PRUDENT », charte « La une »).
 *
 * Deux fichiers transparents, permutés par CSS selon le thème — pas de JS ni
 * d'attente de montage, donc aucun saut d'hydratation :
 *   - clair  : wordmark noir presse (#121212)
 *   - sombre : wordmark orange une (#ff7a1a)
 *
 * On passe par <img> (et non next/image) : ce sont des SVG locaux servis par
 * `self`, inutile d'activer dangerouslyAllowSVG. width/height sont déclarés
 * pour réserver l'espace (pas de CLS).
 */
export function Logo({ className }: { className?: string }) {
  // `className` (ex. "h-7") est porté par les <img> pour fixer la hauteur ;
  // w-auto conserve le ratio du wordmark.
  const common = cn("w-auto select-none", className)
  return (
    <span className="inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/full-color.svg"
        alt="Jean Prudent"
        width={160}
        height={56}
        className={cn(common, "block dark:hidden")}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/full-color-dark.svg"
        alt=""
        aria-hidden="true"
        width={160}
        height={56}
        className={cn(common, "hidden dark:block")}
      />
    </span>
  )
}
