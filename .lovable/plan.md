

# Redesign Homepage to Match The Everygirl Layout

## What Changes

Rebuild the homepage modules to replicate the exact editorial patterns visible in The Everygirl screenshots, replacing Valentine's/lifestyle content with longevity technology content. No changes to URLs, CMS schema, section order, or content hierarchy.

## Section-by-Section Mapping

### 1. HeroIntro (already close -- minor refinements)
The current layout already mirrors The Everygirl's hero: large featured article left + "NEW and NOW" sidebar right. Refinements:
- Make the featured image taller/more dominant (closer to 16:9 or wider)
- Add a short excerpt paragraph under the headline
- Ensure sidebar cards have square thumbnails + category label + serif headline (already mostly there)

### 2. Scrolling Headline Ticker (NEW component)
Add a horizontal auto-scrolling marquee bar between the hero and the next section, matching The Everygirl's black ticker strip with white text. Content: longevity-related headlines like "INFRARED SAUNAS: THE COMPLETE GUIDE", "IS CRYOTHERAPY WORTH IT?", etc.

### 3. TechnologyGrid -- convert to horizontal scrolling carousel
Replace the static 5-column grid with a horizontally scrollable carousel (using Embla, already installed) with portrait-aspect cards, matching the XOXO/themed section. Title becomes a centered serif heading. Each card: tall portrait image + category label + serif headline. Left/right arrow buttons on the edges.

### 4. WhatWeCover -- convert to "ICYMI" masonry-style grid
Replace the current text + staggered images with an asymmetric 3-column masonry layout mixing text-first cards (category + headline on top, image below) and image-first cards (image on top, category + headline below), exactly like the "ICYMI: Stories Readers Are Loving RN" section.

### 5. Newsletter/Subscribe Strip (NEW component)
Add a dark background strip with centered text "Want exclusive content? We've got you covered." + email input + subscribe button, matching The Everygirl's format.

### 6. AudienceCards -- convert to 4-column "Latest Articles" grid
Replace the 2-card layout with a 4-column grid of portrait image cards (like "Latest Articles"), each with: portrait image, category label, and serif headline. Map to: Infrared Sauna, Red Light Therapy, Cryotherapy, Hyperbaric Oxygen -- linking to technology pages.

### 7. ApproachSection -- convert to masonry editorial grid
Replace the numbered steps layout with a 2-column asymmetric layout matching "The Everygirl at Home": cards that alternate image-first and text-first, with category labels and serif headlines. Content: the three evaluation steps presented as editorial cards rather than numbered boxes.

### 8. CtaStrip -- convert to split promo section
Replace the centered CTA with a two-column layout matching the Podcast/Substack section: left side has a large image, right side has a heading, paragraph, and sub-cards linking to key areas of the site.

### 9. Footer -- expand to multi-column
Add multi-column category links matching The Everygirl's footer: Technologies, Products, Business, Videos columns with sub-links, plus a newsletter signup column and a "Contact Us" column.

## Files Modified
- `src/components/home/HeroIntro.tsx` -- minor sizing tweaks
- `src/components/home/TechnologyGrid.tsx` -- rewrite as horizontal carousel
- `src/components/home/WhatWeCover.tsx` -- rewrite as masonry grid
- `src/components/home/AudienceCards.tsx` -- rewrite as 4-column article grid
- `src/components/home/ApproachSection.tsx` -- rewrite as asymmetric editorial grid
- `src/components/home/CtaStrip.tsx` -- rewrite as split promo section
- `src/components/home/TickerBar.tsx` -- NEW scrolling headline marquee
- `src/components/home/NewsletterStrip.tsx` -- NEW subscribe bar
- `src/pages/Index.tsx` -- add TickerBar and NewsletterStrip to the composition
- `src/components/layout/Footer.tsx` -- expand to multi-column with sub-links
- `src/index.css` -- add marquee animation keyframes

## Technical Notes
- The carousel uses `embla-carousel-react` (already installed)
- Marquee uses CSS animation (`@keyframes marquee`) for smooth infinite scroll
- All images reuse the existing 4 editorial assets already in `src/assets/`
- No new dependencies required
- Mobile: carousel swipes naturally; masonry grids collapse to single column; ticker stays full-width

