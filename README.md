# Documentação da Arquitetura Frontend — NOSTER

## Visão geral

O frontend do NOSTER está estruturado para crescer de forma organizada, mantendo uma separação clara entre rotas, telas, componentes visuais, regras de interface, estado, dados temporários e futura integração com backend.

A arquitetura atual foi pensada para permitir que o produto continue evoluindo visualmente agora, sem depender da definição imediata das APIs. Quando o backend for iniciado, a integração poderá acontecer sem reescrever telas ou componentes principais.

O fluxo central da aplicação é:

```txt
page.tsx
↓
Screen
↓
Hook
↓
Repository
↓
Mock hoje / API amanhã
```

Essa organização garante que a interface não fique presa aos dados mockados. Os mocks funcionam apenas como simulação temporária da fonte de dados, enquanto os repositories servem como camada de isolamento para uma futura API.

---

## Estrutura principal

```txt
src/
├── app/
├── features/
└── shared/
```

A estrutura está dividida em três grandes blocos:

- `app/`: responsável pelas rotas e layouts do Next.js.
- `features/`: responsável pelos domínios funcionais do produto.
- `shared/`: responsável por componentes, estilos, tipos e utilitários reutilizáveis.

---

## `app/`

A pasta `app/` concentra as rotas da aplicação usando o App Router do Next.js.

```txt
src/app/
├── globals.css
├── layout.tsx
├── page.tsx
├── (public)/
│   └── landing/
│       └── page.tsx
└── (authenticated)/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        ├── configuracoes/
        ├── decisoes/
        ├── multi-agentes/
        ├── persuasao/
        └── reunioes/
```

### Responsabilidade

O `app/` deve ser mantido fino. Ele deve cuidar de:

- rotas;
- layouts;
- agrupamento público/autenticado;
- chamada da tela principal da feature.

### O que evitar

Evitar colocar dentro de `app/`:

- regra de negócio;
- dados mockados;
- lógica complexa de estado;
- componentes grandes;
- chamadas diretas para API.

O ideal é que cada `page.tsx` apenas importe e renderize uma `Screen`.

Exemplo:

```tsx
import { MeetingsScreen } from '@/features/meetings/screens/MeetingsScreen';

export default function Page() {
  return <MeetingsScreen />;
}
```

---

## `features/`

A pasta `features/` organiza o produto por domínio funcional.

```txt
features/
├── auth/
├── authenticated-app/
├── decision-management/
├── landing/
├── meetings/
├── multi-agents/
├── persuasion/
└── settings/
```

Cada feature representa uma área real do produto.

---

# Padrão das features

As features principais seguem este padrão:

```txt
feature-name/
├── components/
├── hooks/
├── mocks/
├── repositories/
├── screens/
├── styles/
└── types/
```

Nem toda feature precisa obrigatoriamente de todas as pastas. A regra é criar apenas quando houver necessidade.

---

## `components/`

A pasta `components/` contém partes visuais da feature.

Exemplo:

```txt
features/meetings/components/
├── CreateMeetingButton.tsx
├── MeetingCard.tsx
├── MeetingDetailsPanel.tsx
├── MeetingsFilterBar.tsx
├── MeetingsKanban.tsx
└── MeetingStatusColumn.tsx
```

### Responsabilidade

Componentes devem:

- renderizar interface;
- receber dados por `props`;
- disparar callbacks;
- ser reutilizáveis dentro da feature.

### O que evitar

Componentes não devem:

- importar mocks diretamente;
- buscar dados diretamente;
- conhecer detalhes do backend;
- concentrar regra pesada de tela.

Exemplo recomendado:

```tsx
<MeetingsKanban meetings={meetings} onOpenMeeting={handleOpenMeeting} />
```

Exemplo a evitar:

```tsx
import { meetings } from '../mocks/meetings.mock';
```

---

## `screens/`

A pasta `screens/` contém telas completas.

Exemplo:

```txt
features/meetings/screens/
├── MeetingDetailsScreen.tsx
└── MeetingsScreen.tsx
```

### Responsabilidade

Uma `Screen` monta a página de uma feature. Ela pode:

