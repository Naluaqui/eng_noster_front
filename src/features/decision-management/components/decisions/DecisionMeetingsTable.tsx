import { useState } from 'react';
import { Eye, FilePenLine, Filter, Trash2 } from 'lucide-react';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, MeetingStatus } from '@/features/meetings/types/meeting';
import type { DecisionFilters, DecisionOfferingOption } from '../../types/decision-management';

const statusLabels: Record<MeetingStatus, string> = {
  scheduled: 'Agendada',
  'in-review': 'Em análise',
  decided: 'Decidida',
  analyzed: 'Analisada',
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
  meetings: Meeting[];
  selectedMeetingId: string;
  onOpenMeeting: (meetingId: string) => void;
  filters: DecisionFilters;
  offeringOptions: DecisionOfferingOption[];
  onFiltersChange: (nextFilters: DecisionFilters) => void;
};

export function DecisionMeetingsTable({
  meetings,
  selectedMeetingId,
  onOpenMeeting,
  filters,
  offeringOptions,
  onFiltersChange,
}: DecisionMeetingsTableProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function updateFilter(field: keyof DecisionFilters, value: string) {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  }

  function clearFilters() {
    onFiltersChange({
      startDate: '',
      endDate: '',
      offering: '',
    });
  }

  return (
    <section
      className="decision-meetings-table-card"
      aria-labelledby="decision-meetings-table-title"
    >
      <header>
        <div>
          <span>Reuniões</span>
          <h2 id="decision-meetings-table-title">Lista de reuniões analisadas</h2>
        </div>

        <button
          aria-controls="decision-table-filter-menu"
          aria-expanded={isFilterOpen}
          onClick={() => setIsFilterOpen((current) => !current)}
          type="button"
        >
          <Filter size={15} aria-hidden="true" />
          Filtrar
        </button>
      </header>

      {isFilterOpen ? (
        <div className="decision-table-filter-menu" id="decision-table-filter-menu">
          <label>
            <span>Data inicial</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => updateFilter('startDate', event.target.value)}
            />
          </label>

          <label>
            <span>Data final</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => updateFilter('endDate', event.target.value)}
            />
          </label>

          <label className="decision-table-filter-menu__offering">
            <span>Produtos e Serviços, linhas e segmento</span>
            <select
              value={filters.offering}
              onChange={(event) => updateFilter('offering', event.target.value)}
            >
              <option value="">Portfólio completo TOTVS</option>
              {offeringOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.category}
                </option>
              ))}
            </select>
          </label>

          <button className="decision-table-filter-menu__clear" onClick={clearFilters} type="button">
            Limpar filtros
          </button>
        </div>
      ) : null}

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
              <tr
                className={meeting.id === selectedMeetingId ? 'is-selected' : undefined}
                key={meeting.id}
              >
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
                  <span
                    className="decision-meetings-table-card__status"
                    data-status={meeting.status}
                  >
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
