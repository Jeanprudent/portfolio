import { test, expect } from "@playwright/test"

/**
 * Invariants de la page article, alignée sur le gabarit des fiches services.
 *
 * Les mêmes contrôles que service-page.spec.ts, plus la vérification du
 * JSON-LD. Le slug est découvert depuis /blog : le figer dans le test le
 * rendrait faux dès que l'article est renommé depuis le back-office — c'est
 * exactement ce qui m'a fait diagnostiquer un faux 404 le 21/08.
 */

async function premierArticle(page: import("@playwright/test").Page) {
  await page.goto("/blog")
  const lien = page.locator('a[href^="/blog/"]').first()
  await expect(lien, "aucun article publié : le test ne peut rien vérifier").toHaveCount(1)
  return (await lien.getAttribute("href")) as string
}

test("l'article répond 200 et sert son JSON-LD", async ({ page }) => {
  const url = await premierArticle(page)
  const res = await page.goto(url)
  expect(res?.status()).toBe(200)

  const types = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) =>
      els.map((e) => {
        try {
          return JSON.parse(e.textContent ?? "{}")["@type"]
        } catch {
          return "JSON_INVALIDE"
        }
      })
    )
  expect(types).toContain("BlogPosting")
  expect(types).toContain("BreadcrumbList")
  expect(types).not.toContain("JSON_INVALIDE")
})

test("l'article n'a qu'un seul h1", async ({ page }) => {
  const url = await premierArticle(page)
  await page.goto(url)
  await expect(page.locator("h1")).toHaveCount(1)
})

test("la hiérarchie Hn de l'article ne saute pas de niveau", async ({ page }) => {
  const url = await premierArticle(page)
  await page.goto(url)
  const niveaux = await page
    .locator("h1,h2,h3,h4,h5,h6")
    .evaluateAll((els) => els.map((e) => Number(e.tagName[1])))

  expect(niveaux[0]).toBe(1)
  for (let i = 1; i < niveaux.length; i++) {
    expect(
      niveaux[i] - niveaux[i - 1],
      `saut de h${niveaux[i - 1]} à h${niveaux[i]} (titre n°${i + 1})`
    ).toBeLessThanOrEqual(1)
  }
})

test("une couverture hébergée hors Supabase ne fait pas tomber la page", async ({ page }) => {
  // Régression du 21/08 : next/image lève sur un hôte absent de
  // remotePatterns, et la page répond 500 au lieu d'ignorer l'image.
  // Les couvertures étant des URL saisies à la main, l'hôte est imprévisible.
  const url = await premierArticle(page)
  const res = await page.goto(url)
  expect(res?.status()).toBe(200)
  await expect(page.locator("h1")).toBeVisible()
})

test("l'article ne déborde pas horizontalement en 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const url = await premierArticle(page)
  await page.goto(url)
  const debordement = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(debordement).toBe(0)
})

test("un slug d'article inconnu renvoie un vrai 404", async ({ page }) => {
  const res = await page.goto("/blog/article-qui-nexiste-pas")
  expect(res?.status()).toBe(404)
})
