'use client';

import { useMemo, useState } from 'react';
import type { Meeting } from '@/features/meetings/types/meeting';
import { DecisionDecisionsPanel } from '../decisions/DecisionDecisionsPanel';
import { DecisionAnalysisFolder } from '../overview/DecisionAnalysisFolder';
import {
  createFilteredDecisionScenario,
  defaultDecisionFilters,
  hasActiveDecisionFilters,
} from '../../mocks/filteredDecisionScenario.mock';
import type {
  DecisionImpactFlowData,
  DecisionOfferingOption,
  DecisionWavePoint,
} from '../../types/decision-management';
import {
  DecisionManagementNavigation,
  type DecisionManagementTab,
} from './DecisionManagementNavigation';
import { PrincipalInsightCard } from './PrincipalInsightCard';

type DecisionManagementWorkspaceProps = {
  meetings: Meeting[];
  decisionImpactFlows: Record<string, DecisionImpactFlowData>;
  decisionPriorityWaves: DecisionWavePoint[];
  offeringOptions: DecisionOfferingOption[];
};

const baseInsight =
  'A conversa demonstra interesse real, mas a decisão perde força quando o retorno esperado não fica concreto o suficiente para justificar o avanço.';

export function DecisionManagementWorkspace({
  meetings,
  decisionImpactFlows,
  decisionPriorityWaves,
  offeringOptions,
}: DecisionManagementWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<DecisionManagementTab>('general');
  const [filters, setFilters] = useState(defaultDecisionFilters);
  const isGeneralTab = activeTab === 'general';
  const filteredScenario = useMemo(
    () =>
      hasActiveDecisionFilters(filters)
        ? createFilteredDecisionScenario(filters, offeringOptions)
        : null,
    [filters, offeringOptions],
  );

  return (
    <div className="decision-management-page">
      <DecisionManagementNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className="decision-management-tab-panel"
        id={`decision-management-${activeTab}-panel`}
        role="tabpanel"
        aria-label={isGeneralTab ? 'Visão geral da gestão de decisão' : 'Decisões analisadas'}
      >
        {isGeneralTab ? (
          <>
            <PrincipalInsightCard insight={filteredScenario?.insight ?? baseInsight} />
            <DecisionAnalysisFolder
              filters={filters}
              offeringOptions={offeringOptions}
              overview={filteredScenario?.overview}
              onFiltersChange={setFilters}
            />
          </>
        ) : (
          <DecisionDecisionsPanel
            meetings={filteredScenario?.meetings ?? meetings}
            decisionImpactFlows={filteredScenario?.decisionImpactFlows ?? decisionImpactFlows}
            decisionPriorityWaves={filteredScenario?.decisionPriorityWaves ?? decisionPriorityWaves}
            filters={filters}
            offeringOptions={offeringOptions}
            onFiltersChange={setFilters}
          />
        )}
      </div>
    </div>
  );
}
