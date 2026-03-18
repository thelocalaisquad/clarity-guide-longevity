

# Edition Creator Admin Page

## Overview
Build a password-protected admin page where you can create and manage edition content through a structured form, with live preview. Editions will be stored in the database and rendered dynamically at `/editions/:slug`.

## What gets built

### 1. Database: `editions` table
A new table storing all edition fields currently hardcoded in the template:
- Core fields: number, slug, title, category, date, author, read_time
- Content fields: meta_description, lead_summary, lead_summary_plain, body_html
- Video fields: video_embed_url, video_caption, video_title
- Expert fields: expert_name, expert_title, expert_credential, expert_photo_url
- Product fields: product_name, product_description, product_price_range, product_image_url, product_cta_url
- FAQs: stored as JSONB array
- SEO: canonical_url, og_image
- Status: draft/published flag
- Timestamps: created_at, updated_at

RLS: Public read for published editions. Authentication required for insert/update/delete.

### 2. Authentication
Simple email/password login for admin access (no public signup). Required since the database uses RLS.

### 3. Admin Edition Creator page (`/admin/editions`)
A structured form with sections matching the edition template:
- **Edition basics** -- number, title, slug (auto-generated from title), category dropdown, date, author, read time
- **Lead summary** -- rich text area for the summary
- **Video** -- embed URL, caption, title fields
- **Expert callout** -- name, title, credential, photo URL
- **Body content** -- HTML text area for main article body
- **Product spotlight** -- name, description, price range, image URL, CTA link
- **FAQs** -- dynamic add/remove FAQ pairs
- **SEO** -- meta description, OG image URL
- **Status** -- draft/published toggle
- **Live preview** button to see how the edition will look

### 4. Dynamic Edition Template
Update `EditionTemplate.tsx` to fetch edition data from the database by slug instead of using hardcoded data. Show 404 for missing editions.

### 5. Editions list on admin
A simple table listing all editions with edit/delete actions.

## Technical details

- **Auth**: Supabase auth with email/password. No auto-confirm (email verification required).
- **Form**: react-hook-form with zod validation
- **Routes**: `/admin/login`, `/admin/editions` (list), `/admin/editions/new` (create), `/admin/editions/:id/edit` (edit)
- **Database migration**: Single migration creating the `editions` table with RLS policies
- **Edition Template**: Updated to use `useQuery` to fetch from database, with loading/error states

