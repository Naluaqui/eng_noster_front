import type { CSSProperties } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { DecisionHealthData } from '../../types/decision-management';

type RoiPoint = {
  label: string;
  value: number;
};

type ClarityPoint = {
  label: string;
  value: number;
};

type ExpansionItem = {
  label: string;
  value: number;
  amountLabel: string;
  amountValue: number;
};

type LinearTick = {
  value: number;
  label: string;
};

const baseRoiTrend: RoiPoint[] = [
  { label: 'Mai', value: 2.1 },
  { label: 'Jun', value: 2.2 },
  { label: 'Jul', value: 2.5 },
  { label: 'Ago', value: 2.4 },
  { label: 'Set', value: 2.9 },
  { label: 'Out', value: 3.1 },
  { label: 'Nov', value: 3.6 },
  { label: 'Dez', value: 3.2 },
];

const baseClarityTrend: ClarityPoint[] = [
  { label: 'Mai', value: 78 },
  { label: 'Jun', value: 72 },
  { label: 'Jul', value: 69 },
  { label: 'Ago', value: 64 },
  { label: 'Set', value: 61 },
];

const baseExpansionItems: ExpansionItem[] = [
  { label: 'Upsell identificado', value: 72, amountLabel: 'R$ 21,4 mil', amountValue: 21.4 },
  { label: 'Cross-sell possível', value: 58, amountLabel: 'R$ 15,5 mil', amountValue: 15.5 },
];

const chart = {
  width: 260,
  height: 130,
  padding: {
    top: 18,
    right: 14,
    bottom: 24,
    left: 24,
  },
};

function getChartBounds(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min || 1) * 0.18;

  return {
    min: Math.max(0, min - padding),
    max: max + padding,
  };
}

function getX(index: number, total: number) {
  const plotWidth = chart.width - chart.padding.left - chart.padding.right;

  if (total <= 1) {
    return chart.padding.left;
  }

  return chart.padding.left + (index / (total - 1)) * plotWidth;
}

function getY(value: number, min: number, max: number) {
  const plotHeight = chart.height - chart.padding.top - chart.padding.bottom;

  if (max === min) {
    return chart.padding.top + plotHeight / 2;
  }

  return chart.padding.top + (1 - (value - min) / (max - min)) * plotHeight;
}

