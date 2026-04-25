import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { meetings } from '../data/meetings';

type MeetingDetailsPanelProps = {
  meetingId: string;
};

export function MeetingDetailsPanel({ meetingId }: MeetingDetailsPanelProps) {
  const meeting = meetings.find((item) => item.id === meetingId);

  if (!meeting) {
    return (
      <main className="feature-page">
        <EmptyState title="Reunião não encontrada" description="Confira o identificador da reunião." />
      </main>
    );
  }

  return (
    <main className="feature-page">
      <header className="feature-page__header">
        <div>
          <span>Detalhes da reunião</span>
          <h2>{meeting.title}</h2>
        </div>
      </header>
      <section className="details-panel">
        <p>{meeting.participants.join(', ')}</p>
      </section>
    </main>
  );
}
