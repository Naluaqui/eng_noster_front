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
    <section
      className="meeting-status-column"
      data-status={status}
      aria-labelledby={`meetings-${status}`}
    >
      <header>
        <h2 id={`meetings-${status}`}>{statusLabels[status]}</h2>
        <span aria-label={`${meetings.length} reuniões`}>{meetings.length}</span>
      </header>

      {meetings.length > 0 ? (
        <div className="meeting-status-column__list" role="list">
          {meetings.map((meeting) => (
            <MeetingCard meeting={meeting} key={meeting.id} />
          ))}
        </div>
      ) : (
        <p className="meeting-status-column__empty">Nenhuma reunião neste status.</p>
      )}
    </section>
  );
}
