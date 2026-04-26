import { Eye, FilePenLine, Filter, Trash2 } from 'lucide-react';
import { formatShortDate } from '@/shared/lib/formatters';
import { meetings } from '@/features/meetings/data/meetings';
import type { MeetingStatus } from '@/features/meetings/types/meeting';

const statusLabels: Record<MeetingStatus, string> = {
  scheduled: 'Agendada',
  'in-review': 'Em análise',
  decided: 'Decidida',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type DecisionMeetingsTableProps = {
  selectedMeetingId: string;
  onOpenMeeting: (meetingId: string) => void;
};

export function DecisionMeetingsTable({ selectedMeetingId, onOpenMeeting }: DecisionMeetingsTableProps) {
  return (
    <section className="decision-meetings-table-card" aria-labelledby="decision-meetings-table-title">
      <header>
        <div>
          <span>Reuniões</span>
          <h2 id="decision-meetings-table-title">Lista de reuniões analisadas</h2>
        </div>

        <button type="button">
          <Filter size={15} aria-hidden="true" />
          Filtrar
        </button>
      </header>

      <div className="decision-meetings-table-card__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Foto</th>
              <th scope="col">Reunião</th>
              <th scope="col">Responsável</th>
              <th scope="col">Data</th>
              <th scope="col">Status</th>
              <th scope="col">Sinais</th>
              <th scope="col">Operação</th>
              <th scope="col">Ação</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr className={meeting.id === selectedMeetingId ? 'is-selected' : undefined} key={meeting.id}>
                <td>
                  <span className="decision-meetings-table-card__avatar" aria-hidden="true">
                    {getInitials(meeting.owner)}
                  </span>
                </td>
                <td>
                  <strong>{meeting.title}</strong>
                  <small>{meeting.tags.join(' / ')}</small>
                </td>
                <td>{meeting.owner}</td>
                <td>
                  <time dateTime={meeting.date}>{formatShortDate(meeting.date)}</time>
                </td>
                <td>
                  <span className="decision-meetings-table-card__status" data-status={meeting.status}>
                    {statusLabels[meeting.status]}
                  </span>
                </td>
                <td>{meeting.signalCount} sinais</td>
                <td>
                  <div className="decision-meetings-table-card__operations">
                    <button type="button" aria-label={`Editar ${meeting.title}`}>
                      <FilePenLine size={15} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label={`Visualizar ${meeting.title}`}>
                      <Eye size={15} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label={`Excluir ${meeting.title}`}>
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className="decision-meetings-table-card__open"
                    type="button"
                    aria-controls="decision-impact-flow"
                    aria-pressed={meeting.id === selectedMeetingId}
                    onClick={() => onOpenMeeting(meeting.id)}
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
