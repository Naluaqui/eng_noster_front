import type { DragEvent } from 'react';
import { CalendarDays, Signal, UsersRound } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, UpdateMeetingInput } from '../types/meeting';
import { EditMeetingButton } from './EditMeetingButton';

type MeetingCardProps = {
  meeting: Meeting;
  isMoving?: boolean;
  onUpdateMeeting: (meetingId: string, input: UpdateMeetingInput) => Promise<Meeting>;
};

export function MeetingCard({ meeting, isMoving = false, onUpdateMeeting }: MeetingCardProps) {
  function handleDragStart(event: DragEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea')) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-noster-meeting-id', meeting.id);
    event.dataTransfer.setData('text/plain', meeting.id);
  }

  return (
    <Card
      className={`meeting-card${isMoving ? ' meeting-card--moving' : ''}`}
      draggable
      onDragStart={handleDragStart}
      role="listitem"
    >
      <header>
        <span className="meeting-card__owner">{meeting.owner}</span>
        <EditMeetingButton meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
      </header>

      <div className="meeting-card__body">
        <h3>{meeting.title}</h3>
        <p>{meeting.summary}</p>
      </div>

      <div className="meeting-card__tags" aria-label="Etiquetas da reunião">
        {meeting.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <footer>
        <span>
          <CalendarDays size={15} aria-hidden="true" />
          <time dateTime={`${meeting.date}T${meeting.time}`}>
            {formatShortDate(meeting.date)} {meeting.time}
          </time>
        </span>
        <span>
          <UsersRound size={15} aria-hidden="true" />
          {meeting.participants.length}
        </span>
        <span>
          <Signal size={15} aria-hidden="true" />
          {meeting.signalCount}
        </span>
      </footer>
    </Card>
  );
}
