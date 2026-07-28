# Shortlinks

Shortlinks is a privacy-preserving Nextcloud app for creating, organising, sharing, protecting and analysing short URLs. It uses only public `OCP\\` APIs, keeps redirects inside the registered app route, and has no external analytics, telemetry or cloud dependency.

## Supported platforms

- Nextcloud 34 and 35
- PHP 8.3, 8.4 and 8.5
- SQLite, MariaDB/MySQL and PostgreSQL
- Current Chromium/Firefox-class browsers

The app ID is `shortlinks`, the PHP namespace is `OCA\\Shortlinks`, and the licence is AGPL-3.0-or-later.

## Quick start

Requirements: Git, Docker Desktop/Engine with Compose, Composer, and Node 24 with pnpm 11.

```bash
cp .env.example .env
composer install
corepack pnpm install --frozen-lockfile
corepack pnpm build
docker compose up -d db redis nextcloud34 cron
./scripts/install.sh nextcloud34
```

On Windows PowerShell, use `Copy-Item .env.example .env` and `./scripts/install.ps1`. Open `http://localhost:8080`. Development-only accounts are `admin` / `admin-dev-only`, `alice` / `alice-dev-only`, and `bob` / `bob-dev-only`; change them whenever the environment is reachable by anyone else.

Run `docker compose --profile nextcloud35 up -d nextcloud35`, `--profile postgres up -d nextcloud-postgres`, or `--profile sqlite up -d nextcloud-sqlite` for the other matrix variants. `scripts/reset.*` refuses unexpected Compose project names and removes only project-scoped containers and named volumes.

## What is included

- Exact, case-sensitive custom aliases plus random, sequential Base36 and sequential Base62 generators with database-backed counters and collision retries.
- Link lifecycle: create, edit with optimistic concurrency, clone, favorite, activate, bulk edit, trash, restore and permanent deletion.
- Nested per-user folders, tags, read/edit shares to users or groups, keyboard-operable navigation, responsive UI and dark-mode-compatible styling.
- Public, authenticated, restricted, password-protected and disabled access modes; start/expiry times; atomic click limits; selectable 301/302/307/308 redirects.
- Local QR generation, bookmarklet, bounded CSV/JSON import and export, CSV-injection protection.
- Privacy-aware click events, HMAC-pseudonymous daily/link-scoped visitors, referrer redaction, local Device Detector classification and optional local MaxMind-compatible MMDB lookup.
- Retention, aggregation and secret-rotation jobs; audit trail; health, stats, import/export, GeoIP, ownership-transfer and demo-data OCC commands.
- Versioned OCS API, capabilities provider and OpenAPI description.
- Nextcloud admin settings, German and English localisation.

## Security defaults

Only signed-in Nextcloud users can manage links. Redirects are public only when the link is explicitly in public mode. Target schemes default to HTTP(S); credentials in URLs are rejected. Server-side title fetching is disabled by default and, when enabled, validates every redirect, rejects private/local destinations, streams at most 64 KiB, and times out. Dynamic redirects return `Cache-Control: no-store`. Password attempts are rate-limited. Full IP addresses and raw user agents are not stored.

301 and 308 responses can be cached by browsers and proxies, so later policy changes and click statistics may not be observed by those clients. Prefer 302 or 307 for mutable campaigns.

## Commands

```bash
composer test:all
corepack pnpm test:all
docker compose exec -u www-data nextcloud34 php occ shortlinks:health
docker compose exec -u www-data nextcloud34 php occ shortlinks:seed --user=alice
docker compose exec -u www-data nextcloud34 php occ app:check-code shortlinks
```

See [development](docs/development.md), [testing](docs/testing.md), [architecture](docs/architecture.md), [user guide](docs/user-guide.md), [admin guide](docs/admin-guide.md), [privacy](docs/privacy.md), [threat model](docs/threat-model.md), [API](docs/api.md), and the [release checklist](docs/release.md).

## Production installation

Build with `composer install --no-dev --classmap-authoritative` and `corepack pnpm install --frozen-lockfile && corepack pnpm build`. Package the files permitted by `.nextcloudignore` into a directory named `shortlinks`, place it in a configured Nextcloud apps directory, then run `occ app:enable shortlinks`. Configure system cron and review the Shortlinks administration section before use. The Compose environment is for development only.

## Project status and release inputs

Version `1.0.0` is prepared as an unsigned source release. App Store publishing still requires a real repository URL, maintainer identity, screenshots from a real Nextcloud instance, an App Store account/certificate, signed archive and human release review. No signing key is included.
