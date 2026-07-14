<script lang="ts">
  import { Prose } from '@rookide/ui';
  let { data } = $props();
  const Component = $derived(data.component);
</script>

<svelte:head>
  <title>{data.title} — rook docs</title>
  <link rel="canonical" href={`https://docs.rookide.com/${data.slug}`} />
  <meta property="og:title" content={`${data.title} — rook docs`} />
</svelte:head>

<Prose>
  <Component />
</Prose>
