# Issue #6: Dynamic OG/Social Share Images per Blog Post

**Type:** Feature  
**Priority:** Medium  
**Status:** Open

## Description

Currently all pages share the same static OG image (`/og.png`). Generate unique Open Graph images for each blog post that include the post title, date, and a consistent design template.

## Proposed Implementation

- Use `@vercel/og` (Next.js Image Response API) or `satori` to generate OG images dynamically
- Create an `/api/og` route that accepts `title` and `date` query parameters
- Design a clean template matching the site's aesthetic (dark/light variants)
- Update `generateMetadata()` in `blogs/[slug]/page.tsx` to set `openGraph.images` to the dynamic URL
- Keep the static `/og.png` as fallback for the homepage

## Acceptance Criteria

- [ ] Each blog post generates a unique OG image with title and date
- [ ] Image dimensions are 1200×630 (standard OG size)
- [ ] Design matches the site's visual identity
- [ ] Long titles are truncated or resized gracefully
- [ ] Homepage still uses the static OG image as fallback
