'use client';

import { useState } from 'react';
import type { Meeting } from '@/features/meetings/types/meeting';
import { DecisionDecisionsPanel } from '../decisions/DecisionDecisionsPanel';
import { DecisionAnalysisFolder } from '../overview/DecisionAnalysisFolder';
import type {
  DecisionImpactFlowData,
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
};

export function DecisionManagementWorkspace({
  meetings,
  decisionImpactFlows,
  decisionPriorityWaves,
}: DecisionManagementWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<DecisionManagementTab>('general');
  const isGeneralTab = activeTab === 'general';

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
            <PrincipalInsightCard />
            <DecisionAnalysisFolder />
          </>
        ) : (
          <DecisionDecisionsPanel
            meetings={meetings}
            decisionImpactFlows={decisionImpactFlows}
            decisionPriorityWaves={decisionPriorityWaves}
          />
        )}
      </div>
    </div>
  );
}
