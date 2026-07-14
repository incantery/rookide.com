<script lang="ts">
  import { links } from './links';
</script>

<footer class="border-t border-lo/15 px-6 py-8 font-mono text-xs text-dim">
  <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
    <span>♜ rook — an incantery experiment</span>
    <div class="flex gap-5">
      <a href={links.github} class="hover:text-fg">GitHub</a>
      <a href={links.subreddit} class="hover:text-fg">r/rookide</a>
      <a href={links.docs} class="hover:text-fg">Docs</a>
      <a href={links.license} class="hover:text-fg">MIT</a>
    </div>
  </div>
</footer>
