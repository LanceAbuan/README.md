# Issue #1: Blog Search with Client-Side Filtering

**Type:** Feature  
**Priority:** Medium  
**Status:** Open

## Description

Add a search/filter bar to the `/blogs` index page so users can quickly find posts by keyword, tag, or date range without scrolling through the entire list.

## Proposed Implementation

- Add a search input at the top of the blog index page
- Filter posts client-side by matching against `title`, `excerpt`, and `tags`
- Debounce input (300ms) to avoid excessive re-renders
- Show a "No results" state with a suggestion to broaden the search
- Optional: tag-based filter chips that pre-populate the search

## Acceptance Criteria

- [ ] Search input appears below the blog header
- [ ] Typing filters posts in real-time (debounced)
- [ ] Matching is case-insensitive and covers title, excerpt, and tags
- [ ] Empty state shows when no posts match
- [ ] Works with 0 posts, 1 post, and many posts
