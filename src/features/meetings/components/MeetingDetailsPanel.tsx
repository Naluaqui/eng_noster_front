import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, MeetingStatus } from '../types/meeting';

const statusLabels: Record<MeetingStatus, string> = {
  scheduled: 'Agendada',
  'in-review': 'Em análise',
  decided: 'Decidida',
  analyzed: 'Analisada',
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
            <time dateTime={`${meeting.date}T${meeting.time}`}>
              {formatShortDate(meeting.date)} {meeting.time}
            </time>
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

        {meeting.product ? (
          <Card className="meeting-details__content">
            <h3>Produto, serviço ou linha</h3>
            <p>{meeting.product}</p>
          </Card>
        ) : null}

        {meeting.description ? (
          <Card className="meeting-details__content">
            <h3>Descrição</h3>
            <p>{meeting.description}</p>
          </Card>
        ) : null}

        {meeting.transcription ? (
          <Card className="meeting-details__content">
            <h3>Transcrição</h3>
            <p>{meeting.transcription}</p>
          </Card>
        ) : null}

        {meeting.notes ? (
          <Card className="meeting-details__content">
            <h3>Anotações</h3>
            <p>{meeting.notes}</p>
          </Card>
        ) : null}

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
