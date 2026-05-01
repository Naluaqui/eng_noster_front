'use client';

import { useEffect, useState } from 'react';
import { getMeetingById } from '../repositories/meetings.repository';
import type { Meeting } from '../types/meeting';

export function useMeetingDetails(meetingId: string) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeeting() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMeetingById(meetingId);

        if (isMounted) {
          setMeeting(data);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar a reuniao.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMeeting();

    return () => {
      isMounted = false;
    };
  }, [meetingId]);

  return {
    meeting,
    isLoading,
    error,
  };
}
