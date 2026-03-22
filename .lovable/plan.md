

## Plan: Fix Three Editorial Workflow Issues

### Issue 1: Missing Social Platforms (Facebook, TikTok, Pinterest)

**Current state:** The social step only has 6 channels: LinkedIn, X Thread, Instagram, Reddit, Quote Card, Clip Titles. Facebook, TikTok, and Pinterest are missing.

**Fix:**
- Add `facebook`, `tiktok`, and `pinterest` to the `CHANNELS` array in `StepSocial.tsx`
- Add the same channels to the `CHANNELS` array in `generate-social/index.ts` edge function
- Redeploy the edge function

### Issue 2: Visuals Not Generating

**Current state:** The `transcripts` storage bucket is **private** (not public). The visuals step uploads images to this bucket and then calls `getPublicUrl()` — but since the bucket is private, the returned URL won't actually serve the image. The canvas `img.onload` never fires, so no preview renders.

**Fix:**
- Switch image uploads in `StepVisuals.tsx` to use `createSignedUrl()` instead of `getPublicUrl()` so images load correctly from the private bucket
- This will allow the canvas to render the preview properly

### Issue 3: Video Link Not Included in Newsletter

**Current state:** The `generate-newsletter` edge function fetches `content_jobs` and `content_briefs` but never fetches `content_sources` (where the video URL is stored). The video URL is completely absent from the AI prompt.

**Fix:**
- In `generate-newsletter/index.ts`, fetch the latest `content_sources` row for the job
- Include the `video_url` in the AI prompt so the newsletter content references the video
- Redeploy the edge function

### Files to Modify
1. `src/components/editor/steps/StepSocial.tsx` — add Facebook, TikTok, Pinterest channels
2. `supabase/functions/generate-social/index.ts` — add matching channels
3. `src/components/editor/steps/StepVisuals.tsx` — use signed URLs for image loading
4. `supabase/functions/generate-newsletter/index.ts` — fetch and include video URL in prompt

