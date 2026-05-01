'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MeetingsKanban } from '../components/MeetingsKanban';
import { useMeetings } from '../hooks/useMeetings';

export function MeetingsScreen() {
  const { meetings, catalog, hasCompany, isLoading, movingMeetingId, error, createMeeting, updateMeeting, deleteMeeting, moveMeeting } =
    useMeetings();

  if (isLoading) {
    return <LoadingState label="Carregando reunioes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar reunioes" description={error} />;
  }

  if (!hasCompany) {
    return (
      <EmptyState
        title="Selecione uma empresa"
        description="Crie ou selecione uma empresa em Configuracoes para cadastrar reunioes."
      />
    );
  }

  return (
    <MeetingsKanban
      catalog={catalog}
      meetings={meetings}
      movingMeetingId={movingMeetingId}
      onCreateMeeting={createMeeting}
      onDeleteMeeting={deleteMeeting}
      onMoveMeeting={moveMeeting}
      onUpdateMeeting={updateMeeting}
    />
  );
}
