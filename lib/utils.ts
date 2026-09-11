import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

/**
 * Date a afficher pour un article : celle de sa mise en ligne.
 *
 * created_at est la date de creation du brouillon. Un article redige en aout
 * et publie en septembre s'annoncait date d'aout, sur le site comme dans le
 * balisage Schema.org. Repli sur created_at pour les brouillons et pour les
 * lignes anterieures a la migration 008.
 */
export function datePublication(post: { published_at?: string | null; created_at: string }): string {
  return post.published_at || post.created_at
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "…"
}