- chamar hooks;
- controlar estado de tela;
- renderizar loading;
- renderizar error;
- renderizar empty state;
- compor vários componentes.

Exemplo de fluxo:

```tsx
export function MeetingsScreen() {
  const { meetings, isLoading, error } = useMeetings();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState title="Não foi possível carregar as reuniões." />;
  }

  return <MeetingsKanban meetings={meetings} />;
}
```

---

## `hooks/`

A pasta `hooks/` concentra a lógica de estado e consumo dos dados da feature.

Exemplo:

```txt
features/meetings/hooks/
├── useMeetingDetails.ts
└── useMeetings.ts
```

### Responsabilidade

Hooks devem:

- chamar repositories;
- controlar `isLoading`;
- controlar `error`;
- controlar `data`;
- expor funções como `refetch`, quando necessário;
- evitar que a tela conheça a origem real dos dados.

### Padrão recomendado

```ts
return {
  data,
  isLoading,
  error,
  refetch,
};
```

Ou, quando fizer sentido para leitura da tela:

```ts
return {
  meetings,
  isLoading,
  error,
  refetch,
};
```

### Benefício

Quando o backend entrar, a tela continua chamando o mesmo hook. A mudança acontece dentro do repository.

---

## `repositories/`

A pasta `repositories/` é a camada de origem dos dados.

Exemplo:

```txt
features/meetings/repositories/
└── meetings.repository.ts
```

### Responsabilidade

Repositories devem:

- buscar os dados atuais da feature;
- hoje podem usar mocks;
- amanhã podem chamar API;
- esconder da interface a origem real dos dados.

### Exemplo atual com mock

```ts
import { meetings } from '../mocks/meetings.mock';

export async function getMeetings() {
  return meetings;
}

export async function getMeetingById(meetingId: string) {
  return meetings.find((meeting) => meeting.id === meetingId) ?? null;
}
```

### Futuro com API

Quando a API existir, o hook não muda e a tela não muda. Apenas o repository muda.

```ts
export async function getMeetings() {
  const response = await fetch('/api/meetings');
  return response.json();
}
```

---

## `mocks/`

A pasta `mocks/` contém dados temporários usados para desenvolver o front antes do backend.

Exemplo:

```txt
features/meetings/mocks/
└── meetings.mock.ts
```

### Responsabilidade

Mocks devem:

- simular dados reais;
- ajudar a construir a interface;
- ficar isolados dos componentes;
- ser consumidos preferencialmente apenas pelos repositories.

### Regra importante

Mock não deve ser importado diretamente por `components/` ou `screens/`.

Permitido:

```ts
// repository
import { meetings } from '../mocks/meetings.mock';
```

Evitar:

```ts
// component ou screen
import { meetings } from '../mocks/meetings.mock';
```

---

## `types/`

A pasta `types/` contém os contratos TypeScript da feature.

Exemplo:

```txt
features/meetings/types/
└── meeting.ts
```

### Responsabilidade

Types devem:

- definir os modelos usados pela interface;
- evitar `any`;
- padronizar os formatos de dados usados em componentes, hooks e repositories.

Exemplo:

```ts
export type Meeting = {
  id: string;
  title: string;
  status: 'pending' | 'analyzed' | 'archived';
  date: string;
};
```

---

## `styles/`

A pasta `styles/` contém os estilos específicos da feature.

Exemplo:

```txt
features/decision-management/styles/
├── decision-management.css
└── decision-management/
    ├── analysis-folder.css
    ├── base.css
    ├── decisions.css
    ├── financial-history.css
    ├── health-snapshot.css
    ├── overview-metrics.css
    ├── performance-overview.css
    ├── personas.css
    ├── principal-insight.css
    └── responsive.css
```

### Responsabilidade

Styles devem:

- manter estilos próximos da feature;
- evitar concentração excessiva em um único arquivo;
- separar estilos por contexto visual;
- manter responsividade organizada.

---

# Features atuais

## `auth/`

```txt
features/auth/
├── components/
├── hooks/
├── repositories/
└── types/
```

### Função

