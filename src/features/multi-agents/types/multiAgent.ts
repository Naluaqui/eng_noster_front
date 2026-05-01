export type MultiAgentRole = 'user' | 'agent';

export type MultiAgentMeetingAttachment = {
  id: string;
  title: string;
  date: string;
  time: string;
  summary: string;
};

export type MultiAgentMessage = {
  id: string;
  role: MultiAgentRole;
  agent?: string;
  content: string;
  attachments?: MultiAgentMeetingAttachment[];
};

export type AnalysisStatus = 'active' | 'draft' | 'archived';

export type AgentAnalysis = {
  id: string;
  title: string;
  description: string;
  status: AnalysisStatus;
  agentCount: number;
};
