# Issue #3: Project Filtering by Technology Tag

**Type:** Feature  
**Priority:** Medium  
**Status:** Open

## Description

Allow users to filter the Projects section by technology tags. This is useful when a visitor wants to see only Python projects, or only web-related work, without scrolling through everything.

## Proposed Implementation

- Collect all unique tags across all projects
- Render filter chips/pills above the project grid
- Clicking a tag filters the visible projects to those containing that tag
- A "All" chip resets the filter
- Use URL query parameters (`?tag=Python`) so filters are shareable/bookmarkable
- Animate filtered-in/filtered-out cards with Framer Motion layout animations

## Acceptance Criteria

- [ ] Tag filter chips appear above the project grid
- [ ] Clicking a tag filters projects client-side
- [ ] "All" chip resets to show all projects
- [ ] URL query parameter syncs with active filter
- [ ] Sharing a filtered URL restores the filter state
- [ ] Smooth enter/exit animations for filtered cards
