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
