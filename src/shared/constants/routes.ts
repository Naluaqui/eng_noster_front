export const publicRoutes = {
  landing: '/landing',
} as const;

export const authenticatedRoutes = {
  home: '/app',
  meetings: '/app/reunioes',
  multiAgents: '/app/multi-agentes',
  decisions: '/app/decisoes',
  insights: '/app/persuasao',
  personas: '/app/persuasao/personas',
  settings: '/app/configuracoes',
} as const;

export const sidebarRoutes = [
  { href: authenticatedRoutes.meetings, label: 'Reuniões' },
  { href: authenticatedRoutes.multiAgents, label: 'Multi-agentes' },
  { href: authenticatedRoutes.decisions, label: 'Gestão de decisões' },
  { href: authenticatedRoutes.insights, label: 'Persuasão' },
  { href: authenticatedRoutes.settings, label: 'Configurações' },
] as const;
