'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MultiAgentsChat } from '../components/MultiAgentsChat';
import { useMultiAgentsContext } from '../context/MultiAgentsContext';

export function MultiAgentsScreen() {
  const {
    data,
    isLoading,
    isAnalyzing,
    error,
    analysisError,
    typingAgent,
    attachMeeting,
    createAnalysis,
    detachMeeting,
    selectAnalysis,
    sendMessage,
  } = useMultiAgentsContext();

  if (isLoading) {
    return <LoadingState label="Carregando multi-agentes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar multi-agentes" description={error} />;
  }

  if (!data || data.messages.length === 0) {
    return <EmptyState title="Nenhuma analise encontrada" />;
  }

  return (
    <MultiAgentsChat
      activeAnalysisId={data.activeAnalysisId}
      analyses={data.analyses}
      analysisError={analysisError}
      analysisResult={data.analysisResult}
      attachedMeetings={data.attachedMeetings}
      isAnalyzing={isAnalyzing}
      meetings={data.meetings}
      messages={data.messages}
      onAttachMeeting={attachMeeting}
      onCreateAnalysis={createAnalysis}
      onDetachMeeting={detachMeeting}
      onSelectAnalysis={selectAnalysis}
      onSendMessage={sendMessage}
      typingAgent={typingAgent}
    />
  );
}
