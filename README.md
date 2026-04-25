# Noster Front

Front end Next.js do Noster, um software de engenharia de decisao com IA.

## Scripts

- `npm run dev`: inicia o ambiente local em Next.js.
- `npm run build`: valida TypeScript e gera build de producao.
- `npm run start`: inicia o build de producao.
- `npm run lint`: executa ESLint.
- `npm run format`: formata os arquivos com Prettier.

## Estrutura

- `src/app`: rotas, layouts e estilos globais do Next.js App Router.
- `src/app/(public)`: rotas publicas, como `/landing`.
- `src/app/(authenticated)`: rotas do app pos-login, mantendo a URL `/app`.
- `src/features`: dominios do produto, com components, data, hooks, services e types por contexto.
- `src/shared`: UI base, feedback, constantes, utilitarios, estilos e tipos compartilhados.
