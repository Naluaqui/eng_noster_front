import Link from 'next/link';
import { CalendarDays, Signal, UsersRound } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { authenticatedRoutes } from '@/shared/constants/routes';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting } from '../types/meeting';

type MeetingCardProps = {
  meeting: Meeting;
};

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Card className="meeting-card" role="listitem">
      <header>
        <span className="meeting-card__owner">{meeting.owner}</span>
        <Link href={`${authenticatedRoutes.meetings}/${meeting.id}`}>Editar</Link>
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
          <time dateTime={meeting.date}>{formatShortDate(meeting.date)}</time>
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
