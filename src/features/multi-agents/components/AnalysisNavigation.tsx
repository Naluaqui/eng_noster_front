import { Archive, Bot, FileText, Plus } from 'lucide-react';
import { agentAnalyses } from '../data/multiAgentChat';

const statusLabels = {
  active: 'Ativa',
  draft: 'Rascunho',
  archived: 'Arquivada',
} as const;

export function AnalysisNavigation() {
  return (
    <aside className="analysis-nav" aria-label="Gerenciar análises">
      <header>
        <div>
          <span>Análises</span>
          <h2>Gerenciar</h2>
        </div>
        <button type="button" aria-label="Criar análise">
          <Plus size={16} aria-hidden="true" />
        </button>
      </header>

      <nav>
        {agentAnalyses.map((analysis) => (
          <a
            className={analysis.status === 'active' ? 'is-active' : undefined}
            href={`#${analysis.id}`}
            key={analysis.id}
          >
            <FileText size={16} aria-hidden="true" />
            <span>
              <strong>{analysis.title}</strong>
              <small>{analysis.description}</small>
            </span>
            <em>{statusLabels[analysis.status]}</em>
          </a>
        ))}
      </nav>

      <footer>
        <Bot size={16} aria-hidden="true" />
        <span>{agentAnalyses[0].agentCount} agentes nesta análise</span>
        <Archive size={15} aria-hidden="true" />
      </footer>
    </aside>
  );
}
