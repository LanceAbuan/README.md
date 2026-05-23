# Code Style

Enterprise-grade standards for the portfolio project. Readability is the priority.

---

## Formatting

- **Prettier** is the source of truth. Run `npx prettier --write .` before committing.
- Configuration lives in `.prettierrc` (or `prettier` key in `package.json`).
- Never debate formatting. The formatter decides.

## File Structure

- **One component per file.** If a component grows beyond ~80 lines, extract sub-components or logic.
- **Separate logic from presentation.** Data fetching, transformation, and business logic go in `lib/` or dedicated `hooks/`. Components in `components/` only render.
- **Clear responsibility.** Each file should have one job. If you need more than one heading to describe a file, split it.
- **Next.js conventions:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` — use the framework's file-based routing names.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `Navbar.tsx`, `HeroSection.tsx` |
| Functions / hooks | camelCase | `useTheme()`, `getBlogPosts()` |
| Variables | camelCase | `isActive`, `postList` |
| Constants | UPPER_SNAKE_CASE | `MAX_POSTS`, `API_BASE_URL` |
| Files | kebab-case (except components) | `blog-utils.ts`, `theme-provider.tsx` |
| Directories | kebab-case | `components/ui`, `lib/blog` |

## Readability

- **Write code a human can pick up cold.** Assume the next reader has zero context.
- Name variables after what they *are*, not what type they are. `posts` not `postArray`.
- Extract complex expressions into named variables.
- Add comments that explain *why*, not *what*.
- Keep functions short. If you have to scroll to understand a function, it's too long.
- Prefer early returns over nested conditionals.

## TypeScript

- `strict: true` in `tsconfig.json`.
- Explicit return types on exported functions.
- No `any`. Use `unknown` and narrow, or create a proper type.
- Use `interface` for object shapes, `type` for unions/intersections.

## Imports

Grouped and alphabetical within groups:

```ts
// 1. React / framework
import { useState } from "react";
import Link from "next/link";

// 2. Third-party
import { motion } from "framer-motion";

// 3. Internal (@/ aliases)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 4. Relative
import { Header } from "./header";
```

## Tailwind

- Use `cn()` for conditional classes.
- Prefer utility classes over custom CSS. Custom CSS only when utilities can't express it.
- Keep class lists readable — one class per line if the list is long.

## Git

- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`
- **Branch naming:** `feature/description`, `fix/description`, `chore/description`
- **PRs for everything.** No direct pushes to `main`. Every change goes through a PR.
- Squash merge on approval.

## PR Process

1. Branch from `main`
2. Make changes
3. Run `npx prettier --write .` and `npm run build`
4. Push branch, open PR
5. Fill out the PR template
6. Self-review before requesting approval
