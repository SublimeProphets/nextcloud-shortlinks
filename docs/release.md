# Release checklist

- Update `appinfo/info.xml`, `package.json`, `composer.json` metadata and `CHANGELOG.md` with one SemVer.
- Run clean Composer/pnpm installs with lockfile updates permitted, all tests, both dependency audits, production build and bundle-size review. Before release, run `pnpm deps:update` and review the resulting `pnpm-lock.yaml` diff.
- Install from the packaged artifact on fresh Nextcloud 34/35 using SQLite, MariaDB and PostgreSQL; run migrations, app code checker, health, redirect, cron and Playwright suites.
- Validate `docs/openapi.yaml`, translation key parity, light/dark/responsive/keyboard UI and accessibility.
- Review dependency licences and generate SBOMs (`composer show --locked --format=json`, `pnpm licenses list --json` or CycloneDX tooling).
- Confirm `.nextcloudignore` includes no source/test/secrets/MMDB/signing keys and includes compiled `js/`, `css/`, PHP, templates, localisation, icon, vendor and licence.
- Capture real screenshots, set repository/issues/homepage URLs, review privacy/admin documentation, and obtain maintainer approval.
- Run `make package` (or `bash scripts/package.sh`) to build `build/appstore/shortlinks-<version>.tar.gz` and its SHA-512 file. The script installs production-only Composer dependencies in an isolated staging tree and normalises ownership, order, timestamps and the gzip header using `SOURCE_DATE_EPOCH` for reproducibility. Windows developers can run `pnpm build; ./scripts/package.ps1` for an equivalent isolated package; final reproducibility verification should use the Bash/CI path. Sign with the App Store certificate, verify the signature, then upload manually. Never commit the private key.
