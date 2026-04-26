import { insightMetrics, insights } from '../data/insights';
import { InsightCard } from './InsightCard';
import { InsightChart } from './InsightChart';
import { PersonasMiniHeader } from './PersonasMiniHeader';

export function InsightsDashboard() {
  return (
    <main className="feature-page">
      <header className="feature-page__header">
        <div>
          <span>Persuasão</span>
          <h2>Dashboard de persuasão</h2>
        </div>
      </header>
      <InsightChart metrics={insightMetrics} />
      <PersonasMiniHeader />
      <section className="insights-grid" aria-label="Sinais de persuasão recentes">
        {insights.map((insight) => (
          <InsightCard insight={insight} key={insight.id} />
        ))}
      </section>
    </main>
  );
}
