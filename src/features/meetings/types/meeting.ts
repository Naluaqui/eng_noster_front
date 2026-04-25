export type MeetingStatus = 'scheduled' | 'in-review' | 'decided';

export type Meeting = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  status: MeetingStatus;
};
