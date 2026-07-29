# Changelog

All notable changes follow Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Changed

- Completed per-link and overview statistics UI, granularity/comparison exports, click log and recipient search.
- Hardened counts-only/DNT event storage, duplicate-target updates, folder subtree depth checks and share auditing.
- Preserved folder paths, tags, lifecycle fields, creation time and historical click totals during CSV/JSON migration.
- Split production vendor bundles, expanded German localisation and added admin maintenance controls.

## [1.0.0] - 2026-07-28

### Added

- Link, folder, tag, share, redirect, audit and privacy-aware statistics domain model.
- Versioned authenticated OCS API, capabilities, QR, bookmarklet and bounded import/export.
- Vue 3/TypeScript user and admin interfaces with English and German localisation.
- Aggregation, retention and secret rotation jobs plus operational OCC commands.
- Docker Compose matrix, CI, unit/component/accessibility/E2E/load tests and operator documentation.
