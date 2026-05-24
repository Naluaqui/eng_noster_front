'use client';

import { useState } from 'react';
import { DecisionFinancialHistory } from './DecisionFinancialHistory';
import { DecisionHealthSnapshot } from './DecisionHealthSnapshot';
import { DecisionOverviewMetrics } from './DecisionOverviewMetrics';
import { DecisionPerformanceOverview } from './DecisionPerformanceOverview';
import { DecisionPersonaPanel } from '../personas/DecisionPersonaPanel';
import type {
  DecisionFilters,
  DecisionOfferingOption,
  DecisionOverviewData,
} from '../../types/decision-management';

const analysisTabs = [
  { id: 'totvs', label: 'TOTVS' },
  { id: 'persona', label: 'Persona' },
] as const;

type AnalysisTab = (typeof analysisTabs)[number]['id'];

type DecisionAnalysisFolderProps = {
  filters: DecisionFilters;
  offeringOptions: DecisionOfferingOption[];
  overview?: DecisionOverviewData;
  onFiltersChange: (nextFilters: DecisionFilters) => void;
};

export function DecisionAnalysisFolder({
  filters,
  offeringOptions,
  overview,
  onFiltersChange,
}: DecisionAnalysisFolderProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('totvs');
  const isTotvs = activeTab === 'totvs';

  return (
    <section className="decision-analysis-folder" aria-label="Análise por contexto">
      <header className="decision-analysis-folder__tabs">
        <div role="tablist" aria-label="Abas de análise">
          {analysisTabs.map((tab) => (
            <button
              aria-controls={`decision-${tab.id}-panel`}
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? 'is-active' : undefined}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className="decision-analysis-folder__content"
        id={`decision-${activeTab}-panel`}
        role="tabpanel"
        aria-label={isTotvs ? 'Análise TOTVS' : 'Análise de persona'}
      >
        {isTotvs ? (
          <>
            <DecisionOverviewMetrics
              data={overview?.metrics}
              filters={filters}
              offeringOptions={offeringOptions}
              onFiltersChange={onFiltersChange}
            />
            <DecisionPerformanceOverview data={overview?.performance} />
            <DecisionHealthSnapshot data={overview?.health} />
            <DecisionFinancialHistory data={overview?.financial} />
          </>
        ) : (
          <DecisionPersonaPanel data={overview?.persona} />
        )}
      </div>
    </section>
  );
}
