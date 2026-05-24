'use client';

import { useEffect, useRef } from 'react';
import type { Meeting } from '@/features/meetings/types/meeting';
import type { AgentAnalysis, AiAnalysis, MultiAgentMessage as MultiAgentMessageType } from '../types/multiAgent';
import { AgentSuggestionGrid } from './AgentSuggestionGrid';
import { AnalysisEntityTags } from './AnalysisEntityTags';
import { AnalysisNavigation } from './AnalysisNavigation';
import { AnalysisResultPanel } from './AnalysisResultPanel';
import { MultiAgentComposer } from './MultiAgentComposer';
import { MultiAgentMessage } from './MultiAgentMessage';

type MultiAgentsChatProps = {
  activeAnalysisId: string;
  analyses: AgentAnalysis[];
  analysisError: string | null;
  analysisResult: AiAnalysis | null;
  attachedMeetings: Meeting[];
  isAnalyzing: boolean;
  meetings: Meeting[];
  messages: MultiAgentMessageType[];
  onAttachMeeting: (meetingId: string) => void;
  onCreateAnalysis: () => void;
  onDetachMeeting: (meetingId: string) => void;
  onSelectAnalysis: (analysisId: string) => void;
  onSendMessage: (content: string) => Promise<boolean>;
};

export function MultiAgentsChat({
  activeAnalysisId,
  analyses,
  analysisError,
  analysisResult,
  attachedMeetings,
  isAnalyzing,
  meetings,
  messages,
  onAttachMeeting,
  onCreateAnalysis,
  onDetachMeeting,
  onSelectAnalysis,
  onSendMessage,
}: MultiAgentsChatProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    timeline.scrollTo({
      behavior: 'smooth',
      top: timeline.scrollHeight,
    });
  }, [analysisError, analysisResult, isAnalyzing, messages.length]);

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
            <div className={isAnalyzing ? 'multi-agents-chat__orb is-analyzing' : 'multi-agents-chat__orb'} aria-hidden="true" />
            <p>Bom dia, Ana</p>
            <h3 id="multi-agents-title">O que vamos decidir hoje?</h3>
            {isAnalyzing ? <strong className="multi-agents-chat__progress">Agentes analisando as reunioes...</strong> : null}
          </section>

          <div className="multi-agents-chat__timeline" ref={timelineRef}>
            <section className="multi-agents-chat__messages" aria-label="Historico do chat">
              {messages.map((message) => (
                <MultiAgentMessage message={message} key={message.id} />
              ))}
            </section>

            {analysisError ? (
              <p className="multi-agents-chat__error" role="alert">
                {analysisError}
              </p>
            ) : null}

            {analysisResult ? (
              <>
                <AnalysisEntityTags analysis={analysisResult} />
                <AnalysisResultPanel analysis={analysisResult} />
              </>
            ) : null}
          </div>

          <MultiAgentComposer
            analysisResult={analysisResult}
            attachedMeetings={attachedMeetings}
            isAnalyzing={isAnalyzing}
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
