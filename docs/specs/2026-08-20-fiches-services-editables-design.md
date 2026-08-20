# Fiches services éditables + refonte de structure

**Date** : 20 août 2026
**Statut** : en attente de validation
**Périmètre** : pages `/services/[slug]`, page `/blog/[slug]`, back-office `/gestion/services`

---

## 1. Objectif

Trois demandes liées :

1. Rendre **tout** le contenu des fiches services éditable depuis `/gestion` (aujourd'hui : titre, description et icône seulement).
2. Restructurer les fiches sur le modèle de `bendavakan.com/services/site-vitrine`, réduit à un **socle de 8 sections** valable pour les 4 services.
3. Aligner la page d'un **article de blog** sur la structure *actuelle* des fiches services (bannière + colonne 2/3 + encart collé + section pleine largeur).

### Décisions actées

| Sujet | Décision |
| --- | --- |
| Modèle d'édition | **Hybride** — champs dédiés pour les blocs structurés, éditeur riche pour la prose |
| Sections | **Socle commun de 8**, les blocs propres à Bendavakan sont écartés |
| Prix du hero | **Dérivé** du `price_min` le plus bas des offres |
| Preuves chiffrées | **Bénéfices qualitatifs** — aucune statistique inventée |
| FAQ | **Propre à chaque service** |
| Article de blog | Encart → auteur + CTA ; section Offres → articles similaires |
| Déploiement | **Pilote** sur « Création de sites web », puis les 3 autres |

---

## 2. Prérequis bloquant

La table `services` a toujours ses **8 colonnes d'origine**. Vérifié : `?select=slug` renvoie `400`.

`supabase/migrations/003_services_columns.sql` est dans le dépôt mais **n'a jamais été exécuté**. Rien de ce document ne fonctionne tant qu'il ne l'est pas.

Ordre à respecter : **003** (slug, banner, long_description, offers) puis **004** (contenu structuré).

---

## 3. Modèle de données

### 3.1 Migration 004 — une colonne, pas quinze

```sql
alter table services add column if not exists content jsonb not null default '{}'::jsonb;
```

**Pourquoi une seule colonne JSON plutôt qu'une colonne par bloc :** ajouter une section plus tard ne demandera aucune migration ni redéploiement de schéma. Le compromis est l'absence de validation par la base — compensée par une validation zod à la lecture (§ 3.3).

### 3.2 Forme du document

```jsonc
{
  "version": 1,
  "hero":       { "tagline": "…", "badges": ["Next.js", "SEO local", "Mobile-first"] },
  "definition": { "title": "…", "body": "<p>…</p>", "highlight": "…" },
  "why": {
    "title": "…",
    // Ordre PASA. Les clés nomment le rôle pour guider la rédaction dans le
    // back-office ; elles ne sont JAMAIS rendues côté visiteur.
    "problem":     { "title": "…", "text": "…" },
    "aggravation": { "title": "…", "text": "…" },
    // Les cartes de bénéfices illustrent la réponse : elles vivent DANS ce
    // temps, elles ne forment plus une section à part (décision du 20/08).
    "solution":    { "title": "…", "text": "…",
                     "benefits": [{ "icon": "…", "title": "…", "text": "…" }] },
    "action":      { "title": "…", "text": "…", "ctaLabel": "…" }
  },
  "includes":   { "title": "…", "items": [{ "icon": "…", "title": "…", "text": "…" }] },
  "process":    { "title": "…", "steps": [{ "title": "…", "text": "…" }] },
  "pricing":    { "intro": "…", "factors": ["…"] },
  "faq":        [{ "q": "…", "a": "…" }]
}
```

`version` permet de faire évoluer la forme sans casser l'existant.

Les colonnes hors `content` gardent leur rôle : `title`, `description`, `icon`, `banner`, `slug`, `long_description` (prose libre), `offers` (tarifs).

### 3.3 Validation — `lib/service-content.ts`

Un schéma zod avec **valeurs par défaut sur chaque branche**, exposant :

```ts
export function parseServiceContent(raw: unknown): ServiceContent
```

Règle : un JSON absent, partiel ou malformé ne doit **jamais** faire tomber la page. On retombe sur un document vide, et chaque section disparaît si son bloc est vide (§ 4.2). C'est ce qui permet au pilote de coexister avec les 3 services non encore remplis.

---

## 4. Structure de la fiche service

### 4.1 Les 8 sections

| # | Section | Source | Vide si… |
| --- | --- | --- | --- |
| 1 | **Hero** — bannière, titre, accroche, badges, « À partir de X », 2 CTA | `banner`, `title`, `content.hero`, `offers` | jamais (titre toujours présent) |
| 2 | **Définition** — « C'est quoi ? » + citation encadrée | `content.definition` | pas de `body` |
| 3 | **Pourquoi en avez-vous besoin ?** — PASA, bénéfices inclus (§ 4.6) | `content.why` | aucun temps rempli |
| 4 | **Ce qui est inclus** — grille de cartes | `content.includes` | `items` vide |
| 5 | **Processus** — étapes numérotées | `content.process` | `steps` vide |
| 6 | **Tarifs** — offres pleine largeur + facteurs de coût | `offers`, `content.pricing` | `offers` vide |
| 7 | **FAQ** — accordéon | `content.faq` | liste vide |
| 8 | **Services connexes + CTA final** | les autres services | jamais |

La prose libre (`long_description`) reste rendue entre les sections 2 et 3, dans `prose-jp`.

### 4.2 Règle de rendu

Chaque section est un composant autonome qui **retourne `null` si sa donnée est vide**. Conséquence directe : les 3 services non traités affichent une page courte mais cohérente — jamais un gabarit à trous.

### 4.3 Numérotation

Les étapes du processus sont numérotées **parce que l'ordre porte une information** (le déroulé d'un projet). Aucune autre section n'est numérotée.

