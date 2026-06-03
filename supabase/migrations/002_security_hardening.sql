-- =============================================================================
-- 002 — Durcissement sécurité (RLS + Storage)
-- À exécuter dans le SQL Editor Supabase APRÈS 001_initial.sql.
--
-- ⚠️ AVANT D'EXÉCUTER : remplace l'email ci-dessous par TON email de connexion
--    admin (celui utilisé sur /admin/login), puis exécute tout le fichier.
--
-- Corrige :
--   #2  Toute personne « authenticated » pouvait tout écrire / lire les messages.
--   #5  `grant all ... to anon` ouvrait les futures tables au public.
--   #6  Le bucket Storage n'avait aucune policy (upload public possible).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Annuler les privilèges trop larges (#5)
-- -----------------------------------------------------------------------------
-- Supprime le "grant all" par défaut posé en 001 sur les FUTURES tables.
alter default privileges in schema public revoke all on tables from anon, authenticated;

-- Repart d'une base minimale : RLS filtre les lignes, les GRANT filtrent les verbes.
revoke all on all tables in schema public from anon;

-- anon (visiteur public) : lecture seule (RLS s'applique) ...
grant select on all tables in schema public to anon;
-- ... sauf les messages de contact : aucune lecture publique, mais insert autorisé.
revoke select on contact_messages from anon;
grant insert on contact_messages to anon;

-- authenticated (admin connecté) : DML complet — RLS via is_admin() gardera la porte.
grant select, insert, update, delete on all tables in schema public to authenticated;

-- -----------------------------------------------------------------------------
-- 2) Allowlist d'administrateurs + fonction is_admin()
-- -----------------------------------------------------------------------------
create table if not exists admin_emails (
  email text primary key
);
alter table admin_emails enable row level security;
-- Aucune policy => la table est inaccessible via l'API (PostgREST). Voulu.

-- 👉 REMPLACE par ton email de connexion admin :
insert into admin_emails (email) values ('jeanprudent03@gmail.com')
on conflict do nothing;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_emails
    where email = lower(auth.jwt() ->> 'email')
  );
$$;

-- -----------------------------------------------------------------------------
-- 3) Remplacer les policies d'écriture "authenticated" par "is_admin()" (#2)
-- -----------------------------------------------------------------------------
-- NB : on supprime à la fois les anciens noms ("Auth ...") ET les nouveaux
-- ("Admin ...") avant chaque create => script entièrement ré-exécutable.
drop policy if exists "Auth update config" on portfolio_config;
drop policy if exists "Admin update config" on portfolio_config;
create policy "Admin update config" on portfolio_config
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Auth all services" on services;
drop policy if exists "Admin all services" on services;
create policy "Admin all services" on services
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Auth all projects" on projects;
drop policy if exists "Admin all projects" on projects;
create policy "Admin all projects" on projects
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Auth all skills" on skills;
drop policy if exists "Admin all skills" on skills;
create policy "Admin all skills" on skills
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Auth all testimonials" on testimonials;
drop policy if exists "Admin all testimonials" on testimonials;
create policy "Admin all testimonials" on testimonials
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Auth all stats" on stats;
drop policy if exists "Admin all stats" on stats;
create policy "Admin all stats" on stats
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Auth all posts" on blog_posts;
drop policy if exists "Admin all posts" on blog_posts;
create policy "Admin all posts" on blog_posts
  for all using (is_admin()) with check (is_admin());

-- Messages de contact : lecture/maj réservées à l'admin (PII protégée).
drop policy if exists "Auth read messages" on contact_messages;
drop policy if exists "Admin read messages" on contact_messages;
create policy "Admin read messages" on contact_messages
  for select using (is_admin());

drop policy if exists "Auth update messages" on contact_messages;
drop policy if exists "Admin update messages" on contact_messages;
create policy "Admin update messages" on contact_messages
  for update using (is_admin()) with check (is_admin());
-- "Anyone can send message" (INSERT public) est conservée volontairement.

-- -----------------------------------------------------------------------------
-- 4) Sécuriser le bucket Storage "portfolio-images" (#6)
-- -----------------------------------------------------------------------------
-- Lecture publique des images, mais upload/écrasement/suppression admin only.
drop policy if exists "Public read portfolio-images" on storage.objects;
create policy "Public read portfolio-images" on storage.objects
  for select using (bucket_id = 'portfolio-images');

drop policy if exists "Admin insert portfolio-images" on storage.objects;
create policy "Admin insert portfolio-images" on storage.objects
  for insert with check (bucket_id = 'portfolio-images' and is_admin());

drop policy if exists "Admin update portfolio-images" on storage.objects;
create policy "Admin update portfolio-images" on storage.objects
  for update using (bucket_id = 'portfolio-images' and is_admin());

drop policy if exists "Admin delete portfolio-images" on storage.objects;
create policy "Admin delete portfolio-images" on storage.objects
  for delete using (bucket_id = 'portfolio-images' and is_admin());

-- =============================================================================
-- RAPPEL MANUEL (dashboard Supabase) :
--   Authentication → Providers/Sign In → DÉSACTIVER "Allow new users to sign up"
--   pour empêcher la création de comptes non sollicités. La RLS ci-dessus
--   bloque déjà toute écriture par un non-admin, mais couper les inscriptions
--   est la défense en profondeur recommandée.
-- =============================================================================
