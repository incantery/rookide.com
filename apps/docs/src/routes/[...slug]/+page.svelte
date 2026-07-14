<script lang="ts">
  import { Prose } from '@rookide/ui';
  let { data } = $props();
  const Component = $derived(data.component);
</script>

<svelte:head><title>{data.title} — rook docs</title></svelte:head>

<Prose>
  <Component />
</Prose>