### 4.4 Accordéon FAQ

`<details>` / `<summary>` natifs : accessibles au clavier, fonctionnels sans JavaScript, indexables par Google. Aucune dépendance, aucun état React.

### 4.6 Section « Pourquoi » — structure PASA sans étiquettes

Quatre temps, dans l'ordre : la situation inconfortable, ce qui empire si rien ne bouge, la réponse apportée, l'invitation à agir.

**Règle absolue : les mots « Problème », « Aggravation », « Solution » et « Action » n'apparaissent nulle part côté visiteur.** Ils vivent uniquement dans les clés JSON et dans les libellés du back-office, où ils servent de guide de rédaction.

C'est une correction, pas seulement un ajout : les fiches en production affichent aujourd'hui ces étiquettes en toutes lettres, parce que `long_description` les contient et qu'elle est rendue telle quelle.

Chaque temps porte **son propre sous-titre rédigé**, qui remplace l'étiquette :

> ~~Problème :~~ → « Vos clients vous cherchent et ne vous trouvent pas »
> ~~Aggravation :~~ → « Chaque mois qui passe, ce trafic part chez un concurrent »

**Rendu.** Une progression visuelle porte la tension narrative, sans numérotation — l'ordre se lit, il n'a pas à être compté :

| Temps | Traitement |
| --- | --- |
| Situation | teinte neutre, texte secondaire |
| Ce qui empire | teinte d'alerte discrète, bord gauche marqué |
| Réponse | bascule sur la couleur d'accent de la marque |
| Passage à l'action | bloc plein, CTA vers le formulaire de contact |

Un temps laissé vide est simplement omis : la section reste lisible même partiellement remplie.

**Reprise du contenu existant.** Les `long_description` actuelles suivent déjà ce découpage. Le script de reprise (§ 7.4) les éclate en quatre temps et **retire les préfixes** — ce qui vide `long_description` de sa raison d'être pour les services traités.

### 4.5 Composants à créer

```
components/services/
  ServiceHero.tsx        (remplace ServiceBanner)
  ServiceDefinition.tsx
  ServiceWhy.tsx         (PASA sans étiquettes, cartes de bénéfices incluses)
  ServiceIncludes.tsx
  ServiceProcess.tsx
  ServicePricing.tsx     (englobe ServiceOffers existant)
  ServiceFaq.tsx
  RelatedServices.tsx
```

`ServiceOffers` et `ContactModal` sont conservés tels quels.

---

## 5. Page article de blog

Reprend le gabarit **actuel** des fiches services :

