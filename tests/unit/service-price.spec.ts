import { test, expect } from "@playwright/test"
import { fromPrice } from "../../lib/service-price"
import type { Offer } from "../../types/portfolio"

const offre = (o: Partial<Offer>): Offer =>
  ({ id: "x", name: "Pack", description: "", duration_days: 7, ...o }) as Offer

// Intl.NumberFormat("fr-FR") sépare les milliers par une ESPACE FINE
// INSÉCABLE (U+202F), pas par une espace ordinaire — c'est la typographie
// française correcte. Les tests la nomment explicitement plutôt que de
// coller un caractère invisible dans une chaîne littérale.
const FINE = " "

test("prend le plus bas des price_min", () => {
  expect(
    fromPrice([
      offre({ price_min: 400000, currency: "XOF" }),
      offre({ price_min: 150000, currency: "XOF" }),
      offre({ price_min: 1200000, currency: "XOF" }),
    ])
  ).toBe(`À partir de 150${FINE}000 XOF`)
})

test("renvoie null sans offre — le hero n'affiche alors aucun prix", () => {
  expect(fromPrice([])).toBeNull()
  expect(fromPrice(undefined)).toBeNull()
  expect(fromPrice(null)).toBeNull()
})

test("ignore les offres sans price_min exploitable", () => {
  expect(fromPrice([offre({}), offre({ price_min: 0 })])).toBeNull()
  expect(
    fromPrice([offre({}), offre({ price_min: 90000, currency: "XOF" })])
  ).toBe(`À partir de 90${FINE}000 XOF`)
})

test("retombe sur XOF quand la devise manque", () => {
  expect(fromPrice([offre({ price_min: 50000 })])).toBe(
    `À partir de 50${FINE}000 XOF`
  )
})

test("ne sépare jamais les milliers par une virgule", () => {
  const r = fromPrice([offre({ price_min: 1200000, currency: "XOF" })])
  expect(r).not.toContain(",")
  expect(r).toBe(`À partir de 1${FINE}200${FINE}000 XOF`)
})
