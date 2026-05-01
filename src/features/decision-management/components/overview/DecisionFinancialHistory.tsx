import type { CSSProperties } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  TrendingUp,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';

type SignalType = 'positive' | 'risk' | 'warning';

type StrategicSignal = {
  label: string;
  date: string;
  amount: number;
  type: SignalType;
  icon: LucideIcon;
};

type ImpactPoint = {
  label: string;
  value: number;
};

type ChartTick = {
  value: number;
  label: string;
};

const strategicSignals: StrategicSignal[] = [
  {
    label: 'Objeção de ROI resolvida',
    date: '05 Junho 2026',
    amount: 12400,
    type: 'positive',
    icon: TrendingUp,
  },
  {
    label: 'Concorrente citado',
    date: '04 Junho 2026',
    amount: -8200,
    type: 'risk',
    icon: AlertTriangle,
  },
  {
    label: 'Decisor identificado',
    date: '03 Junho 2026',
    amount: 9750,
    type: 'positive',
    icon: UserCheck,
  },
  {
    label: 'Follow-up crítico atrasado',
    date: '02 Junho 2026',
    amount: -4100,
    type: 'warning',
    icon: Clock,
  },
];

const impactHistory: ImpactPoint[] = [
  { label: 'Jan', value: 8200 },
  { label: 'Fev', value: 11800 },
  { label: 'Mar', value: 9400 },
  { label: 'Abr', value: 14700 },
  { label: 'Mai', value: 17754 },
  { label: 'Jun', value: 20435 },
];

const chartSize = {
  width: 520,
  height: 220,
  padding: {
    top: 22,
    right: 28,
    bottom: 36,
    left: 58,
  },
};

