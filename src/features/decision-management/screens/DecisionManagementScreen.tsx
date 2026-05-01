'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { DecisionManagementWorkspace } from '../components/shared/DecisionManagementWorkspace';
import { useDecisionDecisions } from '../hooks/useDecisionDecisions';

export function DecisionManagementScreen() {
  const { data, isLoading, error } = useDecisionDecisions();

  if (isLoading) {
    return <LoadingState label="Carregando gestao de decisoes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar decisoes" description={error} />;
  }

  if (!data || data.meetings.length === 0) {
    return <EmptyState title="Nenhuma decisao encontrada" />;
  }

  return (
    <DecisionManagementWorkspace
      meetings={data.meetings}
      decisionImpactFlows={data.decisionImpactFlows}
      decisionPriorityWaves={data.decisionPriorityWaves}
    />
  );
}
