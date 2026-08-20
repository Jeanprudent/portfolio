-- =============================================================================
-- 004 — Contenu structuré des fiches services
-- À exécuter dans le SQL Editor Supabase APRÈS 003_services_columns.sql.
--
-- Ajoute une unique colonne JSON qui porte toutes les sections éditables de
-- la fiche (accroche, argumentaire PASA, ce qui est inclus, processus,
-- tarification, FAQ).
--
-- Pourquoi une seule colonne plutôt qu'une par bloc : ajouter une section
-- plus tard ne demandera aucune migration. La contrepartie — pas de
-- validation par la base — est compensée par une validation zod côté
-- application, avec des valeurs par défaut sur chaque branche : un document
-- absent ou partiel ne fait jamais tomber la page.
--
-- Ré-exécutable sans risque.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) La colonne
-- -----------------------------------------------------------------------------
alter table services
  add column if not exists content jsonb not null default '{}'::jsonb;

-- Garde-fou : `content` doit rester un objet, jamais un tableau ni un scalaire.
-- Sans cela, un `[]` envoyé par erreur casserait toutes les lectures.
alter table services drop constraint if exists services_content_is_object;
alter table services add constraint services_content_is_object
  check (jsonb_typeof(content) = 'object');

-- -----------------------------------------------------------------------------
-- 2) Forme attendue du document (documentation, non contrainte)
--
-- {
--   "version": 1,
--   "hero":    { "tagline": "...", "badges": ["...", "..."] },
--   "definition": { "title": "...", "body": "<p>...</p>", "highlight": "..." },
--   "why": {
--     "title": "...",
--     "problem":     { "title": "...", "text": "..." },
--     "aggravation": { "title": "...", "text": "..." },
--     "solution":    { "title": "...", "text": "...",
--                      "benefits": [{ "icon": "...", "title": "...", "text": "..." }] },
--     "action":      { "title": "...", "text": "...", "ctaLabel": "..." }
--   },
--   "includes": { "title": "...", "items": [{ "icon": "...", "title": "...", "text": "..." }] },
--   "process":  { "title": "...", "steps": [{ "title": "...", "text": "..." }] },
--   "pricing":  { "intro": "...", "factors": ["...", "..."] },
--   "faq":      [{ "q": "...", "a": "..." }]
-- }
--
-- IMPORTANT : les clés problem / aggravation / solution / action nomment le
-- rôle de chaque temps pour guider la rédaction dans le back-office. Elles ne
-- sont JAMAIS affichées au visiteur — chaque temps porte son propre "title".
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 3) Amorce : marquer les lignes existantes en version 1
-- Ne touche que les documents encore vides.
-- -----------------------------------------------------------------------------
update services
set content = jsonb_build_object('version', 1)
where content = '{}'::jsonb;

-- -----------------------------------------------------------------------------
-- 4) Vérification — les 4 lignes doivent afficher version = 1
-- -----------------------------------------------------------------------------
select
  order_index,
  title,
  slug,
  content->>'version' as version_contenu,
  jsonb_array_length(offers) as nb_offres
from services
order by order_index;
