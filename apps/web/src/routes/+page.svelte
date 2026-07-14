<script lang="ts">
  import { Nav, Footer, Button, InstallChip, TerminalFrame, links } from '@rookide/ui';
</script>

<div
  class="min-h-screen font-sans text-fg [background:radial-gradient(1200px_520px_at_50%_-120px,rgba(130,170,255,0.1),transparent_62%),var(--color-bg)]"
>
  <Nav />

  <!-- Hero / manifesto -->
  <header id="vision" class="mx-auto max-w-3xl px-6 pt-16 pb-14">
    <p class="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-dim">
      ◆ An open-source experiment
    </p>
    <h1 class="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
      The IDE was built for one developer, one repository, and
      <span class="text-acc">one task at a time.</span>
    </h1>
    <p class="mb-4 text-lg leading-relaxed">That is no longer how software gets built.</p>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      Coding agents can work across multiple tasks, repositories, terminals, and review cycles at
      once. But today's tools still make you manage that work through
      <span class="text-fg">scattered windows, tabs, chats, and terminal sessions.</span>
    </p>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      Rook is an experiment in what comes next: an <span class="text-fg">agent-native IDE</span>
      built around persistent workspaces, concurrent agent sessions, review, and attention management.
    </p>
    <p class="my-7 font-mono text-sm text-amber">
      It is early. The shape of this new category is not settled yet.
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <Button href={links.github}>Join us in building it →</Button>
      <InstallChip />
    </div>
  </header>

  <!-- The shift -->
  <section class="mx-auto max-w-3xl px-6 py-14">
    <h2 class="mb-4 text-2xl font-bold">The shift</h2>
    <p class="mb-4 max-w-[62ch] leading-relaxed text-dim">
      One developer. One repository. One task at a time. Every tool we use — the editor, the
      terminal, the review UI — quietly assumes it. That assumption is breaking.
    </p>
    <p class="max-w-[62ch] leading-relaxed text-dim">
      When several agents work in parallel across repositories, the bottleneck stops being how fast
      you can type and becomes how well you can <span class="text-fg"
        >direct, review, and stay oriented</span
      > across all of it at once. That is the problem rook is built around.
    </p>
  </section>

  <!-- Where it is today -->
  <section class="mx-auto max-w-3xl px-6 py-14">
    <h2 class="mb-4 text-2xl font-bold">Where it is today</h2>
    <p class="mb-6 max-w-[62ch] leading-relaxed text-dim">
      Rook is a real terminal you can install now — a desktop app that replaces ghostty + tmux,
      built for muscle-memory parity first. The agent is being built from inside a tool that is
      already trusted. Parity first, magic second.
    </p>
    <TerminalFrame title="rook — 1 · main">
      <div>
        <span class="text-grn">agent</span> <span class="text-dim">▸ split pane, run tests</span>
      </div>
      <div class="text-dim">✓ 42 passing · 0.8s</div>
      <div>
        <span class="text-acc">~/rook</span> ❯ <span class="border-b-2 border-acc">&nbsp;</span>
      </div>
    </TerminalFrame>
  </section>

  <!-- Join / Install -->
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h2 class="mb-3 text-2xl font-bold">Join us in building it</h2>
    <p class="mb-6 max-w-[60ch] leading-relaxed text-dim">
      If the tools you have today do not fit the way you actually work with agents, come help define
      what replaces them.
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <Button href={links.github}>GitHub — star & discuss</Button>
      <Button href={links.subreddit} variant="ghost">r/rookide</Button>
    </div>
    <div class="mt-6"><InstallChip /></div>
  </section>

  <Footer />
</div>
