'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { meetings } from '@/features/meetings/data/meetings';
import { decisionImpactFlows } from '../../data/decisionImpactFlows';
import { DecisionImpactFlow } from './DecisionImpactFlow';
import { DecisionMeetingsTable } from './DecisionMeetingsTable';

type DecisionPoint = {
  label: string;
  priorityIntensity: number;
  pressureIntensity: number;
  focusArea: string;
  biggestPain: string;
  recommendedAction: string;
  topProduct: string;
  weakProduct: string;
  marketReading: string;
};

type ChartPoint = DecisionPoint & {
  x: number;
  y: number;
};

type DecisionSeriesKey = 'priority' | 'pressure';

const decisionPoints: DecisionPoint[] = [
  {
    label: 'Jan',
    priorityIntensity: 34,
    pressureIntensity: 28,
    focusArea: 'Retenção de contas estratégicas',
    biggestPain: 'Clientes relevantes sem próximo passo executivo claro.',
    recommendedAction: 'Concentrar energia nas contas de maior recorrência.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Chat Assistido',
    marketReading: 'Mercado valoriza clareza estratégica, não só respostas rápidas.',
  },
  {
    label: 'Fev',
    priorityIntensity: 42,
    pressureIntensity: 34,
    focusArea: 'Clareza de valor para liderança',
    biggestPain: 'Percepção de valor ainda superficial em reuniões de fechamento.',
    recommendedAction: 'Traduzir uso da plataforma em impacto de negócio.',
    topProduct: 'Insights Executivos',
    weakProduct: 'Chat Assistido',
    marketReading: 'O produto sobe quando fala de impacto, cai quando parece genérico.',
  },
  {
    label: 'Mar',
    priorityIntensity: 56,
    pressureIntensity: 40,
    focusArea: 'Destravamento de decisões paradas',
    biggestPain: 'Muitas pautas abertas, poucos donos definidos.',
    recommendedAction: 'Separar urgência operacional de prioridade real.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Resumo de Reuniões',
    marketReading: 'Clientes querem menos registro e mais direcionamento.',
  },
  {
    label: 'Abr',
    priorityIntensity: 69,
    pressureIntensity: 47,
    focusArea: 'Prova de ROI comercial',
    biggestPain: 'Objeção de retorno ainda aparece cedo demais.',
    recommendedAction: 'Mostrar evidência de ganhos já no começo da conversa.',
    topProduct: 'Insights Executivos',
    weakProduct: 'Chat Assistido',
    marketReading: 'Produto forte quando amarrado a valor e priorização.',
  },
  {
    label: 'Mai',
    priorityIntensity: 82,
    pressureIntensity: 54,
    focusArea: 'Expansão em contas com alta adesão',
    biggestPain: 'Upsell identificado sem narrativa forte de expansão.',
    recommendedAction: 'Atacar contas com dor validada e espaço para crescimento.',
    topProduct: 'Insights Executivos',
    weakProduct: 'Módulo de Personas',
    marketReading: 'Insights ganham espaço quando conectados a expansão.',
  },
  {
    label: 'Jun',
    priorityIntensity: 90,
    pressureIntensity: 62,
    focusArea: 'Defesa contra concorrência ativa',
    biggestPain: 'Contas estratégicas começaram a comparar alternativas.',
    recommendedAction: 'Entrar com posicionamento executivo antes da discussão virar preço.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Chat Assistido',
    marketReading: 'Ferramenta de decisão sobe; chat puro perde força.',
  },
  {
    label: 'Jul',
    priorityIntensity: 61,
    pressureIntensity: 68,
    focusArea: 'Reorganização de prioridades internas',
    biggestPain: 'Time disperso em várias frentes de baixo impacto.',
    recommendedAction: 'Reduzir dispersão e concentrar no gargalo principal.',
    topProduct: 'Analytics Comercial',
    weakProduct: 'Gestão de Decisões',
    marketReading: 'Quando o cenário aperta, clareza operacional ganha espaço.',
  },
  {
    label: 'Ago',
    priorityIntensity: 58,
    pressureIntensity: 74,
    focusArea: 'Reposicionamento da mensagem comercial',
    biggestPain: 'O discurso atual não evidencia a dor mais urgente do cliente.',
    recommendedAction: 'Mudar a narrativa de funcionalidade para dor executiva.',
    topProduct: 'Insights Executivos',
    weakProduct: 'Módulo de Reuniões',
    marketReading: 'Produtos analíticos seguram melhor a pressão de mercado.',
  },
  {
    label: 'Set',
    priorityIntensity: 66,
    pressureIntensity: 79,
    focusArea: 'Recuperação de contas em risco',
    biggestPain: 'Conta de alto potencial começou a esfriar por perda de urgência.',
    recommendedAction: 'Reativar interesse com visão clara de impacto e timing.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Chat Assistido',
    marketReading: 'Mercado pressiona tudo que parece commodity.',
  },
  {
    label: 'Out',
    priorityIntensity: 79,
    pressureIntensity: 72,
    focusArea: 'Fechamento de oportunidades críticas',
    biggestPain: 'Decisores ainda sem alinhamento final sobre prioridade.',
    recommendedAction: 'Amarrar dono, prazo e impacto em cada oportunidade-chave.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Módulo de Personas',
    marketReading: 'Produto executivo volta a ganhar força quando a venda amadurece.',
  },
  {
    label: 'Nov',
    priorityIntensity: 92,
    pressureIntensity: 76,
    focusArea: 'Proteção de valor premium',
    biggestPain: 'Cliente quer empurrar a conversa para preço.',
    recommendedAction: 'Sustentar valor com diferenciação e risco evitado.',
    topProduct: 'Insights Executivos',
    weakProduct: 'Chat Assistido',
    marketReading: 'Mercado segue premiando inteligência acionável.',
  },
  {
    label: 'Dez',
    priorityIntensity: 98,
    pressureIntensity: 83,
    focusArea: 'Fechar o que realmente move receita',
    biggestPain: 'Volume alto de decisões, mas poucas realmente estratégicas.',
    recommendedAction: 'Priorizar as frentes com retorno mais claro e efeito imediato.',
    topProduct: 'Gestão de Decisões',
    weakProduct: 'Módulo de Reuniões',
    marketReading: 'Produto forte é o que entrega direção; o fraco é o que só registra.',
  },
];

