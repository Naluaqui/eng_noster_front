'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { MultiAgentsChat } from '../components/MultiAgentsChat';
import { useMultiAgents } from '../hooks/useMultiAgents';

export function MultiAgentsScreen() {
  const { data, isLoading, error } = useMultiAgents();

  if (isLoading) {
    return <LoadingState label="Carregando multi-agentes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar multi-agentes" description={error} />;
  }

  if (!data || data.messages.length === 0) {
    return <EmptyState title="Nenhuma analise encontrada" />;
  }

  return <MultiAgentsChat analyses={data.analyses} messages={data.messages} />;
}
