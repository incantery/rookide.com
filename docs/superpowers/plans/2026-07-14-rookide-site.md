# rookide.com Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two prerendered SvelteKit sites — rookide.com (vision-forward marketing) and docs.rookide.com (mdsvex docs) — from one pnpm workspace, sharing a brand package, deployable to Cloudflare Pages.

**Architecture:** A pnpm workspace with `packages/ui` (the single source of brand truth: Tailwind v4 theme tokens + shared Svelte 5 components) consumed by two independent SvelteKit apps, `apps/web` and `apps/docs`. Both use `@sveltejs/adapter-static` and prerender fully — no server runtime. Docs content is authored Markdown rendered by mdsvex with a sidebar generated from the content tree.

**Tech Stack:** pnpm workspaces, SvelteKit 2 + Svelte 5, `@sveltejs/adapter-static` 3, Tailwind CSS v4 (`@tailwindcss/vite`), mdsvex 0.12, Vitest 4, Cloudflare Pages.

## Global Constraints

- **Node/pnpm:** pnpm workspace; pnpm 9+. Node 20+.
- **Exact dependency floors** (use these caret ranges verbatim): `svelte@^5.56.5`, `@sveltejs/kit@^2.69.3`, `@sveltejs/adapter-static@^3.0.10`, `@sveltejs/vite-plugin-svelte@^7.2.0`, `vite@^8.1.4`, `tailwindcss@^4.3.2`, `@tailwindcss/vite@^4.3.2`, `mdsvex@^0.12.7`, `vitest@^4.1.10`.
- **No external network dependencies at runtime.** No font/script/style CDNs. Fonts use system stacks (see below); no webfont binaries in v1.
- **Fully prerendered.** Every app sets `export const prerender = true` in its root layout; no SSR endpoints.
- **Brand tokens (Night Owl), copied verbatim** — these are the exact hex values, do not alter:
  `--color-acc:#82aaff` · `--color-grn:#c3e88d` · `--color-amber:#ffcb6b` · `--color-red:#ff5370` · `--color-fg:#d6deeb` · `--color-dim:#8f93a2` · `--color-lo:#5b6273` · background `#0f111a` · `--color-surface:#0b0e17` (darker terminal/code surface). Components reference tokens via Tailwind utilities (`bg-surface`, `text-acc`, …), never a raw hex. Svelte 5 `$props()` takes no type argument — type it with a destructuring annotation (`let { … }: { … } = $props()`), not `$props<T>()`.
- **Font stacks (system, no webfonts in v1):** mono = `"SF Mono", Menlo, ui-monospace, "Cascadia Code", monospace`; sans = `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. (Spec called for self-hosted fonts; simplified to system stacks for v1 to stay CSP-clean with zero binaries. Self-hosting a branded sans is deferred.)
- **Brand truth lives once** in `packages/ui`. Apps must not redefine color/font tokens locally.
- **Wordmark:** interim is the `♜` glyph + "rook". No logo asset yet.
- **Community links:** GitHub repo `https://github.com/incantery/rook`, subreddit `https://reddit.com/r/rookide`. Install one-liner: `curl -fsSL https://raw.githubusercontent.com/incantery/rook/main/install.sh | sh`.
- **CTA order:** primary = Join (GitHub/subreddit), secondary = Install.
- **Commit after every task.** DRY, YAGNI, TDD where logic exists.

---

## File Structure

```
rookide.com/
├─ pnpm-workspace.yaml            # workspace globs
├─ package.json                   # root scripts, prettier
├─ .prettierrc                    # formatting
├─ packages/ui/
│  ├─ package.json                # @rookide/ui, svelte export condition
│  ├─ src/theme.css               # @theme tokens + base
│  └─ src/lib/
│     ├─ index.ts                 # re-exports
│     ├─ Nav.svelte
│     ├─ Footer.svelte
│     ├─ Button.svelte
│     ├─ InstallChip.svelte
│     ├─ Prose.svelte
│     ├─ TerminalFrame.svelte
│     └─ links.ts                 # canonical URLs (DRY)
├─ apps/web/
│  ├─ package.json
│  ├─ svelte.config.js            # adapter-static
│  ├─ vite.config.ts              # tailwind + svelte plugins
│  ├─ tsconfig.json
│  ├─ src/app.html
│  ├─ src/app.css                 # imports @rookide/ui theme
│  ├─ src/lib/seo.ts              # meta helper (shared logic → tested)
│  ├─ src/routes/+layout.ts       # prerender = true
│  ├─ src/routes/+layout.svelte
│  ├─ src/routes/+page.svelte     # the landing page
│  ├─ src/routes/sitemap.xml/+server.ts
│  ├─ static/robots.txt
│  └─ static/_headers             # Cloudflare headers
├─ apps/docs/
│  ├─ package.json
│  ├─ svelte.config.js            # adapter-static + mdsvex
│  ├─ vite.config.ts
│  ├─ tsconfig.json
│  ├─ mdsvex.config.js
│  ├─ src/app.html
│  ├─ src/app.css
│  ├─ src/lib/nav.ts              # sidebar generator (pure → TDD)
│  ├─ src/lib/nav.test.ts
│  ├─ content/                    # authored markdown
│  │  ├─ install.md
│  │  ├─ configuration.md
│  │  ├─ getting-started.md
│  │  └─ architecture.md
│  ├─ src/routes/+layout.ts
│  ├─ src/routes/+layout.svelte   # sidebar + prose shell
│  ├─ src/routes/+page.svelte     # docs index
│  ├─ src/routes/[...slug]/+page.ts
│  ├─ src/routes/[...slug]/+page.svelte
│  ├─ src/routes/sitemap.xml/+server.ts
│  └─ static/robots.txt
└─ README.md                      # repo + deploy docs
```

---

### Task 1: Workspace scaffold

