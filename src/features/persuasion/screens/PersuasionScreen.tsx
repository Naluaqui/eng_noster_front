'use client';

import { useState } from 'react';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { PersuasionDashboard } from '../components/PersuasionDashboard';
import { usePersuasion } from '../hooks/usePersuasion';

export function PersuasionScreen() {
  const { data, isLoading, error } = usePersuasion();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingState label="Carregando persuasao..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar persuasao" description={error} />;
  }

  const selectedProfile = data?.profiles.find((profile) => profile.id === selectedProfileId) ?? data?.profile;

  if (!data || !selectedProfile) {
    return <EmptyState title="Nenhum perfil de persuasao encontrado" />;
  }

  return (
    <PersuasionDashboard
      profile={selectedProfile}
      socials={data.socials}
      tracks={data.tracks}
      sidebarStats={data.sidebarStats}
      worklist={data.worklist}
      onSelectProfile={setSelectedProfileId}
    />
  );
}
