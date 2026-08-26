import { test, expect } from "@playwright/test"
import { sanitizeHtml } from "../../lib/sanitize"

/**
 * Le contenu des articles vient du back-office et part dans
 * dangerouslySetInnerHTML. Ces tests verrouillent les deux exigences :
 * ce qui est dangereux disparaît, ce que produit TipTap survit.
 */

test("le balisage produit par l'éditeur traverse intact", () => {
  const propre =
    '<h2>Titre</h2><p>Du <strong>gras</strong>, de l\'<em>italique</em> et un ' +
    '<a href="https://exemple.com" title="lien">lien</a>.</p>' +
    "<ul><li>un</li><li>deux</li></ul>" +
    '<blockquote><p>Citation</p></blockquote><pre><code>du code</code></pre>' +
    '<img src="https://exemple.com/photo.jpg" alt="photo" />'

  const sortie = sanitizeHtml(propre)

  for (const attendu of ["<h2>", "<strong>", "<em>", "<blockquote>", "<pre>", "<code>", "<li>"]) {
    expect(sortie, `${attendu} doit survivre`).toContain(attendu)
  }
  expect(sortie).toContain('href="https://exemple.com"')
  expect(sortie).toContain('src="https://exemple.com/photo.jpg"')
  expect(sortie).toContain('alt="photo"')
})

test("le script est retiré, et son contenu avec", () => {
  const sortie = sanitizeHtml('<p>avant</p><script>alert(1)</script><p>après</p>')
  expect(sortie).not.toContain("script")
  // Le piège : jeter la balise en recrachant l'intérieur laisserait « alert(1) ».
  expect(sortie).not.toContain("alert(1)")
  expect(sortie).toContain("avant")
  expect(sortie).toContain("après")
})

test("les gestionnaires d'événements sautent", () => {
  const sortie = sanitizeHtml('<img src="https://x.fr/a.png" onerror="alert(1)" alt="" />')
  expect(sortie).not.toContain("onerror")
  expect(sortie).not.toContain("alert")
  expect(sortie).toContain("src=")
})

test("javascript: dans un href est neutralisé", () => {
  const sortie = sanitizeHtml('<a href="javascript:alert(1)">clic</a>')
  expect(sortie.toLowerCase()).not.toContain("javascript:")
  expect(sortie).toContain("clic")
})

test("data: est refusé, y compris sur une image (vecteur SVG)", () => {
  const svg = "data:image/svg+xml;base64,PHN2Zz48c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+PC9zdmc+"
  expect(sanitizeHtml(`<img src="${svg}" alt="" />`)).not.toContain("data:")
})

test("une URL relative au protocole est refusée", () => {
  expect(sanitizeHtml('<a href="//evil.com">x</a>')).not.toContain("//evil.com")
})

test("les URL relatives du site restent utilisables", () => {
  expect(sanitizeHtml('<a href="/services">nos services</a>')).toContain('href="/services"')
})

test("iframe, form et style disparaissent", () => {
  const sortie = sanitizeHtml(
    '<iframe src="https://evil.com"></iframe><form action="/x"><input /></form>' +
      '<style>body{display:none}</style><p>reste</p>'
  )
  for (const interdit of ["iframe", "<form", "<input", "<style", "display:none"]) {
    expect(sortie, `${interdit} ne doit pas subsister`).not.toContain(interdit)
  }
  expect(sortie).toContain("reste")
})

test("l'attribut style est retiré, la balise conservée", () => {
  const sortie = sanitizeHtml('<p style="position:fixed;top:0">texte</p>')
  expect(sortie).not.toContain("style=")
  expect(sortie).toContain("texte")
})

test("un lien qui ouvre un onglet reçoit rel=noopener", () => {
  const sortie = sanitizeHtml('<a href="https://exemple.com" target="_blank">x</a>')
  expect(sortie).toContain('target="_blank"')
  expect(sortie).toContain("noopener")
})

test("une entrée vide ne lève pas", () => {
  expect(sanitizeHtml("")).toBe("")
})
