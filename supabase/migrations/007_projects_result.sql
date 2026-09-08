-- =============================================================================
-- 007 — Metrique de resultat sur les projets
-- À exécuter dans le SQL Editor Supabase APRÈS 006_config_font_pair.sql.
--
-- Problème corrigé :
--   Une carte projet ne portait qu'un titre et une description. Ce qui décide
--   un prospect, c'est le résultat obtenu — « +40 % de trafic SEO en 3 mois »,
--   « délai de réponse divisé par 4 ». Cette colonne accueille cette phrase,
--   saisie depuis /gestion/projets.
--
--   Colonne laissée vide volontairement : le chiffre doit venir d'une mesure
--   réelle du projet concerné. Une carte sans résultat s'affiche exactement
--   comme avant, le badge n'apparaît que s'il est renseigné.
--
-- Ce script est ré-exécutable sans risque.
-- =============================================================================

alter table projects
  add column if not exists result text;

comment on column projects.result is
  'Resultat mesure du projet, affiche en badge sur la carte. Ex : "+40 % de trafic SEO en 3 mois". Laisser vide si aucun chiffre verifiable.';
