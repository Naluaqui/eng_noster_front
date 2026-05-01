import type { CreateMeetingInput, Meeting, MeetingStatus } from '../types/meeting';
import { CreateMeetingButton } from './CreateMeetingButton';
import { MeetingsFilterBar } from './MeetingsFilterBar';
import { MeetingStatusColumn } from './MeetingStatusColumn';

const statuses: MeetingStatus[] = ['scheduled', 'in-review', 'decided'];

type MeetingsKanbanProps = {
  meetings: Meeting[];
  movingMeetingId: string | null;
  onCreateMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
  onMoveMeeting: (meetingId: string, status: MeetingStatus) => void;
};

export function MeetingsKanban({
  meetings,
  movingMeetingId,
  onCreateMeeting,
  onMoveMeeting,
}: MeetingsKanbanProps) {
  const totalSignals = meetings.reduce((total, meeting) => total + meeting.signalCount, 0);

  return (
    <main className="feature-page meetings-page">
      <header className="feature-page__header meetings-page__header">
        <div>
          <span>Reuniões</span>
          <h2>Kanban de reuniões</h2>
          <p>Organize conversas, sinais e decisões em uma visão operacional limpa.</p>
        </div>
        <CreateMeetingButton onCreateMeeting={onCreateMeeting} />
      </header>

      <section className="meetings-overview" aria-label="Resumo de reuniões">
        <article>
          <span>Reuniões</span>
          <strong>{meetings.length}</strong>
        </article>
        <article>
          <span>Sinais capturados</span>
          <strong>{totalSignals}</strong>
        </article>
        <article>
          <span>Em análise</span>
          <strong>{meetings.filter((meeting) => meeting.status === 'in-review').length}</strong>
        </article>
      </section>

      <MeetingsFilterBar />

      <div className="kanban-board">
        {statuses.map((status) => (
          <MeetingStatusColumn
            meetings={meetings.filter((meeting) => meeting.status === status)}
            movingMeetingId={movingMeetingId}
            onMoveMeeting={onMoveMeeting}
            status={status}
            key={status}
          />
        ))}
      </div>
    </main>
  );
}
