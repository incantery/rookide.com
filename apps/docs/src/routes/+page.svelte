<script lang="ts">
  import { Prose } from '@rookide/ui';
</script>

<svelte:head>
  <title>rook docs</title>
  <link rel="canonical" href="https://docs.rookide.com/" />
  <meta property="og:title" content="rook documentation" />
  <meta property="og:url" content="https://docs.rookide.com/" />
</svelte:head>

<Prose>
  {#snippet children()}
    <h1>rook documentation</h1>
    <p>
      Install rook, configure it, and read the thinking behind the project. Pick a page from the
      sidebar.
    </p>
  {/snippet}
</Prose>
