'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Meeting } from '@/features/meetings/types/meeting';
import type { AgentAnalysis, AiAnalysis, MultiAgentMessage as MultiAgentMessageType } from '../types/multiAgent';
import { AnalysisEntityTags } from './AnalysisEntityTags';
import { AnalysisNavigation } from './AnalysisNavigation';
import { AnalysisResultPanel } from './AnalysisResultPanel';
import { MultiAgentComposer } from './MultiAgentComposer';
import { MultiAgentMessage, MultiAgentTypingIndicator } from './MultiAgentMessage';

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
  typingAgent: string | null;
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
  typingAgent,
}: MultiAgentsChatProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  useEffect(() => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    timeline.scrollTo({
      behavior: 'smooth',
      top: timeline.scrollHeight,
    });
  }, [analysisError, analysisResult, isAnalyzing, messages.length, typingAgent]);

  useEffect(() => {
    if (!isAnalysisOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsAnalysisOpen(false);
      }
    }

    window.addEventListener('keydown', closeOnEscape);

    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isAnalysisOpen]);

  function handleSelectAnalysis(analysisId: string) {
    setIsAnalysisOpen(false);
    onSelectAnalysis(analysisId);
  }

  return (
    <main className="feature-page multi-agents-page">
      <section className="multi-agents-workspace" aria-label="Chat multi-agentes">
        <AnalysisNavigation
          activeAnalysisId={activeAnalysisId}
          analyses={analyses}
          onCreateAnalysis={onCreateAnalysis}
          onSelectAnalysis={handleSelectAnalysis}
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
              {typingAgent ? <MultiAgentTypingIndicator agent={typingAgent} /> : null}
            </section>

            {analysisError ? (
              <p className="multi-agents-chat__error" role="alert">
                {analysisError}
              </p>
            ) : null}

            {analysisResult ? (
              <article className="multi-agents-chat__diagnosis">
                <span>Diagnostico central</span>
                <p>{analysisResult.diagnostico_central}</p>
                <button onClick={() => setIsAnalysisOpen(true)} type="button">
                  Ver analise completa
                </button>
              </article>
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
        </div>
      </section>

      {analysisResult && isAnalysisOpen ? (
        <div className="analysis-modal" role="dialog" aria-modal="true" aria-label="Analise completa">
          <div className="analysis-modal__panel">
            <header>
              <div>
                <span>Multi-agentes</span>
                <h2>Analise completa</h2>
              </div>
              <button aria-label="Fechar analise" onClick={() => setIsAnalysisOpen(false)} type="button">
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="analysis-modal__content">
              <AnalysisEntityTags analysis={analysisResult} />
              <AnalysisResultPanel analysis={analysisResult} />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
