import type { DecisionMessage } from '../types/decision';

export const decisionMessages: DecisionMessage[] = [
  {
    id: '1',
    role: 'assistant',
    persona: 'Estrategista',
    content: 'Mapeei riscos, intenção comercial e próximos passos para a decisão.',
  },
  {
    id: '2',
    role: 'user',
    content: 'Quais objeções apareceram na reunião?',
  },
];