```
[========== BANNIÈRE cover_url + voile + titre + méta ==========]

[ contenu de l'article        ]  [ encart collé        ]
[ prose-jp, 2/3 de largeur    ]  [ auteur + CTA        ]
[                             ]  [ + partage           ]

[============== ARTICLES SIMILAIRES (pleine largeur) ==============]
```

Correspondances :

| Fiche service (actuel) | Article |
| --- | --- |
| Bannière `banner` | Bannière `cover_url` |
| Encart « Intéressé ? » + ContactModal | Encart auteur + CTA « Me contacter » + partage |
| Section Offres pleine largeur | Articles similaires |

Le contenu de l'article ne change pas : il reste du HTML TipTap assaini par `sanitizeHtml`. **Aucune modification du back-office blog n'est nécessaire** — c'est une refonte de présentation.

---

## 6. Back-office

### 6.1 Éclatement en deux écrans

Le formulaire actuel tient dans une carte dépliable. Avec ~40 champs, ce n'est plus tenable.

- `/gestion/services` → **liste** (titre, visibilité, ordre, actions)
- `/gestion/services/[id]` → **édition complète**, en onglets :

```
[ Général ] [ Contenu ] [ Offres ] [ FAQ ]

Général  : titre, slug, description, icône, bannière, ordre, visible
Contenu  : accroche, badges, définition (éditeur riche),
           « Pourquoi » — 4 temps guidés (les libellés Problème /
           Aggravation / Solution / Action n'aident qu'à la rédaction),
           prose libre (éditeur riche), bénéfices, inclus, processus
Offres   : liste répétable (nom, description, durée, prix, fourchette)
FAQ      : liste répétable (question, réponse)
```

### 6.2 Composants admin à créer

| Composant | Rôle |
| --- | --- |
| `RichTextEditor` | **extraction** de l'éditeur TipTap déjà présent dans `app/gestion/blog/page.tsx`, aujourd'hui non réutilisable |
| `RepeatableList` | générique : ajouter / supprimer / réordonner — sert aux badges, bénéfices, inclus, étapes, offres, FAQ |
| `IconPicker` | saisie d'un nom Iconify **avec aperçu en direct** |

`IconPicker` répond à un incident déjà rencontré : `line-md:lightning-twotone-loop` n'existait pas et la pastille restait vide, sans le moindre signal. L'aperçu rend l'erreur visible à la saisie.

### 6.3 Écriture en base

Les onglets alimentent un seul objet. La sauvegarde envoie `content` en un bloc, validé par le même schéma zod qu'à la lecture — la donnée écrite ne peut pas prendre une forme que la page ne saura pas relire.

---

## 7. Effets de bord

### 7.1 Bascule fichier → base

Aujourd'hui la fiche lit `data/portfolio-data.ts`, jamais Supabase (`long_description` et `offers` n'existent pas en base). Après 003 + 004, la fiche doit lire la base **avec repli sur le fichier**, comme le fait déjà `lib/supabase-data.ts` pour le reste.

Nouvelle fonction `getService(slug)` dans `lib/supabase-data.ts`.

### 7.2 generateStaticParams

Les slugs viennent aujourd'hui de `SERVICES`. Une fois la base peuplée, ils doivent en venir aussi, sinon un service créé depuis le back-office ne serait jamais prérendu.

### 7.3 SEO

- `generateMetadata` continue de fonctionner, alimenté par la base.
- **Ajout** : JSON-LD `Service` (avec `offers`) et `FAQPage`. La FAQ par service ouvre l'accès aux résultats enrichis Google — c'est le prolongement direct du travail d'indexation de la semaine.

### 7.4 Migration du contenu existant

Le contenu de `data/portfolio-data.ts` (long_description, offres) doit être recopié en base pour le service pilote. Un script SQL fourni avec la migration 004, ou une saisie manuelle depuis le back-office.

Le fichier reste en place comme **repli** si Supabase est injoignable.

---

## 8. Découpage

