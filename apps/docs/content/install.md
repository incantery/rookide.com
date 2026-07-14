---
title: Install
order: 1
---

# Install

rook is a macOS (Apple Silicon) desktop app.

```sh
curl -fsSL https://raw.githubusercontent.com/incantery/rook/main/install.sh | sh
```

This installs `/Applications/rook.app` and the `rookctl` CLI from the latest
release. Use the script (not a browser download) — curl skips the quarantine
attribute, so the app launches without Gatekeeper ceremony.

## Upgrades

Upgrades are self-managed:

```sh
rookctl update          # update to the latest release
rookctl update --check  # just look
```

## From source

`make install` — needs Go, node, and the wails3 CLI.
