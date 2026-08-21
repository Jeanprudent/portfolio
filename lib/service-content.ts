import { z } from "zod"

/**
 * Contenu structuré d'une fiche service, stocké dans la colonne `content`
 * (jsonb) de la table `services` — voir migration 004.
 *
 * Principe directeur : la base ne valide pas la forme du JSON, cette
 * fonction s'en charge. Elle ne doit JAMAIS lever, quelle que soit la
 * donnée reçue — un document absent, tronqué ou corrompu doit produire un
 * document vide, pas une page en erreur. Les drapeaux `has*` permettent
 * ensuite à chaque section de s'effacer proprement.
 */

const txt = z.string().catch("")

const blocVide = { title: "", text: "" }
const bloc = z.object({ title: txt, text: txt }).catch(blocVide)

// `title` est obligatoire : une carte sans titre n'a rien à afficher, on
// l'écarte plutôt que de rendre un cadre vide.
const carte = z.object({ icon: txt, title: z.string().min(1), text: txt })

/**
 * Liste tolérante : une entrée invalide est écartée au lieu de faire échouer
 * la liste entière. Une FAQ dont la 3e question est incomplète garde ses
 * deux premières.
 */
const liste = <T extends z.ZodTypeAny>(item: T) =>
  z
    .array(z.unknown())
    .catch([])
    .transform((arr) =>
      arr.flatMap((v) => {
        const r = item.safeParse(v)
        return r.success ? [r.data as z.infer<T>] : []
      })
    )

const solutionVide = { title: "", text: "", benefits: [] }
const actionVide = { title: "", text: "", ctaLabel: "" }
const whyVide = {
  title: "",
  problem: blocVide,
  aggravation: blocVide,
  solution: solutionVide,
  action: actionVide,
}

const schema = z.object({
  version: z.number().catch(1),

  hero: z
    .object({ tagline: txt, badges: liste(z.string().min(1)) })
    .catch({ tagline: "", badges: [] }),

  definition: z
    .object({ title: txt, body: txt, highlight: txt })
    .catch({ title: "", body: "", highlight: "" }),

  /**
   * Argumentaire PASA. Les clés nomment le rôle de chaque temps pour guider
   * la rédaction dans le back-office ; elles ne sont jamais rendues côté
   * visiteur, chaque temps portant son propre `title`.
   * Les bénéfices illustrent le temps « solution » — ils ne forment pas
   * une section à part.
   */
  why: z
    .object({
      title: txt,
      problem: bloc,
      aggravation: bloc,
      solution: z
        .object({ title: txt, text: txt, benefits: liste(carte) })
        .catch(solutionVide),
      action: z
        .object({ title: txt, text: txt, ctaLabel: txt })
        .catch(actionVide),
    })
    .catch(whyVide),

  includes: z
    .object({ title: txt, items: liste(carte) })
    .catch({ title: "", items: [] }),

  process: z
    .object({
      title: txt,
      steps: liste(z.object({ title: z.string().min(1), text: txt })),
    })
    .catch({ title: "", steps: [] }),

  pricing: z
    .object({ intro: txt, factors: liste(z.string().min(1)) })
    .catch({ intro: "", factors: [] }),

  faq: liste(z.object({ q: z.string().min(1), a: z.string().min(1) })),
})

type ServiceContentBase = z.infer<typeof schema>

export type ServiceContent = ServiceContentBase & {
  hasDefinition: boolean
  hasWhy: boolean
  hasIncludes: boolean
  hasProcess: boolean
  hasFaq: boolean
}

/**
 * Retire les drapeaux `has*` avant écriture en base.
 *
 * Ils sont DÉDUITS du contenu à chaque lecture : les persister créerait une
 * seconde source de vérité, fatalement désynchronisée dès qu'un champ change
 * par un autre chemin (SQL direct, import).
 */
export function toStored(c: ServiceContent): ServiceContentBase {
  // Sélection explicite plutôt que déstructuration à rebut : le jour où une
  // section s'ajoute, oublier de la lister ici se voit tout de suite.
  return {
    version: c.version,
    hero: c.hero,
    definition: c.definition,
    why: c.why,
    includes: c.includes,
    process: c.process,
    pricing: c.pricing,
    faq: c.faq,
  }
}

const rempli = (b: { title: string; text: string }) => Boolean(b.title || b.text)

export function parseServiceContent(raw: unknown): ServiceContent {
  // Un tableau ou un scalaire n'a rien à faire ici : on repart d'un objet
  // vide, que le schéma peuplera entièrement de valeurs par défaut.
  const objet =
    raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}

  const base = schema.parse(objet)

  return {
    ...base,
    hasDefinition: Boolean(base.definition.body || base.definition.title),
    hasWhy:
      rempli(base.why.problem) ||
      rempli(base.why.aggravation) ||
      rempli(base.why.solution) ||
      rempli(base.why.action) ||
      base.why.solution.benefits.length > 0,
    hasIncludes: base.includes.items.length > 0,
    hasProcess: base.process.steps.length > 0,
    hasFaq: base.faq.length > 0,
  }
}
