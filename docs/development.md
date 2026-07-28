# Development

Install PHP 8.3+, Composer 2, Node 24, pnpm 11 and Docker Compose. Copy `.env.example`, then run `make setup up install` (Unix) or the equivalent commands in `README.md` plus `scripts/install.ps1` (Windows).

Source layout:

- `appinfo/`: metadata and routes
- `lib/`: application, controllers, services, policies, persistence, jobs and commands
- `src/`: Vue 3/TypeScript application and admin UI
- `templates/`, `l10n/`, `img/`: server views, translations and icon
- `tests/`: PHP, frontend, browser and load tests
- `docs/openapi.yaml`: API contract

Use `pnpm watch` while editing the UI. The Compose bind mount exposes the repository as `custom_apps/shortlinks`; rebuild JS after frontend changes. PHP code is loaded directly. Run `occ maintenance:repair` after adding a new migration.

Do not edit a released migration, access `OC\\` classes, query server/app-owned tables, add CDN assets, or commit `.env`, MMDB data, credentials or signing keys. New framework usage must be verified against the public stable developer manual. Extension points should be typed events or provider interfaces.

The Docker profiles deliberately keep database volumes separate. The base stack is Nextcloud 34 + MariaDB + Redis + cron on port 8080. Nextcloud 35 uses port 8081, PostgreSQL port 8082, and SQLite port 8083.
