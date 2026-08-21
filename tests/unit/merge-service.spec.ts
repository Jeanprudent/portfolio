import { test, expect } from "@playwright/test"
import { mergeService } from "../../lib/merge-service"
import type { Service } from "../../types/portfolio"

const local = {
  id: "1",
  title: "Création de sites web sur mesure",
  slug: "creation-de-sites-web-sur-mesure",
  description: "Description du fichier",
  long_description: "Texte long du fichier",
  icon: "line-md:laptop-twotone",
  order_index: 0,
  visible: true,
  offers: [
    { id: "o1", name: "Pack Starter", description: "", duration_days: 7, price_min: 150000 },
  ],
} as Service

test("la base fait autorité sur les champs qu'elle renseigne", () => {
  const r = mergeService(local, {
    ...local,
    description: "Description de la base",
  } as Service)
  expect(r.description).toBe("Description de la base")
})

test("un tableau vide en base ne doit PAS écraser les offres du fichier", () => {
  // Régression constatée le 21/08 : la migration 003 crée `offers` avec la
  // valeur par défaut '[]'. Un filtre qui n'écarte que null/undefined
  // laissait ce tableau vide gagner, et la section Tarifs disparaissait.
  const r = mergeService(local, { ...local, offers: [] } as Service)
  expect(r.offers).toHaveLength(1)
  expect(r.offers?.[0].name).toBe("Pack Starter")
})

test("un tableau rempli en base gagne bien", () => {
  const r = mergeService(local, {
    ...local,
    offers: [
      { id: "b1", name: "Pack de la base", description: "", duration_days: 3 },
      { id: "b2", name: "Autre", description: "", duration_days: 5 },
    ],
  } as Service)
  expect(r.offers).toHaveLength(2)
  expect(r.offers?.[0].name).toBe("Pack de la base")
})

test("une chaîne vide en base ne doit pas écraser le fichier", () => {
  const r = mergeService(local, { ...local, long_description: "" } as Service)
  expect(r.long_description).toBe("Texte long du fichier")
})

test("null et undefined en base sont ignorés", () => {
  const r = mergeService(local, {
    ...local,
    long_description: null,
    banner: undefined,
  } as unknown as Service)
  expect(r.long_description).toBe("Texte long du fichier")
})

test("false et 0 restent des valeurs légitimes, jamais écartées", () => {
  const r = mergeService(local, {
    ...local,
    visible: false,
    order_index: 0,
  } as Service)
  expect(r.visible).toBe(false)
  expect(r.order_index).toBe(0)
})

test("sans équivalent local, la base est renvoyée telle quelle", () => {
  const distant = { ...local, id: "99", title: "Service créé au back-office" } as Service
  expect(mergeService(null, distant).title).toBe("Service créé au back-office")
})
