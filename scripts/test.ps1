$ErrorActionPreference = 'Stop'
composer validate --strict
composer test:all
pnpm install --no-frozen-lockfile
pnpm test:all