| Lot | Contenu | Livrable vérifiable |
| --- | --- | --- |
| **0** | Exécuter 003, écrire et exécuter 004 | `?select=content` renvoie 200 |
| **1** | `lib/service-content.ts` + `getService()` + repli | la fiche lit la base, le site ne bouge pas |
| **2** | Les 8 sections + rendu conditionnel | fiche pilote au nouveau gabarit |
| **3** | Back-office : liste + édition, 3 composants | contenu modifiable de bout en bout |
| **4** | Contenu du service pilote | « Création de sites web » complet |
| **5** | Page article au gabarit fiche service | article restructuré |
| **6** | JSON-LD Service + FAQPage | validé par le test de résultats enrichis Google |

Les lots 1 à 3 ne changent rien de visible tant que la base est vide : **aucune régression possible** avant le lot 4.

---

## 9. Vérification

À chaque lot :

- `npm run build`, `npx tsc --noEmit`, lint des fichiers touchés
- rendu Playwright en **390** et **1280 px**, thèmes clair et sombre
- relevé des erreurs console et des réponses HTTP ≥ 400
- absence de débordement horizontal

Spécifique :

- **Lot 1** : couper Supabase → la fiche doit continuer de s'afficher via le repli fichier
- **Lot 2** : un service au `content` vide doit rendre une page courte et propre, sans section fantôme
- **Lot 3** : aller-retour complet — modifier chaque type de champ, sauvegarder, recharger, vérifier le rendu
- **Lot 6** : `search.google.com/test/rich-results` sur une fiche

---

## 10. Écarté volontairement

| Écarté | Raison |
| --- | --- |
| Tableau comparatif, sections technologie et refonte | Propres à l'activité de Bendavakan, sans objet ici |
| Statistiques chiffrées | Aucun chiffre inventé ; remplacées par des bénéfices qualitatifs |
| Prévisualisation temps réel dans le back-office | Coût élevé, valeur faible face à un simple onglet navigateur |
| Versionnement du contenu | YAGNI — un seul rédacteur |
| Éditeur par glisser-déposer | Le socle de 8 sections est fixe et assumé |

---

## 11. SEO — contraintes d'implémentation

### 11.1 Correction préalable : les titres livrés sont tronqués

Les `generateMetadata` mis en ligne le 19/08 produisent des titres de **63 à 70 caractères**, au-delà de la limite d'affichage de Google (~60). Les quatre sont coupés dans les résultats.

| Service | Actuel | Corrigé |
| --- | --- | --- |
| Sites web | 64 ❌ | `Création de site web à Cotonou, Bénin \| Jean Prudent` — 52 ✅ |
| SEO | 68 ❌ | `Référencement naturel SEO à Cotonou \| Jean Prudent` — 50 ✅ |
| WordPress | 63 ❌ | `Maintenance WordPress à Cotonou, Bénin \| Jean Prudent` — 53 ✅ |
| Automatisation | 70 ❌ | `Automatisation des tâches n8n au Bénin \| Jean Prudent` — 53 ✅ |

Le gabarit `%s | Jean Prudent` du layout consomme 15 caractères : le titre propre à la page ne doit pas dépasser **45 caractères**. À contrôler à chaque rédaction.

Les descriptions sont recalibrées dans la fenêtre 150-160 (une était à 168, tronquée ; une autre à 138, place gâchée).

### 11.2 Ciblage par service

Volumes faibles mais concurrence quasi nulle sur ces requêtes locales : le vrai levier est la **précision géographique**, pas le volume.

| Service | Mot-clé principal | Longue traîne |
| --- | --- | --- |
| Sites web | création site web Cotonou | site vitrine Bénin · créer un site internet Cotonou · agence web Cotonou · prix site web Bénin |
| SEO | référencement naturel Cotonou | SEO Bénin · être premier sur Google Cotonou · audit SEO Bénin · Google My Business Cotonou |
| WordPress | maintenance WordPress Bénin | sécuriser site WordPress · site WordPress lent · sauvegarde site web Cotonou |
| Automatisation | automatisation n8n | automatiser devis et relances · intégration API PME Bénin · gagner du temps administratif |

**Champ lexical à faire vivre naturellement** : PME, TPE, artisan, entrepreneur, Cotonou, Bénin, devis, vitrine, responsive, mobile, Google, trafic, prospect, conversion, délai, tarif, XOF, maintenance, sauvegarde, workflow.

