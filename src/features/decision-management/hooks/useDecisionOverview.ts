'use client';

import { useEffect, useState } from 'react';
import { getDecisionOverview } from '../repositories/decision-management.repository';

export function useDecisionOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDecisionOverview() {
      try {
        setIsLoading(true);
        setError(null);
        await getDecisionOverview();
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar a visao geral.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDecisionOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading,
    error,
  };
}
