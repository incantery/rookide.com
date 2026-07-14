<script lang="ts">
  let { href, variant = 'solid', children } = $props<{
    href: string;
    variant?: 'solid' | 'ghost';
    children: import('svelte').Snippet;
  }>();
</script>

<a
  {href}
  class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold transition-colors
    {variant === 'solid'
      ? 'bg-acc text-[#0b0e17] hover:brightness-110'
      : 'border border-lo/50 text-fg hover:border-acc/60'}"
>
  {@render children()}
</a>