### 11.3 Hiérarchie Hn — contrainte forte du nouveau gabarit

Avec 8 sections et des titres imbriqués, le risque de casser la hiérarchie est réel.

```
H1  titre du service                    (hero, UNE SEULE FOIS)
H2  C'est quoi ?
H2  Pourquoi en avez-vous besoin ?
    H3  chaque temps PASA (4)
    H3  chaque carte de bénéfice
H2  Ce qui est inclus
    H3  chaque carte
H2  Comment ça se passe
    H3  chaque étape
H2  Tarifs
    H3  chaque offre
H2  Questions fréquentes
    H3  chaque question (dans <summary>)
H2  Autres services
```

Aucun saut de niveau. Le `<h1>` du hero est le seul de la page — `ServiceHero` doit être le seul composant à en émettre un.

### 11.4 Données structurées

| Page | Schémas |
| --- | --- |
| Fiche service | `Service` (+ `provider`, `areaServed`, `offers`), `FAQPage`, `BreadcrumbList` |
| Accueil | `Person`, `WebSite`, `LocalBusiness` |
| Article | `BlogPosting` (+ `author`, `datePublished`, `dateModified`) |
| Liste services | `BreadcrumbList` |

`offers` alimente directement `Service.offers` via `price_min` / `price_max` / `currency` : les données sont déjà structurées, il n'y a rien à ressaisir.

**Réserve honnête sur FAQPage** : depuis août 2023, Google réserve les résultats enrichis FAQ aux sites gouvernementaux et de santé. Le balisage reste utile à la compréhension sémantique, mais il ne faut pas en attendre d'étoiles dans la SERP.

**Prérequis** : le fil d'Ariane n'existe pas encore sur le site. `BreadcrumbList` suppose de l'ajouter — il sert d'abord la navigation, le balisage n'est qu'un bonus.

### 11.5 Maillage interne

```
        /services  (page pilier)
       /     |     \      \
   sites   SEO   WordPress  automatisation
       \_____ chacune liant les 3 autres _____/
                     ↑
        articles de blog thématiques
```

- La section 8 « Autres services » assure le maillage horizontal — **prévu au design**.
- Le footer lie déjà les 4 fiches depuis toutes les pages — **livré le 19/08**.
- **Manquant** : les articles de blog ne pointent vers aucune fiche service. C'est le maillage qui transforme un lecteur en prospect. À traiter à la rédaction des articles, avec des ancres descriptives (« création de site web à Cotonou », jamais « cliquez ici »).
- Profondeur : toutes les fiches sont à 1 clic de l'accueil via le footer. ✅

### 11.6 Volume de contenu

Cible **800 à 1500 mots** par fiche (landing page commerciale). En dessous, la page ne pèse pas face à une concurrence même faible ; au-delà, on dilue l'intention transactionnelle.

Répartition indicative : définition 150, PASA 350, inclus 200, processus 200, tarifs 150, FAQ 300.

### 11.7 Core Web Vitals

| Métrique | Point d'attention sur le nouveau gabarit |
| --- | --- |
| **LCP** | La bannière du hero est l'élément LCP : `priority` sur `next/image` — déjà en place dans `ServiceBanner`. |
| **CLS** | Ratio fixe obligatoire sur toutes les images de cartes, comme sur les cartes de la page d'accueil. |
| **INP** | La FAQ en `<details>` natif ne coûte aucun JavaScript. C'est aussi pour ça qu'on l'a choisie. |

### 11.8 Attributs `alt`

Les bannières de service portent aujourd'hui `alt=""` (décoratif, le titre est juste à côté en H1). À conserver : répéter le titre dans l'`alt` est du bourrage sans bénéfice. En revanche, toute image **informative** ajoutée dans la prose devra décrire son contenu.

---

## Validation demandée

Avant toute ligne de code :

1. ~~Le socle de sections~~ — **validé le 20/08**, passé à 9 avec « Pourquoi » (PASA) après la définition. Reste son articulation avec les Bénéfices (§ 4.6).
2. Le **découpage en 7 lots** te va-t-il, en commençant par le lot 0 (les migrations, côté Supabase) ?
3. L'éclatement du back-office en **liste + page d'édition à onglets** te convient-il ?
