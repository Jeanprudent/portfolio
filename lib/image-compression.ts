/**
 * Conversion des images en WebP avant envoi vers Supabase Storage.
 *
 * Les captures de projets partaient telles quelles : dix PNG pour 9,7 Mo, dont
 * un a 1,7 Mo. La page /projets les charge toutes. Le stockage ne transforme
 * rien, la compression doit donc avoir lieu avant l'envoi.
 *
 * Tout se passe dans le navigateur, via canvas : aucune dependance ajoutee, et
 * l'echec est toujours benin — si le navigateur ne sait pas encoder en WebP,
 * on renvoie le fichier d'origine plutot que de bloquer une publication.
 */

/** Plus large qu'une carte projet en 2x, inutile d'aller au-dela. */
const LARGEUR_MAX = 1600

const CIBLE_OCTETS = 100 * 1024

/** De la meilleure a la plus econome : on s'arrete des que la cible est tenue. */
const QUALITES = [0.82, 0.72, 0.62, 0.52, 0.45]

export type ResultatCompression = {
  fichier: File
  /** Vrai si l'image a reellement ete reencodee (faux = fichier d'origine). */
  converti: boolean
  octetsAvant: number
  octetsApres: number
}

function dessiner(bitmap: ImageBitmap, largeur: number): HTMLCanvasElement | null {
  const echelle = Math.min(1, largeur / bitmap.width)
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * echelle)
  canvas.height = Math.round(bitmap.height * echelle)
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  // Un PNG a fond transparent devient noir en WebP sans ce fond blanc.
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas
}

function encoder(canvas: HTMLCanvasElement, qualite: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", qualite))
}

export async function compresserEnWebp(fichier: File): Promise<ResultatCompression> {
  const inchange: ResultatCompression = {
    fichier,
    converti: false,
    octetsAvant: fichier.size,
    octetsApres: fichier.size,
  }

  // Un GIF anime perdrait son animation a la conversion.
  if (fichier.type === "image/gif") return inchange
  if (typeof document === "undefined" || typeof createImageBitmap !== "function") return inchange

  try {
    const bitmap = await createImageBitmap(fichier)

    // Deux passes de largeur : la seconde ne sert qu'aux captures tres larges
    // que la qualite seule ne suffit pas a ramener sous la cible.
    for (const largeur of [LARGEUR_MAX, 1200]) {
      const canvas = dessiner(bitmap, largeur)
      if (!canvas) break

      for (const qualite of QUALITES) {
        const blob = await encoder(canvas, qualite)
        if (!blob || blob.type !== "image/webp") return inchange
        if (blob.size <= CIBLE_OCTETS || (qualite === QUALITES.at(-1) && largeur === 1200)) {
          bitmap.close()
          // Un visuel deja optimise peut ressortir plus lourd en WebP :
          // dans ce cas l'original reste le meilleur choix.
          if (blob.size >= fichier.size) return inchange
          const nom = fichier.name.replace(/\.[^.]+$/, "") + ".webp"
          return {
            fichier: new File([blob], nom, { type: "image/webp" }),
            converti: true,
            octetsAvant: fichier.size,
            octetsApres: blob.size,
          }
        }
      }
    }

    bitmap.close()
    return inchange
  } catch {
    return inchange
  }
}

export const enKo = (octets: number) => Math.max(1, Math.round(octets / 1024))
