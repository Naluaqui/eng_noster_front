'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MeetingsKanban } from '../components/MeetingsKanban';
import { useMeetings } from '../hooks/useMeetings';

export function MeetingsScreen() {
  const { meetings, isLoading, movingMeetingId, error, createMeeting, moveMeeting } =
    useMeetings();

  if (isLoading) {
    return <LoadingState label="Carregando reunioes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar reunioes" description={error} />;
  }

  if (meetings.length === 0) {
    return <EmptyState title="Nenhuma reuniao encontrada" />;
  }

  return (
    <MeetingsKanban
      meetings={meetings}
      movingMeetingId={movingMeetingId}
      onCreateMeeting={createMeeting}
      onMoveMeeting={moveMeeting}
    />
  );
}
