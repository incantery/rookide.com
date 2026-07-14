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

## Assets

Each site's social card (`apps/<app>/static/og.png`) is generated from a
static HTML source at `apps/<app>/og/og.html` via headless Chrome, so it can
be reproduced or tweaked without design tools:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="apps/<app>/static/og.png" --default-background-color=00000000 \
  "file://$(pwd)/apps/<app>/og/og.html"
```

Verify the output is exactly 1200x630 with `sips -g pixelWidth -g pixelHeight apps/<app>/static/og.png`.

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