**Files:**

- Create: `pnpm-workspace.yaml`, `package.json`, `.prettierrc`, `.nvmrc`
- (`.gitignore` already exists)

**Interfaces:**

- Produces: a working pnpm workspace; root scripts `dev:web`, `dev:docs`, `build:web`, `build:docs`, `build`, `check`, `format`.

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

- [ ] **Step 2: Create root `package.json`**

```json
{
  "name": "rookide.com",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.10.0",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:docs": "pnpm --filter docs dev",
    "build:web": "pnpm --filter web build",
    "build:docs": "pnpm --filter docs build",
    "build": "pnpm -r build",
    "check": "pnpm -r check",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "prettier-plugin-svelte": "^3.2.6"
  }
}
```

- [ ] **Step 3: Create `.prettierrc`**

```json
{
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

- [ ] **Step 4: Create `.nvmrc`**

```
20
```

- [ ] **Step 5: Install and verify workspace resolves**

Run: `pnpm install`
Expected: completes without error; creates `pnpm-lock.yaml`. (No packages yet — that's fine.)

- [ ] **Step 6: Commit**

```bash
git add pnpm-workspace.yaml package.json .prettierrc .nvmrc pnpm-lock.yaml
git commit -m "chore: scaffold pnpm workspace"
```

---

### Task 2: `@rookide/ui` — theme + package setup

**Files:**

- Create: `packages/ui/package.json`, `packages/ui/src/theme.css`

**Interfaces:**

- Produces: package `@rookide/ui` with export `"./theme.css"` → `src/theme.css` (imported by both apps' `app.css`). Defines all brand tokens as Tailwind v4 `@theme` variables.

- [ ] **Step 1: Create `packages/ui/package.json`**

```json
{
  "name": "@rookide/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "svelte": "./src/lib/index.ts",
  "exports": {
    ".": { "svelte": "./src/lib/index.ts", "default": "./src/lib/index.ts" },
    "./theme.css": "./src/theme.css",
    "./links": "./src/lib/links.ts"
  },
  "peerDependencies": { "svelte": "^5.56.5" }
}
```

- [ ] **Step 2: Create `packages/ui/src/theme.css`**

```css
/* @rookide/ui — the single source of brand truth.
   Night Owl palette + system font stacks, exposed as Tailwind v4 theme
   tokens. Both apps @import this after "tailwindcss". */
@theme {
  --color-bg: #0f111a;
  --color-acc: #82aaff;
  --color-grn: #c3e88d;
  --color-amber: #ffcb6b;
  --color-red: #ff5370;
  --color-fg: #d6deeb;
  --color-dim: #8f93a2;
  --color-lo: #5b6273;
  --color-surface: #0b0e17;

  --font-mono: 'SF Mono', Menlo, ui-monospace, 'Cascadia Code', monospace;
  --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* Global base shared by both sites. */
:root {
  color-scheme: dark;
}
html {
  background: var(--color-bg);
}
body {
  margin: 0;
  min-height: 100%;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: Install svelte as a dev dependency of the workspace root (so peer resolves)**

Run: `pnpm add -w -D svelte@^5.56.5`
Expected: adds svelte to root devDependencies.

- [ ] **Step 4: Verify the package is discoverable**

Run: `pnpm --filter @rookide/ui exec node -e "console.log('ui ok')"`
Expected: prints `ui ok` (confirms pnpm resolves the workspace package).

- [ ] **Step 5: Commit**

```bash
git add packages/ui package.json pnpm-lock.yaml
git commit -m "feat(ui): add brand theme package"
```

---

### Task 3: `@rookide/ui` — shared components

**Files:**

- Create: `packages/ui/src/lib/links.ts`, `Button.svelte`, `InstallChip.svelte`, `Nav.svelte`, `Footer.svelte`, `Prose.svelte`, `TerminalFrame.svelte`, `index.ts`

**Interfaces:**

- Consumes: theme tokens from Task 2 (Tailwind utility classes like `text-acc`, `bg-bg`, `font-mono`).
- Produces:
  - `links` object: `{ github: string, subreddit: string, docs: string, install: string, license: string }`
  - `<Button href variant>` — `variant: 'solid' | 'ghost'` (default `'solid'`), renders an `<a>`.
  - `<InstallChip />` — renders the install command in a mono chip with click-to-copy.
  - `<Nav />` — top bar: wordmark + links + Join button.
  - `<Footer />` — bottom links + license.
  - `<Prose>` (snippet children) — long-form typography wrapper.
  - `<TerminalFrame title>` — decorative fake terminal; children are body lines.

- [ ] **Step 1: Create `packages/ui/src/lib/links.ts`**

```ts
export const links = {
  github: 'https://github.com/incantery/rook',
  subreddit: 'https://reddit.com/r/rookide',
  docs: 'https://docs.rookide.com',
  install: 'curl -fsSL https://raw.githubusercontent.com/incantery/rook/main/install.sh | sh',
  license: 'https://github.com/incantery/rook/blob/main/LICENSE'
};
```

- [ ] **Step 2: Create `packages/ui/src/lib/Button.svelte`**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    href,
    variant = 'solid',
    children
  }: { href: string; variant?: 'solid' | 'ghost'; children: Snippet } = $props();
</script>

<a
  {href}
  class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold transition-colors
    {variant === 'solid'
    ? 'bg-acc text-surface hover:brightness-110'
    : 'border border-lo/50 text-fg hover:border-acc/60'}"
>
  {@render children()}
</a>
```

- [ ] **Step 3: Create `packages/ui/src/lib/InstallChip.svelte`**

```svelte
<script lang="ts">
  import { links } from './links';
  let copied = $state(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(links.install);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      copied = false;
    }
  }
</script>

