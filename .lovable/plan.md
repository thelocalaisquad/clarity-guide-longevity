

## Plan: Fix "edits don't reach the live site" on the Visuals (and Article) step

### Root cause

The Visuals step (and similarly Article) saves **new draft rows** in `visual_assets` / `content_outputs`, but the changes never reach the live `editions` row unless the editor runs the full **Step 8 → Publish** flow again. Two specific issues:

1. **Visuals step never re-syncs the live edition.** Saving or approving a new visual just inserts a row into `visual_assets`. The live `editions.og_image` is only updated when `publish-to-website` runs.
2. **The Visuals step always INSERTs a new row** (even when the user is iterating). So you accumulate multiple "approved" assets, and which one wins depends on `created_at DESC` — confusing and fragile.
3. **No clear feedback in the UI** that "Saved/Approved" ≠ "Live on site". Users assume Approve = published.
4. **Article step has the same shape** — edits autosave to `content_outputs`, but the live `editions.body_html` only updates on republish.

### Fix (3 parts)

**Part 1 — One-click "Push to live site" on the Visuals step**
Add a prominent "Update Live Site" button next to Approve. It calls the existing `publish-to-website` edge function for this job, which already re-reads the latest approved visual and article and upserts the edition. Show a toast with the live URL on success.

**Part 2 — Same button on the Article step and the top of Job Detail**
- Article step: "Update Live Site" button (only enabled when an approved article exists).
- Job Detail header: a persistent "Re-publish" button + a small badge showing "Live image last synced: <timestamp>" pulled from the latest `published_to_website` activity_log entry. This makes the live state visible from any step.

**Part 3 — UX clarity on Visuals**
- Show a "Currently Live" badge on whichever saved visual matches the edition's current `og_image`.
- Change "Approve & Save" copy to "Approve (saves as draft — click Update Live Site to push)".
- After the user clicks Update Live Site, refresh the visuals list and live badge.

### Files changed

| File | Change |
|---|---|
| `src/components/editor/steps/StepVisuals.tsx` | Add "Update Live Site" button; add "Currently Live" badge on saved visuals; clarify Approve copy; invoke `publish-to-website` |
| `src/components/editor/steps/StepArticle.tsx` | Add "Update Live Site" button alongside Approve |
| `src/pages/JobDetail.tsx` | Add header-level "Re-publish" button + "Live last synced" timestamp badge |
| (no DB migration, no edge function changes — `publish-to-website` already does the right thing) |

### What the user will experience after

- On Visuals: approve a new image → click **Update Live Site** → toast "Live site updated" → homepage and edition page show the new image immediately.
- Same flow for article text edits.
- A visible "Live last synced" timestamp at the top of every job, so it's obvious whether your latest edits are reflected on the public site.