function formatFullCurrency(value: number) {
  return formatCurrency(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getNiceMax(value: number) {
  if (value <= 0) {
    return 100;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getX(index: number, total: number) {
  const width = chartSize.width - chartSize.padding.left - chartSize.padding.right;

  if (total <= 1) {
    return chartSize.padding.left;
  }

  return chartSize.padding.left + (index / (total - 1)) * width;
}

function getY(value: number, maxValue: number) {
  const height = chartSize.height - chartSize.padding.top - chartSize.padding.bottom;

  if (maxValue <= 0) {
    return chartSize.padding.top + height;
  }

  return chartSize.padding.top + (1 - value / maxValue) * height;
}

function getChartTicks(maxValue: number, count = 5): ChartTick[] {
  return Array.from({ length: count }, (_, index) => {
    const value = maxValue - (maxValue / (count - 1)) * index;

    return {
      value,
      label: formatCurrency(value).replace('R$', 'R$ '),
    };
  });
}

function createLinePath(points: ImpactPoint[], maxValue: number) {
  return points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${getX(index, points.length)} ${getY(point.value, maxValue)}`;
    })
    .join(' ');
}

function createAreaPath(points: ImpactPoint[], maxValue: number) {
  const linePath = createLinePath(points, maxValue);
  const firstX = getX(0, points.length);
  const lastX = getX(points.length - 1, points.length);
  const baseY = chartSize.height - chartSize.padding.bottom;

  return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
}

function getSignalImpactPercent(amount: number, maxAmount: number) {
  if (maxAmount <= 0) {
    return 0;
  }

  return Math.min((Math.abs(amount) / maxAmount) * 100, 100);
}

export function DecisionFinancialHistory() {
  const currentImpact = impactHistory[impactHistory.length - 1];
  const previousImpact = impactHistory[impactHistory.length - 2];
  const impactDelta = currentImpact.value - previousImpact.value;

  const maxImpact = getNiceMax(Math.max(...impactHistory.map((point) => point.value)));
  const chartTicks = getChartTicks(maxImpact);
  const linePath = createLinePath(impactHistory, maxImpact);
  const areaPath = createAreaPath(impactHistory, maxImpact);

  const positiveImpact = strategicSignals
    .filter((signal) => signal.amount > 0)
    .reduce((sum, signal) => sum + signal.amount, 0);

  const riskImpact = strategicSignals
    .filter((signal) => signal.amount < 0)
    .reduce((sum, signal) => sum + Math.abs(signal.amount), 0);

  const maxSignalAmount = Math.max(...strategicSignals.map((signal) => Math.abs(signal.amount)));

  return (
    <section
      className="decision-financial-history"
      aria-label="Movimentação estratégica da empresa"
    >
      <article className="decision-balance-card">
        <header>
          <div>
            <span>Valor Estratégico em Movimento</span>
            <strong>{formatFullCurrency(previousImpact.value)}</strong>
          </div>

          <button type="button">
            Mensal
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <p className="decision-balance-card__description">
          Impacto líquido das decisões, riscos e oportunidades detectadas nas conversas.
        </p>

        <div className="decision-balance-kpis">
          <div>
            <span>Oportunidades</span>
            <strong>{formatCurrency(positiveImpact)}</strong>
          </div>

          <div>
            <span>Riscos mapeados</span>
            <strong>{formatCurrency(riskImpact)}</strong>
          </div>

          <div>
            <span>Variação mensal</span>
            <strong>{formatCurrency(impactDelta)}</strong>
          </div>
        </div>

        <div className="decision-balance-chart">
          <svg
            viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
            role="img"
            aria-label="Evolução do impacto estratégico mensal"
          >
            {chartTicks.map((tick) => {
              const y = getY(tick.value, maxImpact);

              return (
                <g key={tick.value}>
                  <line
                    className="decision-balance-chart__grid"
                    x1={chartSize.padding.left}
                    x2={chartSize.width - chartSize.padding.right}
                    y1={y}
                    y2={y}
                  />

                  <text
                    className="decision-balance-chart__axis"
                    x={chartSize.padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                  >
                    {tick.label.replace(',00', '')}
                  </text>
                </g>
              );
            })}

            <path className="decision-balance-chart__area" d={areaPath} />
            <path className="decision-balance-chart__line" d={linePath} />

            {impactHistory.map((point, index) => {
              const x = getX(index, impactHistory.length);
              const y = getY(point.value, maxImpact);

              return (
                <g key={point.label}>
                  <circle className="decision-balance-chart__point" cx={x} cy={y} r="4" />
                  <text
                    className="decision-balance-chart__label"
                    x={x}
                    y={chartSize.height - 10}
                    textAnchor="middle"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="decision-balance-point-overlays">
            {impactHistory.map((point, index) => {
              const x = getX(index, impactHistory.length);
              const y = getY(point.value, maxImpact);

              return (
                <button
                  className="decision-balance-point-trigger"
                  type="button"
                  key={point.label}
                  style={
                    {
                      '--x': `${(x / chartSize.width) * 100}%`,
                      '--y': `${(y / chartSize.height) * 100}%`,
                    } as CSSProperties
                  }
                  aria-label={`Impacto líquido em ${point.label}: ${formatFullCurrency(point.value)}`}
                >
                  <span className="decision-balance-tooltip">
                    <span>Impacto líquido</span>
                    <strong>{formatFullCurrency(point.value)}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <article className="decision-transaction-card">
        <header>
          <h2>Histórico de Sinais Estratégicos</h2>

          <button type="button">
            Prioridade
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <p className="decision-transaction-card__description">
          Eventos que alteraram potencial comercial, risco ou prioridade da empresa.
        </p>

        <ul>
          {strategicSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <li className={`is-${signal.type}`} key={signal.label}>
                <i>
                  <Icon size={16} aria-hidden="true" />
                </i>

                <div className="decision-transaction-card__content">
                  <span>{signal.label}</span>
                  <time>{signal.date}</time>

                  <div className="decision-transaction-card__bar">
                    <b
                      style={
                        {
                          '--width': `${getSignalImpactPercent(signal.amount, maxSignalAmount)}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>

                <strong>{formatCurrency(signal.amount)}</strong>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
