---
title: Architecture
order: 4
---

# Architecture & vision

rook is an experiment in the **agent-native IDE**: persistent workspaces,
concurrent agent sessions, review, and attention management — built for a world
where several agents work across repositories at once.

A few load-bearing decisions:

- **A single command registry.** Every action is a named command. Clicks,
  keybindings, and (later) the agent's tool surface all dispatch the same
  commands, so the agent can do everything you can — by construction.
- **A separate PTY host process.** The UI can crash, rebuild, and reattach
  without killing shells — the tmux-server model.
- **Shell integration (OSC 133) from the start.** Semantic prompt marks give
  command boundaries, cwd, and exit codes as structure the UI and agent read.

For the full decision log, see the
[rook README](https://github.com/incantery/rook).
