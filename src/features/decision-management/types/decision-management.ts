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
