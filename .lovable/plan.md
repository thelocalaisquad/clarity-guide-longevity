

# Remove Banner Ad

Remove the `BannerAd` component from the header so the site opens clean with just the logo and nav.

## Changes

1. **`src/components/layout/Header.tsx`** — Remove the `BannerAd` import and its usage inside the header
2. **`src/components/layout/BannerAd.tsx`** — Delete the file (no longer needed)
3. **`src/assets/strapline-bg.jpg`** — Can be removed as it was only used by BannerAd

