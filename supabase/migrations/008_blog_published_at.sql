-- =============================================================================
-- 008 — Date de publication des articles
-- À exécuter dans le SQL Editor Supabase APRÈS 007_projects_result.sql.
--
-- Problème corrigé :
--   Les articles affichaient `created_at`, c'est-à-dire la date à laquelle le
--   brouillon a été créé. Un article rédigé en août et mis en ligne en
--   septembre s'annonçait donc daté d'août, sur le site comme dans le
--   balisage Schema.org lu par Google.
--
--   `published_at` porte désormais la date de mise en ligne. Elle est
--   renseignée au premier passage en « publié », depuis /gestion/blog, et
--   n'est plus jamais écrasée ensuite : dépublier puis republier ne réécrit
--   pas l'histoire de l'article.
--
-- Reprise de l'existant : les articles déjà en ligne n'ont pas d'autre date
-- disponible, on retient donc leur date de création. Corrigez-la ici si la
-- vraie date de mise en ligne diffère, par exemple :
--   update blog_posts set published_at = '2026-09-06'
--   where slug = 'contenu-ia-nuit-votre-pme';
--
-- Les brouillons restent à NULL : ils n'ont pas encore de date de publication.
--
-- Ce script est ré-exécutable sans risque.
-- =============================================================================

alter table blog_posts
  add column if not exists published_at timestamptz;

update blog_posts
set published_at = created_at
where published is true
  and published_at is null;

comment on column blog_posts.published_at is
  'Date de mise en ligne, renseignee au premier passage en published = true. NULL pour un brouillon. A ne pas confondre avec created_at, date de creation du brouillon.';

create index if not exists blog_posts_published_at_idx
  on blog_posts (published_at desc nulls last);
