import { useState, type DragEvent } from 'react';
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
  movingMeetingId: string | null;
  onMoveMeeting: (meetingId: string, status: MeetingStatus) => void;
};

export function MeetingStatusColumn({
  status,
  meetings,
  movingMeetingId,
  onMoveMeeting,
}: MeetingStatusColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragOver(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);

    const meetingId = event.dataTransfer.getData('application/x-noster-meeting-id');

    if (meetingId) {
      onMoveMeeting(meetingId, status);
    }
  }

  return (
    <section
      className={`meeting-status-column${isDragOver ? ' meeting-status-column--drag-over' : ''}`}
      data-status={status}
      aria-labelledby={`meetings-${status}`}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <header>
        <h2 id={`meetings-${status}`}>{statusLabels[status]}</h2>
        <span aria-label={`${meetings.length} reuniões`}>{meetings.length}</span>
      </header>

      {meetings.length > 0 ? (
        <div className="meeting-status-column__list" role="list">
          {meetings.map((meeting) => (
            <MeetingCard
              isMoving={movingMeetingId === meeting.id}
              meeting={meeting}
              key={meeting.id}
            />
          ))}
        </div>
      ) : (
        <p className="meeting-status-column__empty">Nenhuma reunião neste status.</p>
      )}
    </section>
  );
}
