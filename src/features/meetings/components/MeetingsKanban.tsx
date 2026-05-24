'use client';

import { useMemo, useState } from 'react';
import type {
  CreateMeetingInput,
  Meeting,
  MeetingCatalog,
  MeetingFilters,
  MeetingStatus,
  UpdateMeetingInput,
} from '../types/meeting';
import { CreateMeetingButton } from './CreateMeetingButton';
import { MeetingsFilterBar } from './MeetingsFilterBar';
import { MeetingStatusColumn } from './MeetingStatusColumn';

const statuses: MeetingStatus[] = ['scheduled', 'in-review', 'analyzed', 'decided'];
const statusOrder: Record<MeetingStatus, number> = {
  scheduled: 0,
  'in-review': 1,
  analyzed: 2,
  decided: 3,
};

const defaultFilters: MeetingFilters = {
  search: '',
  status: 'all',
  product: 'all',
  participant: 'all',
  period: 'all',
  signals: 'all',
  sortBy: 'stage',
};

type MeetingsKanbanProps = {
  catalog: MeetingCatalog;
  meetings: Meeting[];
  movingMeetingId: string | null;
  onCreateMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
  onDeleteMeeting: (meetingId: string) => Promise<Meeting>;
  onMoveMeeting: (meetingId: string, status: MeetingStatus) => void;
  onUpdateMeeting: (meetingId: string, input: UpdateMeetingInput) => Promise<Meeting>;
};

