export type PersuasionSocial = 'Instagram' | 'Facebook' | 'X' | 'LinkedIn' | 'Telegram';

export type PersuasionProfile = {
  id: string;
  name: string;
  role: string;
  registeredAt: string;
  location: string;
  industry: string;
  email: string;
  phone: string;
  avatar: string;
  source?: 'mock' | 'analysis';
  linkedMeetings?: Array<{
    id: string;
    title: string;
  }>;
};

export type PersuasionTrack = {
  id: string;
  title: string;
  description: string;
  lessons: string;
  status: string;
  tone: string;
};

export type PersuasionSidebarStat = {
  id: string;
  label: string;
  value: number;
  tone: string;
};

export type PersuasionWorklistItem = {
  id: string;
  profileId: string;
  name: string;
  role: string;
  status: string;
  priority: string;
  channel: 'document' | 'phone' | 'email';
  avatar: string;
};
