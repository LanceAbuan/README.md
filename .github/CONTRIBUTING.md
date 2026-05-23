# Contributing

## Workflow

1. Branch from `main`: `git checkout -b feature/description`
2. Make your changes
3. Format: `npx prettier --write .`
4. Verify: `npm run build`
5. Commit: `git commit -m "feat: description"`
6. Push: `git push origin feature/description`
7. Open a PR against `main`

## Rules

- **PRs for everything.** No direct pushes to `main`.
- **Conventional commits.** See [CODESTYLE.md](../CODESTYLE.md) for commit prefixes.
- **Prettier runs before every commit.** Formatted code only.
- **Build must pass.** If `npm run build` fails, the PR is blocked.
- **One feature per PR.** Don't mix unrelated changes.

## Questions

Ask in the PR description. Don't guess.