export function MeetingsKanban({
  catalog,
  meetings,
  movingMeetingId,
  onCreateMeeting,
  onDeleteMeeting,
  onMoveMeeting,
  onUpdateMeeting,
}: MeetingsKanbanProps) {
  const [filters, setFilters] = useState<MeetingFilters>(defaultFilters);
  const totalSignals = meetings.reduce((total, meeting) => total + meeting.signalCount, 0);

  const productOptions = useMemo(() => {
    const productNames: string[] = [];

    meetings.forEach((meeting) => {
      if (meeting.product) {
        productNames.push(meeting.product);
      }

      productNames.push(...meeting.tags);
    });

    return toFilterOptions(productNames);
  }, [meetings]);

  const participantOptions = useMemo(() => {
    const participantNames: string[] = [];

    meetings.forEach((meeting) => {
      participantNames.push(meeting.owner, ...meeting.participants);
    });

    return toFilterOptions(participantNames);
  }, [meetings]);

  const filteredMeetings = useMemo(
    () => sortMeetings(meetings.filter((meeting) => matchesFilters(meeting, filters)), filters.sortBy),
    [filters, meetings],
  );

  const statusesToShow =
    filters.status === 'all' ? statuses : statuses.filter((status) => status === filters.status);

  const hasActiveFilters =
    filters.search.trim() !== defaultFilters.search ||
    filters.status !== defaultFilters.status ||
    filters.product !== defaultFilters.product ||
    filters.participant !== defaultFilters.participant ||
    filters.period !== defaultFilters.period ||
    filters.signals !== defaultFilters.signals ||
    filters.sortBy !== defaultFilters.sortBy;

  function updateFilter<Field extends keyof MeetingFilters>(
    field: Field,
    value: MeetingFilters[Field],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  return (
    <main className="feature-page meetings-page">
      <header className="feature-page__header meetings-page__header">
        <div>
          <span>Reuniões</span>
          <h2>Kanban de reuniões</h2>
          <p>Organize conversas, sinais e decisões em uma visão operacional limpa.</p>
        </div>
        <CreateMeetingButton catalog={catalog} onCreateMeeting={onCreateMeeting} />
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
        <article>
          <span>Analisadas</span>
          <strong>{meetings.filter((meeting) => meeting.status === 'analyzed').length}</strong>
        </article>
      </section>

      <MeetingsFilterBar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        participantOptions={participantOptions}
        productOptions={productOptions}
        onChange={updateFilter}
        onReset={() => setFilters(defaultFilters)}
      />

      <div className="kanban-board">
        {statusesToShow.map((status) => (
          <MeetingStatusColumn
            meetings={filteredMeetings.filter((meeting) => meeting.status === status)}
            catalog={catalog}
            movingMeetingId={movingMeetingId}
            onMoveMeeting={onMoveMeeting}
            onDeleteMeeting={onDeleteMeeting}
            onUpdateMeeting={onUpdateMeeting}
            status={status}
            key={status}
          />
        ))}
      </div>
    </main>
  );
}

function normalizeValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function toFilterOptions(values: string[]) {
  const options = new Map<string, string>();

  values.forEach((value) => {
    const label = value.trim();
    const normalizedValue = normalizeValue(label);

    if (!label || options.has(normalizedValue)) {
      return;
    }

    options.set(normalizedValue, label);
  });

  return Array.from(options, ([value, label]) => ({
    label,
    value,
  })).sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'));
}

function matchesFilters(meeting: Meeting, filters: MeetingFilters) {
  const search = normalizeValue(filters.search);
  const searchableText = normalizeValue(
    [
      meeting.title,
      meeting.summary,
      meeting.owner,
      meeting.product,
      meeting.description,
      meeting.notes,
      ...meeting.participants,
      ...meeting.tags,
    ]
      .filter(Boolean)
      .join(' '),
  );

  if (search && !searchableText.includes(search)) {
    return false;
  }

  if (filters.status !== 'all' && meeting.status !== filters.status) {
    return false;
  }

  if (filters.product !== 'all') {
    const meetingProducts = [meeting.product, ...meeting.tags].filter(Boolean).map((item) =>
      normalizeValue(String(item)),
    );

    if (!meetingProducts.includes(filters.product)) {
      return false;
    }
  }

  if (filters.participant !== 'all') {
    const people = [meeting.owner, ...meeting.participants].map(normalizeValue);

    if (!people.includes(filters.participant)) {
      return false;
    }
  }

  if (!matchesPeriod(meeting.date, filters.period)) {
    return false;
  }

  if (filters.signals === 'none' && meeting.signalCount !== 0) {
    return false;
  }

  if (filters.signals === 'with-signals' && meeting.signalCount === 0) {
    return false;
  }

  if (filters.signals === 'high-signals' && meeting.signalCount < 10) {
    return false;
  }

  return true;
}

function matchesPeriod(date: string, period: MeetingFilters['period']) {
  if (period === 'all') {
    return true;
  }

  const meetingDate = toStartOfDay(date);
  const today = toStartOfToday();
  const next7Days = addDays(today, 7);
  const next30Days = addDays(today, 30);

  if (period === 'today') {
    return meetingDate.getTime() === today.getTime();
  }

  if (period === 'upcoming') {
    return meetingDate.getTime() >= today.getTime();
  }

  if (period === 'past') {
    return meetingDate.getTime() < today.getTime();
  }

  if (period === 'next-7') {
    return meetingDate >= today && meetingDate <= next7Days;
  }

  return meetingDate >= today && meetingDate <= next30Days;
}

function sortMeetings(meetings: Meeting[], sortBy: MeetingFilters['sortBy']) {
  return [...meetings].sort((first, second) => {
    if (sortBy === 'title') {
      return first.title.localeCompare(second.title, 'pt-BR');
    }

    if (sortBy === 'signals-desc') {
      return second.signalCount - first.signalCount;
    }

    if (sortBy === 'signals-asc') {
      return first.signalCount - second.signalCount;
    }

    if (sortBy === 'date-desc') {
      return getDateTime(second).getTime() - getDateTime(first).getTime();
    }

    if (sortBy === 'stage') {
      return statusOrder[first.status] - statusOrder[second.status] || getDateTime(first).getTime() - getDateTime(second).getTime();
    }

    return getDateTime(first).getTime() - getDateTime(second).getTime();
  });
}

function getDateTime(meeting: Meeting) {
  return new Date(`${meeting.date}T${meeting.time}:00`);
}

function toStartOfDay(date: string) {
  return new Date(`${date}T00:00:00`);
}

function toStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}
