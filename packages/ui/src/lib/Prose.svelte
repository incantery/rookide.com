<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div
  class="prose-rook max-w-none
    [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight
    [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold
    [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold
    [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-fg/90
    [&_a]:text-acc [&_a:hover]:underline
    [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1
    [&_code]:rounded [&_code]:bg-lo/20 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-grn
    [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-lo/20 [&_pre]:bg-surface [&_pre]:p-4
    [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-fg"
>
  {@render children()}
</div>
