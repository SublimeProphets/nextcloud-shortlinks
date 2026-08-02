# Changelog

All notable changes follow Keep a Changelog and Semantic Versioning.

## [Unreleased]

## [1.3.0] - 2026-08-02

### Changed

- Persist discovered Open Graph, Twitter Card and HTML share-thumbnail URLs with a refresh timestamp instead of rediscovering them for every card render.
- Serve persisted thumbnails through the existing SSRF-safe, authenticated image proxy and retain the previous image during temporary upstream failures.
- Added bounded admin actions for refreshing missing or all existing thumbnails, including coverage, checked-link and last-refresh statistics.

## [1.2.2] - 2026-07-30

### Changed

- Added automatic URL metadata previews with editable titles, protected thumbnail proxying and restored alias prefilling in both creation flows.
- Added rich selectable link cards, a responsive table/card switch and Files-style bulk actions including move/copy, tagging, export and QR ZIP download.
- Unified folder and tag lists across creation and settings, including nested drag targets, insertion ghosts and compact selectable modes.
- Split personal alias and sharing-URL preferences, with automatic alias saving and simple/template/regular-expression URL modes.
- Added contextual statistics pages and dialogs with period filters, scoped metrics and top-five donut visualisations.
- Renamed user-facing German tag terminology to "Schlagworte" throughout the app.
- Added a dashboard with reusable quick creation, live alias availability feedback, and grouped advanced options.
- Added a sticky Files-style content toolbar with switchable breadcrumbs, advanced search, grouped export/statistics/tag actions, and sortable table headings.
- Moved the bookmarklet into the app navigation and added a guided, draggable bookmarklet dialog.
- Reworked the user navigation, empty state, and short-link dialog with native Nextcloud components and validation states.
- Moved folder and tag management into a navigable app-settings dialog with icons, drag/keyboard ordering, and explicit deletion choices.
- Added generated-alias and atomic folder-order APIs plus persisted folder icons.
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
