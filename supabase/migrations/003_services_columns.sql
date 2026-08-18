-- =============================================================================
-- 003 — Colonnes manquantes de la table `services`
-- À exécuter dans le SQL Editor Supabase APRÈS 002_security_hardening.sql.
--
-- Problème corrigé :
--   La table créée en 001 ne porte que id, title, description, icon,
--   order_index, visible, created_at, updated_at. Le type Service du code
--   attend en plus slug, banner, long_description et offers.
--   Conséquence : le contenu riche des fiches services (texte long, offres,
--   prix, bannière) ne vit que dans data/portfolio-data.ts et n'est donc PAS
--   modifiable depuis le back-office /gestion.
--
-- Ce script est ré-exécutable sans risque : add column if not exists, et les
-- UPDATE ne touchent que les lignes dont la colonne est encore vide.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Ajout des colonnes
-- -----------------------------------------------------------------------------
alter table services add column if not exists slug             text;
alter table services add column if not exists banner           text;
alter table services add column if not exists long_description text;
alter table services add column if not exists offers           jsonb not null default '[]'::jsonb;

-- -----------------------------------------------------------------------------
-- 2) Remplissage des slugs existants
--
-- Doit produire exactement ce que calcule lib/slug.ts, sans quoi les fiches
-- redeviendraient introuvables :
--   - décomposition des accents  (« Création » -> « creation »)
--   - « & » supprimé, pas traduit en « et »
--   - tout le reste -> tirets, sans tiret en début ni fin
-- unaccent n'est pas garanti sur toutes les instances : on passe par translate,
-- qui couvre les caractères réellement utilisés en français.
-- -----------------------------------------------------------------------------
update services
set slug = trim(both '-' from regexp_replace(
      lower(translate(replace(title, '&', ' '),
                      'àâäáãåçèéêëìíîïñòóôöõùúûüýÿœæ',
                      'aaaaaaceeeeiiiinooooouuuuyyoa')),
      '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- Un slug par service : garantit qu'aucune fiche ne devienne ambiguë.
create unique index if not exists services_slug_key on services (slug);

-- -----------------------------------------------------------------------------
-- 3) Bannières livrées avec le site (public/services/*.webp)
-- Ne remplit que les lignes sans bannière : une image téléversée depuis le
-- back-office n'est jamais écrasée.
-- -----------------------------------------------------------------------------
update services
set banner = '/services/' || slug || '.webp'
where (banner is null or banner = '')
  and slug in (
    'creation-de-sites-web-sur-mesure',
    'optimisation-seo-visibilite-google',
    'maintenance-support-wordpress',
    'automatisation-optimisation-digitale'
  );

-- -----------------------------------------------------------------------------
-- 4) Vérification — à lire avant de considérer la migration réussie.
-- Les 4 lignes doivent afficher un slug, une bannière, et offers = [].
-- -----------------------------------------------------------------------------
select order_index, title, slug, banner, jsonb_array_length(offers) as nb_offres
from services
order by order_index;

-- =============================================================================
-- ÉTAPE SUIVANTE, CÔTÉ CODE
--
-- Les colonnes existent maintenant, mais elles sont vides pour
-- long_description et offers : le contenu est encore dans
-- data/portfolio-data.ts. Deux options :
--
--   a) Recopier ce contenu depuis le back-office /gestion/services
--      (nécessite que le formulaire expose ces champs).
--
--   b) Le migrer en SQL, service par service. Exemple pour le premier :
--
--      update services
--      set long_description = $txt$Problème : ...$txt$,
--          offers = '[{"id":"s1-o1","name":"Pack Starter","price":"150 000 à 300 000 XOF",
--                      "price_min":150000,"price_max":300000,"currency":"XOF",
--                      "duration_days":7,"description":"Site vitrine 3 pages..."}]'::jsonb
--      where slug = 'creation-de-sites-web-sur-mesure';
--
-- Tant que ces deux colonnes restent vides, la fiche service continue de lire
-- data/portfolio-data.ts : rien ne casse, mais rien n'est éditable non plus.
-- =============================================================================
