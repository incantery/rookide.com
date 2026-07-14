<script lang="ts">
  import { links } from './links';
  let copied = $state(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(links.install);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      copied = false;
    }
  }
</script>

<button
  onclick={copy}
  class="group inline-flex items-center gap-3 rounded-lg border border-acc/35 bg-acc/10 px-3.5 py-2 font-mono text-xs text-acc hover:bg-acc/15"
  aria-label="Copy install command"
>
  <span class="text-dim">$</span>
  <code>{links.install}</code>
  <span class="text-dim group-hover:text-acc">{copied ? 'copied' : 'copy'}</span>
</button>
