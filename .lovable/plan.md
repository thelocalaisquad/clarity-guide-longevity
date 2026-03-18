

# Structured Newsletter Content System

## What changes

The current edition system has a free-form `body_html` field. You want a structured format where every edition always has the same sections, plus core inputs (video, raw info, product). Here's what we'll build:

### 1. Database: Add structured content columns

Add new columns to the `editions` table replacing the single `body_html` with dedicated fields:

| Column | Purpose |
|--------|---------|
| `section_what_is_it` | "What is it?" section content (HTML) |
| `section_how_it_works` | "How it works" section content (HTML) |
| `section_why_different` | "Why is it different?" section content (HTML) |
| `section_who_is_it_for` | "Who is it for?" section content (HTML) |
| `raw_information` | The raw source material / research notes you paste in |

Keep `body_html` for backwards compatibility but the new structured sections take priority when present.

### 2. Admin Form: Restructured input flow

Reorganise the admin form (`/admin/editions/new`) into a clear workflow:

**Step 1 — Core Content** (what you always upload)
- Video embed URL + title + caption
- Raw information textarea (paste your research/notes)
- Product link, name, description, price, image

**Step 2 — Structured Sections** (the newsletter body)
- "What is it?" — textarea
- "How it works" — textarea
- "Why is it different?" — textarea
- "Who is it for?" — textarea

**Step 3 — Expert + FAQs**
- Expert callout fields (name, title, credential, photo)
- Dynamic FAQ pairs (add/remove)

**Step 4 — CTA & Contact**
- Already handled: each edition links to the AI advisor and strategy call booking (from ExpertDialog component)
- We'll add a persistent CTA block at the bottom of every edition linking to both

**Step 5 — Metadata & SEO**
- Edition number, title, slug, category, author, date
- Meta description, canonical URL, OG image
- Published toggle

### 3. Edition Template: Structured layout

Update the public edition page to render the structured sections in order:

1. Breadcrumb + Header + Title + Byline
2. Video
3. Lead summary
4. Expert callout
5. **"What is it?"** section with H2
6. **"How it works"** section with H2
7. **"Why is it different?"** section with H2
8. **"Who is it for?"** section with H2
9. Product spotlight
10. FAQs
11. **New CTA block** — "Have more questions?" with links to AI advisor chat and strategy call booking
12. Subscribe

### 4. JSON-LD updates

Add the structured sections as defined `articleSection` entries in the schema markup for better AI search visibility.

## Technical details

- **Migration**: `ALTER TABLE editions ADD COLUMN` for the 5 new text columns
- **Form**: Update zod schema, add new form sections with clear labels and placeholder guidance
- **Template**: New `EditionStructuredSections` component rendering the 4 "What/How/Why/Who" blocks
- **CTA component**: New `EditionContactCta` component with links to AI advisor and booking calendar (using existing URLs from ExpertDialog)
- **Backwards compatible**: If structured sections are empty, falls back to `body_html`

