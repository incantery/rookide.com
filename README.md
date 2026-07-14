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
