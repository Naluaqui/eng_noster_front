import type { InsightMetric } from '../types/insight';

type InsightChartProps = {
  metrics: InsightMetric[];
};

export function InsightChart({ metrics }: InsightChartProps) {
  return (
    <div className="insight-chart" aria-label="Indicadores de persuasão">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </div>
  );
}
