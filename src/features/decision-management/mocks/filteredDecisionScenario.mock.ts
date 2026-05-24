import type { Meeting } from '@/features/meetings/types/meeting';
import type {
  DecisionFilters,
  DecisionMockScenario,
  DecisionOverviewData,
  DecisionOfferingOption,
  DecisionWavePoint,
} from '../types/decision-management';

export const defaultDecisionFilters: DecisionFilters = {
  startDate: '',
  endDate: '',
  offering: '',
};

function hashValue(value: string) {
  let result = 0;

  for (const character of value) {
    result = (result * 31 + character.charCodeAt(0)) % 997;
  }

  return result;
}

function parseDate(value: string, fallback: string) {
  const parsed = new Date(`${value || fallback}T12:00:00`);

  return Number.isNaN(parsed.valueOf()) ? new Date(`${fallback}T12:00:00`) : parsed;
}

function getPeriod(filters: DecisionFilters) {
  const first = parseDate(filters.startDate, '2026-05-01');
  const second = parseDate(filters.endDate, '2026-12-31');
  const start = first <= second ? first : second;
  const end = first <= second ? second : first;

  return { start, end };
}

export function hasActiveDecisionFilters(filters: DecisionFilters) {
  return Boolean(filters.startDate || filters.endDate || filters.offering);
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatPeriodDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function intervalDates(filters: DecisionFilters, count: number) {
  const { start, end } = getPeriod(filters);
  const range = Math.max(0, end.valueOf() - start.valueOf());

  return Array.from({ length: count }, (_item, index) => {
    const ratio = count <= 1 ? 0 : index / (count - 1);

    return new Date(start.valueOf() + range * ratio);
  });
}

function pointLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(date)
    .replace('.', '')
    .toUpperCase();
}

function getSelection(filters: DecisionFilters, options: DecisionOfferingOption[]) {
  return (
    options.find((option) => option.value === filters.offering) ?? {
      value: '',
      label: 'Portfólio completo TOTVS',
      category: 'Produtos e Serviços, linhas e segmentos',
    }
  );
}

function createMeetings(
  seed: number,
  filters: DecisionFilters,
  selection: DecisionOfferingOption,
): Meeting[] {
  const dates = intervalDates(filters, 3);
  const owners = ['Comercial Enterprise', 'Diretoria de Soluções', 'Customer Success'];
  const titles = ['Mapeamento de valor', 'Validação executiva', 'Plano de avanço'];

  return titles.map((title, index) => ({
    id: `decision-mock-${seed}-${index}`,
    title: `${title}: ${selection.label}`,
    date: formatDate(dates[index]),
    time: index === 0 ? '09:30' : index === 1 ? '14:00' : '16:30',
    participants: [selection.category, 'Cliente', owners[index]],
    status: 'analyzed',
    summary: `Cenário de decisão para ${selection.label} no período selecionado.`,
    owner: owners[index],
    tags: [selection.category, selection.label],
    signalCount: 3 + ((seed + index * 2) % 8),
    product: selection.label,
    description: `Reunião simulada sobre ${selection.label}.`,
  }));
}

function createWaves(
  seed: number,
  filters: DecisionFilters,
  selection: DecisionOfferingOption,
): DecisionWavePoint[] {
  return intervalDates(filters, 6).map((date, index) => {
    const movement = (seed + index * 13) % 26;
    const priorityIntensity = Math.min(96, 48 + movement + index * 4);
    const pressureIntensity = Math.min(92, 38 + ((seed + index * 17) % 34));

    return {
      label: pointLabel(date),
      priorityIntensity,
      pressureIntensity,
      focusArea: index >= 4 ? `Converter valor de ${selection.label}` : `Validar ${selection.category}`,
      biggestPain:
        index % 2 === 0
          ? 'Retorno esperado ainda precisa ser quantificado.'
          : 'Aprovação interna depende de evidências mais objetivas.',
      recommendedAction: `Relacionar ${selection.label} a um indicador mensurável do cliente.`,
      topProduct: selection.label,
      weakProduct: index % 2 === 0 ? 'Oferta genérica sem linha definida' : 'Serviço sem prova de impacto',
      marketReading: `${selection.label} ganha força quando objetivo e público ficam explícitos.`,
    };
  });
}

