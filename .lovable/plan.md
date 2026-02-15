
# Replace Banner Ad with Text Strapline

## What Changes

Replace the current image-based banner ad (`BannerAd.tsx`) with a styled text strapline targeting gym owners.

**Content:**
- Headline: "How The Best Gyms Are Quietly Becoming Longevity Hubs (and adding $10-50k a month)"
- CTA button: "Free Training"

## Design Approach

- Full-width dark background strip (matching the editorial black-and-white aesthetic)
- Headline in serif font for editorial authority
- "Free Training" as a compact, high-contrast CTA button on the right
- Responsive: stacks vertically on mobile, inline on desktop
- Links to `/business` (or an external training link -- will use `#` as placeholder)

## Technical Details

**File modified:** `src/components/layout/BannerAd.tsx`

- Remove the image import (`banner-ad.jpg`)
- Replace with a flex layout containing the strapline text and a CTA button
- Keep the same component name and export so `Header.tsx` needs no changes
- Styling: `bg-foreground text-background` for the dark strip, serif headline, sans-serif button with uppercase tracking to match site conventions