Responsável pela autenticação e sessão do usuário.

### Preparado para

- login social;
- logout;
- sessão;
- usuário atual;
- token futuro;
- permissões futuras.

---

## `authenticated-app/`

```txt
features/authenticated-app/
├── components/
├── layouts/
└── styles/
```

### Função

Responsável pela estrutura da área logada.

Inclui:

- sidebar;
- header;
- navegação;
- perfil do usuário;
- layout autenticado.

Essa feature é estrutural e não precisa, neste momento, de `repositories` ou `mocks`, porque não representa uma entidade de dados principal.

---

## `landing/`

```txt
features/landing/
├── components/
├── data/
├── screens/
└── styles/
```

### Função

Responsável pela página pública de apresentação do NOSTER.

### Observação

A pasta `data/` faz sentido aqui, porque a landing usa conteúdo estático real, como slides e textos institucionais.

Não há necessidade de repository enquanto esse conteúdo não vier do backend.

---

## `meetings/`

```txt
features/meetings/
├── components/
├── hooks/
├── mocks/
├── repositories/
├── screens/
├── styles/
└── types/
```

### Função

Responsável pela área de reuniões.

Inclui:

- listagem de reuniões;
- kanban;
- cards;
- detalhes de reunião;
- status;
- criação de reunião.

### Preparado para backend

A feature já possui `hooks` e `repositories`, então pode trocar mock por API sem alterar a interface principal.

---

## `decision-management/`

```txt
features/decision-management/
├── components/
├── hooks/
├── mocks/
├── repositories/
├── screens/
├── styles/
└── types/
```

### Função

Responsável pela gestão de decisões e pelos principais insights estratégicos do produto.

Inclui:

- overview;
- decisões;
- personas;
- métricas;
- gráficos;
- histórico estratégico;
- fluxo de impacto;
- navegação interna da gestão de decisão.

### Observação

Essa é a feature mais importante e mais densa do produto. A divisão interna por `overview`, `decisions`, `personas` e `shared` está correta.

---

## `multi-agents/`

```txt
features/multi-agents/
├── components/
├── hooks/
├── mocks/
├── repositories/
├── screens/
├── styles/
└── types/
```

### Função

Responsável pela experiência de conversa com múltiplas perspectivas de IA.

Inclui:

- chat;
- mensagens;
- sugestões de agentes;
- navegação de análise;
- composer.

### Preparado para backend

A feature já está pronta para trocar mock de conversa por integração futura com serviço de IA/backend.

---

## `persuasion/`

```txt
features/persuasion/
├── components/
├── hooks/
├── mocks/
├── repositories/
├── screens/
├── styles/
└── types/
```

### Função

Responsável pela análise de persuasão.

Inclui:

- dashboard de persuasão;
- sidebar analítica;
- perfil persuasivo;
- dados de interpretação.

---

## `settings/`

```txt
features/settings/
├── components/
├── hooks/
├── repositories/
├── screens/
└── types/
```

### Função

Responsável por configurações da conta e preferências do usuário.

Inclui:

- perfil;
- conta;
- preferências.

### Observação

Pode receber `styles/` futuramente se crescer visualmente.

---

# `shared/`

A pasta `shared/` contém recursos reutilizáveis por todo o projeto.

```txt
shared/
├── components/
├── constants/
├── lib/
├── styles/
└── types/
```

---

## `shared/components/`

Componentes globais reutilizáveis.

```txt
shared/components/
├── feedback/
└── ui/
```

### `feedback/`

```txt
feedback/
├── EmptyState.tsx
└── LoadingState.tsx
```

Usado para estados de tela.

### `ui/`

```txt
ui/
├── Avatar.tsx
├── Button.tsx
├── Card.tsx
├── Input.tsx
└── Modal.tsx
```

Componentes base da interface.

---

## `shared/constants/`

```txt
shared/constants/
└── routes.ts
```

Responsável por constantes globais, como rotas da aplicação.

---

## `shared/lib/`

```txt
shared/lib/
├── formatters.ts
└── utils.ts
```

Responsável por funções utilitárias reutilizáveis.

Exemplos:

