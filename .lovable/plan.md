

## Plan: Auto-Publish on Approval

When all review checklist items pass (brief, newsletter, article, social channels approved + CTA configured), automatically trigger publishing to all active webhook destinations without requiring the editor to manually go to the Publish step.

### How It Works

1. **Add an "Auto-publish" toggle to Settings** — a new column `auto_publish` (boolean, default false) on `publishing_targets` or a new `editor_settings` table with a single row. Editors opt in explicitly.

2. **Create a database trigger + edge function** — when a `content_outputs` or `content_briefs` row is updated with `approved = true`, a Postgres trigger calls `pg_net` to invoke a new `check-auto-publish` edge function. This function:
   - Runs the same readiness checks as StepReview (brief approved, newsletter approved, article approved, all social approved, CTA configured)
   - If all pass and auto-publish is enabled, triggers `trigger-publish-webhook` for each active publishing target
   - Logs the auto-publish action in `activity_log`

3. **Update StepReview UI** — show a banner when auto-publish is enabled: "Auto-publish is ON. Content will publish automatically when all checks pass." Add a quick toggle to enable/disable it.

4. **Update Settings page** — add an auto-publish on/off switch in EditorSettings.

### Files to Create/Modify

| File | Change |
|------|--------|
| DB migration | Add `auto_publish_enabled` boolean to a new `editor_settings` table (single-row config) |
| `supabase/functions/check-auto-publish/index.ts` | New edge function that checks readiness and triggers publishing |
| DB migration | Add trigger on `content_outputs` and `content_briefs` to call `check-auto-publish` via `pg_net` on approval |
| `src/pages/EditorSettings.tsx` | Add auto-publish toggle switch |
| `src/components/editor/steps/StepReview.tsx` | Show auto-publish status banner |

### Why a Trigger-Based Approach

Rather than polling or checking on every page load, a Postgres trigger fires only when an approval actually changes. This ensures publishing happens immediately and reliably, even if the editor closes their browser after approving the last item.

