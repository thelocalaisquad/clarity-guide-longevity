

# Longevity Channel 1 — Website Build Plan

## Brand Foundation
- **Logo & Identity**: Wordmark-first design using a serif/editorial typeface in a neutral palette (bone, off-white, charcoal, muted green, sand). Calm, informed, premium-but-not-luxury tone. No medical, biohacker, or startup imagery.
- **Design Style**: Editorial magazine aesthetic — generous whitespace, clean typography, long-form readability. Think *The Atlantic* meets *Monocle*.
- **Color system**: Warm neutrals with a muted green accent, all defined as CSS custom properties for consistency.

## Global Navigation
Fixed top navigation with exactly 5 items: **Home · Technologies · Products · Business & Operations · Videos**

## Backend (Lovable Cloud + Supabase)
A database-driven CMS so content can be managed without editing code. Core tables:
- **Technologies** — name, slug, description, how it works, evidence, individual use, operator use, FAQs
- **Products** — name, slug, technology link, home/commercial flag, specs, installation notes, safety notes
- **Videos** — title, slug, YouTube embed URL, summary, transcript, technology links, audience label
- **Operator Pages** — title, slug, content sections, related technologies
- **Comparison Pages** — title, slug, content, compared technologies

A simple **admin panel** (password-protected) to create/edit/delete content across all types.

## Page Templates (Built & Styled)
We'll build 5 reusable templates, each fully fleshed out with 1–2 real examples:

### 1. Home Page
- Hero with editorial positioning statement
- "What longevity technology is" section
- "Who this is for" (individuals + operators)
- How technologies are evaluated
- Entry points into Technologies and Business & Operations hubs

### 2. Hub Page Template (used for Technologies, Products, Business & Operations, Videos)
- Clean index layout with category cards/lists
- Short factual summaries for each linked item
- Filtering by technology or audience where appropriate

### 3. Technology Page Template
- Structured sections: What it is → How it works → Evidence → Individual use → Operator use → Related Products → Related Videos → FAQs
- Example pages: **Infrared Sauna** and **Red Light Therapy** fully built out with placeholder content

### 4. Product Page Template
- Descriptive (not promotional) layout
- Home vs. commercial suitability clearly labeled
- Technical specs in structured tables
- Installation and safety notes
- Example pages: one home product, one commercial product

### 5. Operator Authority Page Template
- Factual, pattern-focused content layout
- No legal advice framing
- Related technologies sidebar
- Example page: **Infrared Saunas as a Revenue Stream**

### 6. Video Page Template
- YouTube embed with its own dedicated page
- Summary, transcript section, technologies mentioned, products shown, audience intent label
- Example page: **How Infrared Saunas Work**

### 7. Comparison Page Template (optional, up to 3)
- Side-by-side structured comparison
- Example: **Infrared Sauna vs Traditional Sauna**

## What You Get at Launch
- All templates built and styled with the editorial design system
- 1–2 complete example pages per template type (~8–10 fully built pages)
- Admin panel to add the remaining ~24 pages yourself using the same templates
- Database seeded with the example content
- All pages dynamically rendered from the CMS — no code changes needed to add content
- SEO-friendly structure with clear entity hierarchy, intent labeling, and clean URLs

## Build Phases
**Phase 1**: Brand system, global layout, navigation, database schema  
**Phase 2**: Home page, hub pages (Technologies, Products, Business & Operations, Videos)  
**Phase 3**: Technology page template + 2 examples, Product page template + 2 examples  
**Phase 4**: Operator page template + 1 example, Video page template + 1 example  
**Phase 5**: Comparison page template + 1 example, admin panel for content management  

