

## Plan: Publish Approved Articles to the Website

You have 3 approved articles with content ready to go. The website displays content from the `editions` table, so I need to create edition records from the approved article outputs.

### What Gets Published

| # | Title | Guest | Slug |
|---|-------|-------|------|
| 1 | Innovating Light Therapy: Why Skin Contact is the Key to Optimal Dosing | John Graham Harper | innovating-light-therapy-skin-contact-optimal-dose |
| 2 | Neuro Pro 2: Bridging the Gap Between Immediate Focus and Long-Term Brain Health | — | neuro-pro-2-cognitive-enhancement-science |
| 3 | How Magnetic Fields Boost Cellular Energy: Recharging the Biological Battery | Scott Baider | how-magnetic-fields-boost-cellular-energy-pemf-induction |

### Steps

1. **Create a "publish-to-website" edge function** that takes a `job_id`, reads the approved article output and job metadata, and inserts a row into the `editions` table with:
   - `title`, `slug`, `body_html` from the article output
   - `meta_description` from the article output
   - `expert_name` from the job's `guest_name`
   - `product_name`, `product_cta_url` from the job
   - `edition_number` auto-incremented
   - `is_published = true`
   - `canonical_url` set to production domain + slug
   - Category inferred from content type

2. **Add a "Publish to Website" destination** in StepPublish that calls this new function directly instead of a webhook, creating the edition record in the database.

3. **Run it for the 3 existing approved articles** by invoking the function for each job, creating 3 new editions visible on the site immediately.

4. **Update the publishing target flow** so "website" in the destination list uses this internal publish path rather than requiring an external webhook URL.

### Technical Details

- **New edge function**: `supabase/functions/publish-to-website/index.ts` — authenticated, reads `content_outputs` + `content_jobs`, upserts into `editions`, logs to `activity_log`
- **StepPublish.tsx**: When destination is "website", call `publish-to-website` function instead of `trigger-publish-webhook`
- **No migration needed** — the `editions` table already has all the required columns

