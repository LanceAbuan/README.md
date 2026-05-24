# CODESTYLE.md — Portfolio Project Conventions

## Git Workflow

- **Never commit or merge directly to `main`.** Always work on a feature/refactor branch.
- **Push every branch to origin** — branches are public by default.
- **Multiple commits per PR.** Group related changes into logical commits (one per section/component). Don't squash unrelated work into a single commit.
- **Branch naming:** `feature/<desc>`, `refactor/<desc>`, `fix/<desc>`
- **Commit messages:** Imperative, descriptive. Example: `feat: add skip navigation link for accessibility`

## Code Style

- **TypeScript** everywhere. No `any`. Use explicit return types on exported functions.
- **Components:** Functional, `"use client"` only when needed (interactivity, hooks, events).
- **Props:** Typed interfaces, not `React.FC`.
- **Imports:** Grouped (external → internal → relative), sorted alphabetically within groups.
- **Naming:** camelCase for variables/functions, PascalCase for components/types, UPPER_CASE for constants.
- **Tailwind:** Utility classes in alphabetical order when practical. Use `@apply` only for repeated patterns.
- **Framer Motion:** Keep animations subtle. Respect `prefers-reduced-motion`.
- **Accessibility:** Semantic HTML first, ARIA only when semantics aren't enough. All interactive elements must be keyboard-accessible.
- **SEO:** Every page gets metadata, canonical URLs, and structured data where applicable.

## Theming

- Colors managed via CSS custom properties in `globals.css`.
- Dark/light via `next-themes` + `class="dark"` on `<html>`.
- Custom primary/secondary colors map to CSS variables, not hardcoded values.

## Related

- [`AGENTS.md`](AGENTS.md) — Agent workspace conventions
