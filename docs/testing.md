# Testing

Use Node 24 and pnpm 11. Install pnpm with `npm install --global pnpm@latest-11`; this path does not depend on Corepack's registry signing-key cache.

## Local commands

```bash
composer validate --strict
composer lint
composer cs:check
composer psalm
composer test:unit
composer test:integration
composer audit
pnpm lint
pnpm stylelint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --audit-level high
```

Install frontend dependencies with `pnpm install --no-frozen-lockfile`. To refresh all versions allowed by `package.json` and immediately audit the result, run `pnpm deps:update`, review the lockfile diff, and execute `pnpm test:all`. Keep `pnpm-lock.yaml` committed so a reviewed dependency graph remains available, but do not rely on frozen installation as an update policy.

Run Playwright against a seeded instance with `NEXTCLOUD_URL=http://localhost:8080 NEXTCLOUD_TEST_USER=alice NEXTCLOUD_TEST_PASSWORD=alice-dev-only pnpm test:e2e`. Browsers must first be installed with `pnpm exec playwright install`. The suite covers Chromium, Firefox and a mobile Chromium viewport; select one with `--project=chromium` when a smoke test is sufficient.

Run the redirect smoke test with `k6 run -e BASE_URL=http://localhost:8080 -e SLUG=<known-alias> tests/performance/redirect-smoke.js`. Record CPU/RAM, database, Nextcloud/PHP version, virtualisation and event/statistics mode beside results. Thresholds are smoke guards, not production throughput claims.

Database checks use the Compose variants and should cover a fresh install, `occ maintenance:repair`, link creation, guarded concurrent clicks, aggregation and cleanup. Run `occ integrity:check-app shortlinks` for signed release artifacts in both supported Nextcloud versions. CI repeats static, unit, build and OpenAPI reproducibility checks, runs the Nextcloud 34/35 plus MariaDB/PostgreSQL/SQLite container matrix, and executes a Chromium lifecycle smoke test.

Coverage is generated with `vendor-bin/phpunit/vendor/bin/phpunit --coverage-clover coverage/php.xml` and `pnpm vitest run --coverage`; a coverage driver must be installed for PHP. Coverage is evidence, not a substitute for database and browser tests.
