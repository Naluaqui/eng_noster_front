'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MeetingDetailsPanel } from '../components/MeetingDetailsPanel';
import { useMeetingDetails } from '../hooks/useMeetingDetails';

type MeetingDetailsScreenProps = {
  meetingId: string;
};

export function MeetingDetailsScreen({ meetingId }: MeetingDetailsScreenProps) {
  const { meeting, isLoading, error } = useMeetingDetails(meetingId);

  if (isLoading) {
    return <LoadingState label="Carregando reuniao..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar reuniao" description={error} />;
  }

  return <MeetingDetailsPanel meeting={meeting} />;
}
