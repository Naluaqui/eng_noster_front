export type DecisionImpactFlowNode = {
  title: string;
  description: string;
};

export type DecisionImpactFlowData = {
  zone: string;
  source: DecisionImpactFlowNode;
  centralDecision: DecisionImpactFlowNode;
  decisions: DecisionImpactFlowNode[];
  impacts: DecisionImpactFlowNode[];
  actions: string[];
};

export type DecisionWavePoint = {
  label: string;
  priorityIntensity: number;
  pressureIntensity: number;
  focusArea: string;
  biggestPain: string;
  recommendedAction: string;
  topProduct: string;
  weakProduct: string;
  marketReading: string;
};

export type DecisionWaveSeriesKey = 'priority' | 'pressure';

export type DecisionOfferingOption = {
  value: string;
  label: string;
  category: string;
};

export type DecisionFilters = {
  startDate: string;
  endDate: string;
  offering: string;
};

export type DecisionOverviewMetric = {
  label: string;
  value: string;
  trend: string;
  previous: string;
  featured?: boolean;
};

export type DecisionPerformanceMonth = {
  month: string;
  periodLabel: string;
  potential: number;
  converted: number;
  selected?: boolean;
};

export type DecisionPerformanceData = {
  months: DecisionPerformanceMonth[];
  overview: {
    actionableRate: number;
    actionableDecisions: number;
    blockedDecisions: number;
    actionableTrend: string;
    blockedTrend: string;
  };
};

export type DecisionHealthData = {
  roiTrend: Array<{ label: string; value: number }>;
  clarityTrend: Array<{ label: string; value: number }>;
  expansionItems: Array<{
    label: string;
    value: number;
    amountLabel: string;
    amountValue: number;
  }>;
  competitiveAlert: string;
};

export type DecisionFinancialData = {
  strategicSignals: Array<{
    label: string;
    date: string;
    amount: number;
    type: 'positive' | 'risk' | 'warning';
  }>;
  impactHistory: Array<{ label: string; value: number }>;
};

export type DecisionPersonaData = {
  location: string;
  age: string;
  name: string;
  role: string;
  quote: string;
  problems: string[];
  goals: string[];
  motivations: string[];
  engagementSignals: string[];
};

export type DecisionOverviewData = {
  metrics: DecisionOverviewMetric[];
  performance: DecisionPerformanceData;
  health: DecisionHealthData;
  financial: DecisionFinancialData;
  persona: DecisionPersonaData;
};

export type DecisionMockScenario = {
  insight: string;
  meetings: import('@/features/meetings/types/meeting').Meeting[];
  decisionImpactFlows: Record<string, DecisionImpactFlowData>;
  decisionPriorityWaves: DecisionWavePoint[];
  overview: DecisionOverviewData;
};
