# Changelog

All notable changes follow Keep a Changelog and Semantic Versioning.

## [Unreleased]

## [1.7.6] - 2026-08-03

### Added

- Added an idempotent demo workspace seed with clean/append modes, nested folders, workflow tags, 36 varied links, plausible analytics, and three designed use-case Pages.

### Fixed

- Kept grouped Page headings readable when a dark custom theme is used.

## [1.7.4] - 2026-08-03

### Fixed

- Reset Nextcloud's global fixed-footer rule for the Page-specific footer, keeping attribution and selected links inside the themed Page.

## [1.7.3] - 2026-08-03

### Fixed

- Contained overflowing published Page content in its own scroll area so the app footer can no longer overlap Nextcloud's guest footer.

## [1.7.2] - 2026-08-03

### Fixed

- Made published Pages fill Nextcloud's complete public content area without extending underneath the fixed guest footer.

## [1.7.1] - 2026-08-03

### Fixed

- Kept Page theme cards exposed as native buttons to assistive technology while retaining their horizontal card presentation.

## [1.7.0] - 2026-08-03

### Added

- Added four Page themes, twenty local font choices, base-size and overall scaling controls, expanded header composition, editable attribution and centered footer links.

### Changed

- Replaced Page grouping selects with accessible illustrated radio choices and added sticky search to both individual-link pickers.
- Split the Page header and footer configuration into focused sections and brought theme-specific styling to both live previews and published Pages.

## [1.6.1] - 2026-08-03

### Fixed

- Added the missing confirmation action to the native multi-file picker and clear empty-result feedback to contact search.

## [1.6.0] - 2026-08-03

### Added

- Added native multi-file selection from Nextcloud Files to Pages, with owner-bound validation, signed streamed delivery, image previews and explicit downloads.
- Added privacy-conscious contact search through Nextcloud address books and contact cards on the live preview and published Page.

## [1.5.1] - 2026-08-03

### Changed

- Completed the production UI polish for dual-series analytics, click-log badges, availability wording, QR copy actions and the requested navigation order.

## [1.5.0] - 2026-08-03

### Added

- Added custom Nextcloud Files thumbnails, decorative image/video media and per-link accent colors across forms, cards, previews and the detail sidebar.
- Added shareable Pages with folder/tag/manual sources, four responsive layouts, grouping, visible-field controls, theming, headers/footers and live preview.
- Added private, public, password-protected and user/group-restricted Page access, availability windows, public rendering and a shared trash workflow.
- Added aggregate time-series charts and CSV/JSON click-log exports.

### Changed

- Rebuilt the link sidebar around native grouped tabs, merged access and sharing, richer metadata, QR actions, mini analytics, full statistics, click cards and activity icons.
- Reorganized the navigation into Dashboard, collapsible Short links, collapsible Pages, statistics, folders, tags and fixed footer actions.
- Expanded backup/CSV compatibility to preserve thumbnails, local media references and link colors.

## [1.4.0] - 2026-08-02

### Added

- Added complete account backups and automatic imports for Shortlinks JSON/CSV plus YOURLS Import/Export CSV/XML files.
- Added rate-limited import-compatibility, suggestion, bug-report and development-help forms with anonymous submission support.
- Added a six-step dashboard Quick Start guide for personal aliases, sharing URLs, folders, tags and the bookmarklet.

### Changed

- Added personal thumbnail, metadata autocomplete and Quick Start visibility settings with immediate dashboard updates.
- Added a global metadata privacy switch, feedback recipient and import-suggestion visibility controls for administrators.
- Expanded custom-domain guidance with ready-to-copy Apache and PHP forwarding examples.

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
