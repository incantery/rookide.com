<script lang="ts">
  import { Prose } from '@rookide/ui';
  let { data } = $props();
  const Component = $derived(data.component);
</script>

<svelte:head>
  <title>{data.title} — rook docs</title>
  <link rel="canonical" href={`https://docs.rookide.com/${data.slug}`} />
  <meta property="og:title" content={`${data.title} — rook docs`} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: data.title,
    url: `https://docs.rookide.com/${data.slug}`,
    isPartOf: { '@type': 'WebSite', name: 'rook docs', url: 'https://docs.rookide.com/' }
  })}<\/script>`}
</svelte:head>

<Prose>
  <Component />
</Prose>
