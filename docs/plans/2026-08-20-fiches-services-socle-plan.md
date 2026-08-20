# Plan A — Socle : données + rendu des fiches services

**Spec** : `docs/specs/2026-08-20-fiches-services-editables-design.md` (lots 1 et 2)
**Date** : 20 août 2026
**Prérequis** : lot 0 terminé — migrations 003 et 004 appliquées et vérifiées le 20/08

---

## Découpage en trois plans

La spec couvre trois sous-systèmes qui se testent et se livrent séparément :

| Plan | Périmètre | Effet visible |
| --- | --- | --- |
| **A — ce document** | Schéma de contenu, lecture en base avec repli, les 8 sections | Aucun : `content` est vide, chaque section s'efface |
| **B** | Back-office (liste + édition à onglets, 3 composants) | Le contenu devient saisissable |
| **C** | Contenu du service pilote, page article, JSON-LD | Les pages prennent leur forme finale |

**Conséquence importante du plan A** : tant que `content` reste vide en base, le site rend exactement ce qu'il rend aujourd'hui. Aucune régression n'est possible avant le plan C. C'est ce qui permet de livrer le socle sans risque.

---

## Stack et conventions

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4
- Validation : `zod` v4 (déjà installé)
- Tests : `@playwright/test` (déjà installé), utilisé pour **les tests unitaires ET de bout en bout**
- Aucune dépendance nouvelle
- Racine du projet : `C:\Users\Call Connect\desktop\antigravity\jp\portfolio`

### Stratégie de test

Tester chaque composant de présentation isolément apporterait peu ici : ce sont des fonctions pures de leurs props, sans logique. L'effort porte donc là où le risque est réel :

1. **Unitaire** — `parseServiceContent` : un JSON absent, partiel ou malformé ne doit **jamais** lever d'exception. C'est la garantie qui rend le rendu conditionnel sûr.
2. **Bout en bout** — invariants de page, vrais garde-fous de non-régression, valables quel que soit le contenu :
   - exactement **un** `<h1>`
   - **aucun saut de niveau** dans la hiérarchie Hn (contrainte § 11.3 de la spec)
   - aucun débordement horizontal en 390 et 1280 px
   - aucune réponse HTTP ≥ 400

---

## Fichiers

```
Create:  tests/unit/service-content.spec.ts
Create:  tests/e2e/service-page.spec.ts
Create:  lib/service-content.ts
Create:  components/services/ServiceHero.tsx
Create:  components/services/ServiceDefinition.tsx
Create:  components/services/ServiceWhy.tsx
Create:  components/services/ServiceIncludes.tsx
Create:  components/services/ServiceProcess.tsx
Create:  components/services/ServicePricing.tsx
Create:  components/services/ServiceFaq.tsx
Create:  components/services/RelatedServices.tsx

Modify:  playwright.config.ts          (testDir, webServer)
Modify:  package.json                  (scripts test)
Modify:  lib/supabase-data.ts          (getService, getServiceSlugs)
Modify:  types/portfolio.ts            (champ content)
Modify:  app/(public)/services/[slug]/page.tsx

Delete:  Playwright tests/example.spec.ts
Rename:  "Playwright tests/" -> tests/
```

---

## Tâche 0 — Harnais de test

> Le dossier `Playwright tests` contient une espace, ce qui casse les commandes CLI qui le ciblent (constat SEC-09 de l'audit). Aucun script `test` n'existe, et la config ne démarre pas le serveur.

### 0.1 Renommer le dossier

```bash
cd "C:/Users/Call Connect/desktop/antigravity/jp/portfolio"
mkdir -p tests/unit tests/e2e
rm -f "Playwright tests/example.spec.ts"
rmdir "Playwright tests"
```

### 0.2 `playwright.config.ts`

Remplacer `testDir` et ajouter un `webServer` — sans lui, chaque test suppose un serveur lancé à la main :

```ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  // Port dédié : n'entre pas en conflit avec un `npm run dev` déjà ouvert.
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
```

### 0.3 `package.json`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "playwright test",
  "test:unit": "playwright test tests/unit",
  "test:e2e": "playwright test tests/e2e"
}
```

### 0.4 Vérifier

```bash
npx playwright test --list
```
Attendu : `Total: 0 tests` sans erreur de configuration.

### 0.5 Commit

```bash
git add -A -- tests playwright.config.ts package.json ':!Playwright tests'
git commit -m "chore(test): harnais Playwright — dossier sans espace, webServer, scripts"
```

---

## Tâche 1 — Schéma de contenu (TDD)

### 1.1 Écrire le test — `tests/unit/service-content.spec.ts`

```ts
import { test, expect } from '@playwright/test'
import { parseServiceContent } from '../../lib/service-content'

