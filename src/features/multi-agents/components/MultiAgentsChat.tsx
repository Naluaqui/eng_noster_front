import { multiAgentMessages } from '../data/multiAgentChat';
import { AgentSuggestionGrid } from './AgentSuggestionGrid';
import { AnalysisNavigation } from './AnalysisNavigation';
import { MultiAgentComposer } from './MultiAgentComposer';
import { MultiAgentMessage } from './MultiAgentMessage';

export function MultiAgentsChat() {
  return (
    <main className="feature-page multi-agents-page">
      <header className="feature-page__header multi-agents-page__header">
        <div>
          <span>Multi-agentes</span>
          <h2>Sala de decisão virtual</h2>
          <p>Converse com múltiplas perspectivas para transformar reuniões em análises acionáveis.</p>
        </div>
      </header>

      <section className="multi-agents-workspace" aria-label="Chat multi-agentes">
        <AnalysisNavigation />

        <div className="multi-agents-chat">
          <section className="multi-agents-chat__hero" aria-labelledby="multi-agents-title">
            <div className="multi-agents-chat__orb" aria-hidden="true" />
            <p>Bom dia, Ana</p>
            <h3 id="multi-agents-title">O que vamos decidir hoje?</h3>
          </section>

          <section className="multi-agents-chat__messages" aria-label="Histórico do chat">
            {multiAgentMessages.map((message) => (
              <MultiAgentMessage message={message} key={message.id} />
            ))}
          </section>

          <MultiAgentComposer />
          <AgentSuggestionGrid />
        </div>
      </section>
    </main>
  );
}
