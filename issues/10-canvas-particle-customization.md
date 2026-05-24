# Issue #10: Canvas Particle Background — Settings Panel & Performance Mode

**Type:** Feature / Performance  
**Priority:** Medium  
**Status:** Open

## Description

The animated canvas background is visually appealing but has no user control. Add a settings panel (or at minimum a toggle) to let users reduce or disable the animation, plus performance optimizations for low-end devices.

## Proposed Implementation

- Add a "reduce motion" toggle that disables particles and fractals when `prefers-reduced-motion: reduce` is detected (currently not fully respected)
- Implement automatic low-performance mode: detect low `devicePixelRatio`, low-memory devices, or throttled `requestAnimationFrame` and reduce `PARTICLE_COUNT` accordingly
- Optional settings panel (accessible from footer or a gear icon) with:
  - Particle count slider
  - Toggle for connection lines
  - Toggle for fractals
  - Full disable option
- Persist preferences in `localStorage`
- Add `requestIdleCallback` or frame-budget checks to avoid jank during scroll

## Acceptance Criteria

- [ ] `prefers-reduced-motion: reduce` fully disables the canvas animation
- [ ] Low-performance devices auto-reduce particle count
- [ ] User can manually disable or tune the animation
- [ ] Preferences persist across sessions (localStorage)
- [ ] No performance regression on high-end devices
- [ ] Animation doesn't cause scroll jank on mobile
