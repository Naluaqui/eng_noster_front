import type { Meeting } from '../types/meeting';

export const meetings: Meeting[] = [
  {
    id: 'kickoff-noster',
    title: 'Kickoff Noster',
    date: '2026-04-28',
    participants: ['Produto', 'Comercial', 'Financeiro'],
    status: 'scheduled',
  },
  {
    id: 'priorizacao-roadmap',
    title: 'Priorização de roadmap',
    date: '2026-05-02',
    participants: ['Produto', 'Cliente', 'Marketing'],
    status: 'in-review',
  },
  {
    id: 'go-no-go',
    title: 'Go / no-go comercial',
    date: '2026-05-08',
    participants: ['Vendas', 'Diretoria', 'Operações'],
    status: 'decided',
  },
];
