import { test, expect } from "@playwright/test"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Vérifie que chaque nom d'icône Iconify référencé dans le code existe
 * réellement.
 *
 * Pourquoi ce test : un nom inexistant ne produit AUCUNE erreur. Iconify
 * renvoie simplement du vide, et l'icône disparaît en silence. Le problème
 * s'est manifesté trois fois — pastille de service vide, bascule de
 * visibilité invisible dans le back-office, étoiles vides des témoignages
 * absentes — sans jamais laisser de trace en console ni casser un build.
 *
 * Le test interroge l'API Iconify. S'il n'y a pas de réseau, il est ignoré
 * plutôt que de faire échouer la suite pour une raison sans rapport.
 */

const RACINE = join(__dirname, "..", "..")
const DOSSIERS = ["app", "components", "data", "lib"]
const IGNORES = new Set(["node_modules", ".next", "test-results"])

function fichiers(dir: string): string[] {
  const out: string[] = []
  for (const nom of readdirSync(dir)) {
    if (IGNORES.has(nom)) continue
    const chemin = join(dir, nom)
    if (statSync(chemin).isDirectory()) out.push(...fichiers(chemin))
    else if (/\.tsx?$/.test(chemin)) out.push(chemin)
  }
  return out
}

function nomsUtilises(): Map<string, string[]> {
  // Préfixes réellement employés dans le projet. Restreindre évite de
  // confondre un nom d'icône avec une classe Tailwind ou une pseudo-URL.
  const PREFIXES = ["line-md", "logos", "simple-icons", "prime", "ant-design"]
  const motif = new RegExp(`"(${PREFIXES.join("|")}):([a-z0-9-]+)"`, "g")

  const trouves = new Map<string, string[]>()
  for (const dossier of DOSSIERS) {
    for (const f of fichiers(join(RACINE, dossier))) {
      const src = readFileSync(f, "utf8")
      for (const m of src.matchAll(motif)) {
        const nom = `${m[1]}:${m[2]}`
        trouves.set(nom, [...(trouves.get(nom) ?? []), f.replace(RACINE, "")])
      }
    }
  }
  return trouves
}

test("toutes les icônes référencées existent chez Iconify", async () => {
  test.setTimeout(60_000)

  const utilisees = nomsUtilises()
  expect(utilisees.size, "aucune icône trouvée — le motif de détection est cassé").toBeGreaterThan(10)

  const parPrefixe = new Map<string, string[]>()
  for (const nom of utilisees.keys()) {
    const [prefixe, icone] = nom.split(":")
    parPrefixe.set(prefixe, [...(parPrefixe.get(prefixe) ?? []), icone])
  }

  const introuvables: string[] = []
  for (const [prefixe, icones] of parPrefixe) {
    let data: { not_found?: string[] }
    try {
      const res = await fetch(
        `https://api.iconify.design/${prefixe}.json?icons=${icones.join(",")}`
      )
      data = await res.json()
    } catch {
      test.skip(true, "API Iconify injoignable — vérification ignorée")
      return
    }
    for (const manquante of data.not_found ?? []) {
      const nom = `${prefixe}:${manquante}`
      introuvables.push(`${nom}  (${utilisees.get(nom)?.join(", ")})`)
    }
  }

  expect(
    introuvables,
    `Ces icônes n'existent pas et s'afficheront vides, sans aucune erreur :\n  ${introuvables.join("\n  ")}`
  ).toEqual([])
})