const chartConfig = {
  width: 860,
  height: 300,
  padding: {
    top: 26,
    right: 24,
    bottom: 44,
    left: 170,
  },
};

function getSeriesValue(point: DecisionPoint, seriesKey: DecisionSeriesKey) {
  return seriesKey === 'priority' ? point.priorityIntensity : point.pressureIntensity;
}

function getX(index: number, total: number) {
  const plotWidth = chartConfig.width - chartConfig.padding.left - chartConfig.padding.right;

  if (total <= 1) {
    return chartConfig.padding.left;
  }

  return chartConfig.padding.left + (index / (total - 1)) * plotWidth;
}

function getY(value: number) {
  const plotHeight = chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom;

  return chartConfig.padding.top + (1 - value / 100) * plotHeight;
}

function getSeriesPoints(seriesKey: DecisionSeriesKey): ChartPoint[] {
  return decisionPoints.map((point, index) => ({
    ...point,
    x: getX(index, decisionPoints.length),
    y: getY(getSeriesValue(point, seriesKey)),
  }));
}

function createSmoothPath(points: ChartPoint[]) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const commands = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 1; index < points.length; index += 1) {
    const previousPrevious = points[index - 2] ?? points[index - 1];
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1] ?? current;

    const controlPointOneX = previous.x + (current.x - previousPrevious.x) / 6;
    const controlPointOneY = previous.y + (current.y - previousPrevious.y) / 6;
    const controlPointTwoX = current.x - (next.x - previous.x) / 6;
    const controlPointTwoY = current.y - (next.y - previous.y) / 6;

    commands.push(
      `C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${current.x} ${current.y}`,
    );
  }

  return commands.join(' ');
}

function createAreaPath(points: ChartPoint[]) {
  if (!points.length) {
    return '';
  }

  const linePath = createSmoothPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baseY = chartConfig.height - chartConfig.padding.bottom;

  return `${linePath} L ${lastPoint.x} ${baseY} L ${firstPoint.x} ${baseY} Z`;
}

function getTooltipPositionClass(index: number, total: number) {
  if (index <= 1) {
    return 'is-start';
  }

  if (index >= total - 2) {
    return 'is-end';
  }

  return 'is-center';
}

