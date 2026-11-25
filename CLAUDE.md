# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Next.js 16 / React 19 / Tailwind 4.** As AGENTS.md warns, APIs differ from older versions — read the relevant guide in `node_modules/next/dist/docs/` before writing framework code. Most notably, **middleware is now `proxy.ts`** (not `middleware.ts`), and it exports a `proxy()` function.

## Commands

```bash
npm run dev          # dev server on :3000 (Turbopack)
npm run build        # production build
npm run lint         # eslint (flat config, eslint.config.mjs)

npm run test         # unit + e2e
npm run test:unit    # pure-logic tests, no browser/server (playwright.unit.config.ts)
npm run test:e2e     # browser invariants against a dev server on :3100 (playwright.config.ts)
```

Run a single test (Playwright is the runner for both suites):

```bash
npx playwright test -c playwright.unit.config.ts tests/unit/sanitize.spec.ts   # one file
npx playwright test -c playwright.unit.config.ts -g "slug"                     # by title
npx playwright test tests/e2e/service-page.spec.ts                            # one e2e file
```

- **Unit tests** (`tests/unit/`) don't start Next — they validate pure functions (zod schemas, slug, merge, sanitize). No dedicated runner is installed; Playwright is used only as a launcher.
- **E2E tests** (`tests/e2e/`) run on a dedicated port **3100** so they don't collide with a `npm run dev` on 3000. First visit to a route is slow (Turbopack compiles on demand) — hence the 90s timeout and one retry even locally.

## Architecture

Single-admin portfolio site with a public front and a `/gestion` back-office, backed by Supabase (Postgres + Auth + Storage). Everything is in French; code comments are the primary design documentation.

### Data layer: DB is authority, local files are the fallback

`lib/supabase-data.ts` is the read layer for all public content. Every getter **falls back to a static file** in `data/` (`portfolio-data.ts`, `blog-data.ts`) when Supabase is unreachable or a column/migration is missing — the public site must never go blank. For services, `lib/merge-service.ts` merges the two: the DB wins, the file fills gaps (and an empty array is treated as "no value"). When adding a DB-backed field, update the matching fallback file and types in `types/portfolio.ts`.

There are **three** Supabase clients, kept deliberately separate:
- `lib/supabase.ts` — browser client via `createBrowserClient`; the session lives in a **cookie** (not localStorage) specifically so `proxy.ts` can read it server-side.
- `lib/supabase-data.ts` — anon-key reads with the fallback behavior above.
- `lib/supabase-admin.ts` — **`service_role` key, server-only, import ONLY from `app/api/**`.** It bypasses RLS; the env var has no `NEXT_PUBLIC_` prefix so it never reaches a client bundle. Importing it into a client component leaks full DB access.

### Back-office auth: three layers, RLS is the only real one

`/gestion` is protected by three cooperating layers — never rely on just one:
1. `proxy.ts` (matcher `/gestion/:path*`) — server gate; validates the token with `getUser()` (not the forgeable `getSession()`) before any HTML/JS is served.
2. `app/gestion/layout.tsx` — client guard; enforces a **30-minute inactivity timeout** via a separate cookie (`lib/admin-session.ts`), because `@supabase/ssr` forces a 400-day max-age on its own cookies. Syncs sign-out across tabs via BroadcastChannel.
3. **Supabase RLS** (`supabase/migrations/002_security_hardening.sql`) — the only thing that actually protects the data. Writes are restricted to `is_admin()` (session email in `admin_emails`).

### Content ingestion: the n8n blog webhook

`app/api/blog/webhook/route.ts` receives AI-written articles from an n8n RSS workflow (`docs/n8n/`). It writes with the `service_role` key (a webhook has no session). Two deliberate guardrails: articles are **always created as drafts** (`published: false`, nothing reaches the public site without a human click in `/gestion/blog`), and incoming HTML passes through the same `lib/sanitize.ts` TipTap whitelist as rendering.

### i18n: French source, runtime auto-translation

French is the source language. Static UI strings are hardcoded in `lib/i18n.ts` (fr/en). **Dynamic DB content** is translated at runtime: wrap it in the `<T>` component (`components/ui/T.tsx`) / `useAutoTranslate` hook, which call the MyMemory API through `lib/translator.ts` (chunked + cached). New external domains used this way must be added to the CSP.

### Security headers / CSP

`next.config.ts` sets a strict Content-Security-Policy and security headers on every route. Any new external origin (API, script, image host) must be whitelisted in the relevant `*-src` directive or it fails silently in production. Uploaded images are served from Supabase Storage (`*.supabase.co/storage/v1/object/public/**`), already allowed in both `remotePatterns` and `img-src`.

### Rich text

Back-office editing uses TipTap (`components/gestion/RichTextEditor.tsx`). `lib/sanitize.ts` defines the allowed-tags whitelist and is the single sanitization point for both webhook input and article rendering — keep editor capabilities and the whitelist in sync.

### Routing map

- `app/(public)/` — public site (home, `blog/[slug]`, `projets`, `services/[slug]`). Service/blog pages use `generateStaticParams`; be careful with uncached `fetch` in the root layout (see `getFontPair` in `supabase-data.ts` — it uses a cached REST call precisely to avoid forcing dynamic rendering).
- `app/gestion/` — back-office (content, projects, services, blog, design, seo, settings, login).
- `app/api/` — route handlers (`blog/webhook`, `contact`).

> Note: `naming-suite-main/` is an unrelated vendored Claude Code skills package, not part of the app.
