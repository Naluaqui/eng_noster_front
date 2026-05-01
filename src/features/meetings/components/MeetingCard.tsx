import { useState, type DragEvent } from 'react';
import { CalendarDays, Signal, Trash2, UsersRound } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/feedback/ConfirmDialog';
import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, MeetingCatalog, UpdateMeetingInput } from '../types/meeting';
import { EditMeetingButton } from './EditMeetingButton';

type MeetingCardProps = {
  meeting: Meeting;
  catalog: MeetingCatalog;
  isMoving?: boolean;
  onDeleteMeeting: (meetingId: string) => Promise<Meeting>;
  onUpdateMeeting: (meetingId: string, input: UpdateMeetingInput) => Promise<Meeting>;
};

export function MeetingCard({
  meeting,
  catalog,
  isMoving = false,
  onDeleteMeeting,
  onUpdateMeeting,
}: MeetingCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDragStart(event: DragEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea')) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-noster-meeting-id', meeting.id);
    event.dataTransfer.setData('text/plain', meeting.id);
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await onDeleteMeeting(meeting.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card
        className={`meeting-card${isMoving ? ' meeting-card--moving' : ''}`}
        draggable
        onDragStart={handleDragStart}
        role="listitem"
      >
        <header>
          <span className="meeting-card__owner">{meeting.owner}</span>
          <div className="meeting-card__actions">
            <EditMeetingButton catalog={catalog} meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
            <button
              aria-label={`Excluir ${meeting.title}`}
              className="meeting-card__delete"
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="meeting-card__body">
          <h3>{meeting.title}</h3>
          <p>{meeting.summary}</p>
        </div>

        <div className="meeting-card__tags" aria-label="Etiquetas da reuniao">
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

      <ConfirmDialog
        description={`A reuniao "${meeting.title}" sera excluida deste workspace.`}
        isOpen={isDeleteDialogOpen}
        isSubmitting={isDeleting}
        title="Excluir reuniao?"
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
