'use client';

import { useEffect, useState } from 'react';
import { getDecisionPersonas } from '../repositories/decision-management.repository';

export function useDecisionPersonas() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDecisionPersonas() {
      try {
        setIsLoading(true);
        setError(null);
        await getDecisionPersonas();
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar as personas.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDecisionPersonas();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading,
    error,
  };
}
