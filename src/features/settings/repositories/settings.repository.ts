import type { SettingsSection } from '../types/settings';

export async function getSettingsSections(): Promise<SettingsSection[]> {
  return ['profile', 'preferences', 'account'];
}
