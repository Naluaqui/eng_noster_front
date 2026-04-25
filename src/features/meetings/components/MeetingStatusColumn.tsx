import type { Meeting, MeetingStatus } from '../types/meeting';
import { MeetingCard } from './MeetingCard';

const statusLabels: Record<MeetingStatus, string> = {
  scheduled: 'Agendadas',
  'in-review': 'Em análise',
  decided: 'Decididas',
};

type MeetingStatusColumnProps = {
  status: MeetingStatus;
  meetings: Meeting[];
};

export function MeetingStatusColumn({ status, meetings }: MeetingStatusColumnProps) {
  return (
    <section className="meeting-status-column" aria-labelledby={`meetings-${status}`}>
      <h2 id={`meetings-${status}`}>{statusLabels[status]}</h2>
      {meetings.map((meeting) => (
        <MeetingCard meeting={meeting} key={meeting.id} />
      ))}
    </section>
  );
}
