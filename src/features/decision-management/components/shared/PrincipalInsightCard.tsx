import { MessageSquareText } from 'lucide-react';

type PrincipalInsightCardProps = {
  insight: string;
};

export function PrincipalInsightCard({ insight }: PrincipalInsightCardProps) {
  return (
    <section className="principal-insight-card" aria-label="Comentário de análise principal">
      <div className="principal-insight-card__icon" aria-hidden="true">
        <MessageSquareText size={22} />
      </div>

      <div className="principal-insight-card__comment">
        <p>{insight}</p>
      </div>
    </section>
  );
}
