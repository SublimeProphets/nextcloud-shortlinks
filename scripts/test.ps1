$ErrorActionPreference = 'Stop'
composer validate --strict
composer test:all
corepack pnpm install --frozen-lockfile
corepack pnpm test:all
