# Release checklist

- Update `appinfo/info.xml`, `package.json`, `composer.json` metadata and `CHANGELOG.md` with one SemVer.
- Run clean Composer/pnpm installs from lockfiles, all tests, both dependency audits, production build and bundle-size review.
- Install from the packaged artifact on fresh Nextcloud 34/35 using SQLite, MariaDB and PostgreSQL; run migrations, app code checker, health, redirect, cron and Playwright suites.
- Validate `docs/openapi.yaml`, translation key parity, light/dark/responsive/keyboard UI and accessibility.
- Review dependency licences and generate SBOMs (`composer show --locked --format=json`, `pnpm licenses list --json` or CycloneDX tooling).
- Confirm `.nextcloudignore` includes no source/test/secrets/MMDB/signing keys and includes compiled `js/`, `css/`, PHP, templates, localisation, icon, vendor and licence.
- Capture real screenshots, set repository/issues/homepage URLs, review privacy/admin documentation, and obtain maintainer approval.
- Build a reproducible `shortlinks-<version>.tar.gz`, calculate SHA-512, sign with the App Store certificate, verify signature, then upload manually. Never commit the private key.
