import { meetings } from '../data/meetings';
import type { MeetingStatus } from '../types/meeting';
import { CreateMeetingButton } from './CreateMeetingButton';
import { MeetingStatusColumn } from './MeetingStatusColumn';

const statuses: MeetingStatus[] = ['scheduled', 'in-review', 'decided'];

export function MeetingsKanban() {
  return (
    <main className="feature-page">
      <header className="feature-page__header">
        <div>
          <span>Reuniões</span>
          <h2>Kanban de reuniões</h2>
        </div>
        <CreateMeetingButton />
      </header>

      <div className="kanban-board">
        {statuses.map((status) => (
          <MeetingStatusColumn
            meetings={meetings.filter((meeting) => meeting.status === status)}
            status={status}
            key={status}
          />
        ))}
      </div>
    </main>
  );
}
