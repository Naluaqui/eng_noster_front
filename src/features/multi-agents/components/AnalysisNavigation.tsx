import { Archive, Bot, FileText, Plus } from 'lucide-react';
import type { AgentAnalysis } from '../types/multiAgent';

const statusLabels = {
  active: 'Ativa',
  draft: 'Rascunho',
  archived: 'Arquivada',
} as const;

type AnalysisNavigationProps = {
  activeAnalysisId: string;
  analyses: AgentAnalysis[];
  onCreateAnalysis: () => void;
  onSelectAnalysis: (analysisId: string) => void;
};

export function AnalysisNavigation({
  activeAnalysisId,
  analyses,
  onCreateAnalysis,
  onSelectAnalysis,
}: AnalysisNavigationProps) {
  const activeAnalysis = analyses.find((analysis) => analysis.id === activeAnalysisId);
  const activeAgentCount = activeAnalysis?.agentCount ?? 0;

  return (
    <aside className="analysis-nav" aria-label="Gerenciar analises">
      <header>
        <div>
          <span>Analises</span>
          <h2>Gerenciar</h2>
        </div>
        <button type="button" aria-label="Criar analise" onClick={onCreateAnalysis}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </header>

      <nav>
        {analyses.map((analysis) => (
          <button
            className={analysis.id === activeAnalysisId ? 'is-active' : undefined}
            key={analysis.id}
            onClick={() => onSelectAnalysis(analysis.id)}
            type="button"
          >
            <FileText size={16} aria-hidden="true" />
            <span>
              <strong>{analysis.title}</strong>
              <small>{analysis.description}</small>
            </span>
            <em>{statusLabels[analysis.status]}</em>
          </button>
        ))}
      </nav>

      <footer>
        <Bot size={16} aria-hidden="true" />
        <span>{activeAgentCount} agentes nesta analise</span>
        <Archive size={15} aria-hidden="true" />
      </footer>
    </aside>
  );
}
