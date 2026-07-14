# rookide.com — marketing + docs site design

**Date:** 2026-07-14
**Status:** Approved design, pre-implementation
**Repo:** `github.com/incantery/rookide.com`

## Summary

Build the public web presence for [rook](https://github.com/incantery/rook) — an
agent-native IDE (positioned as a new category; shipping today as an AI-native
terminal). This repo hosts **two static sites** from one pnpm workspace:

- **rookide.com** — the marketing site. Vision-forward manifesto whose job is
  _community-building_: find developers who are dissatisfied with today's
  agent/IDE/terminal tooling and give them a "yes, finally" plus a way in.
- **docs.rookide.com** — the documentation site. Freshly authored Markdown
  (mdsvex), a curated launch set; deeper/internal docs link out to the rook repo.

Both are SvelteKit static builds sharing one brand package, deployed as two
Cloudflare Pages projects.

## Goals

1. **Recruit a community**, not just users. Primary action is _join/contribute_
   (GitHub + r/rookide); installing rook is the secondary action.
2. **Be findable.** SEO foundations so people searching for a better tool land here.
3. **Be honest.** Sell the vision, but show where rook actually is today so "it is
   early" stays credible.
4. **Feel like the product.** Reuse rook's Night Owl palette and type so the site
   and the app are visibly one thing.

## Non-goals (v1)

- No blog / long-form content surface (may come later; foundations don't preclude it).
- No pulling docs from `rook/docs` at build time — content is authored fresh here.
- No newsletter/email capture, Discord, or auth. GitHub + subreddit only.
- No CMS. Content is files in the repo.
- No real logo yet — the `♜` chess-rook glyph is the interim wordmark.

## Positioning & audience

- **Positioning:** vision-forward. Lead with the "agent-native IDE / new category"
  manifesto. The terminal-replacement reality is the credibility section, not the hero.
- **Audience:** developers frustrated with managing coding agents through scattered
  windows, tabs, chats, and terminal sessions — people actively looking for what's next.
- **Voice:** confident, essayistic, honest about being early. Recruitment, not sales.

## Architecture

### Monorepo layout (pnpm workspace)

```
rookide.com/
├─ pnpm-workspace.yaml
├─ package.json                # root: shared dev scripts, formatter config
├─ packages/
│  └─ ui/                      # @rookide/ui — single source of brand truth
│     ├─ src/theme.css         #   Night Owl tokens as Tailwind v4 @theme
│     ├─ src/lib/              #   shared Svelte components (see below)
│     └─ src/fonts/            #   self-hosted mono + sans (no external CDN)
├─ apps/
│  ├─ web/                     # rookide.com (marketing)
│  │  ├─ src/routes/           #   +layout.svelte, +page.svelte (landing)
│  │  ├─ src/routes/+layout.ts #   export const prerender = true
│  │  ├─ static/               #   og image, favicon, robots.txt
│  │  └─ svelte.config.js      #   adapter-static
│  └─ docs/                    # docs.rookide.com
│     ├─ content/              #   authored Markdown (install.md, config.md, …)
│     ├─ src/routes/           #   mdsvex render + generated sidebar
│     ├─ static/
│     └─ svelte.config.js      #   adapter-static + mdsvex
```

`packages/ui` is the load-bearing decision: both apps import theme + components
from it, so a brand change happens in one place. Cost accepted: both apps declare
`@rookide/ui` as a workspace dependency and Vite transpiles it; minor wiring in
exchange for zero brand drift.

### `@rookide/ui` contents

- `theme.css` — Tailwind v4 `@theme` block with rook's tokens
  (`--color-acc #82aaff`, `--color-grn #c3e88d`, `--color-amber #ffcb6b`,
  `--color-red #ff5370`, `--color-fg #d6deeb`, `--color-dim #8f93a2`,
  bg `#0f111a`), mono + sans font families.
- Components: `Nav`, `Footer`, `Button`, `InstallChip` (the `curl … | sh` copy
  chip), `Prose` (long-form typography wrapper), `TerminalFrame` (the fake-terminal
  mockup used decoratively on the landing).
- Self-hosted fonts: a mono (Hack/SF Mono family) for code, labels, and kickers;
  a clean sans for paragraph-length prose (mono reads poorly at length).

## The marketing site (apps/web)

Single prerendered landing page (`/`). Section flow, top to bottom:

1. **Nav** — `♜ rook` wordmark; links: Vision (in-page), Docs (→ docs.rookide.com),
   GitHub. Right-aligned "Join" button.
2. **Hero / manifesto** — the approved copy:
   - Kicker: "An open-source experiment"
   - H1: "The IDE was built for one developer, one repository, and one task at a time."
   - Lead: "That is no longer how software gets built."
   - Body: agents work across many tasks/repos/terminals/reviews at once, but
     today's tools force scattered windows/tabs/chats/sessions.
   - Body: "Rook is an experiment in what comes next: an agent-native IDE built
     around persistent workspaces, concurrent agent sessions, review, and
     attention management."
   - Early note: "It is early. The shape of this new category is not settled yet."
   - CTAs: primary **Join us in building it →** (GitHub); secondary **Install** (curl chip).
3. **The shift** — expands the manifesto's middle: one dev / one repo / one task →
   concurrent agents across everything. The problem, named sharply so a frustrated
   reader nods.
4. **Where it is today** — the honest bridge. Rook is a real terminal you can
   install now (replaces ghostty+tmux, muscle-memory parity); the agent is being
   built from inside a tool that's already trusted. Keeps "it is early" credible
   and gives dissatisfied-today readers something concrete.
5. **Join / Install** — community CTA block. Primary: GitHub (repo + Discussions)
   and **r/rookide**. Secondary: `curl -fsSL … | sh` install one-liner.
6. **Footer** — GitHub, incantery, docs, MIT license.

## The docs site (apps/docs)

- **Engine:** SvelteKit + mdsvex. Markdown lives in `content/`; mdsvex renders it
  and allows inline Svelte components (callouts, code tabs).
- **Navigation:** left sidebar auto-generated from the `content/` file tree (order
  via frontmatter or a manifest). Prose via the shared `Prose` component; code
  blocks in rook's palette.
- **Launch set** (authored fresh, web-curated — not synced from rook/docs):
  - **Install** — the curl one-liner, what it installs, upgrades (`rookctl update`).
  - **Configuration** — the `~/.config/rook/config` surface, adapted from
    `config.sample`; note secrets live in the keychain.
  - **Getting started / parity** — what works today, the ghostty+tmux parity story.
  - **Architecture / vision** — the category thesis and key architecture decisions,
    web-readable.
- Deeper/internal docs (agent.md, key-repeat.md, raw config.sample) link out to the
  rook GitHub repo rather than being duplicated.

## SEO (foundations only)

Applied to both sites, per page:

- Semantic HTML and a sensible heading hierarchy.
- Unique `<title>` and `<meta name="description">`.
- Open Graph + Twitter card tags; a static OG image per site.
- `sitemap.xml` and `robots.txt`.
- JSON-LD (`SoftwareApplication` for the marketing site; `TechArticle`/docs schema
  for doc pages).
- Target terms woven naturally into landing + docs copy (e.g. "agent-native IDE,"
  "concurrent coding agents," "managing multiple agents," "tmux/terminal for agents").
- No blog surface in v1.

## Tech stack

- **SvelteKit** with `@sveltejs/adapter-static`, fully prerendered
  (`export const prerender = true` at the root layout of each app). No SSR/server.
- **Tailwind v4** via `@tailwindcss/vite`; theme imported from `@rookide/ui`.
  Preflight is enabled here (fresh sites), unlike rook where it is intentionally off.
- **mdsvex** for docs Markdown.
- **Svelte 5**, matching rook's frontend.
- Self-hosted fonts; no external network dependencies at runtime.

## Build & deploy

- Two **Cloudflare Pages** projects, git-connected to this repo:
  - `web`: build `pnpm --filter web build`, publish `apps/web/build`, domain
    `rookide.com` (+ `www` redirect).
  - `docs`: build `pnpm --filter docs build`, publish `apps/docs/build`, domain
    `docs.rookide.com`.
- Push-to-`main` deploys production; PRs get preview URLs.
- Root `package.json` scripts: `dev:web`, `dev:docs`, `build:web`, `build:docs`,
  `build` (both), `format`, `check`.

## Testing & verification

- `svelte-check` (types) and a lint/format pass (match rook's oxlint/oxfmt or use
  prettier — decide at plan time) run in CI and locally.
- A build of both apps must succeed and prerender with no unresolved routes.
- Manual verification: run each app's `build` + `preview`, click through the
  landing and docs sidebar, confirm meta/OG tags render and internal/external links
  resolve. Lighthouse pass on the landing page for the SEO/perf foundations.
- (Component-level unit tests are light for a mostly-static content site; reserve
  tests for any non-trivial logic like the docs sidebar generator.)

## Open questions / deferred

- **CTA order confirmation:** assuming primary = Join, secondary = Install. Easy to flip.
- **Real logo** replacing the `♜` glyph — later.
- **Docs → rook/docs sync:** deferred; authored fresh for now. If duplication
  becomes painful, revisit a build-time pull.
- **Blog/content surface** for deeper SEO — deferred past v1.
- **Analytics** (privacy-friendly, e.g. Cloudflare Web Analytics) — not in v1 unless wanted.
