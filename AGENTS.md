# AGENTS.md

## Project Overview

- This repository is a Vue 3 component library plus a Vite-powered demo site for Microsoft Fluent UI emoji picking.
- Prefer linking to the public API and usage details already documented in [README.md](README.md) instead of duplicating them here.

## Commands

- Install dependencies with `pnpm install`.
- Start the demo app with `pnpm dev`.
- Build everything with `pnpm build`.
- Build only the publishable library with `pnpm build:lib`.
- Build only the demo site with `pnpm build:web`.
- Preview the demo build with `pnpm preview`.
- Regenerate emoji data with `pnpm generate-emoji-list`.
- There are currently no dedicated `test`, `lint`, or `typecheck` scripts in [package.json](package.json). Use the narrowest available build command for validation.

## Code Map

- [src/index.ts](src/index.ts) is the library entry and public export surface.
- [src/plugin/index.ts](src/plugin/index.ts) contains plugin install behavior and config injection helpers.
- [src/components](src/components) contains reusable library components.
- [src/config](src/config) contains shared runtime configuration used by the plugin and demo.
- [src/data](src/data) contains emoji metadata, category definitions, and filtering utilities.
- [src/examples](src/examples) and [src/App.vue](src/App.vue) power the demo site.
- [src/main.ts](src/main.ts) is only for the demo app bootstrap.
- [scripts](scripts) contains emoji data generation and other repository maintenance scripts.
- [.github/workflows](.github/workflows) contains the GitHub Actions workflows for npm publishing and GitHub Pages deployment.

## Important Boundaries

- For library-facing changes, start from [src/index.ts](src/index.ts), [src/plugin/index.ts](src/plugin/index.ts), or the affected file under [src/components](src/components).
- For demo-only changes, work in [src/App.vue](src/App.vue), [src/examples](src/examples), or [src/main.ts](src/main.ts).
- Keep the library export surface intentional. Do not add exports from [src/index.ts](src/index.ts) unless the API change is required.
- Vite runs in two modes from [vite.config.ts](vite.config.ts): `lib` writes to `dist`, while `web` writes the demo site to `dist/web`.
- `vite-plugin-dts` excludes most of [src/examples](src/examples) from declaration generation. Avoid moving publishable library code into demo folders.

## Project-Specific Pitfalls

- Not everything under [src/examples](src/examples) is purely demo-only: [src/plugin/index.ts](src/plugin/index.ts) registers `CdnSelector` from `src/examples/components/CdnSelector.vue` as a global component. Changes there can affect plugin consumers.
- Publishing and GitHub Pages deployment are handled by GitHub Actions workflows under [.github/workflows](.github/workflows). Do not trigger or alter release automation unless the user explicitly asks.
- The repo currently mixes library code, demo code, and packaging scripts in one workspace. Prefer the smallest validation that matches the edited area.

## Validation Guidance

- After library code changes, prefer `pnpm build:lib`.
- After demo UI changes, prefer `pnpm build:web` or `pnpm dev` if interactive verification is needed.
- After changes that touch shared config, exports, or plugin wiring, prefer `pnpm build`.
- If a change affects generated emoji data, run `pnpm generate-emoji-list` only when the task explicitly requires updating the data source.