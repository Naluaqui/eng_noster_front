import { MeetingDetailsScreen } from '@/features/meetings/screens/MeetingDetailsScreen';

type MeetingDetailsRouteProps = {
  params: Promise<{
    meetingId: string;
  }>;
};

export default async function MeetingDetailsRoute({ params }: MeetingDetailsRouteProps) {
  const { meetingId } = await params;

  return <MeetingDetailsScreen meetingId={meetingId} />;
}
