import type { AgentAnalysis, MultiAgentMessage } from '../types/multiAgent';

export const agentAnalyses: AgentAnalysis[] = [
  {
    id: 'analise-go-no-go',
    title: 'Go / no-go comercial',
    description: 'Risco, viabilidade financeira e narrativa de valor.',
    status: 'active',
    agentCount: 6,
  },
  {
    id: 'objecoes-cliente',
    title: 'Objeções do cliente',
    description: 'Dores, tensões emocionais e próximos argumentos.',
    status: 'draft',
    agentCount: 4,
  },
  {
    id: 'priorizacao-roadmap',
    title: 'Priorização de roadmap',
    description: 'Impacto, esforço e alinhamento estratégico.',
    status: 'archived',
    agentCount: 5,
  },
];

export const multiAgentMessages: MultiAgentMessage[] = [
  {
    id: 'welcome',
    role: 'agent',
    agent: 'Estrategista',
    content:
      'Bom dia, Ana. Posso analisar a conversa por múltiplas perspectivas e sugerir uma direção de decisão.',
  },
  {
    id: 'prompt',
    role: 'user',
    content: 'Compare as objeções do cliente com o risco financeiro do projeto.',
  },
  {
    id: 'analysis',
    role: 'agent',
    agent: 'Financeiro + Cliente',
    content:
      'A objeção principal parece estar menos no preço e mais na confiança de retorno. Eu trataria a próxima resposta como prova de valor, não como desconto.',
  },
];
