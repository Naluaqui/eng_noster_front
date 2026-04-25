import { insights } from '../data/insights';
import { InsightCard } from './InsightCard';
import { PersonasMiniHeader } from './PersonasMiniHeader';

export function PersonaAnalysisPanel() {
  return (
    <main className="feature-page">
      <PersonasMiniHeader />
      <section className="insights-grid" aria-label="Insights por persona">
        {insights.map((insight) => (
          <InsightCard insight={insight} key={insight.id} />
        ))}
      </section>
    </main>
  );
}
