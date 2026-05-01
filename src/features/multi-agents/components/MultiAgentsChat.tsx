import type { AgentAnalysis, MultiAgentMessage as MultiAgentMessageType } from '../types/multiAgent';
import { AgentSuggestionGrid } from './AgentSuggestionGrid';
import { AnalysisNavigation } from './AnalysisNavigation';
import { MultiAgentComposer } from './MultiAgentComposer';
import { MultiAgentMessage } from './MultiAgentMessage';

type MultiAgentsChatProps = {
  analyses: AgentAnalysis[];
  messages: MultiAgentMessageType[];
};

export function MultiAgentsChat({ analyses, messages }: MultiAgentsChatProps) {
  return (
    <main className="feature-page multi-agents-page">
      <section className="multi-agents-workspace" aria-label="Chat multi-agentes">
        <AnalysisNavigation analyses={analyses} />

        <div className="multi-agents-chat">
          <section className="multi-agents-chat__hero" aria-labelledby="multi-agents-title">
            <div className="multi-agents-chat__orb" aria-hidden="true" />
            <p>Bom dia, Ana</p>
            <h3 id="multi-agents-title">O que vamos decidir hoje?</h3>
          </section>

          <section className="multi-agents-chat__messages" aria-label="Histórico do chat">
            {messages.map((message) => (
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
