# CEIF - Front-end

Interface web moderna desenvolvida para o ecossistema do sistema **CEIF**, construída com Next.js (App Router), TypeScript, Tailwind CSS e shadcn/ui, seguindo padrões rigorosos de arquitetura limpa e separação de preocupações.

---

## 🚀 Tecnologias e Ferramentas

- **Framework:** [Next.js](https://nextjs.org/) (App Router com Turbopack)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) & [tw-animate-css](https://github.com/mhsdesign/tw-animate-css)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Validação de Esquemas:** [Zod](https://zod.dev/)
- **Padronização & Linting:** [Biome](https://biomejs.dev/) & [Prettier](https://prettier.io/)
- **Containerização:** [Docker](https://www.docker.com/)

---

## 📁 Arquitetura do Projeto

O código-fonte está completamente modularizado sob o diretório `src/`:

```text
ceif-front/
├── public/                 # Ativos estáticos públicos (ícones, imagens)
├── src/
│   ├── app/                # Next.js App Router (páginas, layouts, globals.css)
│   ├── components/         # Componentes React puramente visuais (apresentação)
│   │   └── ui/             # Componentes base do shadcn/ui (Button, etc.)
│   ├── contexts/           # Contextos React globais ou de features
│   ├── hooks/              # Custom Hooks para orquestração de lógica e serviços
│   ├── lib/                # Utilitários compartilhados (ex: cn helper)
│   └── services/           # Comunicação pura com backend (funções assíncronas)
├── .gitignore
├── AGENTS.md               # Diretrizes mandatórias para Agentes de IA e LLMs
├── biome.json              # Configurações do linter e formatador Biome
├── components.json         # Configurações do shadcn/ui
├── Dockerfile              # Imagem Docker para deploy e desenvolvimento
├── next.config.ts          # Configurações do Next.js
├── package.json            # Dependências e scripts do projeto
└── tsconfig.json           # Configurações do compilador TypeScript
```

---

## ⚙️ Regras de Arquitetura

Conforme especificado em [`AGENTS.md`](./AGENTS.md):

1. **Componentes Visuais (`src/components`):** Estritamente para apresentação. Nunca devem realizar chamadas `fetch` ou `axios` diretamente.
2. **Serviços (`src/services`):** Toda comunicação com o backend deve ser estruturada como funções assíncronas puras.
3. **Custom Hooks (`src/hooks`):** Utilizados para orquestrar as chamadas de serviços e conectar os estados globais aos componentes.
4. **Estado Global:** Utilizar `zustand`. O uso de Redux não é permitido.
5. **Validação:** Utilizar `zod` para validação de formulários e contratos de payloads da API.
6. **Linter:** O projeto utiliza `@biomejs/biome`.

---

## 🛠️ Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou gerenciador de pacotes equivalente

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd ceif-front
npm install
```

### Executando em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

### Build de Produção

```bash
# Compilar o projeto
npm run build

# Iniciar servidor de produção
npm run start
```

### Linting e Formatação

```bash
# Checagem de código com Biome
npm run lint

# Formatação com Prettier
npm run format
```

---

## 🐳 Execução via Docker

Para construir e executar a aplicação em container:

```bash
# Construir a imagem Docker
docker build -t ceif-front .

# Executar o container na porta 3000
docker run -p 3000:3000 ceif-front
```

---

## 📄 Licença

Este projeto é de uso privado para o sistema CEIF.
