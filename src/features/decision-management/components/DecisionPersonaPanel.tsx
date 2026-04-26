import { PersonaProductFilter } from './PersonaProductFilter';

const personaProblems = [
  'Status da análise fica pouco claro e atrasado, gerando perda de confiança',
  'Fluxos complexos interrompem a compra no momento de decisão',
];

const personaGoals = [
  'Receber recomendações automaticamente sem ações extras',
  'Entender claramente quando e como avançar com a decisão',
];

const personaMotivations = [
  'Economizar tempo em decisões comerciais recorrentes',
  'Manter o fluxo de venda rápido e familiar',
  'Evitar rastreamento manual de sinais e confirmações',
];

const engagementSignals = [
  'Compara risco, intenção e oportunidade antes do fechamento',
  'Consulta status da decisão depois de reuniões críticas',
  'Usa a plataforma regularmente, mas espera baixa carga cognitiva',
];

export function DecisionPersonaPanel() {
  return (
    <section className="decision-persona-sheet" aria-label="Persona principal">
      <PersonaProductFilter />

      <article className="persona-photo-card" aria-label="Perfil da persona">
        <div className="persona-photo-card__tags">
          <span>São Paulo</span>
          <span>34 anos</span>
        </div>

        <img
          alt="Retrato da persona Rafael Moreira"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
        />

        <footer>
          <strong>Rafael Moreira</strong>
          <span>Diretor Comercial</span>
        </footer>
      </article>

      <blockquote className="persona-analysis-quote">
        Clareza deve funcionar como benefício de fundo, não como uma tarefa separada.
      </blockquote>

      <section className="persona-mini-list persona-mini-list--problems" aria-labelledby="persona-problems">
        <h3 id="persona-problems">Problems</h3>
        {personaProblems.map((problem) => (
          <article key={problem}>
            <i />
            <span>{problem}</span>
          </article>
        ))}
      </section>

      <section className="persona-mini-list persona-mini-list--goals" aria-labelledby="persona-goals">
        <h3 id="persona-goals">Goals</h3>
        {personaGoals.map((goal) => (
          <article key={goal}>
            <i />
            <span>{goal}</span>
          </article>
        ))}
      </section>

      <section className="persona-motivation-card" aria-labelledby="persona-motivations">
        <h3 id="persona-motivations">Motivations</h3>
        <ul>
          {personaMotivations.map((motivation) => (
            <li key={motivation}>{motivation}</li>
          ))}
        </ul>
      </section>

      <section className="persona-engagement-card" aria-labelledby="persona-engagement">
        <h3 id="persona-engagement">User engagement</h3>
        <ul>
          {engagementSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