function formatCompactAmount(value: number) {
  return `R$ ${(value / 1000).toFixed(1).replace('.', ',')} mil`;
}

function createOverview(
  seed: number,
  filters: DecisionFilters,
  selection: DecisionOfferingOption,
): DecisionOverviewData {
  const dates = intervalDates(filters, 8);
  const performanceMonths = dates.map((date, index) => {
    const potential = 28000 + ((seed + index * 7919) % 67000);
    const converted = Math.round(potential * (0.38 + ((seed + index * 7) % 40) / 100));

    return {
      month: pointLabel(date),
      periodLabel: new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(date),
      potential,
      converted,
      selected: index === dates.length - 2,
    };
  });
  const adherence = 54 + (seed % 38);
  const health = 45 + ((seed * 3) % 42);
  const bottleneck = 10 + ((seed * 5) % 39);
  const revenueRisk = 3800 + seed * 31;
  const actionableDecisions = 32 + (seed % 67);
  const blockedDecisions = 7 + (seed % 26);
  const actionableRate = Number(
    ((actionableDecisions / (actionableDecisions + blockedDecisions)) * 100).toFixed(1),
  );
  const roiTrend = dates.map((date, index) => ({
    label: pointLabel(date),
    value: Number((1.4 + ((seed + index * 19) % 30) / 10).toFixed(1)),
  }));
  const clarityTrend = dates.slice(0, 5).map((date, index) => ({
    label: pointLabel(date),
    value: 44 + ((seed + index * 11) % 45),
  }));
  const positiveValue = 8500 + (seed % 11000);
  const riskValue = 3800 + (seed % 7200);
  const impactHistory = dates.slice(0, 6).map((date, index) => ({
    label: pointLabel(date),
    value: 5200 + ((seed + index * 4789) % 22000),
  }));
  const period = `${formatPeriodDate(getPeriod(filters).start)} a ${formatPeriodDate(getPeriod(filters).end)}`;

  return {
    metrics: [
      {
        label: 'Aderência Oferta x Cliente',
        value: `${adherence}%`,
        trend: `+${4 + (seed % 13)}%`,
        previous: `Período anterior: ${Math.max(adherence - 7, 0)}%`,
        featured: true,
      },
      {
        label: 'Saúde Comercial',
        value: `${health}%`,
        trend: seed % 2 === 0 ? `+${3 + (seed % 9)}%` : `-${3 + (seed % 9)}%`,
        previous: `Período anterior: ${Math.max(health - 4, 0)}%`,
      },
      {
        label: 'Gargalo Estratégico',
        value: `${bottleneck}%`,
        trend: `+${2 + (seed % 11)}%`,
        previous: `Período anterior: ${Math.max(bottleneck - 5, 0)}%`,
      },
      {
        label: 'Receita em risco',
        value: formatCompactAmount(revenueRisk),
        trend: seed % 2 === 0 ? 'atenção' : 'crítico',
        previous: `Período anterior: ${formatCompactAmount(Math.round(revenueRisk * 0.54))}`,
      },
    ],
    performance: {
      months: performanceMonths,
      overview: {
        actionableRate,
        actionableDecisions,
        blockedDecisions,
        actionableTrend: `+${5 + (seed % 14)}%`,
        blockedTrend: seed % 2 === 0 ? 'controlado' : 'atenção',
      },
    },
    health: {
      roiTrend,
      clarityTrend,
      expansionItems: [
        {
          label: `Expansão em ${selection.label}`,
          value: 48 + (seed % 46),
          amountLabel: formatCompactAmount(positiveValue),
          amountValue: positiveValue / 1000,
        },
        {
          label: `Serviços aderentes a ${selection.category}`,
          value: 35 + ((seed * 2) % 53),
          amountLabel: formatCompactAmount(positiveValue * 0.67),
          amountValue: (positiveValue * 0.67) / 1000,
        },
      ],
      competitiveAlert: `${2 + (seed % 14)} contas ligadas a ${selection.label} apresentam comparação ativa ou risco de atraso no período ${period}.`,
    },
    financial: {
      strategicSignals: [
        {
          label: `Valor de ${selection.label} reconhecido`,
          date: period,
          amount: positiveValue,
          type: 'positive',
        },
        {
          label: `Objeção em ${selection.category}`,
          date: period,
          amount: -riskValue,
          type: 'risk',
        },
        {
          label: 'Decisor técnico identificado',
          date: period,
          amount: Math.round(positiveValue * 0.58),
          type: 'positive',
        },
        {
          label: 'Prazo de validação em atenção',
          date: period,
          amount: -Math.round(riskValue * 0.54),
          type: 'warning',
        },
      ],
      impactHistory,
    },
    persona: {
      location: seed % 2 === 0 ? 'São Paulo' : 'Belo Horizonte',
      age: `${30 + (seed % 18)} anos`,
      name: seed % 2 === 0 ? 'Camila Andrade' : 'Leonardo Martins',
      role: `Liderança de ${selection.category}`,
      quote: `Só avanço com ${selection.label} quando o resultado aparece de forma objetiva para minha operação.`,
      problems: [
        `Precisa justificar investimento em ${selection.label} para outros decisores.`,
        `Ainda compara alternativas para ${selection.category} antes de aprovar.`,
      ],
      goals: [
        `Validar impacto mensurável de ${selection.label}.`,
        `Reduzir risco da decisão no período ${period}.`,
      ],
      motivations: [
        'Obter previsibilidade antes de comprometer orçamento.',
        `Conectar ${selection.category} a metas da empresa.`,
        'Tomar a decisão com evidências compartilháveis.',
      ],
      engagementSignals: [
        `Solicita comprovação de valor para ${selection.label}.`,
        'Inclui liderança técnica no próximo encontro.',
        'Responde melhor a próximos passos com prazo definido.',
      ],
    },
  };
}

