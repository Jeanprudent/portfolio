import DOMPurify from "isomorphic-dompurify"

// Liste blanche alignée sur ce que produit l'éditeur TipTap (StarterKit + Image + Link).
// Tout le reste (script, iframe, event handlers, etc.) est supprimé.
const ALLOWED_TAGS = [
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "code", "pre", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "img",
  "span",
]

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"]

/**
 * Nettoie du HTML non fiable (contenu d'article stocké en base) avant de le
 * rendre via dangerouslySetInnerHTML. Bloque le XSS stocké.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Interdit les URI dangereuses (javascript:, data: hors images) sur href/src.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "style"],
  })
}
