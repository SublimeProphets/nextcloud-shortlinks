#!/usr/bin/env bash
set -euo pipefail
composer validate --strict
composer test:all
pnpm install --no-frozen-lockfile
pnpm test:all
