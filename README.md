# Noster Front

Front end Next.js do Noster, um software de engenharia de decisão com IA.

## Scripts

- `npm run dev`: inicia o ambiente local em Next.js.
- `npm run build`: valida TypeScript e gera build de produção.
- `npm run start`: inicia o build de produção.
- `npm run lint`: executa ESLint.
- `npm run format`: formata os arquivos com Prettier.

## Estrutura

- `src/app`: rotas, layouts e estilos globais do Next.js App Router.
- `src/app/(public)`: rotas públicas, como `/landing`.
- `src/app/(authenticated)`: rotas do app pós-login, mantendo a URL `/app`.
- `src/features`: domínios do produto, separados por contexto de negócio.
- `src/features/decision-management/components`: organizado por `overview`, `decisions`, `personas` e `shared`.
- `src/shared`: UI base, feedback, constantes, utilitários, estilos e tipos compartilhados.