<button
  onclick={copy}
  class="group inline-flex items-center gap-3 rounded-lg border border-acc/35 bg-acc/10 px-3.5 py-2 font-mono text-xs text-acc hover:bg-acc/15"
  aria-label="Copy install command"
>
  <span class="text-dim">$</span>
  <code>{links.install}</code>
  <span class="text-dim group-hover:text-acc">{copied ? 'copied' : 'copy'}</span>
</button>
```

- [ ] **Step 4: Create `packages/ui/src/lib/Nav.svelte`**

```svelte
<script lang="ts">
  import { links } from './links';
  import Button from './Button.svelte';
</script>

<nav class="flex items-center justify-between border-b border-lo/15 px-6 py-4 font-mono text-sm">
  <a href="/" class="font-bold tracking-tight">♜ <span class="text-acc">rook</span></a>
  <div class="flex items-center gap-5">
    <a href="#vision" class="text-dim hover:text-fg">Vision</a>
    <a href={links.docs} class="text-dim hover:text-fg">Docs</a>
    <a href={links.github} class="text-dim hover:text-fg">GitHub</a>
    <Button href={links.github}>Join</Button>
  </div>
</nav>
```

- [ ] **Step 5: Create `packages/ui/src/lib/Footer.svelte`**

```svelte
<script lang="ts">
  import { links } from './links';
</script>

