

## Plan: Add Step 9 — "Assets" hub for each job

A single place per job where every asset produced through the pipeline lives together: hero/visual images, social post copy, generated videos, the article body, the newsletter, and the source video. From here you can preview, edit, swap which image is the live hero, and re-push to live — without bouncing between steps.

### What you'll see

A new tab **9. Assets** appears at the end of the step bar on `/jobs/:id`, alongside Intake → Publish.

The Assets page is organised into collapsible groups:

**1. Hero / Visuals** (from `visual_assets`)
- Grid of every image generated for this job (approved + unapproved).
- Each tile shows: thumbnail, platform (LinkedIn / 1080x1080 / etc.), template, "Currently Live" badge if it's the one on the live edition.
- Per-tile actions: **Set as live hero** (one click — approves + demotes others + re-publishes), **Edit overlays** (deep-link to Step 6 with this asset preselected), **Download**, **Delete draft**.
- Upload new image button at the top — lands as a new draft visual.

**2. Article** (from `content_outputs` where `output_group='article'`)
- Inline preview of the approved article body + meta.
- Edit button → deep-link to Step 4.
- Shows "Live" badge + last-published timestamp.

**3. Newsletter** (from `content_outputs` where `output_group='newsletter'`)
- Same pattern: preview + edit → Step 3.

**4. Social posts** (from `content_outputs` where `output_group='social'`, all channels)
- One card per channel (LinkedIn, X thread, Instagram, Facebook, TikTok, Substack).
- Shows post body, approval state, "Copy", "Edit" (→ Step 5), and (where relevant) the visual paired with it.

**5. Source video & transcript** (from `content_sources`)
- Embedded player for `video_url`, link to transcript file, and the research notes — read-only reference.

**6. Live edition snapshot** (from `editions` joined by `source_job_id`)
- Edition number, slug, canonical URL, last `updated_at`, current `og_image` thumbnail, **View live** link, and a **Re-publish now** button (calls `publish-to-website`).

### Why this works with what's already there

- All data already exists in `visual_assets`, `content_outputs`, `content_sources`, and `editions`. No schema changes needed.
- The "Set as live hero" action reuses the exact `handlePushToLive` flow already in `StepVisuals` (approve target → demote siblings → call `publish-to-website` → invalidate `editions-feed`). The DB trigger `sync_edition_og_image_on_visual_approval` then refreshes `editions.og_image` automatically.
- "Edit" buttons just navigate to `/jobs/:id` and open the relevant existing step — no editing UI is duplicated.

### Files changed

| File | Change |
|---|---|
| `src/components/editor/steps/StepAssets.tsx` *(new)* | The hub page with the six sections above. Shares hooks (`usePublishToLive`) and helpers (`withImageCacheBust`, `toPublicStorageUrl`) already in the codebase. |
| `src/pages/JobDetail.tsx` | Add `"Assets"` to the `STEPS` array; add `case 8: return <StepAssets job={job} onRefresh={refresh} />` to `renderStep()`; allow deep-links via `?step=visuals&assetId=…` so "Edit overlays" can preselect a visual in Step 6. |
| `src/components/editor/steps/StepVisuals.tsx` | Read optional `assetId` from query string on mount and preselect that visual for editing (small change to make the deep-link from Assets land on the right item). |

### Out of scope (call out before building)

- No new tables, no new edge functions, no migrations.
- "Generated videos" is included as a section but will only show source video + any video URLs already stored — there is no AI video generation in the pipeline today.
- Bulk export ("download all assets as zip") is not in this pass; can be added later if you want it.

