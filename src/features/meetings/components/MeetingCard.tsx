import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting } from '../types/meeting';

type MeetingCardProps = {
  meeting: Meeting;
};

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Card className="meeting-card">
      <h3>{meeting.title}</h3>
      <time dateTime={meeting.date}>{formatShortDate(meeting.date)}</time>
      <p>{meeting.participants.join(', ')}</p>
    </Card>
  );
}
