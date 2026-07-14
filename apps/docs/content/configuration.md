---
title: Configuration
order: 2
---

# Configuration

Config lives at `~/.config/rook/config` — ghostty-style `key = value` lines.
The file is optional; missing means defaults.

Secrets (the OpenAI key, the Jira token) live in the macOS keychain, **not**
the config file.

The complete key surface — every setting at its default, commented out — ships
as `docs/config.sample` in the rook repository. Copy it in verbatim and
uncomment what you want to change.
