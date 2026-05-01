import type { CreateMeetingInput, Meeting, MeetingStatus } from '../types/meeting';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Nao foi possivel carregar os dados.');
  }

  return result.data;
}

export async function getMeetings() {
  const response = await fetch(`${apiUrl}/api/meetings`);

  return parseApiResponse<Meeting[]>(response);
}

export async function getMeetingById(meetingId: string) {
  const response = await fetch(`${apiUrl}/api/meetings/${meetingId}`);

  if (response.status === 404) {
    return null;
  }

  return parseApiResponse<Meeting>(response);
}

export async function updateMeetingStatus(meetingId: string, status: MeetingStatus) {
  const response = await fetch(`${apiUrl}/api/meetings/${meetingId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return parseApiResponse<Meeting>(response);
}

export async function createMeeting(input: CreateMeetingInput) {
  const response = await fetch(`${apiUrl}/api/meetings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<Meeting>(response);
}
