

## Plan: Make hero image edits actually flow through automatically

### What's broken

Even though we added auto-publish on the Visuals step, hero images you change in the editor are still not showing up on live edition pages. Tracing the flow, there are three real reasons:

1. **The edition page reads `og_image` directly, not the latest approved visual.** `EditionTemplate.tsx` renders `<img src={edition.og_image}>`. That field is only refreshed when `publish-to-website` runs. If a visual was approved but publish didn't fire (e.g. trigger failed, or approval came from a different code path like the SQL migration), the live page keeps the old URL.

2. **Auto-publish only fires from one button in `StepVisuals`.** Approving via the per-asset "Push to live" button works, but several other paths that flip `approved = true` (re-approving an existing row, the auto-publish DB trigger calling `check-auto-publish`, manual SQL, the older "Approve & Save" button on existing assets) don't all reliably re-run `publish-to-website`. So `editions.og_image` drifts out of sync with the latest approved `visual_assets` row.

3. **Even when the URL updates, the image element doesn't bust cache.** We added `?v=<timestamp>` inside `publish-to-website`, but if the underlying file at the same storage path was replaced (which is what's happening — same `pemf-pulse-hero.jpeg` filename), the browser shows the cached image until the URL string itself changes. Direct DB updates from migrations don't always go through the cache-busting code path.

### Fix (make it bulletproof, three layers)

**Layer 1 — Single source of truth: derive `og_image` at read time, not at write time**
Update `EditionTemplate.tsx` and `Index.tsx` to fetch the **latest approved `visual_assets` row for the edition's job** and prefer that image over `editions.og_image`. Fall back to `og_image` only if no approved visual exists. This means: the moment an editor approves a new visual, the live page picks it up on next load — no publish step required.

To link editions ↔ jobs, we need to know which `job_id` produced each edition. Today there's no FK column. Add a nullable `source_job_id uuid` to `editions`, and have `publish-to-website` populate it on insert/update. For existing editions, backfill by matching slug.

**Layer 2 — Database trigger that auto-syncs `og_image` on approval**
Add a Postgres trigger on `visual_assets`: when a row flips to `approved = true`, automatically update `editions.og_image` for the matching `source_job_id` with the new URL plus a fresh `?v=<epoch>` cache buster. This guarantees sync regardless of which UI path or SQL statement caused the approval.

**Layer 3 — Cache-bust on every render**
In `EditionTemplate.tsx` and `Index.tsx`, append `?v=<edition.updated_at epoch>` to image URLs at render time if no `?v=` is present. Belt-and-suspenders against CDN/browser caching when the same storage filename gets overwritten.

### Files changed

| File | Change |
|---|---|
| `supabase/migrations/<new>.sql` | Add `editions.source_job_id`; backfill from slug; create trigger that updates `editions.og_image` on `visual_assets.approved → true` |
| `supabase/functions/publish-to-website/index.ts` | Set `source_job_id = job_id` when upserting editions |
| `src/pages/EditionTemplate.tsx` | Query latest approved visual for `source_job_id`; prefer it over `og_image`; append render-time cache buster |
| `src/pages/Index.tsx` | Same: prefer latest approved visual per edition for the homepage hero/tile images |
| (no changes needed to `StepVisuals.tsx` — the trigger covers all approval paths) |

### What you'll see after

- Approve any visual (in any step, via any button, even via SQL) → live edition page and homepage tile show the new image on the very next page load.
- No "Update Live Site" click required just to swap a hero.
- Replacing a file at the same storage path still busts cache because the trigger always rewrites `?v=`.

