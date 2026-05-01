import type { CSSProperties } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '@/shared/lib/formatters';

type PerformanceMonth = {
  month: string;
  periodLabel: string;
  potential: number;
  converted: number;
  selected?: boolean;
};

type ChartTick = {
  value: number;
  label: string;
};

const performanceMonths: PerformanceMonth[] = [
  { month: 'Mai', periodLabel: 'Maio 2026', potential: 88000, converted: 43000 },
  { month: 'Jun', periodLabel: 'Junho 2026', potential: 36000, converted: 27000 },
  { month: 'Jul', periodLabel: 'Julho 2026', potential: 29000, converted: 22000 },
  { month: 'Ago', periodLabel: 'Agosto 2026', potential: 72000, converted: 58000, selected: true },
  { month: 'Set', periodLabel: 'Setembro 2026', potential: 46000, converted: 18000 },
  { month: 'Out', periodLabel: 'Outubro 2026', potential: 62000, converted: 34000 },
  { month: 'Nov', periodLabel: 'Novembro 2026', potential: 86000, converted: 48000 },
  { month: 'Dez', periodLabel: 'Dezembro 2026', potential: 54000, converted: 21000 },
];

const decisionOverview = {
  actionableRate: 57.3,
  actionableDecisions: 73,
  blockedDecisions: 18,
  actionableTrend: '+12%',
  blockedTrend: 'atenção',
};

function getNiceChartMax(value: number) {
  if (value <= 0) {
    return 100;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalizedValue = value / magnitude;

  if (normalizedValue <= 2) {
    return 2 * magnitude;
  }

  if (normalizedValue <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getChartTicks(maxValue: number, tickCount = 5): ChartTick[] {
  return Array.from({ length: tickCount }, (_, index) => {
    const value = maxValue - (maxValue / (tickCount - 1)) * index;

    return {
      value,
      label: formatCompactCurrency(value).replace('R$ ', ''),
    };
  });
}

function getPercent(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min((value / maxValue) * 100, 100);
}

function getDecisionTotal() {
  return decisionOverview.actionableDecisions + decisionOverview.blockedDecisions;
}

function getDecisionShare(value: number) {
  const total = getDecisionTotal();

  if (total <= 0) {
    return 0;
  }

  return (value / total) * 100;
}

export function DecisionPerformanceOverview() {
  const maxPotential = Math.max(...performanceMonths.map((item) => item.potential));
  const chartMax = getNiceChartMax(maxPotential);
  const chartTicks = getChartTicks(chartMax);

  return (
    <section
      className="decision-performance-overview"
      aria-label="Performance da gestão de decisão"
    >
      <article className="decision-performance-card">
        <header>
          <h2>Evolução da Receita Decisória</h2>

          <button type="button">
            Este mês
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <div
          className="decision-performance-chart"
          aria-label="Comparativo mensal entre receita potencial e receita convertida"
        >
          <div className="decision-performance-axis" aria-hidden="true">
            {chartTicks.map((tick) => (
              <span key={tick.value}>{tick.label}</span>
            ))}
          </div>

          <div className="decision-performance-plot">
            {chartTicks.map((tick) => (
              <span
                className="decision-performance-grid-line"
                key={tick.value}
                style={
                  { '--position': `${100 - getPercent(tick.value, chartMax)}%` } as CSSProperties
                }
              />
            ))}

            <div className="decision-performance-bars">
              {performanceMonths.map((item) => {
                const potentialHeight = getPercent(item.potential, chartMax);
                const convertedHeight = getPercent(item.converted, chartMax);
                const gap = item.potential - item.converted;

                return (
                  <figure
                    className={item.selected ? 'is-selected' : undefined}
                    key={item.month}
                    tabIndex={0}
                  >
                    <div>
                      <i
                        aria-label={`Receita potencial em ${item.periodLabel}: ${formatCurrency(item.potential)}`}
                        style={{ '--height': `${potentialHeight}%` } as CSSProperties}
                      />

                      <i
                        aria-label={`Receita convertida em ${item.periodLabel}: ${formatCurrency(item.converted)}`}
                        style={{ '--height': `${convertedHeight}%` } as CSSProperties}
                      />
                    </div>

                    <figcaption>{item.month}</figcaption>

                    <aside
                      className="decision-performance-tooltip"
                      aria-label={`Resumo de ${item.periodLabel}`}
                    >
                      <strong>{item.periodLabel}</strong>

                      <span>
                        Potencial identificado <b>{formatCompactCurrency(item.potential)}</b>
                      </span>

                      <span>
                        Receita convertida <b>{formatCompactCurrency(item.converted)}</b>
                      </span>

                      <span>
                        Gap não capturado <b>{formatCompactCurrency(gap)}</b>
                      </span>
                    </aside>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </article>

      <article className="decision-growth-card">
        <header>
          <h2>Índice de Decisão Acionável</h2>

          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={17} aria-hidden="true" />
          </button>
        </header>

        <div
          className="decision-index-chart"
          aria-label={`${decisionOverview.actionableRate.toFixed(1)} por cento de decisões acionáveis`}
        >
          <div className="decision-index-ring" tabIndex={0}>
            <svg viewBox="0 0 160 160" role="img" aria-hidden="true">
              <circle className="decision-index-ring-track" cx="80" cy="80" r="58" />

              <circle
                className="decision-index-ring-value"
                cx="80"
                cy="80"
                r="58"
                pathLength="100"
                strokeDasharray={`${decisionOverview.actionableRate} 100`}
              />
            </svg>

            <div>
              <strong>{decisionOverview.actionableRate.toFixed(1)}%</strong>
              <span>acionável</span>
            </div>

            <aside className="decision-index-tooltip">
              <strong>Índice acionável</strong>
              <span>Decisões com próximo passo claro e responsáveis definidos.</span>
            </aside>
          </div>

          <p>
            Decisões com próximo passo claro, responsáveis definidos e menor risco de bloqueio
            operacional.
          </p>
        </div>

        <div className="decision-index-breakdown">
          <div>
            <header>
              <span>Decisões acionáveis</span>
              <strong>{decisionOverview.actionableDecisions}</strong>
            </header>

            <div className="decision-index-progress">
              <i
                style={
                  {
                    '--width': `${getDecisionShare(decisionOverview.actionableDecisions)}%`,
                  } as CSSProperties
                }
              />
            </div>

            <em>{decisionOverview.actionableTrend}</em>
          </div>

          <div>
            <header>
              <span>Bloqueios críticos</span>
              <strong>{decisionOverview.blockedDecisions}</strong>
            </header>

            <div className="decision-index-progress is-critical">
              <i
                style={
                  {
                    '--width': `${getDecisionShare(decisionOverview.blockedDecisions)}%`,
                  } as CSSProperties
                }
              />
            </div>

            <em>{decisionOverview.blockedTrend}</em>
          </div>
        </div>
      </article>
    </section>
  );
}