export function DecisionDecisionsPanel() {
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? '');

  const selectedMeeting = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedMeetingId) ?? meetings[0],
    [selectedMeetingId],
  );

  const selectedFlow = selectedMeeting ? decisionImpactFlows[selectedMeeting.id] : undefined;

  const latestPoint = decisionPoints[decisionPoints.length - 1];

  const priorityPoints = getSeriesPoints('priority');
  const pressurePoints = getSeriesPoints('pressure');

  const priorityPath = createSmoothPath(priorityPoints);
  const pressurePath = createSmoothPath(pressurePoints);

  const priorityAreaPath = createAreaPath(priorityPoints);
  const pressureAreaPath = createAreaPath(pressurePoints);

  return (
    <section className="decision-decisions-panel" aria-label="Painel de decisões">
      <article className="decision-inspiring-chart-card" aria-labelledby="decision-inspiring-chart-title">
        <header>
          <div>
            <span>Análise de decisão</span>

            <h2 id="decision-inspiring-chart-title">
              Prioridade Executiva <strong>e Produto Sob Pressão</strong>
            </h2>

            <p>
              Empresário entende onde focar primeiro, qual é a maior dor agora e quais produtos estão subindo ou apanhando do mercado.
            </p>
          </div>

          <ul className="decision-inspiring-chart-card__legend">
            <li className="is-priority">
              <i />
              <span>Prioridade Executiva</span>
              <strong>{latestPoint.focusArea}</strong>
              <small>{latestPoint.biggestPain}</small>
            </li>

            <li className="is-pressure">
              <i />
              <span>Produto Sob Pressão</span>
              <strong>Em baixa: {latestPoint.weakProduct}</strong>
              <small>Em alta: {latestPoint.topProduct}</small>
            </li>
          </ul>
        </header>

        <div className="decision-inspiring-chart-card__visual">
          <svg
            viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
            role="img"
            aria-label="Ondas de prioridade executiva e produto sob pressão"
          >
            <defs>
              <linearGradient id="priorityAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
              </linearGradient>

              <linearGradient id="pressureAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2d8cff" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2d8cff" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {[
              { label: 'Atenção crítica', value: 88 },
              { label: 'Atenção alta', value: 66 },
              { label: 'Atenção moderada', value: 44 },
            ].map((tick) => {
              const y = getY(tick.value);

              return (
                <g key={tick.label}>
                  <line
                    className="decision-wave-grid"
                    x1={chartConfig.padding.left}
                    x2={chartConfig.width - chartConfig.padding.right}
                    y1={y}
                    y2={y}
                  />

                  <text className="decision-wave-axis" x={24} y={y + 4} textAnchor="start">
                    {tick.label}
                  </text>
                </g>
              );
            })}

            <g className="decision-wave decision-wave--pressure">
              <path className="decision-wave-area" d={pressureAreaPath} />
              <path className="decision-wave-line" d={pressurePath} />
              <path className="decision-wave-hitbox" d={pressurePath} />

              {pressurePoints.map((point) => (
                <circle className="decision-wave-point" cx={point.x} cy={point.y} r="5" key={`pressure-${point.label}`} />
              ))}
            </g>

            <g className="decision-wave decision-wave--priority">
              <path className="decision-wave-area" d={priorityAreaPath} />
              <path className="decision-wave-line" d={priorityPath} />
              <path className="decision-wave-hitbox" d={priorityPath} />

              {priorityPoints.map((point) => (
                <circle className="decision-wave-point" cx={point.x} cy={point.y} r="5.5" key={`priority-${point.label}`} />
              ))}
            </g>

            {decisionPoints.map((point, index) => {
              const x = getX(index, decisionPoints.length);

              return (
                <text
                  className="decision-wave-month"
                  x={x}
                  y={chartConfig.height - 12}
                  textAnchor="middle"
                  key={`month-${point.label}`}
                >
                  {point.label}
                </text>
              );
            })}
          </svg>

          <div className="decision-wave-point-overlays">
            {decisionPoints.map((point, index) => {
              const x = getX(index, decisionPoints.length);
              const y = getY(point.priorityIntensity);
              const tooltipPositionClass = getTooltipPositionClass(index, decisionPoints.length);

              return (
                <div
                  className={`decision-wave-point-trigger ${tooltipPositionClass}`}
                  key={`priority-trigger-${point.label}`}
                  tabIndex={0}
                  role="button"
                  style={
                    {
                      '--x': `${(x / chartConfig.width) * 100}%`,
                      '--y': `${(y / chartConfig.height) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span className="decision-wave-tooltip">
                    <strong>{point.label}</strong>

                    <span>
                      <em>Onde focar</em>
                      <b>{point.focusArea}</b>
                    </span>

                    <span>
                      <em>Maior dor agora</em>
                      <b>{point.biggestPain}</b>
                    </span>

                    <span>
                      <em>Ação recomendada</em>
                      <b>{point.recommendedAction}</b>
                    </span>
                  </span>
                </div>
              );
            })}

            {decisionPoints.map((point, index) => {
              const x = getX(index, decisionPoints.length);
              const y = getY(point.pressureIntensity);
              const tooltipPositionClass = getTooltipPositionClass(index, decisionPoints.length);

              return (
                <div
                  className={`decision-wave-point-trigger decision-wave-point-trigger--pressure ${tooltipPositionClass}`}
                  key={`pressure-trigger-${point.label}`}
                  tabIndex={0}
                  role="button"
                  style={
                    {
                      '--x': `${(x / chartConfig.width) * 100}%`,
                      '--y': `${(y / chartConfig.height) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span className="decision-wave-tooltip">
                    <strong>{point.label}</strong>

                    <span>
                      <em>Produto em alta</em>
                      <b>{point.topProduct}</b>
                    </span>

                    <span>
                      <em>Produto em baixa</em>
                      <b>{point.weakProduct}</b>
                    </span>

                    <span>
                      <em>Leitura de mercado</em>
                      <b>{point.marketReading}</b>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      <DecisionMeetingsTable selectedMeetingId={selectedMeetingId} onOpenMeeting={setSelectedMeetingId} />

      {selectedMeeting && selectedFlow ? <DecisionImpactFlow flow={selectedFlow} meeting={selectedMeeting} /> : null}
    </section>
  );
}