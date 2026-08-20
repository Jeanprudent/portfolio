import { defineConfig } from "@playwright/test"

/**
 * Tests de logique pure — aucun navigateur, aucun serveur.
 *
 * Playwright sert ici de simple lanceur de tests : le projet n'a pas de
 * runner unitaire dédié, et en ajouter un (vitest, jest) pour quelques
 * fonctions pures serait une dépendance de plus à maintenir.
 */
export default defineConfig({
  testDir: "./tests/unit",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "html" : "list",
})
