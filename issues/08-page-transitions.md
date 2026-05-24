# Issue #8: Blog-to-Home Page Transitions

**Type:** Feature / Polish  
**Priority:** Low  
**Status:** Open

## Description

Navigating between the blog pages and the homepage currently feels like a hard page reload. Add subtle page transition animations to improve the browsing experience.

## Proposed Implementation

- Use Next.js App Router's built-in navigation transitions or a lightweight library
- Implement a fade-in/fade-out or slide transition on route changes
- Keep the homepage section scroll animations intact (don't interfere with Framer Motion)
- Ensure transitions respect `prefers-reduced-motion` for accessibility
- Target transitions only for blog routes (`/blogs`, `/blogs/[slug]`) to avoid over-engineering

## Acceptance Criteria

- [ ] Navigating from blog post to blog index has a smooth transition
- [ ] Navigating from blog to homepage has a smooth transition
- [ ] Transitions respect `prefers-reduced-motion: reduce`
- [ ] No regression in homepage scroll-triggered animations
- [ ] Transition duration is subtle (200-400ms)
