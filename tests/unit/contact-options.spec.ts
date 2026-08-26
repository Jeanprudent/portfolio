import { test, expect } from "@playwright/test"
import { besoinLabel, besoinPourService, BESOIN_VALUES } from "../../lib/contact-options"

/**
 * La pré-sélection du besoin dans le modal de devis se déduit du service
 * consulté. Elle doit tenir même si le titre d'une fiche est reformulé
 * depuis le back-office.
 */

test("les quatre services du site tombent dans la bonne case", () => {
  expect(besoinPourService("creation-de-sites-web-sur-mesure")).toBe("site-web")
  expect(besoinPourService("optimisation-seo-visibilite-google")).toBe("seo")
  expect(besoinPourService("automatisation-optimisation-digitale")).toBe("automatisation-ia")
  expect(besoinPourService("maintenance-support-wordpress")).toBe("autre")
})

test("le titre complet donne le même résultat que le slug", () => {
  expect(besoinPourService("Création de sites web sur mesure")).toBe("site-web")
  expect(besoinPourService("Optimisation SEO & visibilité Google")).toBe("seo")
  expect(besoinPourService("Automatisation & optimisation digitale")).toBe("automatisation-ia")
  expect(besoinPourService("Maintenance & support WordPress")).toBe("autre")
})

test("la maintenance ne se fait pas happer par « web »", () => {
  // « Maintenance de site web WordPress » contient « site » et « web » :
  // sans le garde placé en tête, elle basculerait en « site-web ».
  expect(besoinPourService("Maintenance de site web WordPress")).toBe("autre")
})

test("« optimisation » seul ne bascule pas en automatisation", () => {
  // Le mot apparaît dans deux titres sur quatre — c'est « automatis » qui
  // décide, pas « optimisation ».
  expect(besoinPourService("Optimisation du référencement local")).toBe("seo")
})

test("un titre inconnu retombe sur « autre », jamais sur undefined", () => {
  const valeur = besoinPourService("Prestation inclassable")
  expect(valeur).toBe("autre")
  expect(BESOIN_VALUES).toContain(valeur)
})

test("le résultat est toujours une valeur acceptée par l'API", () => {
  for (const titre of ["", "SEO", "IA", "site", "wordpress", "n8n", "???"]) {
    expect(BESOIN_VALUES, `« ${titre} »`).toContain(besoinPourService(titre))
  }
})

test("besoinLabel rend un libellé lisible, et laisse passer l'inconnu", () => {
  expect(besoinLabel("seo")).toBe("Je veux optimiser le SEO de mon site web")
  expect(besoinLabel("inexistant")).toBe("inexistant")
})
