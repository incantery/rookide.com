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

<svelte:head>
  <meta
    name="description"
    content="Documentation for rook — an agent-native IDE. Install, configure, and understand the project."
  />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="rook docs" />
  <meta property="og:image" content="https://docs.rookide.com/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

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