export function createFilteredDecisionScenario(
  filters: DecisionFilters,
  offeringOptions: DecisionOfferingOption[],
): DecisionMockScenario {
  const selection = getSelection(filters, offeringOptions);
  const { start, end } = getPeriod(filters);
  const signature = `${selection.value}|${formatDate(start)}|${formatDate(end)}`;
  const seed = hashValue(signature);
  const meetings = createMeetings(seed, filters, selection);
  const decisionPriorityWaves = createWaves(seed, filters, selection);
  const decisionImpactFlows = Object.fromEntries(
    meetings.map((meeting, index) => [
      meeting.id,
      {
        zone: `${selection.category} / cenário ${index + 1}`,
        source: {
          title: meeting.title,
          description: `Sinais observados entre ${formatPeriodDate(start)} e ${formatPeriodDate(end)}.`,
        },
        centralDecision: {
          title: `Decisão sobre ${selection.label}`,
          description: 'A IA conecta necessidade, público e objetivo esperado antes do avanço.',
        },
        decisions: [
          {
            title: 'Priorizar validação de valor',
            description: `Demonstrar como ${selection.label} atende ao objetivo cadastrado.`,
          },
          {
            title: 'Definir próximo compromisso',
            description: 'Formalizar responsável, prazo e critério de sucesso.',
          },
        ],
        impacts: [
          {
            title: 'Previsibilidade comercial',
            description: 'A decisão passa a ter sinal mensurável de avanço.',
          },
          {
            title: 'Aderência da oferta',
            description: `O cliente associa ${selection.category} ao problema real.`,
          },
        ],
        actions: [
          `Apresentar ${selection.label}`,
          'Quantificar impacto esperado',
          'Agendar checkpoint executivo',
        ],
      },
    ]),
  );
  const insightVariant =
    seed % 2 === 0
      ? 'ganha força quando o retorno esperado é ligado a uma métrica clara'
      : 'precisa tornar o benefício concreto para sustentar o próximo avanço';

  return {
    insight: `De ${formatPeriodDate(start)} a ${formatPeriodDate(end)}, ${selection.label} (${selection.category}) ${insightVariant}.`,
    meetings,
    decisionImpactFlows,
    decisionPriorityWaves,
    overview: createOverview(seed, filters, selection),
  };
}
