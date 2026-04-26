export type MultiAgentRole = 'user' | 'agent';

export type MultiAgentMessage = {
  id: string;
  role: MultiAgentRole;
  agent?: string;
  content: string;
};

export type AnalysisStatus = 'active' | 'draft' | 'archived';

export type AgentAnalysis = {
  id: string;
  title: string;
  description: string;
  status: AnalysisStatus;
  agentCount: number;
};