test('un contenu absent ne lève pas et renvoie un document vide', () => {
  const c = parseServiceContent(undefined)
  expect(c.version).toBe(1)
  expect(c.faq).toEqual([])
  expect(c.why.problem.text).toBe('')
})

test('un contenu malformé retombe sur les valeurs par défaut', () => {
  expect(() => parseServiceContent('pas un objet')).not.toThrow()
  expect(() => parseServiceContent([1, 2, 3])).not.toThrow()
  expect(parseServiceContent({ faq: 'cassé' }).faq).toEqual([])
})

test('un contenu partiel conserve ce qui est valide', () => {
  const c = parseServiceContent({
    hero: { tagline: 'Mon accroche' },
    faq: [{ q: 'Combien ça coûte ?', a: 'À partir de 150 000 XOF.' }],
  })
  expect(c.hero.tagline).toBe('Mon accroche')
  expect(c.hero.badges).toEqual([])
  expect(c.faq).toHaveLength(1)
})

test('les entrées de liste incomplètes sont écartées, pas propagées vides', () => {
  const c = parseServiceContent({ faq: [{ q: 'Sans réponse' }, { q: 'Q', a: 'R' }] })
  expect(c.faq).toHaveLength(1)
})

test('hasContent distingue une section vide d’une section remplie', () => {
  const vide = parseServiceContent({})
  expect(vide.hasDefinition).toBe(false)
  expect(vide.hasWhy).toBe(false)
})
```

### 1.2 Vérifier l'échec

```bash
npm run test:unit
```
Attendu : échec à l'import — `lib/service-content` n'existe pas encore.

### 1.3 Implémenter — `lib/service-content.ts`

Schéma zod avec `.catch()` sur **chaque** branche : c'est ce qui garantit qu'aucune forme inattendue ne remonte une exception.

```ts
import { z } from "zod"

const txt = z.string().catch("")

const bloc = z.object({ title: txt, text: txt }).catch({ title: "", text: "" })

const carte = z.object({ icon: txt, title: z.string().min(1), text: txt })

// Une liste dont chaque entrée invalide est écartée plutôt que de faire
// échouer la liste entière.
const liste = <T extends z.ZodTypeAny>(item: T) =>
  z.array(z.unknown())
    .catch([])
    .transform((arr) => arr.flatMap((v) => {
      const r = item.safeParse(v)
      return r.success ? [r.data] : []
    }))

const schema = z.object({
  version: z.number().catch(1),
  hero: z.object({ tagline: txt, badges: liste(z.string().min(1)) })
    .catch({ tagline: "", badges: [] }),
  definition: z.object({ title: txt, body: txt, highlight: txt })
    .catch({ title: "", body: "", highlight: "" }),
  why: z.object({
    title: txt,
    problem: bloc,
    aggravation: bloc,
    solution: z.object({ title: txt, text: txt, benefits: liste(carte) })
      .catch({ title: "", text: "", benefits: [] }),
    action: z.object({ title: txt, text: txt, ctaLabel: txt })
      .catch({ title: "", text: "", ctaLabel: "" }),
  }).catch({ /* … valeurs vides … */ }),
  includes: z.object({ title: txt, items: liste(carte) }).catch({ title: "", items: [] }),
  process: z.object({ title: txt, steps: liste(z.object({ title: z.string().min(1), text: txt })) })
    .catch({ title: "", steps: [] }),
  pricing: z.object({ intro: txt, factors: liste(z.string().min(1)) })
    .catch({ intro: "", factors: [] }),
  faq: liste(z.object({ q: z.string().min(1), a: z.string().min(1) })),
})

