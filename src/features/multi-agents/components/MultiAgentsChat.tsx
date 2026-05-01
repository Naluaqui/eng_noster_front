import type { Meeting } from '@/features/meetings/types/meeting';
import type { AgentAnalysis, MultiAgentMessage as MultiAgentMessageType } from '../types/multiAgent';
import { AgentSuggestionGrid } from './AgentSuggestionGrid';
import { AnalysisNavigation } from './AnalysisNavigation';
import { MultiAgentComposer } from './MultiAgentComposer';
import { MultiAgentMessage } from './MultiAgentMessage';

type MultiAgentsChatProps = {
  activeAnalysisId: string;
  analyses: AgentAnalysis[];
  attachedMeetings: Meeting[];
  meetings: Meeting[];
  messages: MultiAgentMessageType[];
  onAttachMeeting: (meetingId: string) => void;
  onCreateAnalysis: () => void;
  onDetachMeeting: (meetingId: string) => void;
  onSelectAnalysis: (analysisId: string) => void;
  onSendMessage: (content: string) => void;
};

export function MultiAgentsChat({
  activeAnalysisId,
  analyses,
  attachedMeetings,
  meetings,
  messages,
  onAttachMeeting,
  onCreateAnalysis,
  onDetachMeeting,
  onSelectAnalysis,
  onSendMessage,
}: MultiAgentsChatProps) {
  return (
    <main className="feature-page multi-agents-page">
      <section className="multi-agents-workspace" aria-label="Chat multi-agentes">
        <AnalysisNavigation
          activeAnalysisId={activeAnalysisId}
          analyses={analyses}
          onCreateAnalysis={onCreateAnalysis}
          onSelectAnalysis={onSelectAnalysis}
        />

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

          <MultiAgentComposer
            attachedMeetings={attachedMeetings}
            meetings={meetings}
            onAttachMeeting={onAttachMeeting}
            onDetachMeeting={onDetachMeeting}
            onSendMessage={onSendMessage}
          />
          <AgentSuggestionGrid />
        </div>
      </section>
    </main>
  );
}
