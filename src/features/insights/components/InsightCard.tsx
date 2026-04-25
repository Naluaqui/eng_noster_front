import { Card } from '@/shared/components/ui/Card';
import type { Insight } from '../types/insight';

type InsightCardProps = {
  insight: Insight;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card className="insight-card">
      <span>{insight.persona}</span>
      <h3>{insight.title}</h3>
      <p>{insight.description}</p>
    </Card>
  );
}
