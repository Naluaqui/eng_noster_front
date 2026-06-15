import { useMultiAgentsContext } from '@/features/multi-agents/context/MultiAgentsContext';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title = 'Noster' }: AppHeaderProps) {
  const { isAnalyzing } = useMultiAgentsContext();

  return (
    <header className="app-header">
      <div>
        <span>Engenharia de decisão com IA</span>
        <h1>{title}</h1>
      </div>
      {isAnalyzing ? (
        <div className="app-header__analysis-status" role="status">
          <span className="app-header__analysis-spinner" aria-hidden="true" />
          Multi-agentes analisando em segundo plano...
        </div>
      ) : null}
    </header>
  );
}
