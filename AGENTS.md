# Developer Guidelines for Agentic Coding Agents

This document provides instructions and guidelines for agentic coding agents operating in the **SalarySense** repository.

## Project Overview
SalarySense is a modern web application built with **SolidJS** and **SolidStart**, using **Vinxi** as the underlying toolkit.

## 1. Commands

### Environment
- **Runtime**: **Bun** is used as the primary runtime and package manager.
- **Package Manager**: Use `bun`.

### Core Commands
- **Dev Server**: `bun run dev` (runs `vinxi dev`)
- **Build**: `bun run build` (runs `vinxi build`)
- **Start**: `bun run start` (runs `vinxi start` - for production preview)
- **Version**: `bun run version` (runs `vinxi version`)

### Quality Control (Linting & Formatting)
We use **Biome** for all linting, formatting, and import organization.
- **Check (Lint + Format)**: `bun x @biomejs/biome check .`
- **Fix (Lint + Format + Fix)**: `bun x @biomejs/biome check --write .`
- **Format Only**: `bun x @biomejs/biome format --write .`
- **Organize Imports**: `bun x @biomejs/biome check --write --rule=source.organizeImports .`

### Testing
- **Framework**: **Vitest** is the planned testing framework.
- **Run All Tests**: `bun run test` (once configured).
- **Run Single Test**: `bun x vitest run path/to/file.test.ts`.
- **Watch Mode**: `bun x vitest`.

---

## 2. Project Structure

- `src/`: Core source code.
  - `components/`: Reusable UI components.
  - `routes/`: File-based routing (SolidStart).
  - `app.tsx`: Main application entry and root layout.
  - `app.css`: Global styles including Tailwind directives.
  - `entry-client.tsx`: Client-side entry point.
  - `entry-server.tsx`: Server-side entry point.
- `public/`: Static assets (images, icons, etc.).
- `app.config.ts`: Vinxi/SolidStart configuration.
- `biome.json`: Linting and formatting rules.
- `tsconfig.json`: TypeScript configuration with path aliases.
- `package.json`: Dependencies and scripts.

---

## 3. Code Style & Guidelines

### Formatting & Linting
- **Indentation**: Use **tabs** as specified in `biome.json`.
- **Quotes**: Use **double quotes** for strings.
- **Semicolons**: Always include semicolons.
- **Import Sorting**: Biome handles this automatically. Run `bun x @biomejs/biome check --write .` after modifying imports.

### Component Structure
- Use **Functional Components** with SolidJS signals for state.
- Prefer **Named Exports** for utility functions and **Default Exports** for page/route components.
- Components should be modular and kept in `src/components/`.
- Routes/Pages are in `src/routes/`.

### State Management
- Use `createSignal` for local component state.
- Use `createStore` for complex nested state.
- Avoid unnecessary prop drilling; use Solid's Context API if state needs to be shared deeply.

### Styling
- **Tailwind CSS**: Primary styling method. Use utility classes in `class` (not `className`).
- **Global CSS**: Located in `src/app.css`.
- **Component-Specific CSS**: If needed, create a `.css` file next to the component and import it.

### TypeScript Usage
- **Strict Mode**: `strict: true` is enabled in `tsconfig.json`.
- Use explicit types for function parameters and return values when not obvious.
- Avoid `any`. Prefer `unknown` or specific interfaces.
- Use `~/*` absolute path mappings for imports from `src/`.

### Naming Conventions
- **Components**: `PascalCase` (e.g., `SalaryCalculator.tsx`).
- **Files/Folders**: `kebab-case` for general files/folders, but match component name for component files.
- **Variables/Functions**: `camelCase`.
- **Constants**: `SCREAMING_SNAKE_CASE`.

### Error Handling
- Use `try/catch` blocks for asynchronous operations (API calls).
- For UI error boundaries, use SolidJS `<ErrorBoundary>`.
- Use `Suspense` for data fetching states.
- Log errors to a centralized logging service if one is eventually implemented; for now, use `console.error` with descriptive context.

### Data Fetching
- Use Solid's `createResource` for fetching data from external APIs.
- Prefer server-side data fetching in loaders (if using SolidStart's `cache` and `createAsync`) to reduce client-side overhead.
- Ensure all resources are wrapped in `<Suspense>` to provide a consistent loading experience.

### Accessibility (A11y)
- Use semantic HTML tags whenever possible (e.g., `<main>`, `<nav>`, `<article>`, `<button>` instead of `<div>`).
- Always provide `aria-label` for buttons that only contain icons.
- Ensure all form elements have associated labels.
- Verify color contrast ratios meet WCAG AA standards.

### Performance
- Leverage SolidJS's fine-grained reactivity; avoid unnecessary signal reads in large loops.
- Use `index` or `<For>` for lists to ensure efficient DOM updates.
- Keep components small and focused on a single responsibility.
- Optimize images by using modern formats (WebP/AVIF) and providing appropriate `srcset`.

### Project Specific Patterns
- **Routing**: File-based routing is handled by `@solidjs/start/router` in `src/routes/`.
- **Server Actions**: If adding server-side logic, use SolidStart server functions (`"use server"`).
- **Environment Variables**: Use `.env` files for configuration. Prefix client-side variables with `VITE_` if they need to be accessed in the browser.

---

## 4. Development Workflow

### Step-by-Step Implementation
1.  **Analyze**: Understand the requirements and the existing codebase.
2.  **Plan**: Draft a plan and share it with the user if the task is complex.
3.  **Implement**: Write clean, typed, and formatted code.
4.  **Verify**: Run the dev server to check changes and execute linting/formatting commands.
5.  **Refine**: Address any feedback or issues discovered during verification.

### Self-Correction
- If a command fails, read the error message carefully and attempt to fix the root cause.
- If you are unsure about a project pattern, search the codebase for similar implementations.

## 5. Git Workflow & Collaboration
- **Branching**: Use descriptive branch names like `feature/abc` or `fix/xyz`.
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: ...`, `fix: ...`).
- **Pull Requests**: Provide a clear summary of changes and reference any related issues.
- **Reviews**: Ensure all Biome checks pass before requesting a review.

## 5. Cursor & Copilot Rules
- Currently, no specific `.cursorrules` or `.github/copilot-instructions.md` are defined.
- Follow the guidelines in this `AGENTS.md` file as the primary source of truth.
- When generating code, prioritize readability and maintainability over clever one-liners.
- If you find inconsistencies in the codebase, follow the established patterns even if they differ slightly from these guidelines, but consider bringing it to the developer's attention.
