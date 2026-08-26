import { test, expect } from "@playwright/test"
import { absoluteUrl, SITE_URL } from "../../lib/site"

test("un chemin relatif est préfixé par l'URL du site", () => {
  expect(absoluteUrl("/services")).toBe(`${SITE_URL}/services`)
  expect(absoluteUrl("services")).toBe(`${SITE_URL}/services`)
  expect(absoluteUrl()).toBe(`${SITE_URL}/`)
})

test("une URL déjà absolue est renvoyée telle quelle", () => {
  // Sans ce garde, une couverture d'article hébergée ailleurs produisait
  // « https://mon-site.com/https://autre-site.com/img.jpg » dans le JSON-LD.
  const externe = "https://www.exemple.com/wp-content/uploads/photo.jpg"
  expect(absoluteUrl(externe)).toBe(externe)
  expect(absoluteUrl("http://exemple.com/x.png")).toBe("http://exemple.com/x.png")
})

test("l'URL du site ne se termine jamais par une barre oblique", () => {
  expect(SITE_URL.endsWith("/")).toBe(false)
})
