import { Archive, Bot, FileText, Plus } from 'lucide-react';
import type { AgentAnalysis } from '../types/multiAgent';

const statusLabels = {
  active: 'Ativa',
  draft: 'Rascunho',
  archived: 'Arquivada',
} as const;

type AnalysisNavigationProps = {
  analyses: AgentAnalysis[];
};

export function AnalysisNavigation({ analyses }: AnalysisNavigationProps) {
  const activeAgentCount = analyses[0]?.agentCount ?? 0;

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
        {analyses.map((analysis) => (
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
        <span>{activeAgentCount} agentes nesta análise</span>
        <Archive size={15} aria-hidden="true" />
      </footer>
    </aside>
  );
}
