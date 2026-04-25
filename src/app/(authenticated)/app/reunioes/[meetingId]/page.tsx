import { MeetingDetailsPanel } from '@/features/meetings/components/MeetingDetailsPanel';

type MeetingDetailsRouteProps = {
  params: Promise<{
    meetingId: string;
  }>;
};

export default async function MeetingDetailsRoute({ params }: MeetingDetailsRouteProps) {
  const { meetingId } = await params;

  return <MeetingDetailsPanel meetingId={meetingId} />;
}
