import { meetings } from '../mocks/meetings.mock';

export async function getMeetings() {
  return meetings;
}

export async function getMeetingById(meetingId: string) {
  return meetings.find((meeting) => meeting.id === meetingId) ?? null;
}
