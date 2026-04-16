

## Plan: Add Images to Published Editions

### Problem
- All 22 editions have `og_image = null` — no images display on the homepage or edition pages.
- The `visual_assets` table has approved images for many jobs, but they use **signed URLs that expire** after ~1 hour.
- The `transcripts` storage bucket is **private**, so public URLs won't work until it's made public.

### Solution (3 steps)

**Step 1 — Make the storage bucket public**

Run a migration to set the `transcripts` bucket to `public = true`. The images in `visuals/` need to be accessible without signed tokens for use as og_image on public pages.

**Step 2 — Backfill og_image on existing editions**

For each edition, find the matching `content_job` (by matching slug in `content_outputs`), then find the latest approved `visual_asset` for that job. Extract the file path from the signed URL and construct a permanent public URL. Update each edition's `og_image` accordingly.

This will be done via SQL UPDATE joining editions → content_outputs → visual_assets, extracting the storage path and building public URLs.

**Step 3 — Update publish-to-website to include images**

Modify the `publish-to-website` edge function to also query `visual_assets` for the job's approved image and set `og_image` on the edition at publish time, so future publications automatically include images.

### Files Changed

| File | Change |
|------|--------|
| DB migration | Set `transcripts` bucket to public |
| DB data update | Backfill `og_image` on all editions from visual_assets |
| `supabase/functions/publish-to-website/index.ts` | Add visual_assets query to set `og_image` |

### What the User Sees After

- Homepage shows thumbnail images for each edition card
- Edition pages have og_image set for social sharing
- Future publishes automatically include the image