<footer class="border-t border-lo/15 px-6 py-8 font-mono text-xs text-dim">
  <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
    <span>♜ rook — an incantery experiment</span>
    <div class="flex gap-5">
      <a href={links.github} class="hover:text-fg">GitHub</a>
      <a href={links.subreddit} class="hover:text-fg">r/rookide</a>
      <a href={links.docs} class="hover:text-fg">Docs</a>
      <a href={links.license} class="hover:text-fg">MIT</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 6: Create `packages/ui/src/lib/Prose.svelte`**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div
  class="prose-rook max-w-none
    [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight
    [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold
    [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold
    [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-fg/90
    [&_a]:text-acc [&_a:hover]:underline
    [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1
    [&_code]:rounded [&_code]:bg-lo/20 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-grn
    [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-lo/20 [&_pre]:bg-surface [&_pre]:p-4
    [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-fg"
>
  {@render children()}
</div>
```

- [ ] **Step 7: Create `packages/ui/src/lib/TerminalFrame.svelte`**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { title = 'rook', children }: { title?: string; children: Snippet } = $props();
</script>

<div class="overflow-hidden rounded-xl border border-lo/25 bg-surface font-mono text-sm">
  <div class="flex items-center gap-2 border-b border-lo/15 bg-white/[0.02] px-3 py-2">
    <span class="h-2.5 w-2.5 rounded-full bg-red" aria-hidden="true"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-amber" aria-hidden="true"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-grn" aria-hidden="true"></span>
    <span class="ml-2 text-xs text-dim">{title}</span>
  </div>
  <div class="p-4 leading-relaxed">
    {@render children()}
  </div>
</div>
```

- [ ] **Step 8: Create `packages/ui/src/lib/index.ts`**

```ts
export { default as Nav } from './Nav.svelte';
export { default as Footer } from './Footer.svelte';
export { default as Button } from './Button.svelte';
export { default as InstallChip } from './InstallChip.svelte';
export { default as Prose } from './Prose.svelte';
export { default as TerminalFrame } from './TerminalFrame.svelte';
export { links } from './links';
```

- [ ] **Step 9: Commit** (components compile when first consumed by `apps/web` in Task 5; there is no standalone build for the source-only package)

```bash
git add packages/ui/src/lib
git commit -m "feat(ui): add shared brand components"
```

---

### Task 4: `apps/web` — SvelteKit static scaffold

**Files:**

- Create: `apps/web/package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte` (placeholder)

**Interfaces:**

- Consumes: `@rookide/ui` theme + components.
- Produces: a buildable, fully-prerendered SvelteKit app that outputs static files to `apps/web/build`.

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "dependencies": { "@rookide/ui": "workspace:*" },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.69.3",
    "@sveltejs/vite-plugin-svelte": "^7.2.0",
    "@tailwindcss/vite": "^4.3.2",
    "svelte": "^5.56.5",
    "svelte-check": "^4.1.0",
    "tailwindcss": "^4.3.2",
    "typescript": "^5.6.0",
    "vite": "^8.1.4"
  }
}
```

- [ ] **Step 2: Create `apps/web/svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: null }),
    prerender: { handleHttpError: 'fail' }
  }
};
```

- [ ] **Step 3: Create `apps/web/vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

- [ ] **Step 4: Create `apps/web/tsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 5: Create `apps/web/src/app.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%99%9C%3C/text%3E%3C/svg%3E"
    />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 6: Create `apps/web/src/app.css`**

```css
@import 'tailwindcss';
@import '@rookide/ui/theme.css';
/* Tailwind v4 ignores node_modules, so it won't scan the @rookide/ui
   workspace package by default — component-only utilities (bg-surface,
   border-lo/25, the dot colors) would be missing. @source makes Tailwind
   scan the shared components. */
@source '../../../packages/ui/src';
```

> Integration note: Tailwind v4 must see the `@theme` block from the imported
> package to emit color/font utilities. `@tailwindcss/vite` resolves `@import`
> and processes imported `@theme` — but if Step 11 shows missing utilities
> (e.g. `text-acc` not generated), add `@source '../../../packages/ui/src';` to
> this file so Tailwind scans the shared components, and confirm the import path
> resolves. The build/preview in Steps 10–11 is the checkpoint.

- [ ] **Step 7: Create `apps/web/src/routes/+layout.ts`**

```ts
export const prerender = true;
```

- [ ] **Step 8: Create `apps/web/src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
```

- [ ] **Step 9: Create placeholder `apps/web/src/routes/+page.svelte`**

```svelte
<h1 class="p-10 font-mono text-acc">rook — scaffold ok</h1>
```

- [ ] **Step 10: Install and build**

Run: `pnpm install && pnpm --filter web build`
Expected: build succeeds; `apps/web/build/index.html` exists and contains `scaffold ok`.

- [ ] **Step 11: Verify prerendered output contains the token color (Tailwind + theme wired)**

Run: `grep -rl "0f111a\|--color-acc\|text-acc" apps/web/build || echo "check css output"`
Expected: the built CSS references the theme (acc color / bg). If the class is tree-shaken, confirm the page still renders by opening `pnpm --filter web preview`.

- [ ] **Step 12: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat(web): scaffold static sveltekit app"
```

---

### Task 5: `apps/web` — landing page

**Files:**

- Modify: `apps/web/src/routes/+page.svelte` (replace placeholder)

**Interfaces:**

- Consumes: `Nav`, `Footer`, `Button`, `InstallChip`, `TerminalFrame`, `links` from `@rookide/ui`.
- Produces: the full marketing landing page (hero/manifesto → the shift → where it is today → join/install → footer).

- [ ] **Step 1: Replace `apps/web/src/routes/+page.svelte` with the full landing page**

```svelte
<script lang="ts">
  import { Nav, Footer, Button, InstallChip, TerminalFrame, links } from '@rookide/ui';
</script>

<div class="min-h-screen bg-bg font-sans text-fg">
  <Nav />

  <!-- Hero / manifesto -->
  <header
    id="vision"
    class="mx-auto max-w-3xl px-6 pt-16 pb-14
      [background:radial-gradient(1100px_460px_at_50%_-10%,rgba(130,170,255,.10),transparent_60%)]"
  >
    <p class="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-dim">
      ◆ An open-source experiment
    </p>
    <h1 class="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
      The IDE was built for one developer, one repository, and
      <span class="text-acc">one task at a time.</span>
    </h1>
    <p class="mb-4 text-lg leading-relaxed">That is no longer how software gets built.</p>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      Coding agents can work across multiple tasks, repositories, terminals, and review cycles at
      once. But today's tools still make you manage that work through
      <span class="text-fg">scattered windows, tabs, chats, and terminal sessions.</span>
    </p>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      Rook is an experiment in what comes next: an <span class="text-fg">agent-native IDE</span>
      built around persistent workspaces, concurrent agent sessions, review, and attention management.
    </p>
    <p class="my-7 font-mono text-sm text-amber">
      It is early. The shape of this new category is not settled yet.
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <Button href={links.github}>Join us in building it →</Button>
      <InstallChip />
    </div>
  </header>

  <!-- The shift -->
  <section class="mx-auto max-w-3xl px-6 py-14">
    <h2 class="mb-4 text-2xl font-bold">The shift</h2>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      One developer. One repository. One task at a time. Every tool we use — the editor, the
      terminal, the review UI — quietly assumes it. That assumption is breaking.
    </p>
    <p class="max-w-[62ch] leading-relaxed text-dim">
      When several agents work in parallel across repositories, the bottleneck stops being how fast
      you can type and becomes how well you can <span class="text-fg"
        >direct, review, and stay oriented</span
      > across all of it at once. That is the problem rook is built around.
    </p>
  </section>

  <!-- Where it is today -->
  <section class="mx-auto max-w-3xl px-6 py-14">
    <h2 class="mb-4 text-2xl font-bold">Where it is today</h2>
    <p class="mb-6 max-w-[62ch] leading-relaxed text-dim">
      Rook is a real terminal you can install now — a desktop app that replaces ghostty + tmux,
      built for muscle-memory parity first. The agent is being built from inside a tool that is
      already trusted. Parity first, magic second.
    </p>
    <TerminalFrame title="rook — 1 · main">
      <div>
        <span class="text-grn">agent</span> <span class="text-dim">▸ split pane, run tests</span>
      </div>
      <div class="text-dim">✓ 42 passing · 0.8s</div>
      <div>
        <span class="text-acc">~/rook</span> ❯ <span class="border-b-2 border-acc">&nbsp;</span>
      </div>
    </TerminalFrame>
  </section>

  <!-- Join / Install -->
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h2 class="mb-3 text-2xl font-bold">Join us in building it</h2>
    <p class="mb-6 max-w-[60ch] leading-relaxed text-dim">
      If the tools you have today do not fit the way you actually work with agents, come help define
      what replaces them.
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <Button href={links.github}>GitHub — star & discuss</Button>
      <Button href={links.subreddit} variant="ghost">r/rookide</Button>
    </div>
    <div class="mt-6"><InstallChip /></div>
  </section>

  <Footer />
</div>
```

- [ ] **Step 2: Build and verify content is present**

Run: `pnpm --filter web build && grep -q "one task at a time" apps/web/build/index.html && grep -q "Where it is today" apps/web/build/index.html && echo CONTENT_OK`
Expected: prints `CONTENT_OK`.

- [ ] **Step 3: Visually verify (manual)**

Run: `pnpm --filter web preview` and open the printed URL.
Expected: dark Night Owl page, hero manifesto, install chip copies on click, all sections render, links point to github/reddit.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/+page.svelte
git commit -m "feat(web): build vision-forward landing page"
```

---

### Task 6: `apps/web` — SEO foundations

**Files:**

- Create: `apps/web/src/lib/seo.ts`, `apps/web/src/lib/seo.test.ts`, `apps/web/src/routes/sitemap.xml/+server.ts`, `apps/web/static/robots.txt`, `apps/web/static/_headers`, `apps/web/vitest.config.ts`
- Modify: `apps/web/src/routes/+layout.svelte` (add `<svelte:head>` meta), `apps/web/package.json` (add vitest + test script)

**Interfaces:**

- Consumes: nothing new.
- Produces: `buildMeta(input: { title: string; description: string; url: string; image?: string }): MetaTags` where `MetaTags` is `{ title: string; tags: Array<{ name?: string; property?: string; content: string }> }`. Used to render `<meta>` in head.

- [ ] **Step 1: Add vitest to `apps/web/package.json`**

Add to `devDependencies`: `"vitest": "^4.1.10"`. Add to `scripts`: `"test": "vitest run"`. Then run `pnpm install`.

- [ ] **Step 2: Create `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
```

- [ ] **Step 3: Write the failing test `apps/web/src/lib/seo.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildMeta } from './seo';

describe('buildMeta', () => {
  it('produces title, description, canonical, and OG/Twitter tags', () => {
    const m = buildMeta({
      title: 'rook — agent-native IDE',
      description: 'An experiment in what comes next.',
      url: 'https://rookide.com/',
      image: 'https://rookide.com/og.png'
    });
    expect(m.title).toBe('rook — agent-native IDE');
    const byKey = (k: string, v: string) => m.tags.find((t) => t.name === v || t.property === v);
    expect(byKey('name', 'description')?.content).toBe('An experiment in what comes next.');
    expect(byKey('property', 'og:title')?.content).toBe('rook — agent-native IDE');
    expect(byKey('property', 'og:image')?.content).toBe('https://rookide.com/og.png');
    expect(byKey('name', 'twitter:card')?.content).toBe('summary_large_image');
    expect(m.canonical).toBe('https://rookide.com/');
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm --filter web test`
Expected: FAIL — `buildMeta` not found.

- [ ] **Step 5: Implement `apps/web/src/lib/seo.ts`**

```ts
export type MetaTag = { name?: string; property?: string; content: string };
export type Meta = { title: string; canonical: string; tags: MetaTag[] };

export function buildMeta(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
}): Meta {
  const image = input.image ?? 'https://rookide.com/og.png';
  return {
    title: input.title,
    canonical: input.url,
    tags: [
      { name: 'description', content: input.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: input.url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: image }
    ]
  };
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm --filter web test`
Expected: PASS.

- [ ] **Step 7: Wire meta into `apps/web/src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import '../app.css';
  import { buildMeta } from '$lib/seo';
  let { children } = $props();
  const meta = buildMeta({
    title: 'rook — an agent-native IDE',
    description:
      'Coding agents work across many tasks and repositories at once. Rook is an open-source experiment in the agent-native IDE that comes next.',
    url: 'https://rookide.com/'
  });
</script>

<svelte:head>
  <title>{meta.title}</title>
  <link rel="canonical" href={meta.canonical} />
  {#each meta.tags as t}
    {#if t.name}<meta name={t.name} content={t.content} />{/if}
    {#if t.property}<meta property={t.property} content={t.content} />{/if}
  {/each}
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'rook',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS',
    description: meta.tags.find((t) => t.name === 'description')?.content,
    url: 'https://rookide.com/'
  })}<\/script>`}
