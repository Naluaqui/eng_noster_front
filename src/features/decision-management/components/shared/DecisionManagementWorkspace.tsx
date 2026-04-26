'use client';

import { useState } from 'react';
import { DecisionDecisionsPanel } from '../decisions/DecisionDecisionsPanel';
import { DecisionAnalysisFolder } from '../overview/DecisionAnalysisFolder';
import { DecisionManagementNavigation, type DecisionManagementTab } from './DecisionManagementNavigation';
import { PrincipalInsightCard } from './PrincipalInsightCard';

export function DecisionManagementWorkspace() {
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
          <DecisionDecisionsPanel />
        )}
      </div>
    </div>
  );
}
