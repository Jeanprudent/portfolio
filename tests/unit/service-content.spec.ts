import { test, expect } from "@playwright/test"
import { parseServiceContent, toStored } from "../../lib/service-content"

// Ce que garantit ce fichier : quelle que soit la forme de `content` en base,
// parseServiceContent renvoie toujours un document exploitable et ne lève
// jamais. C'est cette garantie qui permet aux sections de s'effacer
// proprement au lieu de faire tomber la page.

test("un contenu absent renvoie un document vide, sans lever", () => {
  const c = parseServiceContent(undefined)
  expect(c.version).toBe(1)
  expect(c.faq).toEqual([])
  expect(c.why.problem.text).toBe("")
  expect(c.hasWhy).toBe(false)
})

test("un contenu malformé retombe sur les valeurs par défaut", () => {
  expect(() => parseServiceContent("pas un objet")).not.toThrow()
  expect(() => parseServiceContent([1, 2, 3])).not.toThrow()
  expect(() => parseServiceContent(null)).not.toThrow()
  expect(parseServiceContent({ faq: "cassé" }).faq).toEqual([])
  expect(parseServiceContent({ hero: 42 }).hero.badges).toEqual([])
})

test("un contenu partiel conserve ce qui est valide", () => {
  const c = parseServiceContent({
    hero: { tagline: "Mon accroche" },
    faq: [{ q: "Combien ça coûte ?", a: "À partir de 150 000 XOF." }],
  })
  expect(c.hero.tagline).toBe("Mon accroche")
  expect(c.hero.badges).toEqual([])
  expect(c.faq).toHaveLength(1)
  expect(c.hasFaq).toBe(true)
})

test("les entrées de liste incomplètes sont écartées, pas propagées vides", () => {
  const c = parseServiceContent({
    faq: [{ q: "Sans réponse" }, { q: "Q", a: "R" }, "n'importe quoi"],
  })
  expect(c.faq).toHaveLength(1)
  expect(c.faq[0].q).toBe("Q")
})

test("les drapeaux has* distinguent une section vide d'une section remplie", () => {
  const vide = parseServiceContent({})
  expect(vide.hasDefinition).toBe(false)
  expect(vide.hasWhy).toBe(false)
  expect(vide.hasIncludes).toBe(false)
  expect(vide.hasProcess).toBe(false)
  expect(vide.hasFaq).toBe(false)

  const rempli = parseServiceContent({
    definition: { body: "<p>Un site vitrine présente votre activité.</p>" },
    why: { problem: { title: "Vos clients ne vous trouvent pas", text: "…" } },
    includes: { items: [{ title: "Design sur mesure", text: "…" }] },
    process: { steps: [{ title: "Cadrage", text: "…" }] },
  })
  expect(rempli.hasDefinition).toBe(true)
  expect(rempli.hasWhy).toBe(true)
  expect(rempli.hasIncludes).toBe(true)
  expect(rempli.hasProcess).toBe(true)
})

test("les bénéfices vivent dans le temps « solution » du PASA", () => {
  const c = parseServiceContent({
    why: {
      solution: {
        title: "Un site pensé pour convertir",
        benefits: [
          { icon: "line-md:search-twotone", title: "Trouvable sur Google", text: "…" },
          { title: "Sans icône, valide quand même", text: "…" },
        ],
      },
    },
  })
  expect(c.why.solution.benefits).toHaveLength(2)
  expect(c.why.solution.benefits[1].icon).toBe("")
  expect(c.hasWhy).toBe(true)
})

test("toStored retire les drapeaux calculés avant écriture", () => {
  const c = parseServiceContent({ faq: [{ q: "Q", a: "R" }] })
  const stocke = toStored(c) as Record<string, unknown>

  expect(stocke.hasFaq).toBeUndefined()
  expect(stocke.hasWhy).toBeUndefined()
  expect(stocke.version).toBe(1)
  expect(stocke.faq).toHaveLength(1)
})

test("un aller-retour lecture -> écriture -> lecture ne perd rien", () => {
  const initial = {
    hero: { tagline: "Accroche", badges: ["Next.js"] },
    why: { solution: { title: "La réponse", benefits: [{ title: "Rapide", text: "…" }] } },
    process: { steps: [{ title: "Cadrage", text: "…" }] },
    faq: [{ q: "Q", a: "R" }],
  }
  const aller = parseServiceContent(initial)
  const retour = parseServiceContent(toStored(aller))

  expect(retour.hero.tagline).toBe("Accroche")
  expect(retour.hero.badges).toEqual(["Next.js"])
  expect(retour.why.solution.benefits).toHaveLength(1)
  expect(retour.process.steps[0].title).toBe("Cadrage")
  expect(retour.faq).toHaveLength(1)
  expect(retour.hasWhy).toBe(true)
})
