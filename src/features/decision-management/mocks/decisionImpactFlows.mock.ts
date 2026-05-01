import type { DecisionImpactFlowData } from '../types/decision-management';

export const decisionImpactFlows: Record<string, DecisionImpactFlowData> = {
  'kickoff-noster': {
    zone: 'Enterprise decision bus',
    source: {
      title: 'Conversa de kickoff',
      description: 'Escopo, rituais e expectativas entram como sinais de decisão.',
    },
    centralDecision: {
      title: 'Definir IA como participante ativo',
      description: 'NOSTER passa a organizar a reunião e sustentar o raciocínio estratégico.',
    },
    decisions: [
      {
        title: 'Priorizar multi-perspectiva',
        description: 'Cliente, vendedor, financeiro e estratégia entram no mesmo ciclo analítico.',
      },
      {
        title: 'Mapear rituais críticos',
        description: 'Reuniões com maior impacto viram pontos de acompanhamento contínuo.',
      },
      {
        title: 'Criar fechamento guiado',
        description: 'A IA transforma intenção em próximos passos explícitos.',
      },
    ],
    impacts: [
      {
        title: 'Impacto no produto',
        description: 'Escopo fica claro e reduz retrabalho de descoberta.',
      },
      {
        title: 'Impacto comercial',
        description: 'Diminui ruído entre valor percebido e ação de compra.',
      },
      {
        title: 'Impacto operacional',
        description: 'Reuniões deixam trilha acionável para o time executar.',
      },
    ],
    actions: [
      'Desenhar o fluxo de análise',
      'Definir personas ativas',
      'Validar formato com reuniões reais',
    ],
  },
  'priorizacao-roadmap': {
    zone: 'Roadmap impact map',
    source: {
      title: 'Sinais de prioridade',
      description: 'Impacto, esforço e percepção de valor são comparados na mesma leitura.',
    },
    centralDecision: {
      title: 'Ordenar entregas por valor estratégico',
      description:
        'A decisão deixa de ser só volume de pedidos e passa a considerar risco e retorno.',
    },
    decisions: [
      {
        title: 'Separar desejo de urgência',
        description: 'Demandas barulhentas não avançam sem evidência de impacto.',
      },
      {
        title: 'Agrupar dores por tema',
        description: 'Pedidos semelhantes viram hipóteses de produto mais fortes.',
      },
      {
        title: 'Cortar escopo disperso',
        description: 'O roadmap fica menor, mais legível e mais defensável.',
      },
    ],
    impacts: [
      {
        title: 'Impacto no cliente',
        description: 'Valor comunicado fica mais direto para quem compra.',
      },
      {
        title: 'Impacto financeiro',
        description: 'Aposta de produto ganha vínculo com retorno esperado.',
      },
      {
        title: 'Impacto no time',
        description: 'Execução reduz troca de contexto e decisões paralelas.',
      },
    ],
    actions: ['Classificar iniciativas', 'Revisar dependências', 'Publicar decisão de prioridade'],
  },
  'go-no-go': {
    zone: 'Commercial decision bus',
    source: {
      title: 'Sinais de viabilidade',
      description: 'Objeções, custos e capacidade operacional entram antes do avanço comercial.',
    },
    centralDecision: {
      title: 'Aprovar avanço condicionado',
      description: 'O go/no-go passa a depender de critérios explícitos, não de impressão geral.',
    },
    decisions: [
      {
        title: 'Exigir ROI mínimo',
        description: 'Proposta precisa justificar retorno antes da implantação.',
      },
      {
        title: 'Condicionar operação',
        description: 'Implantação só avança com responsáveis e prazos definidos.',
      },
      {
        title: 'Formalizar risco',
        description: 'Dúvidas abertas são registradas como dependências da decisão.',
      },
    ],
    impacts: [
      {
        title: 'Impacto comercial',
        description: 'Pipeline ganha qualidade e perde menos tempo em avanço frágil.',
      },
      {
        title: 'Impacto financeiro',
        description: 'Custo de implantação fica visível antes do compromisso.',
      },
      {
        title: 'Impacto executivo',
        description: 'Diretoria decide com critérios rastreáveis.',
      },
    ],
    actions: [
      'Registrar critérios',
      'Validar custo operacional',
      'Definir próximo marco de decisão',
    ],
  },
  'analise-objeções': {
    zone: 'Objection intelligence map',
    source: {
      title: 'Objeções do cliente',
      description: 'Dúvidas recorrentes são tratadas como sinal de narrativa e fechamento.',
    },
    centralDecision: {
      title: 'Reposicionar discurso de valor',
      description: 'A conversa sai da defesa de preço e entra em clareza de retorno.',
    },
    decisions: [
      {
        title: 'Antecipar preço',
        description: 'Custo deixa de aparecer apenas no momento de fechamento.',
      },
      {
        title: 'Tangibilizar retorno',
        description: 'Benefícios abstratos viram ganhos práticos e verificáveis.',
      },
      {
        title: 'Guiar CTA final',
        description: 'Reunião termina com decisão, próximo passo ou bloqueio explícito.',
      },
    ],
    impacts: [
      {
        title: 'Impacto na conversão',
        description: 'Reduz indecisão prolongada em oportunidades qualificadas.',
      },
      {
        title: 'Impacto na narrativa',
        description: 'Mensagem comercial fica mais concreta e repetível.',
      },
      {
        title: 'Impacto no ciclo',
        description: 'Tempo entre intenção e decisão tende a cair.',
      },
    ],
    actions: [
      'Reescrever pitch de ROI',
      'Criar perguntas de fechamento',
      'Marcar objeções recorrentes',
    ],
  },
};
