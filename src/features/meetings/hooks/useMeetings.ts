'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getMeetings,
  updateMeetingStatus as updateMeetingStatusRepository,
} from '../repositories/meetings.repository';
import type { Meeting, MeetingStatus } from '../types/meeting';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movingMeetingId, setMovingMeetingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetings() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMeetings();

        if (isMounted) {
          setMeetings(data);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar as reunioes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMeetings();

    return () => {
      isMounted = false;
    };
  }, []);

  const moveMeeting = useCallback(
    async (meetingId: string, status: MeetingStatus) => {
      const currentMeeting = meetings.find((meeting) => meeting.id === meetingId);

      if (!currentMeeting || currentMeeting.status === status) {
        return;
      }

      const previousMeetings = meetings;

      setMovingMeetingId(meetingId);
      setError(null);
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, status } : meeting,
        ),
      );

      try {
        const updatedMeeting = await updateMeetingStatusRepository(meetingId, status);

        setMeetings((currentMeetings) =>
          currentMeetings.map((meeting) =>
            meeting.id === updatedMeeting.id ? updatedMeeting : meeting,
          ),
        );
      } catch {
        setMeetings(previousMeetings);
        setError('Nao foi possivel mover a reuniao.');
      } finally {
        setMovingMeetingId(null);
      }
    },
    [meetings],
  );

  return {
    meetings,
    isLoading,
    movingMeetingId,
    error,
    moveMeeting,
  };
}
