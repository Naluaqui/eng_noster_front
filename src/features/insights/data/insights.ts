import type { Insight, InsightMetric } from '../types/insight';

export const insightMetrics: InsightMetric[] = [
  { label: 'Riscos mapeados', value: 18 },
  { label: 'Oportunidades', value: 9 },
  { label: 'Decisões pendentes', value: 4 },
];

export const insights: Insight[] = [
  {
    id: 'cliente-objeções',
    title: 'Objeções recorrentes',
    description: 'Clientes questionam prazo e impacto financeiro antes de avançar.',
    persona: 'Cliente',
  },
  {
    id: 'financeiro-viabilidade',
    title: 'Viabilidade econômica',
    description: 'A decisão depende de clareza sobre retorno e custo de implantação.',
    persona: 'Financeiro',
  },
];
