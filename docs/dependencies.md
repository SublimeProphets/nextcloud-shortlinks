# Dependency and licence overview

Production dependencies are locked by `composer.lock` and `pnpm-lock.yaml`. The release archive contains the Composer runtime tree and compiled frontend assets; it does not contain `node_modules` or frontend build tooling.

Direct PHP runtime libraries:

- `endroid/qr-code` 6.0.9 — MIT — local SVG/PNG QR generation.
- `geoip2/geoip2` 3.4.0 — Apache-2.0 — reads an administrator-supplied local MMDB file; no database is redistributed.
- `matomo/device-detector` 6.5.1 — LGPL-3.0-or-later — local user-agent classification behind an app interface.

`bamarni/composer-bin-plugin` 1.x (MIT) is a development-only dependency used to isolate PHPUnit, Psalm, PHP-CS-Fixer and OpenAPI tooling. It is omitted by the documented production Composer install.

The direct browser runtime is limited to Vue 3 plus the official Nextcloud Axios, dialogs, initial-state, localisation, router and Vue component packages. Their resolved versions and all transitive licences can be reproduced with `pnpm licenses list --prod --json`; PHP metadata can be reproduced with `composer licenses --format=json`.

Security audit status on 2026-07-29:

- `composer audit --locked`: no advisories.
- `pnpm audit --audit-level high`: passes with no critical, high or moderate advisory.
- One low-severity, development-only advisory remains in `elliptic` 6.6.1 through `@nextcloud/vite-config` (`GHSA-848j-6mx2-7j84`). The registry still reports 6.6.1 as the latest published version, while the advisory names 6.6.2 as the patched version. This dependency is build tooling and is not shipped in the app archive.

Review both lockfiles and rerun both audits before every release. Do not add a GeoIP database, signing certificate or private key to the repository.
