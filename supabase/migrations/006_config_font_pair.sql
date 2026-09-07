-- =============================================================================
-- 006 — Paire de polices du site
-- À exécuter dans le SQL Editor Supabase APRÈS 005_services_content_seed.sql.
--
-- Problème corrigé :
--   La page /gestion/design proposait un choix de typographie qui ne vivait
--   que dans l'état React : rien n'était enregistré, et le site public
--   restait figé sur Syne + DM Sans. La colonne ci-dessous porte désormais
--   ce choix, lu par app/layout.tsx à chaque rendu.
--
--   Les colonnes primary_color / secondary_color / accent_color ne sont plus
--   éditables depuis le back-office (aucun composant ne les lisait, le
--   sélecteur ne changeait donc rien). Elles sont conservées ici : les
--   supprimer casserait les types générés sans rien apporter.
--
-- Valeurs acceptées : voir FONT_PAIRS dans lib/font-pairs.ts
--   syne-dm · outfit-inter · space-inter · plus-manrope
--
-- Ce script est ré-exécutable sans risque.
-- =============================================================================

alter table portfolio_config
  add column if not exists font_pair text not null default 'syne-dm';

-- Garde-fou : une valeur inconnue ferait silencieusement retomber le site sur
-- la paire par défaut. Autant la refuser à l'écriture.
alter table portfolio_config
  drop constraint if exists portfolio_config_font_pair_check;

alter table portfolio_config
  add constraint portfolio_config_font_pair_check
  check (font_pair in ('syne-dm', 'outfit-inter', 'space-inter', 'plus-manrope'));
