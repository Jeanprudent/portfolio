/* eslint-disable @next/next/no-img-element */
import Image from "next/image"

/**
 * Image qui ne fait jamais tomber la page.
 *
 * `next/image` refuse tout hôte absent de `remotePatterns` — et ne se
 * contente pas d'ignorer l'image : il lève, la page répond 500. Or les
 * couvertures d'articles sont des URL collées à la main dans le back-office,
 * qui peuvent pointer vers n'importe quel domaine. Lister ces domaines à
 * l'avance est impossible, et ouvrir `remotePatterns` à tout le web
 * reviendrait à offrir notre optimiseur d'images à des tiers.
 *
 * D'où ce compromis : optimisation pour les sources maîtrisées, balise
 * `<img>` ordinaire pour le reste. On perd le redimensionnement sur ces
 * images-là, jamais la page.
 *
 * Constaté le 21/08 : une couverture hébergée sur un domaine client
 * renvoyait 500 sur /blog/[slug].
 */

/** Doit refléter `images.remotePatterns` de next.config.ts. */
function estOptimisable(src: string): boolean {
  if (src.startsWith("/")) return true // fichier local dans public/
  try {
    const url = new URL(src)
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.startsWith("/storage/v1/object/public/")
    )
  } catch {
    return false
  }
}

export default function SafeImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
}) {
  if (estOptimisable(src)) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  )
}