</svelte:head>

{@render children()}
```

- [ ] **Step 8: Create `apps/web/src/routes/sitemap.xml/+server.ts`**

```ts
export const prerender = true;

export function GET() {
  const urls = ['https://rookide.com/'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
```

- [ ] **Step 9: Create `apps/web/static/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://rookide.com/sitemap.xml
```

- [ ] **Step 10: Create `apps/web/static/_headers`** (Cloudflare Pages security headers)

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

- [ ] **Step 11: Build and verify SEO artifacts**

Run: `pnpm --filter web build && test -f apps/web/build/sitemap.xml && test -f apps/web/build/robots.txt && grep -q "og:title" apps/web/build/index.html && grep -q "application/ld+json" apps/web/build/index.html && echo SEO_OK`
Expected: prints `SEO_OK`.

- [ ] **Step 12: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat(web): add SEO foundations (meta, OG, sitemap, robots, JSON-LD)"
```

---

### Task 7: `apps/docs` — SvelteKit + mdsvex scaffold

**Files:**

- Create: `apps/docs/package.json`, `svelte.config.js`, `mdsvex.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+layout.svelte` (minimal), `src/routes/+page.svelte` (placeholder)

**Interfaces:**

- Consumes: `@rookide/ui` theme + `Prose`.
- Produces: a buildable static docs app that compiles `.md`/`.svx` through mdsvex.

- [ ] **Step 1: Create `apps/docs/package.json`**

```json
{
  "name": "docs",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run"
  },
  "dependencies": { "@rookide/ui": "workspace:*" },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.69.3",
    "@sveltejs/vite-plugin-svelte": "^7.2.0",
    "@tailwindcss/vite": "^4.3.2",
    "mdsvex": "^0.12.7",
    "svelte": "^5.56.5",
    "svelte-check": "^4.1.0",
    "tailwindcss": "^4.3.2",
    "typescript": "^5.6.0",
    "vite": "^8.1.4",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Create `apps/docs/mdsvex.config.js`**

```js
import { defineMDSveXConfig as defineConfig } from 'mdsvex';

export default defineConfig({
  extensions: ['.md', '.svx']
});
```

- [ ] **Step 3: Create `apps/docs/svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter({ fallback: null }),
    prerender: { handleHttpError: 'fail' }
  }
};
```

- [ ] **Step 4: Create `apps/docs/vite.config.ts`** (identical plugin set to web)

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

- [ ] **Step 5: Create `apps/docs/tsconfig.json`** (same as web)

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 6: Create `apps/docs/src/app.html`** (same shell as web, title differs at page level)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%99%9C%3C/text%3E%3C/svg%3E"
    />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 7: Create `apps/docs/src/app.css`**

```css
@import 'tailwindcss';
@import '@rookide/ui/theme.css';
/* Tailwind v4 ignores node_modules, so it won't scan the @rookide/ui
   workspace package by default — component-only utilities (bg-surface,
   border-lo/25, the dot colors) would be missing. @source makes Tailwind
   scan the shared components. */
