# Issue #2: Smooth Dark/Light Mode Transition

**Type:** Feature / Polish  
**Priority:** Low  
**Status:** Open

## Description

The current theme toggle switches instantly. Add a smooth CSS transition so the color change animates rather than snapping, improving the perceived quality of the site.

## Proposed Implementation

- Add `transition` properties to color-dependent elements (background, text, borders)
- Use CSS `transition-property: color, background-color, border-color, fill, stroke` with a short duration (200-300ms)
- Apply transitions at the `:root` level via CSS custom properties to minimize per-element rules
- Ensure the transition doesn't cause layout shifts or jank

## Acceptance Criteria

- [ ] Toggling theme animates color changes smoothly (~250ms)
- [ ] No flicker during initial page load (SSR hydration respected)
- [ ] Canvas background transitions gracefully
- [ ] Performance remains smooth on mobile
