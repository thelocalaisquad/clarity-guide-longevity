

## Plan: Bulk-Approve and Publish All Articles to Website

### Problem
All 19 article outputs are `approved = false`. The `publish-to-website` function requires approved articles. Previous publish attempts went through the wrong code path.

### Solution

1. **Bulk-approve all article outputs** — Run a database migration to set `approved = true` on all `content_outputs` where `output_group = 'article'` for jobs currently stuck at `publishing` status.

2. **Bulk-publish all to website** — Write a small script that calls the `publish-to-website` edge function for each of the 19 jobs, creating edition records in the `editions` table so they appear on the live site.

3. **Update job statuses** — Set all successfully published jobs to `status = 'published'`.

### What Gets Published
19 articles including: Horses and Humans, Zero Gravity Comfort, PEMF Charging Cells, PEMF Pain & Inflammation, Sunlight vs Red Light, LumaFlex, and more.

### Files Changed
- **DB migration**: Bulk-approve article outputs for publishing-status jobs
- **Script execution**: Invoke `publish-to-website` for each job via the edge function

### Technical Note
The edge function already handles slug generation, YouTube embed conversion, edition numbering, and activity logging. We just need to approve the articles and trigger it for each job.

