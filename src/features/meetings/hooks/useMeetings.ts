'use client';

import { useEffect, useState } from 'react';
import { getMeetings } from '../repositories/meetings.repository';
import type { Meeting } from '../types/meeting';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return {
    meetings,
    isLoading,
    error,
  };
}
