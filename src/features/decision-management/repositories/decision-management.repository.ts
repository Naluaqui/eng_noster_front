import {
  getCompanySettings,
  getCompanySettingsById,
} from '@/features/settings/repositories/settings.repository';
import { getSelectedCompanyId } from '@/features/settings/repositories/workspace.repository';
import { getMeetings } from '@/features/meetings/repositories/meetings.repository';
import { decisionImpactFlows } from '../mocks/decisionImpactFlows.mock';
import { decisionPriorityWaves } from '../mocks/decisionPriorityWaves.mock';

export async function getDecisionDecisions() {
  const companyId = getSelectedCompanyId();
  const [meetings, settings] = await Promise.all([
    getMeetings(),
    companyId ? getCompanySettingsById(companyId) : getCompanySettings(),
  ]);

  return {
    meetings,
    decisionImpactFlows,
    decisionPriorityWaves,
    offeringOptions: settings.products
      .map((product) => ({
        value: product.name,
        label: product.name,
        category: product.technology,
      }))
      .sort((first, second) => first.label.localeCompare(second.label, 'pt-BR')),
  };
}

export async function getDecisionOverview() {
  return {};
}

export async function getDecisionPersonas() {
  return {};
}
