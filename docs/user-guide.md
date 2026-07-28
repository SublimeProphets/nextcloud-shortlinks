# User guide

Open **Shortlinks** from the Nextcloud navigation. **New short link** requires an HTTP(S) target; alias is optional. Choose folder, tags, redirect type, access mode, time window and click limit. A password is accepted only for password mode and is never shown again.

Use the left navigation for all, favourites, recent, inactive, expired, trash, folders and tags. The list supports selection and bulk changes. Open a row for target, activity, shares and statistics; copy either URL from the row actions. QR codes are generated locally.

Folder nesting is limited to ten levels. Deleting a folder can keep its links (they become unfiled) or move them to trash. A share grants another Nextcloud user/group management view or edit access; it does not silently change public redirect access.

Trash is recoverable until administrator retention cleanup. Permanent deletion is available only after trashing. CSV/JSON import supports dry-run and either skip-conflict or generate-new-alias behaviour. Exports include only links visible to the current account.

Use 302 (default) or 307 if destinations/policies may change. 301/308 can be cached outside Nextcloud, making later edits and analytics incomplete.