@source '../../../packages/ui/src';
```

- [ ] **Step 8: Create `apps/docs/src/routes/+layout.ts`**

```ts
export const prerender = true;
```

- [ ] **Step 9: Create minimal `apps/docs/src/routes/+layout.svelte`** (replaced in Task 8)

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
```

- [ ] **Step 10: Create placeholder `apps/docs/src/routes/+page.svelte`**

```svelte
<h1 class="p-10 font-mono text-acc">rook docs — scaffold ok</h1>
```

- [ ] **Step 11: Install and build**

Run: `pnpm install && pnpm --filter docs build`
Expected: build succeeds; `apps/docs/build/index.html` contains `scaffold ok`.

- [ ] **Step 12: Commit**

```bash
git add apps/docs pnpm-lock.yaml
git commit -m "feat(docs): scaffold static sveltekit + mdsvex app"
```

---

### Task 8: `apps/docs` — sidebar generator (TDD) + doc routing

**Files:**

- Create: `apps/docs/src/lib/nav.ts`, `apps/docs/src/lib/nav.test.ts`, `apps/docs/vitest.config.ts`, `apps/docs/src/routes/[...slug]/+page.ts`, `apps/docs/src/routes/[...slug]/+page.svelte`
- Modify: `apps/docs/src/routes/+layout.svelte` (sidebar + prose shell), `apps/docs/src/routes/+page.svelte` (index)

**Interfaces:**

- Consumes: mdsvex-compiled markdown modules via `import.meta.glob`.
- Produces:
  - `buildNav(files: Record<string, { frontmatter?: { title?: string; order?: number } }>): NavItem[]` where `NavItem = { slug: string; title: string; order: number }`, sorted by `order` then `title`. `slug` is the content filename without extension (e.g. `content/install.md` → `install`).
  - `titleFromSlug(slug: string): string` — fallback title (kebab → Title Case).

- [ ] **Step 1: Create `apps/docs/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
```

- [ ] **Step 2: Write the failing test `apps/docs/src/lib/nav.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildNav, titleFromSlug } from './nav';

describe('titleFromSlug', () => {
  it('converts kebab-case to Title Case', () => {
    expect(titleFromSlug('getting-started')).toBe('Getting Started');
  });
});

describe('buildNav', () => {
  it('derives slug from path, sorts by order then title, falls back to slug title', () => {
    const nav = buildNav({
      '/content/configuration.md': { frontmatter: { title: 'Configuration', order: 2 } },
      '/content/install.md': { frontmatter: { title: 'Install', order: 1 } },
      '/content/architecture.md': {}
    });
    expect(nav.map((n) => n.slug)).toEqual(['install', 'configuration', 'architecture']);
    expect(nav[0].title).toBe('Install');
    expect(nav[2].title).toBe('Architecture');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter docs test`
Expected: FAIL — `buildNav`/`titleFromSlug` not found.

- [ ] **Step 4: Implement `apps/docs/src/lib/nav.ts`**

```ts
export type NavItem = { slug: string; title: string; order: number };
type Mod = { frontmatter?: { title?: string; order?: number } };

export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|svx)$/, '');
}

export function buildNav(files: Record<string, Mod>): NavItem[] {
  const items = Object.entries(files).map(([path, mod]) => {
    const slug = slugFromPath(path);
    return {
      slug,
      title: mod.frontmatter?.title ?? titleFromSlug(slug),
      order: mod.frontmatter?.order ?? 999
    };
  });
  return items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter docs test`
Expected: PASS (both suites).

- [ ] **Step 6: Create `apps/docs/src/routes/[...slug]/+page.ts`** (loads the markdown module for a slug and prerenders all)

```ts
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

const modules = import.meta.glob('/content/*.md');

export const prerender = true;

export const entries: EntryGenerator = () =>
  Object.keys(modules).map((p) => ({
    slug: (p.split('/').pop() ?? '').replace(/\.md$/, '')
  }));

export async function load({ params }) {
  const path = `/content/${params.slug}.md`;
  const loader = modules[path];
  if (!loader) throw error(404, `No doc: ${params.slug}`);
  const mod: any = await loader();
  return { component: mod.default, title: mod.metadata?.title ?? params.slug };
}
```

- [ ] **Step 7: Create `apps/docs/src/routes/[...slug]/+page.svelte`**

```svelte
<script lang="ts">
  import { Prose } from '@rookide/ui';
  let { data } = $props();
  const Component = $derived(data.component);
</script>

<svelte:head><title>{data.title} — rook docs</title></svelte:head>

<Prose>
  <Component />
</Prose>
```

- [ ] **Step 8: Replace `apps/docs/src/routes/+layout.svelte` with the sidebar shell**

```svelte
<script lang="ts">
  import '../app.css';
  import { buildNav } from '$lib/nav';
  import { links } from '@rookide/ui';
  let { children } = $props();
  const files = import.meta.glob('/content/*.md', { eager: true }) as Record<
    string,
    { metadata?: { title?: string; order?: number } }
  >;
  const nav = buildNav(
    Object.fromEntries(Object.entries(files).map(([p, m]) => [p, { frontmatter: m.metadata }]))
  );
</script>

<div class="min-h-screen bg-bg font-sans text-fg">
  <nav class="flex items-center justify-between border-b border-lo/15 px-6 py-4 font-mono text-sm">
    <a href="/" class="font-bold"
      >♜ <span class="text-acc">rook</span> <span class="text-dim">docs</span></a
    >
    <a href={links.github} class="text-dim hover:text-fg">GitHub</a>
  </nav>
  <div class="mx-auto flex max-w-5xl gap-10 px-6 py-10">
    <aside class="w-52 shrink-0">
      <ul class="sticky top-10 space-y-1 font-mono text-sm">
        {#each nav as item}
          <li>
            <a
              href="/{item.slug}"
              class="block rounded px-2 py-1 text-dim hover:bg-lo/15 hover:text-fg"
            >
              {item.title}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
    <main class="min-w-0 flex-1">
      {@render children()}
    </main>
  </div>
</div>
```

