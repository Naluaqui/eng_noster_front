import { MessageSquareText } from 'lucide-react';

export function PrincipalInsightCard() {
  return (
    <section className="principal-insight-card" aria-label="Comentário de análise principal">
      <div className="principal-insight-card__icon" aria-hidden="true">
        <MessageSquareText size={22} />
      </div>

      <div className="principal-insight-card__comment">
        <p>
          A conversa demonstra interesse real, mas a decisão perde força quando o retorno esperado
          não fica concreto o suficiente para justificar o avanço.
        </p>
      </div>
    </section>
  );
}
