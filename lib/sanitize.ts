import sanitizeHtmlLib from "sanitize-html"

/**
 * Nettoyage du HTML non fiable, sans DOM.
 *
 * Historique : ce module utilisait isomorphic-dompurify, qui tire jsdom —
 * une émulation complète de navigateur, ~700 fichiers. Next classe jsdom
 * parmi les paquets « externes » : il n'est pas empaqueté au build mais
 * `require()` à chaud dans la fonction serverless. Or jsdom charge
 * html-encoding-sniffer, qui charge @exodus/bytes, qui est en ESM pur. Le
 * runtime de Vercel refuse ce require et lève ERR_REQUIRE_ESM — au
 * chargement du module, donc avant même le rendu.
 *
 * Conséquence observée le 26/08 : /blog/[slug] répondait 500 en production
 * pour n'importe quel slug, valide ou non, alors que tout passait en local
 * (Node 24 accepte `require()` d'un module ESM) et que /services/[slug]
 * s'en sortait — cette page est prérendue au build, jsdom n'y est jamais
 * chargé à l'exécution.
 *
 * sanitize-html analyse le HTML avec un vrai parseur (htmlparser2) et
 * n'a besoin d'aucun DOM. Il est empaqueté au build par Turbopack, donc
 * plus aucun `require()` de module externe à l'exécution.
 */

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

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ""

  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    // La même liste pour toutes les balises : le parseur écarte de toute
    // façon les attributs qui n'ont pas de sens sur une balise donnée.
    allowedAttributes: { "*": ALLOWED_ATTR },

    // Schémas d'URI autorisés. `data:` est absent volontairement : une image
    // en data-URI peut embarquer du SVG, donc du script. Les couvertures et
    // illustrations passent par des URL http(s).
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Bloque « //evil.com », qui hérite du protocole de la page.
    allowProtocolRelative: false,
    // Les URL relatives (/images/x.png) restent permises.
    allowedSchemesAppliedToAttributes: ["href", "src"],

    // Le contenu de ces balises est jeté avec la balise, pas recraché en
    // texte brut — sinon « <script>alert(1)</script> » laisserait « alert(1) ».
    nonTextTags: ["script", "style", "textarea", "option", "noscript", "iframe"],

    // Un lien qui ouvre un nouvel onglet donne à la page cible l'accès à
    // window.opener. On force la parade, quoi qu'ait mis l'éditeur.
    transformTags: {
      a: (tagName, attribs) =>
        attribs.target
          ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
          : { tagName, attribs },
    },

    disallowedTagsMode: "discard",
  })
}
