# Repository Guidelines

## Project Structure & Module Organization
- Vite root is `src/`; entry HTML is `src/index.html`, and per-page sources live under `src/pages/` (HTML/EJS). Partials and shared layouts sit in `src/templates/` (partials in `templates/partials`).
- Assets are grouped by type in `src/assets/` (`styles/`, `scripts/`, `images/`). Main stylesheet entry is `src/assets/styles/style.scss`.
- Static files copied as-is belong in `src/public/`; Vite outputs to `dist/` (not committed).
- `vite.config.js` wires custom plugins (`viteEjsPlugin.js`, `viteGenerateIndexPlugin.js`) and collects JS/SCSS/HTML inputs; update these when adding new entry files.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start Vite dev server on port 3000 with live reload (EJS and SCSS globs enabled).
- `npm run build` — produce production assets in `dist/` with the current Rollup inputs; output files are grouped under `assets/`.
- No automated tests exist yet; add scripts (e.g., `npm test`) alongside new test tooling when introduced.

## Coding Style & Naming Conventions
- Project uses ESM (`type: module`). Keep imports relative to `src/` and prefer the `@/` alias for readability.
- Prettier rules in `prettier.config.js`: 2-space indent, single quotes, semicolons on, width 80, trailing commas off, arrow params omit parens when avoidable, `bracketSameLine: true`. Run `npx prettier .` before commits.
- SCSS is organized by page under `src/assets/styles/pages/` and base styles under `base/`; follow that grouping when adding styles.
- Name new pages and assets in lowercase with hyphens (e.g., `about-us/index.html`, `header-logo.png`); place reusable JS utilities under `src/assets/scripts/`.

## Testing Guidelines
- Prefer page-level checks in the browser via `npm run dev` for now; validate generated routes in `dist/` with `npm run build` before merging.
- When adding tests, co-locate them with source files or mirror the directory tree under a `__tests__` folder, and document the command in `package.json`.

## Commit & Pull Request Guidelines
- Follow existing history: concise, present-tense messages, optionally referencing tickets/PRs (e.g., `feat: add footer layout (#12)`).
- Keep commits focused (one feature or fix). Include screenshots or GIFs in PRs for visual changes and note impacted pages.
- PR description should summarize scope, list key changes, and mention any manual verification (pages opened, build run). Link related issues when applicable.
