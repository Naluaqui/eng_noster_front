'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { PersuasionDashboard } from '../components/PersuasionDashboard';
import { usePersuasion } from '../hooks/usePersuasion';

export function PersuasionScreen() {
  const { data, isLoading, error } = usePersuasion();

  if (isLoading) {
    return <LoadingState label="Carregando persuasao..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar persuasao" description={error} />;
  }

  if (!data) {
    return <EmptyState title="Nenhum perfil de persuasao encontrado" />;
  }

  return (
    <PersuasionDashboard
      profile={data.profile}
      socials={data.socials}
      tracks={data.tracks}
      sidebarStats={data.sidebarStats}
      worklist={data.worklist}
    />
  );
}
