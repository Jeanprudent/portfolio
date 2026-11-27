import { Icon } from "@iconify/react"
import type { ReactNode } from "react"

/**
 * Bannière d'en-tête partagée, calquée sur le style de la fiche service
 * (ServiceHero) : carte sombre arrondie, voile de marque, contenu CENTRÉ
 * (pastille + titre blanc + sous-titre + actions).
 *
 * Les fiches services ont une photo de fond ; les pages d'index (services,
 * à-propos, projets) n'en ont pas, d'où un fond dégradé de marque (orange
 * #ff7a1a sur base sombre) qui donne le même rendu.
 *
 * Le composant émet le <h1> de la page : les pages qui l'utilisent ne doivent
 * donc pas en émettre un second (invariant « un seul h1 » du site).
 */
export default function PageBanner({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  eyebrowIcon?: string
  title: ReactNode
  subtitle?: ReactNode
  /** Boutons / actions, rendus centrés sous le sous-titre. */
  children?: ReactNode
}) {
  return (
    <header className="relative w-full overflow-hidden rounded-2xl mb-12">
      <div className="relative min-h-[20rem] md:min-h-[24rem]">
        {/* Fond de marque (pas d'image) : halo orange + dégradé sombre. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 22% 12%, rgba(255,122,26,0.30) 0%, rgba(255,122,26,0) 55%), linear-gradient(135deg, #1c1c1c 0%, #0f0f0f 100%)",
          }}
          aria-hidden
        />
        {/* Léger voile bas pour la profondeur et la lisibilité. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col items-center justify-center text-center gap-4 p-6 md:p-10 min-h-[20rem] md:min-h-[24rem]">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/85 backdrop-blur-sm">
              {eyebrowIcon && <Icon icon={eyebrowIcon} width={15} aria-hidden />}
              {eyebrow}
            </span>
          )}

          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white text-balance max-w-3xl mx-auto">
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-1">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