export type ServiceContent = z.infer<typeof schema> & {
  hasDefinition: boolean
  hasWhy: boolean
  hasIncludes: boolean
  hasProcess: boolean
  hasFaq: boolean
}

export function parseServiceContent(raw: unknown): ServiceContent {
  const base = schema.parse(
    raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
  )
  return {
    ...base,
    hasDefinition: Boolean(base.definition.body || base.definition.title),
    hasWhy: [base.why.problem, base.why.aggravation, base.why.solution, base.why.action]
      .some((b) => b.text || b.title),
    hasIncludes: base.includes.items.length > 0,
    hasProcess: base.process.steps.length > 0,
    hasFaq: base.faq.length > 0,
  }
}
```

### 1.4 Vérifier le succès

```bash
npm run test:unit
```
Attendu : 5 tests au vert.

### 1.5 Commit

```bash
git add lib/service-content.ts tests/unit/service-content.spec.ts
git commit -m "feat(services): schema de contenu tolerant aux documents partiels"
```

---

## Tâche 2 — Lecture en base avec repli

### 2.1 Étendre le type — `types/portfolio.ts`

```ts
export interface Service {
  // … champs existants …
  content?: unknown   // brut : la validation se fait via parseServiceContent
}
```

### 2.2 `lib/supabase-data.ts`

```ts
export async function getService(slug: string): Promise<Service | null> {
  try {
    const { data } = await client()
      .from("services").select("*").eq("slug", slug).maybeSingle()
    if (data) return data as Service
  } catch { /* repli ci-dessous */ }
  // Repli fichier : le site ne dépend jamais de la disponibilité de Supabase.
  return SERVICES.find((s) => serviceSlug(s) === slug) ?? null
}

export async function getServiceSlugs(): Promise<string[]> {
  try {
    const { data } = await client().from("services").select("slug").eq("visible", true)
    const slugs = (data ?? []).map((r) => r.slug).filter(Boolean) as string[]
    if (slugs.length) return slugs
  } catch { /* repli ci-dessous */ }
  return SERVICES.filter((s) => s.visible).map(serviceSlug)
}
```

### 2.3 Test de repli — ajouter à `tests/e2e/service-page.spec.ts`

Vérifie qu'une base injoignable ne casse pas la page : on route les appels Supabase vers l'échec et la fiche doit continuer de s'afficher.

```ts
test('la fiche survit à une base injoignable', async ({ page }) => {
  await page.route('**/*.supabase.co/**', (r) => r.abort())
  const res = await page.goto('/services/creation-de-sites-web-sur-mesure')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('Création de sites web')
})
```

### 2.4 Vérifier puis commiter

```bash
npm run test:e2e
git add lib/supabase-data.ts types/portfolio.ts tests/e2e/service-page.spec.ts
git commit -m "feat(services): getService lit la base avec repli sur le fichier"
```

---

## Tâche 3 — Invariants de page (le filet de sécurité)

Ces tests sont écrits **avant** les composants : ils doivent rester verts pendant toute la refonte. Un saut de niveau Hn ou un second `<h1>` les fait échouer immédiatement.

### 3.1 `tests/e2e/service-page.spec.ts`

```ts
import { test, expect } from '@playwright/test'

const SLUGS = [
  'creation-de-sites-web-sur-mesure',
  'optimisation-seo-visibilite-google',
  'maintenance-support-wordpress',
  'automatisation-optimisation-digitale',
]

