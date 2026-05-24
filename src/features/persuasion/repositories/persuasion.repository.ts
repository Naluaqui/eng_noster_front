import type { Meeting } from '@/features/meetings/types/meeting';
import { getStoredMeetingAnalyses } from '@/features/meetings/repositories/meeting-analyses.repository';
import { getMeetings } from '@/features/meetings/repositories/meetings.repository';
import type { AiAnalysis, AiDetectedCompany } from '@/features/multi-agents/types/multiAgent';
import { getSelectedCompanyId } from '@/features/settings/repositories/workspace.repository';
import {
  persuasionProfile,
  persuasionSidebarStats,
  persuasionSocials,
  persuasionTracks,
  persuasionWorklist,
} from '../mocks/persuasionProfile.mock';
import type { PersuasionProfile, PersuasionSidebarStat, PersuasionWorklistItem } from '../types/persuasion';

const profilesStoragePrefix = 'noster.persuasionCompanyProfiles';
export const persuasionProfilesChangedEvent = 'noster.persuasionCompanyProfiles.changed';

export async function getPersuasionDashboard() {
  const companyId = getSelectedCompanyId();

  if (companyId) {
    const meetings = await getMeetings();
    const storedAnalyses = getStoredMeetingAnalyses(companyId);

    Object.entries(storedAnalyses).forEach(([meetingId, analysis]) => {
      const meeting = meetings.find((item) => item.id === meetingId);

      if (meeting) {
        saveDetectedCompanyProfiles(companyId, analysis, [meeting]);
      }
    });
  }

  const detectedProfiles = getDetectedProfiles(companyId);
  const profiles = [...detectedProfiles, persuasionProfile];
  const worklist = [...detectedProfiles.map(mapProfileToWorklist), ...persuasionWorklist];

  return {
    profile: profiles[0],
    profiles,
    socials: persuasionSocials,
    tracks: persuasionTracks,
    sidebarStats: updateStats(worklist, detectedProfiles.length),
    worklist,
  };
}

export function saveDetectedCompanyProfiles(companyId: string, analysis: AiAnalysis, meetings: Meeting[]) {
  const companies = analysis.entidades_detectadas.empresas.map(normalizeCompany);

  if (companies.length === 0 || meetings.length === 0) {
    return;
  }

  const storedProfiles = getDetectedProfiles(companyId);
  const nextProfiles = companies.reduce<PersuasionProfile[]>((profiles, company) => {
    const id = createProfileId(company);
    const profile = createDetectedProfile(id, company, meetings);
    const existingIndex = profiles.findIndex((storedProfile) => storedProfile.id === id);

    if (existingIndex < 0) {
      return [profile, ...profiles];
    }

    const updated = [...profiles];
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...profile,
      linkedMeetings: mergeLinkedMeetings(updated[existingIndex].linkedMeetings ?? [], profile.linkedMeetings ?? []),
    };
    return updated;
  }, storedProfiles);

  const serializedProfiles = JSON.stringify(nextProfiles);

  if (window.localStorage.getItem(getStorageKey(companyId)) !== serializedProfiles) {
    window.localStorage.setItem(getStorageKey(companyId), serializedProfiles);
    window.dispatchEvent(new Event(persuasionProfilesChangedEvent));
  }
}

function getDetectedProfiles(companyId: string | null) {
  if (!companyId || typeof window === 'undefined') {
    return [];
  }

  try {
    const storedProfiles = window.localStorage.getItem(getStorageKey(companyId));
    return storedProfiles ? (JSON.parse(storedProfiles) as PersuasionProfile[]) : [];
  } catch {
    return [];
  }
}

function getStorageKey(companyId: string) {
  return `${profilesStoragePrefix}.${companyId}`;
}

function normalizeCompany(company: string | AiDetectedCompany): AiDetectedCompany {
  return typeof company === 'string' ? { nome: company } : company;
}

function createProfileId(company: AiDetectedCompany) {
  return `analysis-company-${normalizeId(company.nome)}`;
}

function createDetectedProfile(id: string, company: AiDetectedCompany, meetings: Meeting[]): PersuasionProfile {
  return {
    id,
    name: company.nome,
    role: company.setor || 'Empresa identificada',
    registeredAt: new Intl.DateTimeFormat('pt-BR').format(new Date()),
    location: '-',
    industry: company.setor || '-',
    email: '-',
    phone: '-',
    avatar: createAvatar(company.nome),
    source: 'analysis',
    linkedMeetings: meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
    })),
  };
}

function mapProfileToWorklist(profile: PersuasionProfile): PersuasionWorklistItem {
  const linkedMeeting = profile.linkedMeetings?.[0];

  return {
    id: `worklist-${profile.id}`,
    profileId: profile.id,
    name: profile.name,
    role: profile.role,
    status: linkedMeeting ? `Reunião: ${linkedMeeting.title}` : 'Perfil criado',
    priority: 'Nova',
    channel: 'document',
    avatar: profile.avatar,
  };
}

function updateStats(worklist: PersuasionWorklistItem[], detectedCount: number): PersuasionSidebarStat[] {
  return persuasionSidebarStats.map((stat) => {
    if (stat.id === 'worklist') {
      return { ...stat, value: worklist.length };
    }

    if (stat.id === 'new-leads') {
      return { ...stat, value: detectedCount };
    }

    return stat;
  });
}

function mergeLinkedMeetings(
  currentMeetings: NonNullable<PersuasionProfile['linkedMeetings']>,
  nextMeetings: NonNullable<PersuasionProfile['linkedMeetings']>,
) {
  return [...currentMeetings, ...nextMeetings].filter(
    (meeting, index, meetings) => meetings.findIndex((item) => item.id === meeting.id) === index,
  );
}

function normalizeId(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createAvatar(name: string) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#865cff"/><text x="120" y="132" text-anchor="middle" font-family="Arial" font-size="66" font-weight="700" fill="#fffdff">${initials}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