function createLinePath(values: number[]) {
  const bounds = getChartBounds(values);

  return values
    .map((value, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${getX(index, values.length)} ${getY(value, bounds.min, bounds.max)}`;
    })
    .join(' ');
}

function createAreaPath(values: number[]) {
  const linePath = createLinePath(values);
  const firstX = getX(0, values.length);
  const lastX = getX(values.length - 1, values.length);
  const baseY = chart.height - chart.padding.bottom;

  return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
}

function getChartTicks(values: number[], count = 4) {
  const bounds = getChartBounds(values);

  return Array.from({ length: count }, (_, index) => {
    const value = bounds.max - ((bounds.max - bounds.min) / (count - 1)) * index;

    return {
      value,
      y: getY(value, bounds.min, bounds.max),
    };
  });
}

function formatRoi(value: number) {
  return `${value.toFixed(1).replace('.', ',')}x`;
}

function getPercent(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min((value / maxValue) * 100, 100);
}

function getNiceMax(value: number) {
  if (value <= 0) {
    return 10;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;

  if (normalized <= 2.5) {
    return 2.5 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getLinearTicks(maxValue: number, tickCount = 4): LinearTick[] {
  return Array.from({ length: tickCount }, (_, index) => {
    const value = maxValue - (maxValue / (tickCount - 1)) * index;

    return {
      value,
      label: `${Number.isInteger(value) ? value : value.toFixed(1).replace('.', ',')} mil`,
    };
  });
}

export function DecisionHealthSnapshot({ data }: { data?: DecisionHealthData }) {
  const roiTrend = data?.roiTrend ?? baseRoiTrend;
  const clarityTrend = data?.clarityTrend ?? baseClarityTrend;
  const expansionItems = data?.expansionItems ?? baseExpansionItems;
  const competitiveAlert =
    data?.competitiveAlert ??
    '12 contas apresentam comparação ativa com concorrentes, alternativas de mercado ou risco de migração.';
  const roiValues = roiTrend.map((item) => item.value);
  const clarityValues = clarityTrend.map((item) => item.value);

  const roiLinePath = createLinePath(roiValues);
  const roiAreaPath = createAreaPath(roiValues);
  const roiTicks = getChartTicks(roiValues);
  const roiBounds = getChartBounds(roiValues);

  const clarityLinePath = createLinePath(clarityValues);
  const clarityAreaPath = createAreaPath(clarityValues);
  const clarityTicks = getChartTicks(clarityValues);
  const clarityBounds = getChartBounds(clarityValues);
  const currentClarity = clarityTrend[clarityTrend.length - 1];
  const clarityDelta = currentClarity.value - clarityTrend[clarityTrend.length - 2].value;

  const expansionMax = getNiceMax(Math.max(...expansionItems.map((item) => item.amountValue)));
  const expansionTicks = getLinearTicks(expansionMax);

  return (
    <section className="decision-health-snapshot" aria-label="Resumo estratégico da empresa">
      <article className="decision-health-report">
        <header>
          <h2>ROI Projetado</h2>
          <button type="button">Análise</button>
        </header>

        <div className="decision-health-report__chart">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label="Tendência de ROI projetado"
          >
            {roiTicks.map((tick) => (
              <g key={tick.value}>
                <line
                  className="decision-health-grid"
                  x1={chart.padding.left}
                  x2={chart.width - chart.padding.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  className="decision-health-axis"
                  x={chart.padding.left - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                >
                  {formatRoi(tick.value)}
                </text>
              </g>
            ))}

            <path className="decision-health-area" d={roiAreaPath} />
            <path className="decision-health-line" d={roiLinePath} />

            {roiTrend.map((item, index) => {
              const x = getX(index, roiTrend.length);
              const y = getY(item.value, roiBounds.min, roiBounds.max);

              return (
                <g className="decision-health-point-group" key={item.label}>
                  <line
                    className="decision-health-hover-line"
                    x1={x}
                    x2={x}
                    y1={chart.padding.top}
                    y2={chart.height - chart.padding.bottom}
                  />

                  <circle className="decision-health-point" cx={x} cy={y} r="3.5" />
                </g>
              );
            })}
          </svg>

          <div className="decision-health-point-overlays">
            {roiTrend.map((item, index) => {
              const x = getX(index, roiTrend.length);
              const y = getY(item.value, roiBounds.min, roiBounds.max);
              const previousValue = roiTrend[index - 1]?.value ?? item.value;
              const variation = item.value - previousValue;

              return (
                <button
                  className="decision-health-point-trigger"
                  type="button"
                  key={item.label}
                  style={
                    {
                      '--x': `${(x / chart.width) * 100}%`,
                      '--y': `${(y / chart.height) * 100}%`,
                    } as CSSProperties
                  }
                  aria-label={`ROI em ${item.label}: ${formatRoi(item.value)}`}
                >
                  <span className="decision-health-report__tooltip">
                    <strong>{formatRoi(item.value)} ROI</strong>
                    <small>{item.label}</small>
                    <em>
                      {variation >= 0 ? '+' : ''}
                      {formatRoi(variation)} mês
                    </em>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <article className="decision-doctor-card">
        <header>
          <i />
          <button type="button">Alerta estratégico</button>
        </header>

        <div>
          <span>Ameaça Concorrencial</span>
          <p>{competitiveAlert}</p>
        </div>
      </article>

      <article className="decision-trend-card">
        <header>
          <h2>Clareza de Diferencial</h2>

          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </header>

        <div className="decision-trend-card__metric">
          <strong>{currentClarity.value}%</strong>
          <em>{clarityDelta}%</em>
        </div>

        <div className="decision-trend-card__chart">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label="Tendência da clareza de diferencial"
          >
            {clarityTicks.map((tick) => (
              <line
                className="decision-trend-grid"
                x1={chart.padding.left}
                x2={chart.width - chart.padding.right}
                y1={tick.y}
                y2={tick.y}
                key={tick.value}
              />
            ))}

            <path className="decision-trend-area" d={clarityAreaPath} />
            <path className="decision-trend-line" d={clarityLinePath} />

            {clarityTrend.map((item, index) => {
              const x = getX(index, clarityTrend.length);
              const y = getY(item.value, clarityBounds.min, clarityBounds.max);

              return (
                <circle className="decision-trend-point" cx={x} cy={y} r="3.5" key={item.label} />
              );
            })}
          </svg>

          <div className="decision-trend-point-overlays">
            {clarityTrend.map((item, index) => {
              const x = getX(index, clarityTrend.length);
              const y = getY(item.value, clarityBounds.min, clarityBounds.max);
              const previousValue = clarityTrend[index - 1]?.value ?? item.value;
              const variation = item.value - previousValue;

              return (
                <button
                  className="decision-trend-point-trigger"
                  type="button"
                  key={item.label}
                  style={
                    {
                      '--x': `${(x / chart.width) * 100}%`,
                      '--y': `${(y / chart.height) * 100}%`,
                    } as CSSProperties
                  }
                  aria-label={`Clareza de diferencial em ${item.label}: ${item.value}%`}
                >
                  <span className="decision-trend-tooltip">
                    <strong>{item.value}%</strong>
                    <em>
                      {variation >= 0 ? '+' : ''}
                      {variation}% mês
                    </em>
                    <small>{item.label}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <article className="decision-checkup-card">
        <header>
          <h2>Potencial de Expansão</h2>

          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </header>

        <div className="decision-expansion-chart" aria-label="Comparativo do potencial de expansão">
          <div className="decision-expansion-axis" aria-hidden="true">
            {expansionTicks.map((tick) => (
              <span key={tick.value}>{tick.label}</span>
            ))}
          </div>

          <div className="decision-expansion-plot">
            {expansionTicks.map((tick) => (
              <span
                className="decision-expansion-grid-line"
                key={tick.value}
                style={
                  {
                    '--position': `${100 - getPercent(tick.value, expansionMax)}%`,
                  } as CSSProperties
                }
              />
            ))}

            <div className="decision-expansion-bars">
              {expansionItems.map((item) => (
                <figure key={item.label}>
                  <div className="decision-expansion-graph">
                    <div className="decision-expansion-bar-wrap">
                      <i
                        className="decision-expansion-bar"
                        style={
                          {
                            '--height': `${getPercent(item.amountValue, expansionMax)}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                  </div>

                  <figcaption>
                    <strong>{item.label}</strong>
                    <span>{item.amountLabel}</span>
                    <small>{item.value}% de aderência</small>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
