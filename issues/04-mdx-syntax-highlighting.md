# Issue #4: MDX Blog Syntax Highlighting

**Type:** Feature  
**Priority:** High  
**Status:** Open

## Description

Blog post code blocks currently render as plain monospace text without syntax highlighting. Add a syntax highlighting library to make code examples readable and professional.

## Proposed Implementation

- Integrate `react-syntax-highlighter` or `shiki` (preferred for Next.js) for code block rendering
- Update `mdx-components.tsx` to wrap `<code>` blocks with the highlighter
- Support language detection from code fence annotations (```typescript, ```python, etc.)
- Use a theme that adapts to dark/light mode (e.g., GitHub theme pair)
- Add line numbers as an optional toggle
- Ensure server-side rendering compatibility

## Acceptance Criteria

- [ ] Code blocks in blog posts are syntax-highlighted
- [ ] Language detection works from code fence annotations
- [ ] Highlighting adapts to dark/light theme
- [ ] No regression in SSR or build performance
- [ ] Inline `<code>` remains unaffected (no background block style)
