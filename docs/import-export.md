# Import and export

Authenticated users can export visible links as UTF-8 CSV or versioned JSON. CSV fields beginning with spreadsheet formula markers are prefixed with an apostrophe. Export pages are bounded and never bypass `LinkPolicy`.

Imports accept at most 5 MiB and 5,000 records per request. Use dry-run first. CSV needs a header and supports `slug`/`keyword`, `target_url`/`url`, `title`, `description`, `folder_path_json`, `tags_json`, lifecycle fields, `click_count`/`clicks`, and `created_at`/`timestamp`; JSON accepts an array or `{ "links": [...] }` with the equivalent camel-case export fields. Folder paths are arrays of names and missing folders/tags are created for the importing user. Historical click totals and creation times are preserved where supplied, but no synthetic detailed click events are invented. Password-protected imports require interactive password setup and are therefore rejected.

Conflict strategy `skip` reports an existing alias as skipped. `new-alias` first preserves the source alias and falls back to the configured generator only when that alias is already occupied. Every non-dry-run row passes the same URL, domain, alias, quota and permission rules as interactive creation.

For larger controlled migrations, use `occ shortlinks:import` in a maintenance window and retain the original file outside the web root. XML and ZIP are intentionally not accepted, eliminating XXE and decompression-bomb classes.
