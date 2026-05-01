'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MultiAgentsChat } from '../components/MultiAgentsChat';
import { useMultiAgents } from '../hooks/useMultiAgents';

export function MultiAgentsScreen() {
  const {
    data,
    isLoading,
    error,
    attachMeeting,
    createAnalysis,
    detachMeeting,
    selectAnalysis,
    sendMessage,
  } = useMultiAgents();

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
      attachedMeetings={data.attachedMeetings}
      meetings={data.meetings}
      messages={data.messages}
      onAttachMeeting={attachMeeting}
      onCreateAnalysis={createAnalysis}
      onDetachMeeting={detachMeeting}
      onSelectAnalysis={selectAnalysis}
      onSendMessage={sendMessage}
    />
  );
}
