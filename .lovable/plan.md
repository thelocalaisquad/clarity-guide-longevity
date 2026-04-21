

## Plan: Fix homepage images not updating after revisions

### What's actually happening

Tracing the data, your "live" `og_image` in editions matches the latest approved visual for every job I checked — the publish-to-website function works correctly. The problem is that **uploading a new image in the Visuals step doesn't push it to the live edition automatically**. Today the flow is:

1. Editor uploads new image → INSERTed as a new `visual_assets` row with `approved = false`
2. Editor must click "Approve & Save" → row becomes `approved = true`
3. Editor must click "Update Live Site" → edge function reads latest approved visual and updates `editions.og_image`
4. Editor must wait for the homepage `editions-feed` query to refetch (cached in React Query)

If steps 2 or 3 are skipped, the homepage shows the old image. Three friction points to fix:

### Fix

**1. Auto-publish on image upload + approve**
In `StepVisuals.tsx`, when the user uploads a new product image and clicks "Approve & Save" (or the new "Save & push live" button), automatically invoke `publish-to-website` immediately after the insert succeeds. No second button click required.

**2. Add a "Push image to live" button on each saved visual**
Today the "Currently Live" badge tells you which visual is live, but if you want to switch back to an older approved one, there's no button. Add a **"Push to live"** button on every saved asset row that:
- Marks that specific asset as approved (if not already)
- Marks all other approved visuals for that job as `approved = false` (so it becomes the unambiguous winner)
- Calls `publish-to-website`

This makes "which image is live" a deterministic 1-click choice instead of dependent on `created_at DESC`.

**3. Force homepage cache to refresh after publish**
In `usePublishToLive.ts`, after a successful publish, also invalidate the public homepage query keys (`["editions-feed"]`, `["edition", slug]`) so the homepage and edition page refetch fresh data on next visit. Right now only editor-internal queries are invalidated.

**4. Add cache-busting to og_image URL**
Browsers and CDNs cache `/storage/v1/object/public/...` URLs aggressively. If a file at the same path is replaced (rare but possible), the old image sticks. In the publish-to-website function, append `?v={updated_at_timestamp}` to the `og_image` URL written to editions. Cheap and bulletproof.

### Files changed

| File | Change |
|---|---|
| `src/components/editor/steps/StepVisuals.tsx` | Auto-call publish after Approve; add "Push to live" button per saved asset row |
| `src/hooks/usePublishToLive.ts` | Invalidate `editions-feed` and per-slug edition queries on success |
| `supabase/functions/publish-to-website/index.ts` | Append `?v=<timestamp>` cache buster to `og_image` |

### What you'll see after

- Upload a new image → click Approve → it's live on the homepage within seconds, no extra clicks.
- A clear "Push to live" button on every saved visual lets you swap between approved images with one click.
- No stale-cache surprises on the homepage after an update.

