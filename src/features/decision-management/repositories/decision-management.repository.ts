import { getMeetings } from '@/features/meetings/repositories/meetings.repository';
import { decisionImpactFlows } from '../mocks/decisionImpactFlows.mock';
import { decisionPriorityWaves } from '../mocks/decisionPriorityWaves.mock';

export async function getDecisionDecisions() {
  const meetings = await getMeetings();

  return {
    meetings,
    decisionImpactFlows,
    decisionPriorityWaves,
  };
}

export async function getDecisionOverview() {
  return {};
}

export async function getDecisionPersonas() {
  return {};
}