for (const slug of SLUGS) {
  test(`${slug} — un seul h1`, async ({ page }) => {
    await page.goto(`/services/${slug}`)
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test(`${slug} — hiérarchie Hn sans saut de niveau`, async ({ page }) => {
    await page.goto(`/services/${slug}`)
    const niveaux = await page.locator('h1,h2,h3,h4').evaluateAll(
      (els) => els.map((e) => Number(e.tagName[1]))
    )
    for (let i = 1; i < niveaux.length; i++) {
      expect(niveaux[i] - niveaux[i - 1]).toBeLessThanOrEqual(1)
    }
  })

  test(`${slug} — pas de débordement horizontal en 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/services/${slug}`)
    const debordement = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(debordement).toBe(0)
  })
}

test('un slug inconnu renvoie 404', async ({ page }) => {
  const res = await page.goto('/services/slug-qui-nexiste-pas')
  expect(res?.status()).toBe(404)
})
```

### 3.2 Vérifier, puis commiter

```bash
npm run test:e2e
git add tests/e2e/service-page.spec.ts
git commit -m "test(services): invariants de page — h1 unique, hierarchie Hn, responsive"
```

---

## Tâches 4 à 11 — Les composants de section

Chaque composant suit le même moule. Ils ne portent aucune logique : la décision d'affichage vient des drapeaux `has*` de la tâche 1.

| # | Composant | Émet | Rend `null` si |
| --- | --- | --- | --- |
| 4 | `ServiceHero` | **`<h1>`** (le seul) | jamais |
| 5 | `ServiceDefinition` | `<h2>` | `!hasDefinition` |
| 6 | `ServiceWhy` | `<h2>` + `<h3>` par temps et par bénéfice | `!hasWhy` |
| 7 | `ServiceIncludes` | `<h2>` + `<h3>` par carte | `!hasIncludes` |
| 8 | `ServiceProcess` | `<h2>` + `<h3>` par étape | `!hasProcess` |
| 9 | `ServicePricing` | `<h2>` + `<h3>` par offre | pas d'offre |
| 10 | `ServiceFaq` | `<h2>` + `<h3>` dans `<summary>` | `!hasFaq` |
| 11 | `RelatedServices` | `<h2>` | moins de 2 services |

Pour chacune : écrire le composant, lancer `npm run test:e2e` (les invariants de la tâche 3 doivent rester verts), commiter.

**Point de vigilance sur la tâche 4** : `ServiceHero` remplace `ServiceBanner`. Vérifier qu'aucun autre composant n'émet de `<h1>` — le test de la tâche 3.1 le détecte, mais autant le savoir en écrivant.

**Point de vigilance sur la tâche 10** : accordéon en `<details>`/`<summary>` natif. Le `<h3>` va **dans** le `<summary>`, pas autour — sinon la hiérarchie casse.

---

## Tâche 12 — Assemblage de la page

`app/(public)/services/[slug]/page.tsx` : remplacer le corps par la suite des 8 sections, alimenté par `getService()` et `parseServiceContent()`.

`generateStaticParams` passe à `getServiceSlugs()` — sans quoi un service créé depuis le back-office ne serait jamais prérendu.

### Vérification finale du plan A

```bash
npx tsc --noEmit
npx eslint components/services "app/(public)/services" lib
npm run build
npm test
```

Puis contrôle visuel : la page doit être **identique à aujourd'hui**, `content` étant vide. C'est le critère de réussite du plan A.

```bash
git commit -m "feat(services): assemblage des 8 sections avec rendu conditionnel"
```

---

## Ce que le plan A ne fait pas

- Aucun écran de back-office → plan B
- Aucun contenu rédigé → plan C
- La page article n'est pas touchée → plan C
- Aucun JSON-LD → plan C
- `long_description` reste rendue telle quelle, **étiquettes PASA visibles comprises** : elles ne disparaîtront qu'au plan C, quand le contenu sera repris dans `content.why`

---

## Validation demandée

1. Le découpage en **trois plans** te convient-il, en commençant par ce socle sans effet visible ?
2. La stratégie de test — unitaire sur la validation, invariants de page en e2e plutôt qu'un test par composant — te va-t-elle ?
3. Je commence par la **tâche 0** (harnais de test), qui renomme `Playwright tests/` en `tests/` et supprime `example.spec.ts` : c'est bien ce que tu veux ?
