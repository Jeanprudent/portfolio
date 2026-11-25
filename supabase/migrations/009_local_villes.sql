-- =============================================================================
-- 009 - Villes des pages SEO locales
-- A executer dans le SQL Editor Supabase APRES 008_blog_published_at.sql.
--
-- Rend les villes des pages « expertise x ville » pilotables depuis
-- /gestion/zones. Les EXPERTISES restent en code (data/local-seo.ts) : contenu
-- riche et stable. Une ville = un contexte local (intro, secteurs) + un etat
-- actif/inactif. Activer une ville ouvre ses 3 pages au prochain build.
--
-- Repli : tant que cette table est absente ou vide, le site retombe sur
-- data/local-seo.ts (VILLES), exactement comme pour les autres contenus.
--
-- Ce script est re-executable sans risque.
-- =============================================================================

create table if not exists local_villes (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nom         text not null,
  prep        text not null default 'à',
  region      text,
  pays        text not null default 'Bénin',
  intro       text not null default '',
  secteurs    jsonb not null default '[]'::jsonb,
  active      boolean not null default false,
  order_index int not null default 0,
  created_at  timestamptz not null default now()
);

comment on table local_villes is
  'Villes des pages SEO locales (expertise x ville). active=true ouvre les pages de la ville. secteurs = liste JSON de chaines.';

-- -----------------------------------------------------------------------------
-- Privileges : la migration 002 a revoque les droits par defaut sur les
-- FUTURES tables. Il faut donc les accorder explicitement ici.
-- -----------------------------------------------------------------------------
grant select on local_villes to anon;
grant select, insert, update, delete on local_villes to authenticated;

alter table local_villes enable row level security;

-- Lecture publique (le site lit les villes actives via la cle anon).
drop policy if exists "Public read local_villes" on local_villes;
create policy "Public read local_villes" on local_villes
  for select using (true);

-- Ecriture reservee a l'admin (meme garde is_admin() que la migration 002).
drop policy if exists "Admin all local_villes" on local_villes;
create policy "Admin all local_villes" on local_villes
  for all using (is_admin()) with check (is_admin());

-- -----------------------------------------------------------------------------
-- Seed : Cotonou (active) + 3 villes preparees (inactives, a completer).
-- -----------------------------------------------------------------------------
insert into local_villes (slug, nom, prep, region, pays, intro, secteurs, active, order_index) values
(
  'cotonou', 'Cotonou', 'à', 'Littoral', 'Bénin',
  'Cotonou concentre l''essentiel de l''activité économique du Bénin : commerces de Ganhi et Dantokpa, restaurants et hôtels de Fidjrossè et de la Haie Vive, cabinets de Cadjèhoun, importateurs et jeunes entreprises du numérique. Dans cette densité, une entreprise qu''on ne trouve pas en ligne laisse chaque jour des clients à ses concurrents mieux référencés.',
  '["Commerces et boutiques (Ganhi, Dantokpa, Cadjèhoun)","Restaurants, maquis et hôtels (Fidjrossè, Haie Vive)","Cabinets, cliniques et prestataires de services","Artisans, BTP et importateurs","Startups et jeunes entreprises du numérique"]'::jsonb,
  true, 0
),
('porto-novo', 'Porto-Novo', 'à', 'Ouémé', 'Bénin', '', '[]'::jsonb, false, 1),
('abomey-calavi', 'Abomey-Calavi', 'à', 'Atlantique', 'Bénin', '', '[]'::jsonb, false, 2),
('parakou', 'Parakou', 'à', 'Borgou', 'Bénin', '', '[]'::jsonb, false, 3)
on conflict (slug) do nothing;
