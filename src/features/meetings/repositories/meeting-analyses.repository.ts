import type { AiAnalysis } from '@/features/multi-agents/types/multiAgent';

type StoredMultiAgentWorkspace = {
  analyses?: Array<{ id: string }>;
  attachmentsByAnalysis?: Record<string, string[]>;
  resultsByAnalysis?: Record<string, AiAnalysis | null>;
};

export const storedMeetingAnalysesChangedEvent = 'noster.multiAgents.meetingAnalyses.changed';

export function getStoredMeetingAnalyses(companyId: string) {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(`noster.multiAgents.${companyId}`);
    const workspace = stored ? (JSON.parse(stored) as StoredMultiAgentWorkspace) : null;
    const meetingAnalyses: Record<string, AiAnalysis> = {};

    if (!workspace) {
      return meetingAnalyses;
    }

    const analysisIds = workspace.analyses?.map((analysis) => analysis.id) ?? Object.keys(workspace.resultsByAnalysis ?? {});

    analysisIds.forEach((analysisId) => {
      const result = workspace.resultsByAnalysis?.[analysisId];

      if (!result) {
        return;
      }

      (workspace.attachmentsByAnalysis?.[analysisId] ?? []).forEach((meetingId) => {
        if (!meetingAnalyses[meetingId]) {
          meetingAnalyses[meetingId] = result;
        }
      });
    });

    return meetingAnalyses;
  } catch {
    return {};
  }
}
