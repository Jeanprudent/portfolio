# Visuels des projets — TEMPORAIRES

⚠️ **Ces quatre images sont des visuels d'illustration, pas des captures de tes vraies
réalisations.** Elles comblent les 404 en attendant, mais un portfolio gagne à montrer le
travail réel : remplace-les dès que possible par des captures d'écran des sites livrés.

## Comment les remplacer

**Option 1 — par le back-office** (recommandé) : `/gestion/projects`, champ image de chaque
projet. L'URL Supabase prend alors le pas sur le fichier local, sans toucher au code.

**Option 2 — dans le dépôt** : remplace le fichier en gardant le même nom, ou modifie
`image_url` dans `data/portfolio-data.ts`.

| Fichier | Projet | Photo Unsplash |
| --- | --- | --- |
| `e-commerce-premium.webp` | E-commerce Premium | https://unsplash.com/photos/0cfed4f6a45d |
| `site-corporate-seo.webp` | Site Corporate SEO | https://unsplash.com/photos/f200968a6e72 |
| `portfolio-artiste.webp` | Portfolio Artiste | https://unsplash.com/photos/60967b0f800f |
| `automatisation-crm-n8n.webp` | Automatisation CRM n8n | https://unsplash.com/photos/ef010cbdcc31 |

Licence [Unsplash](https://unsplash.com/license) — usage commercial autorisé, attribution
non obligatoire (créditée ici par courtoisie).

Format attendu : WebP, 800 × 500 px (ratio 8/5). Les cartes projets affichent la zone en
`object-cover` sur 192 px de haut — cadre le sujet au centre.
