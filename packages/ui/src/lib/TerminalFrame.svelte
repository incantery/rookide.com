<script lang="ts">
  let { title = 'rook', children } = $props<{
    title?: string;
    children: import('svelte').Snippet;
  }>();
</script>

<div class="overflow-hidden rounded-xl border border-lo/25 bg-[#0b0e17] font-mono text-sm">
  <div class="flex items-center gap-2 border-b border-lo/15 bg-white/[0.02] px-3 py-2">
    <span class="h-2.5 w-2.5 rounded-full bg-red"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-amber"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-grn"></span>
    <span class="ml-2 text-xs text-dim">{title}</span>
  </div>
  <div class="p-4 leading-relaxed">
    {@render children()}
  </div>
</div>
