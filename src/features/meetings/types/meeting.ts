import type { AiAnalysis } from '@/features/multi-agents/types/multiAgent';

export type MeetingStatus = 'scheduled' | 'in-review' | 'decided' | 'analyzed';

export type MeetingStatusFilter = MeetingStatus | 'all';
export type MeetingPeriodFilter = 'all' | 'today' | 'upcoming' | 'past' | 'next-7' | 'next-30';
export type MeetingSignalFilter = 'all' | 'none' | 'with-signals' | 'high-signals';
export type MeetingSort = 'stage' | 'date-asc' | 'date-desc' | 'signals-desc' | 'signals-asc' | 'title';

export type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  status: MeetingStatus;
  summary: string;
  owner: string;
  tags: string[];
  signalCount: number;
  product?: string;
  description?: string;
  transcription?: string;
  notes?: string;
  analysis?: AiAnalysis;
};

export type CreateMeetingInput = {
  title: string;
  date: string;
  time: string;
  participants: string[];
  product?: string;
  description?: string;
  transcription?: string;
  notes?: string;
};

export type UpdateMeetingInput = CreateMeetingInput;

export type MeetingFilters = {
  search: string;
  status: MeetingStatusFilter;
  product: string;
  participant: string;
  period: MeetingPeriodFilter;
  signals: MeetingSignalFilter;
  sortBy: MeetingSort;
};

export type MeetingOption = {
  label: string;
  value: string;
};

export type MeetingCatalog = {
  products: MeetingOption[];
  people: MeetingOption[];
};
