export const publicRoutes = {
  landing: '/landing',
} as const;

export const authenticatedRoutes = {
  home: '/app',
  meetings: '/app/reunioes',
  decisions: '/app/decisoes',
  insights: '/app/insights',
  personas: '/app/insights/personas',
  settings: '/app/configuracoes',
} as const;

export const sidebarRoutes = [
  { href: authenticatedRoutes.meetings, label: 'Reuniões' },
  { href: authenticatedRoutes.decisions, label: 'Gestão de decisões' },
  { href: authenticatedRoutes.insights, label: 'Insights' },
  { href: authenticatedRoutes.settings, label: 'Configurações' },
] as const;
