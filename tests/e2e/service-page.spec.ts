import { test, expect } from "@playwright/test"

/**
 * Invariants des fiches services.
 *
 * Ces tests sont écrits AVANT la refonte en 8 sections et doivent rester
 * verts pendant toute sa durée. Avec des titres imbriqués sur huit niveaux
 * de section, la hiérarchie Hn et l'unicité du h1 sont exactement ce qui
 * casse en premier — et ce que personne ne voit à l'œil nu.
 */

const SLUGS = [
  "creation-de-sites-web-sur-mesure",
  "optimisation-seo-visibilite-google",
  "maintenance-support-wordpress",
  "automatisation-optimisation-digitale",
]

for (const slug of SLUGS) {
  test.describe(slug, () => {
    test("répond 200", async ({ page }) => {
      const res = await page.goto(`/services/${slug}`)
      expect(res?.status()).toBe(200)
    })

    test("n'a qu'un seul h1", async ({ page }) => {
      await page.goto(`/services/${slug}`)
      await expect(page.locator("h1")).toHaveCount(1)
    })

    test("garde une hiérarchie Hn sans saut de niveau", async ({ page }) => {
      await page.goto(`/services/${slug}`)
      const niveaux = await page
        .locator("h1,h2,h3,h4,h5,h6")
        .evaluateAll((els) => els.map((e) => Number(e.tagName[1])))

      expect(niveaux[0]).toBe(1) // la page commence par son h1

      for (let i = 1; i < niveaux.length; i++) {
        // Descendre d'un cran à la fois ; remonter de plusieurs est permis.
        expect(
          niveaux[i] - niveaux[i - 1],
          `saut de h${niveaux[i - 1]} à h${niveaux[i]} (titre n°${i + 1})`
        ).toBeLessThanOrEqual(1)
      }
    })

    test("ne déborde pas horizontalement en 390 px", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/services/${slug}`)
      const debordement = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      )
      expect(debordement).toBe(0)
    })

    test("ne déborde pas horizontalement en 1280 px", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto(`/services/${slug}`)
      const debordement = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      )
      expect(debordement).toBe(0)
    })

    test("ne renvoie aucune ressource en erreur", async ({ page }) => {
      const echecs: string[] = []
      page.on("response", (r) => {
        // Les appels Supabase en 4xx sont hors du périmètre de la page.
        if (r.status() >= 400 && !r.url().includes("supabase.co")) {
          echecs.push(`${r.status()} ${r.url()}`)
        }
      })
      await page.goto(`/services/${slug}`, { waitUntil: "networkidle" })
      expect(echecs).toEqual([])
    })
  })
}

test("un slug inconnu renvoie un vrai 404", async ({ page }) => {
  const res = await page.goto("/services/slug-qui-nexiste-pas")
  expect(res?.status()).toBe(404)
})

test("la fiche survit à une base injoignable", async ({ page }) => {
  // Le repli sur data/portfolio-data.ts n'avait jamais été vérifié.
  await page.route("**/*.supabase.co/**", (route) => route.abort())

  const res = await page.goto("/services/creation-de-sites-web-sur-mesure")
  expect(res?.status()).toBe(200)
  await expect(page.locator("h1")).toContainText("Création de sites web")
})
