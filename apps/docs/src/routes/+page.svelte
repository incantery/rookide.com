<script lang="ts">
  import { Prose } from '@rookide/ui';
</script>

<svelte:head><title>rook docs</title></svelte:head>

<Prose>
  {#snippet children()}
    <h1>rook documentation</h1>
    <p>Install rook, configure it, and read the thinking behind the project. Pick a page from the sidebar.</p>
  {/snippet}
</Prose>
