
# Instruções para Agentes de IA e LLMs

Sempre que gerar código para este repositório, obedeça estritamente às seguintes regras de arquitetura:

1. **Separação de Preocupações:** Os componentes React (`src/components`) são estritamente para apresentação. Eles NUNCA devem fazer chamadas `fetch` ou `axios` diretamente.
2. **Serviços:** Qualquer comunicação com o backend deve ser escrita como uma função assíncrona pura dentro de `src/services/`.
3. **Lógica de Interface:** Utilize Custom Hooks (`src/hooks/`) para orquestrar chamadas de serviços e atualizar o estado global.
4. **Estado:** Use `zustand` para estado global. Não utilize Redux.
5. **Validação:** Sempre utilize `zod` para validação de formulários ou payloads de API.
6. **Linter:** O projeto utiliza `@biomejs/biome`. Evite configurações exclusivas de ESLint no código gerado.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