- formatar moeda;
- formatar data;
- normalizar texto;
- combinar classes;
- helpers genéricos.

---

## `shared/styles/`

```txt
shared/styles/
└── tokens.css
```

Responsável por tokens visuais globais.

Exemplos:

- cores;
- espaçamentos;
- radius;
- sombras;
- tipografia;
- variáveis CSS.

---

## `shared/types/`

```txt
shared/types/
└── user.ts
```

Responsável por tipos globais reutilizados em várias features.

---

# Regras arquiteturais do projeto

## 1. `app/` não deve conter regra de negócio

`app/` deve apenas rotear e montar telas.

Correto:

```tsx
export default function Page() {
  return <DecisionManagementScreen />;
}
```

Evitar:

```tsx
export default function Page() {
  const data = [...]
  const filtered = data.filter(...)
  return <ComplexUI data={filtered} />;
}
```

---

## 2. Componentes não devem importar mocks

Correto:

```tsx
<MeetingCard meeting={meeting} />
```

Evitar:

```tsx
import { meetings } from '../mocks/meetings.mock';
```

---

## 3. Screens usam hooks

Correto:

```tsx
const { meetings, isLoading, error } = useMeetings();
```

Evitar:

```tsx
const meetings = getMeetingsMockDirectly();
```

---

## 4. Hooks usam repositories

Correto:

```ts
const data = await getMeetings();
```

Evitar hook importando vários mocks diretamente.

---

## 5. Repositories são a única camada que conhece a origem dos dados

Hoje:

```txt
Repository -> Mock
```

Futuro:

```txt
Repository -> API
```

A tela não deve ser alterada quando essa troca acontecer.

---

## 6. Types devem ser usados em props, hooks e repositories

Evitar `any`.

Correto:

```ts
type MeetingCardProps = {
  meeting: Meeting;
};
```

---

## 7. Estados de tela devem ser tratados

Toda tela que depende de dados deve prever:

```txt
loading
error
empty
success
```

Exemplo:

```tsx
if (isLoading) return <LoadingState />;
if (error) return <EmptyState title="Erro ao carregar dados." />;
if (!meetings.length) return <EmptyState title="Nenhuma reunião encontrada." />;
```

---

# Preparação para backend

Mesmo sem saber quais APIs existirão, o front já está preparado porque:

- os componentes não precisam conhecer backend;
- as telas não precisam conhecer mocks;
- os hooks isolam estado e carregamento;
- os repositories isolam a origem dos dados;
- os types definem contratos internos.

Quando o backend começar, a evolução natural será:

```txt
Mock
↓
Repository usando fetch/axios
↓
Repository usando api-client global
↓
Validação com schemas, se necessário
↓
Mappers, se o formato da API for diferente do formato do front
```

---

# Checklist final

Antes de começar o backend, validar:

```txt
[ ] Nenhum component importa mock diretamente
[ ] Nenhuma screen importa mock diretamente
[ ] Mocks são usados apenas por repositories
[ ] Screens usam hooks
[ ] Hooks retornam loading, error e data
[ ] Repositories retornam dados tipados
[ ] Props dos componentes estão tipadas
[ ] EmptyState e LoadingState estão sendo usados nas telas com dados
[ ] app/page.tsx apenas renderiza screens
[ ] README documenta o padrão page → screen → hook → repository → mock/API
```

---

# Conclusão

A arquitetura atual do frontend do NOSTER está pronta para continuar evoluindo visualmente e também está preparada para receber backend no futuro.

O ponto mais importante é que o projeto não está acoplado diretamente aos mocks. A presença de `hooks` e `repositories` cria uma camada de proteção entre a interface e a origem dos dados.

Isso permite que o time desenvolva o produto agora com dados simulados e, quando o backend existir, substitua a origem dos dados sem reescrever a estrutura visual.

A arquitetura final pode ser resumida assim:

```txt
Rotas finas.
Features por domínio.
Screens para telas.
Components para UI.
Hooks para estado.
Repositories para dados.
Mocks como fonte temporária.
Types como contrato interno.
Shared para reutilização global.
```