- [ ] **Step 9: Replace `apps/docs/src/routes/+page.svelte` with a docs index**

```svelte
<script lang="ts">
  import { Prose } from '@rookide/ui';
</script>

<svelte:head><title>rook docs</title></svelte:head>

<Prose>
  {#snippet children()}
    <h1>rook documentation</h1>
    <p>
      Install rook, configure it, and read the thinking behind the project. Pick a page from the
      sidebar.
    </p>
  {/snippet}
</Prose>
```

> Note: `Prose` takes a `children` snippet. In `[...slug]/+page.svelte` the default slot is passed implicitly via `<Component />` inside the component tags; if the compiler requires an explicit snippet there too, wrap the `<Component />` in `{#snippet children()}…{/snippet}`.

- [ ] **Step 10: Build and verify routing (content added in Task 9, but index must build)**

Run: `pnpm --filter docs build && grep -q "rook documentation" apps/docs/build/index.html && echo DOCS_INDEX_OK`
Expected: prints `DOCS_INDEX_OK`. (No `[...slug]` pages yet — `content/` is empty until Task 9; that is fine, `entries` yields none.)

- [ ] **Step 11: Commit**

```bash
git add apps/docs pnpm-lock.yaml
git commit -m "feat(docs): sidebar generator and markdown routing"
```

---

### Task 9: `apps/docs` — launch content

**Files:**

- Create: `apps/docs/content/install.md`, `configuration.md`, `getting-started.md`, `architecture.md`

**Interfaces:**

- Consumes: mdsvex frontmatter (`title`, `order`) read by `buildNav` and `[...slug]` loader.
- Produces: four rendered doc pages appearing in the sidebar in order.

- [ ] **Step 1: Create `apps/docs/content/install.md`**

````md
---
title: Install
order: 1
---

# Install

rook is a macOS (Apple Silicon) desktop app.

```sh
curl -fsSL https://raw.githubusercontent.com/incantery/rook/main/install.sh | sh
```
````

This installs `/Applications/rook.app` and the `rookctl` CLI from the latest
release. Use the script (not a browser download) — curl skips the quarantine
attribute, so the app launches without Gatekeeper ceremony.

## Upgrades

Upgrades are self-managed:

```sh
rookctl update          # update to the latest release
rookctl update --check  # just look
```

## From source

`make install` — needs Go, node, and the wails3 CLI.

````

- [ ] **Step 2: Create `apps/docs/content/configuration.md`**

```md
---
title: Configuration
order: 2
---

# Configuration

Config lives at `~/.config/rook/config` — ghostty-style `key = value` lines.
The file is optional; missing means defaults.

Secrets (the OpenAI key, the Jira token) live in the macOS keychain, **not**
the config file.

The complete key surface — every setting at its default, commented out — ships
as `docs/config.sample` in the rook repository. Copy it in verbatim and
uncomment what you want to change.
````

- [ ] **Step 3: Create `apps/docs/content/getting-started.md`**

```md
---
title: Getting Started
order: 3
---

# Getting started

rook replaces a ghostty + tmux daily driver. The first goal is muscle-memory
parity — splits, tab and window switching, copy mode, search, scrollback,
clipboard (OSC 52), true color, and your fonts — not a feature matrix.

Once installed, launch `rook.app` and open a pane. Everything is dispatched
through a single command registry, so every action is available from the
command palette, a keybinding, or a click.

The built-in agent is being built from inside the terminal itself. Parity
first, magic second.
```

- [ ] **Step 4: Create `apps/docs/content/architecture.md`**

```md
---
title: Architecture
order: 4
---

# Architecture & vision

rook is an experiment in the **agent-native IDE**: persistent workspaces,
concurrent agent sessions, review, and attention management — built for a world
where several agents work across repositories at once.

A few load-bearing decisions:

- **A single command registry.** Every action is a named command. Clicks,
  keybindings, and (later) the agent's tool surface all dispatch the same
  commands, so the agent can do everything you can — by construction.
- **A separate PTY host process.** The UI can crash, rebuild, and reattach
  without killing shells — the tmux-server model.
- **Shell integration (OSC 133) from the start.** Semantic prompt marks give
  command boundaries, cwd, and exit codes as structure the UI and agent read.

