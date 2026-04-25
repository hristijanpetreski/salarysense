# Agent Guidelines for SalarySense

This document helps agentic coding assistants work effectively in the SalarySense repository by documenting observed commands, conventions, architecture, and non-obvious gotchas. Only facts observed in the repository are included.

## Project overview

- Modern web application built with SolidJS and SolidStart (file-based routing).
- Vinxi is used as the project scaffolding / adapter (package scripts call `vinxi`).
- Tailwind CSS is used for styling (vite plugin configured in `app.config.ts`).

## Essential commands

Commands are defined in package.json. The project expects Bun to be used as the runtime/package manager in normal development but the scripts are plain npm-style scripts and can be run with Bun or Node tooling that runs package.json scripts.

- Dev server: `bun run dev` (runs `vinxi dev`)
- Build: `bun run build` (runs `vinxi build`)
- Start (preview): `bun run start` (runs `vinxi start`)
- Version info: `bun run version` (runs `vinxi version`)
- Run tests: `bun run test` (script runs `vitest run`)
- Run vitest directly: `bun x vitest run` or `bun x vitest` (watch)
- Vitest UI: `bun run test-ui` (script uses `vitest --ui`)

Quality / formatting (Biome):
- Check (lint + format): `bun x @biomejs/biome check .`
- Fix (lint + format + write): `bun x @biomejs/biome check --write .`
- Format only: `bun x @biomejs/biome format --write .`
- Organize imports (Biomes assist config also enables automatic organization in some editors):
  `bun x @biomejs/biome check --write --rule=source.organizeImports .`

Notes:
- package.json lists `engines.node` >= 22, the repository was set up to be used with Bun in the developer notes.

## Project layout and architecture

- src/
  - components/ — reusable UI components (Solid components)
  - routes/ — SolidStart routes (file-based routing). Examples: `src/routes/index.tsx`, `src/routes/demo.tsx`, `[...404].tsx`.
  - lib/ — utilities and shared code (example: salary calculations in `src/lib/salary.ts`, UI primitives in `src/lib/ui/`).
  - entry-client.tsx, entry-server.tsx, app.tsx — app entry points / root layout used by SolidStart.
- public/ — static assets (icons, manifest)
- app.config.ts — SolidStart/Vite config (shows tailwindcss plugin)
- biome.json — Biome configuration for formatting and linting
- tsconfig.json — TypeScript config; note path alias `~/*` → `./src/*`

Control/data flow (high level):
- Business logic (salary calculations) lives in `src/lib/salary.ts` and is imported by routes/pages (e.g., `src/routes/index.tsx`).
- UI components live under `src/lib/ui` and are used by pages. Pages call pure functions in `lib` and present results.

## Code style and conventions (observed)

- Biome is the formatter/linter. The Biome config sets:
  - formatter indentStyle: "space" and indentWidth: 4 (use 4 spaces for indentation).
  - JavaScript quoteStyle: "double" (use double quotes where possible).
  - Linter recommended rules are enabled.
  - Assist organizes imports (`assist.actions.source.organizeImports: on`).
- TypeScript settings (tsconfig.json):
  - `strict: true` and `noEmit: true`.
  - JSX is preserved with `jsxImportSource: "solid-js"`.
  - Path alias `~/*` maps to `./src/*` — use this alias in imports (observed throughout code).
- Use SolidJS idioms:
  - `createSignal`, `createMemo`, and SolidJS reactive primitives for component state.
  - Components are functional Solid components.
- Tailwind usage: utility classes appear in `class` attributes (not `className`) consistent with SolidJS.

Important correction (non-obvious and critical):
- The repository's Biome configuration uses spaces (4) for indentation. Do NOT use tabs. The previous AGENTS.md entry claiming "tabs" is incorrect — follow `biome.json`.

## Testing

- Vitest is used for unit tests (`vitest` present in devDependencies). A test file exists at `src/lib/salary.test.ts` covering the salary logic.
- Run tests via `bun run test` (runs the `test` script) or run vitest directly with `bun x vitest`.
- Tests use typical Vitest APIs (`describe`, `it`, `expect`). Look at `src/lib/salary.test.ts` as the canonical example for test style and coverage expectations.

## Notable files and entry points

- `src/routes/index.tsx` — main page using `calculateSalary` and UI components.
  - Demonstrates usage of `calculateSalary`, `finalizeSalary`, and UI components like `SegmentedButtonGroup` and `Input`.
- `src/lib/salary.ts` — core domain logic for salary calculations. Pure functions, well-tested.
- `src/lib/constants.ts` — rates used by calculations (exported as `RATES` readonly constant).
- `app.config.ts` — contains Vite plugin configuration (tailwindcss), useful when modifying build config.

## Gotchas and non-obvious patterns

- Path alias: imports frequently use `~/...` (see `tsconfig.json`), so editors and build tooling must respect the alias. When running TypeScript checks or other tools directly, ensure they load `tsconfig.json` so the alias resolves.
- Formatting + imports: Biome is configured to auto-organize imports in assist mode. Edits may change import order/format automatically when running Biome checks.
- Indentation: follow `biome.json` (4 spaces). Many editors default to tabs — configure the editor or run Biome format to avoid needless diffs.
- Tailwind plugin: `app.config.ts` registers `@tailwindcss/vite` plugin for Vite — if you modify PostCSS/Vite config, keep this in mind.
- Tests already exist for salary logic. When modifying `salary.ts`, update/add tests in `src/lib/salary.test.ts` and run `bun run test`.

## How to approach common agent tasks

- Small code change / bug fix in `src/lib`:
  1. Run tests (`bun run test`) to reproduce failing behavior (or run relevant test file).
  2. Edit code, keeping Biome style in mind (4-space indent, double quotes).
  3. Run `bun x @biomejs/biome check --write .` to apply formatting and organize imports.
  4. Run tests again.

- Adding a new route/page:
  - Add a file under `src/routes/` (file-based routing). Use SolidStart patterns as seen in `src/routes/index.tsx`.
  - Use `~/` imports for local code.
  - Add tests if logic is non-trivial.

- Modifying build config:
  - `app.config.ts` is the canonical place for Vite/SolidStart config. The project uses the Tailwind Vite plugin here; preserve it unless intentionally changing CSS build.

## What is NOT included

- No CI configs, deploy scripts, or environment variable conventions were found besides standard `.env` guidance — do not assume CI details.
- Do not assume the presence of additional linters/formatters beyond Biome unless you find them in the repository.

## Quick references

- Path alias: `~/*` → `./src/*` (tsconfig.json)
- Primary test file to study: `src/lib/salary.test.ts`
- Core business logic: `src/lib/salary.ts`
- Formatting config: `biome.json` (4 spaces, double quotes)
- SolidStart/Vite config: `app.config.ts`

---

If you need me to update or expand any section (examples, more gotchas, CI notes after you add them), say which area to expand and I will update AGENTS.md accordingly.