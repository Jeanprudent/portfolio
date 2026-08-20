import { defineConfig, devices } from "@playwright/test"

/**
 * Tests de bout en bout : invariants de page dans un vrai navigateur.
 *
 * Les tests de logique pure vivent dans tests/unit et utilisent
 * playwright.unit.config.ts, qui ne démarre pas Next — inutile de payer
 * 30 secondes de compilation pour valider un schéma zod.
 *
 * Voir docs/plans/2026-08-20-fiches-services-socle-plan.md § Stratégie de test.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // 'list' en local : le rapport HTML ouvre un serveur qui bloque le terminal.
  reporter: process.env.CI ? "html" : "list",

  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },

  // Port dédié 3100 : les tests n'entrent pas en conflit avec un
  // `npm run dev` déjà ouvert sur 3000.
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
