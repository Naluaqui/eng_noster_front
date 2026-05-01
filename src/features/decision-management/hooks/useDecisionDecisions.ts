'use client';

import { useEffect, useState } from 'react';
import { getDecisionDecisions } from '../repositories/decision-management.repository';

type DecisionDecisionsData = Awaited<ReturnType<typeof getDecisionDecisions>>;

export function useDecisionDecisions() {
  const [data, setData] = useState<DecisionDecisionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDecisionDecisions() {
      try {
        setIsLoading(true);
        setError(null);

        const nextData = await getDecisionDecisions();

        if (isMounted) {
          setData(nextData);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar as decisoes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDecisionDecisions();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
