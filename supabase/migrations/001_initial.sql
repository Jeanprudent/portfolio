-- =============================================
-- Portfolio Jean Prudent — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- =============================================
-- TABLE: portfolio_config
-- Stores global site settings (single row)
-- =============================================
create table if not exists portfolio_config (
  id              uuid primary key default gen_random_uuid(),
  site_name       text not null default 'Jean Prudent IDOHOU',
  tagline         text not null default 'Je crée des sites web qui transforment votre présence en ligne en moteur de croissance.',
  bio             text not null default '',
  email           text not null default 'jeanprudent03@gmail.com',
  whatsapp        text not null default '+2290192175002',
  location        text not null default 'Cotonou, Bénin',
  avatar_url      text,
  primary_color   text not null default '#7C3AED',
  secondary_color text not null default '#06B6D4',
  accent_color    text not null default '#A855F7',
  github_url      text default 'https://github.com/Jeanprudent',
  linkedin_url    text default 'https://www.linkedin.com/in/jean-prudent-idohou-4a1409287',
  facebook_url    text default 'https://www.facebook.com/jean.prudent.2025',
  seo_title       text default 'Jean Prudent IDOHOU — Développeur Web & Designer | Cotonou, Bénin',
  seo_description text default 'Je crée des sites web qui transforment votre présence en ligne en moteur de croissance.',
  google_analytics_id text,
  disponible      boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Insert default config row
insert into portfolio_config (id) values (gen_random_uuid())
on conflict do nothing;

-- =============================================
-- TABLE: services
-- =============================================
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  icon        text not null default 'line-md:star-twotone',
  order_index integer not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Default services
insert into services (title, description, icon, order_index) values
  ('Création de sites web sur mesure', 'Je conçois des sites web professionnels sur mesure, pensés pour valoriser votre image, offrir une expérience utilisateur fluide et transformer vos visiteurs en clients.', 'line-md:laptop-twotone', 0),
  ('Optimisation SEO & visibilité Google', 'Améliorez votre visibilité et attirez un trafic qualifié. J''optimise votre site pour le référencement naturel afin d''améliorer votre positionnement sur Google.', 'line-md:search-twotone', 1),
  ('Maintenance & support WordPress', 'Gardez votre site sécurisé, rapide et toujours à jour. Je prends en charge la maintenance technique de votre site pour garantir sa stabilité et sa sécurité.', 'line-md:cog-loop', 2),
  ('Automatisation & optimisation digitale', 'Automatisez vos tâches pour gagner du temps. Formulaires intelligents, emails automatiques et workflows n8n pour simplifier vos processus.', 'line-md:lightning-twotone-loop', 3)
on conflict do nothing;

-- =============================================
-- TABLE: projects
-- =============================================
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  image_url   text,
  project_url text,
  github_url  text,
  tags        text[] not null default '{}',
  category    text not null default 'web',
  featured    boolean not null default false,
  order_index integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================
-- TABLE: skills
-- =============================================
create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon        text not null,
  category    text not null default 'frontend',
  level       integer not null default 80 check (level >= 0 and level <= 100),
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- =============================================
-- TABLE: testimonials
-- =============================================
create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null,
  company    text not null,
  text       text not null,
  avatar_url text,
  rating     integer not null default 5 check (rating >= 1 and rating <= 5),
  visible    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Default testimonials
insert into testimonials (name, role, company, text, rating) values
  ('Marie Dupont', 'Gérante', 'Boutique Chic', 'Jean Prudent a transformé notre présence en ligne en quelques semaines. Notre site attire maintenant 3× plus de clients et nos ventes ont augmenté de 40%. Un travail exceptionnel et un suivi impeccable !', 5),
  ('Kofi Mensah', 'Directeur Commercial', 'TechAfrique', 'Un travail remarquable ! Le site est non seulement magnifique mais aussi parfaitement optimisé pour Google. On est en première page sur nos mots-clés principaux. Je recommande vivement.', 5),
  ('Aminata Traoré', 'Entrepreneur', 'Saveurs d''Afrique', 'L''automatisation mise en place par Jean nous a fait gagner 10h par semaine. Les formulaires, emails et CRM se synchronisent parfaitement. Un investissement qui s''est remboursé en moins d''un mois !', 5)
on conflict do nothing;

-- =============================================
-- TABLE: stats
-- =============================================
create table if not exists stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       integer not null,
  suffix      text not null default '',
  icon        text not null default 'line-md:star-twotone',
  order_index integer not null default 0
);

-- Default stats
insert into stats (label, value, suffix, icon, order_index) values
  ('Ans d''expérience', 2, '+', 'line-md:calendar-twotone', 0),
  ('Projets livrés', 15, '+', 'line-md:confirm-circle-twotone', 1),
  ('Clients satisfaits', 96, '%', 'line-md:emoji-smile-twotone', 2),
  ('Disponibilité', 100, '%', 'line-md:cloud-up-twotone', 3)
on conflict do nothing;

-- =============================================
-- TABLE: blog_posts
-- =============================================
create table if not exists blog_posts (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text not null unique,
  content    text not null default '',
  excerpt    text not null default '',
  cover_url  text,
  tags       text[] not null default '{}',
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on blog_posts (slug);
create index if not exists blog_posts_published_idx on blog_posts (published);

-- =============================================
-- TABLE: contact_messages
-- Stores form submissions (read-only via admin)
-- =============================================
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- portfolio_config: public read, authenticated write
alter table portfolio_config enable row level security;
create policy "Public read config" on portfolio_config for select using (true);
create policy "Auth update config" on portfolio_config for update using (auth.role() = 'authenticated');

-- services: public read, authenticated write
alter table services enable row level security;
create policy "Public read services" on services for select using (visible = true);
create policy "Auth all services" on services for all using (auth.role() = 'authenticated');

-- projects: public read all, authenticated write
alter table projects enable row level security;
create policy "Public read projects" on projects for select using (true);
create policy "Auth all projects" on projects for all using (auth.role() = 'authenticated');

-- skills: public read, authenticated write
alter table skills enable row level security;
create policy "Public read skills" on skills for select using (true);
create policy "Auth all skills" on skills for all using (auth.role() = 'authenticated');

-- testimonials: public read visible, authenticated write
alter table testimonials enable row level security;
create policy "Public read testimonials" on testimonials for select using (visible = true);
create policy "Auth all testimonials" on testimonials for all using (auth.role() = 'authenticated');

-- stats: public read, authenticated write
alter table stats enable row level security;
create policy "Public read stats" on stats for select using (true);
create policy "Auth all stats" on stats for all using (auth.role() = 'authenticated');

-- blog_posts: public read published only, authenticated write all
alter table blog_posts enable row level security;
create policy "Public read published posts" on blog_posts for select using (published = true);
create policy "Auth all posts" on blog_posts for all using (auth.role() = 'authenticated');

-- contact_messages: insert for all, read/update for authenticated
alter table contact_messages enable row level security;
create policy "Anyone can send message" on contact_messages for insert with check (true);
create policy "Auth read messages" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on contact_messages for update using (auth.role() = 'authenticated');

-- =============================================
-- Updated_at trigger function
-- =============================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on portfolio_config for each row execute function update_updated_at();
create trigger set_updated_at before update on services for each row execute function update_updated_at();
create trigger set_updated_at before update on projects for each row execute function update_updated_at();
create trigger set_updated_at before update on testimonials for each row execute function update_updated_at();
create trigger set_updated_at before update on blog_posts for each row execute function update_updated_at();
