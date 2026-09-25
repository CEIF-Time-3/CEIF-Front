# Instructions for AI Agents and LLMs

Whenever generating code for this repository, strictly obey the following architecture rules:

1. **Separation of Concerns:** React components (`src/components`) are strictly for presentation. They must NEVER make `fetch` or `axios` calls directly.
2. **Services:** Any communication with the backend must be written as a pure asynchronous function inside `src/services/`.
3. **UI Logic:** Use Custom Hooks (`src/hooks/`) to orchestrate service calls and update global state.
4. **State Management:** Use `zustand` for global state. Do not use Redux.
5. **Validation:** Always use `zod` for form or API payload validation.
6. **Linter:** The project uses `@biomejs/biome`. Avoid exclusive ESLint configurations in generated code.
7. **Design & Colors:** Strictly adhere to the foundational color palette and design tokens defined in `src/app/globals.css` (or the global CSS file) when styling components or creating new interfaces.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
