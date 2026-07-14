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
