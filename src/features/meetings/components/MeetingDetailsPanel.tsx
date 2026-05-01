import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, MeetingStatus } from '../types/meeting';

const statusLabels: Record<MeetingStatus, string> = {
  scheduled: 'Agendada',
  'in-review': 'Em análise',
  decided: 'Decidida',
};

type MeetingDetailsPanelProps = {
  meeting: Meeting | null;
};

export function MeetingDetailsPanel({ meeting }: MeetingDetailsPanelProps) {
  if (!meeting) {
    return (
      <main className="feature-page">
        <EmptyState
          title="Reunião não encontrada"
          description="Confira o identificador da reunião."
        />
      </main>
    );
  }

  return (
    <main className="feature-page meeting-details-page">
      <header className="feature-page__header">
        <div>
          <span>Detalhes da reunião</span>
          <h2>{meeting.title}</h2>
          <p>{meeting.summary}</p>
        </div>
      </header>

      <section className="meeting-details" aria-label="Informações da reunião">
        <Card className="meeting-details__summary">
          <span>Status</span>
          <strong>{statusLabels[meeting.status]}</strong>
        </Card>

        <Card className="meeting-details__summary">
          <span>Data</span>
          <strong>
            <time dateTime={meeting.date}>{formatShortDate(meeting.date)}</time>
          </strong>
        </Card>

        <Card className="meeting-details__summary">
          <span>Sinais capturados</span>
          <strong>{meeting.signalCount}</strong>
        </Card>

        <Card className="meeting-details__content">
          <h3>Participantes</h3>
          <ul>
            {meeting.participants.map((participant) => (
              <li key={participant}>{participant}</li>
            ))}
          </ul>
        </Card>

        <Card className="meeting-details__content">
          <h3>Etiquetas</h3>
          <div className="meeting-details__tags" aria-label="Etiquetas da reunião">
            {meeting.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