For the full decision log, see the
[rook README](https://github.com/incantery/rook).
```

- [ ] **Step 5: Build and verify all four pages prerender into the sidebar**

Run: `pnpm --filter docs build && for s in install configuration getting-started architecture; do test -f apps/docs/build/$s.html || { echo "MISSING $s"; exit 1; }; done && grep -q "Getting Started" apps/docs/build/install.html && echo DOCS_CONTENT_OK`
Expected: prints `DOCS_CONTENT_OK` (each page exists; the sidebar renders sibling titles on every page).

- [ ] **Step 6: Manual check**

Run: `pnpm --filter docs preview` and click through the sidebar.
Expected: four pages, correct order, code blocks styled in the Night Owl palette.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/content
git commit -m "docs: add launch content (install, config, getting started, architecture)"
```

---

### Task 10: `apps/docs` — SEO foundations

**Files:**

- Create: `apps/docs/src/routes/sitemap.xml/+server.ts`, `apps/docs/static/robots.txt`, `apps/docs/static/_headers`
- Modify: `apps/docs/src/routes/+layout.svelte` (add default meta), `apps/docs/src/routes/[...slug]/+page.svelte` (per-page description)

**Interfaces:**

- Consumes: `buildNav` result (already in layout) to enumerate sitemap URLs.
- Produces: docs sitemap, robots, per-page meta.

- [ ] **Step 1: Add default meta + per-page OG to `apps/docs/src/routes/+layout.svelte`**

Insert this `<svelte:head>` block immediately after the `<script>` block (keep everything else in the file):

```svelte
<svelte:head>
  <meta
    name="description"
    content="Documentation for rook — an agent-native IDE. Install, configure, and understand the project."
  />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="rook docs" />
  <meta property="og:image" content="https://rookide.com/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
```

- [ ] **Step 2: Add per-page description to `apps/docs/src/routes/[...slug]/+page.svelte`**

Replace its `<svelte:head>` with:

```svelte
<svelte:head>
  <title>{data.title} — rook docs</title>
  <link rel="canonical" href={`https://docs.rookide.com/${data.slug}`} />
  <meta property="og:title" content={`${data.title} — rook docs`} />
</svelte:head>
```

And add `slug` to the load return in `apps/docs/src/routes/[...slug]/+page.ts` — change the return line to:

```ts
return { component: mod.default, title: mod.metadata?.title ?? params.slug, slug: params.slug };
```

- [ ] **Step 3: Create `apps/docs/src/routes/sitemap.xml/+server.ts`**

```ts
export const prerender = true;

const modules = import.meta.glob('/content/*.md');

export function GET() {
  const slugs = Object.keys(modules).map((p) => (p.split('/').pop() ?? '').replace(/\.md$/, ''));
  const urls = ['https://docs.rookide.com/', ...slugs.map((s) => `https://docs.rookide.com/${s}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
```

- [ ] **Step 4: Create `apps/docs/static/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://docs.rookide.com/sitemap.xml
```

- [ ] **Step 5: Create `apps/docs/static/_headers`**

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

- [ ] **Step 6: Build and verify**

Run: `pnpm --filter docs build && test -f apps/docs/build/sitemap.xml && test -f apps/docs/build/robots.txt && grep -q "docs.rookide.com/install" apps/docs/build/sitemap.xml && echo DOCS_SEO_OK`
Expected: prints `DOCS_SEO_OK`.

- [ ] **Step 7: Commit**

```bash
git add apps/docs
git commit -m "feat(docs): add SEO foundations (meta, sitemap, robots)"
```

---

### Task 11: Deploy config + README + full verification

**Files:**

- Create: `README.md`
- Verify: full workspace build, checks, tests

**Interfaces:**

- Consumes: everything.
- Produces: documented deploy instructions; green full build.

- [ ] **Step 1: Create `README.md`**

````md
# rookide.com

Marketing (`rookide.com`) and documentation (`docs.rookide.com`) sites for
[rook](https://github.com/incantery/rook), built as a pnpm workspace.

## Layout

- `packages/ui` — `@rookide/ui`, the shared brand (Night Owl theme tokens +
  Svelte components). Single source of brand truth.
- `apps/web` — the marketing site (SvelteKit, static, prerendered).
- `apps/docs` — the docs site (SvelteKit + mdsvex, static, prerendered).

## Develop

```sh
pnpm install
pnpm dev:web     # rookide.com on :5173
pnpm dev:docs    # docs on :5173 (run separately)
```
````

## Build & test

```sh
pnpm build       # builds both apps
pnpm check       # svelte-check both apps
pnpm -r test     # unit tests (seo, nav)
```

## Deploy — Cloudflare Pages

Two Pages projects, both git-connected to this repo:

| Project | Build command                              | Output dir        | Domain             |
| ------- | ------------------------------------------ | ----------------- | ------------------ |
| web     | `pnpm install && pnpm --filter web build`  | `apps/web/build`  | `rookide.com`      |
| docs    | `pnpm install && pnpm --filter docs build` | `apps/docs/build` | `docs.rookide.com` |

Set each project's **Root directory** to the repo root and the build command
as above (the monorepo builds one app per project). Push to `main` deploys
production; PRs get preview URLs. Custom domains are added in the Pages
dashboard; `apps/*/static/_headers` supplies security headers.

````

- [ ] **Step 2: Full build**

Run: `pnpm install && pnpm build`
Expected: both apps build with no errors; `apps/web/build` and `apps/docs/build` exist.

- [ ] **Step 3: Full type check**

Run: `pnpm check`
Expected: `svelte-check` passes for both apps (0 errors).

- [ ] **Step 4: Full test run**

Run: `pnpm -r test`
Expected: seo + nav suites pass.

- [ ] **Step 5: Format check**

Run: `pnpm format`
Expected: files formatted; re-run `pnpm format:check` prints no diffs.

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: add repo README and Cloudflare Pages deploy guide"
````

---

## Self-Review Notes

- **Spec coverage:** monorepo + shared `@rookide/ui` (T1–T3); marketing IA hero/shift/today/join/footer (T5); docs mdsvex + sidebar + launch set (T7–T9); SEO foundations both sites (T6, T10); Cloudflare deploy (T11); vision-forward copy + CTA order Join>Install (T5); brand tokens verbatim (T2). All spec sections map to a task.
- **Deviation flagged:** spec said self-hosted fonts; plan uses system font stacks for v1 (zero binaries, still CSP-clean). Called out in Global Constraints. Revisit if a branded sans is wanted.
- **Known risk:** mdsvex + Svelte 5 default-slot rendering of `<Component />` inside `<Prose>` — Task 8 Step 9 note covers the snippet-wrapping fallback if the compiler requires it. Validate at T8 build; if it fails, wrap `<Component />` in `{#snippet children()}`.
- **Testable logic isolated to pure functions** (`buildMeta`, `buildNav`/`titleFromSlug`) with real failing-first tests; static content verified by build + grep assertions rather than synthetic tests.

```

```
