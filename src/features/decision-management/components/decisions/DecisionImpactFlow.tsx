import type { Meeting } from '@/features/meetings/types/meeting';
import type { DecisionImpactFlowData } from '../../types/decision-management';

type DecisionImpactFlowProps = {
  meeting: Meeting;
  flow: DecisionImpactFlowData;
};

export function DecisionImpactFlow({ meeting, flow }: DecisionImpactFlowProps) {
  return (
    <section
      className="decision-impact-flow-card"
      id="decision-impact-flow"
      aria-labelledby="decision-impact-flow-title"
    >
      <header className="decision-impact-flow-card__topbar">
        <span>Fluxograma de decisões e impactos</span>
        <strong>{meeting.title}</strong>
      </header>

      <div className="decision-impact-flow-card__map">
        <aside className="decision-impact-flow-card__domain" aria-label="Origem da reunião">
          <span>Domínio</span>
          <strong>{meeting.owner}</strong>
          <p>{meeting.participants.join(' + ')}</p>
        </aside>

        <div className="decision-impact-flow-card__zone">
          <header>
            <span>Zona: {flow.zone}</span>
            <h2 id="decision-impact-flow-title">{flow.centralDecision.title}</h2>
          </header>

          <div className="decision-impact-flow-card__diagram">
            <article className="decision-flow-node decision-flow-node--source">
              <span>Entrada</span>
              <strong>{flow.source.title}</strong>
              <p>{flow.source.description}</p>
            </article>

            <article className="decision-flow-node decision-flow-node--hub">
              <span>Hub</span>
              <strong>IA</strong>
              <p>{flow.centralDecision.description}</p>
            </article>

            <div className="decision-impact-flow-card__stack" aria-label="Decisões derivadas">
              {flow.decisions.map((decision) => (
                <article
                  className="decision-flow-node decision-flow-node--decision"
                  key={decision.title}
                >
                  <span>Decisão</span>
                  <strong>{decision.title}</strong>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>

            <div className="decision-impact-flow-card__stack" aria-label="Impactos mapeados">
              {flow.impacts.map((impact) => (
                <article
                  className="decision-flow-node decision-flow-node--impact"
                  key={impact.title}
                >
                  <span>Impacto</span>
                  <strong>{impact.title}</strong>
                  <p>{impact.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="decision-impact-flow-card__actions" aria-label="Ações recomendadas">
        {flow.actions.map((action) => (
          <span key={action}>{action}</span>
        ))}
      </footer>
    </section>
  );
}
