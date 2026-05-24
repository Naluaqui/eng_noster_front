'use client';

import { useEffect, useState } from 'react';
import { selectedCompanyChangedEvent } from '@/features/settings/repositories/workspace.repository';
import { getPersuasionDashboard, persuasionProfilesChangedEvent } from '../repositories/persuasion.repository';

type PersuasionDashboardData = Awaited<ReturnType<typeof getPersuasionDashboard>>;

export function usePersuasion() {
  const [data, setData] = useState<PersuasionDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPersuasion() {
      try {
        setIsLoading(true);
        setError(null);

        const nextData = await getPersuasionDashboard();

        if (isMounted) {
          setData(nextData);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar persuasao.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPersuasion();
    window.addEventListener(persuasionProfilesChangedEvent, loadPersuasion);
    window.addEventListener(selectedCompanyChangedEvent, loadPersuasion);

    return () => {
      isMounted = false;
      window.removeEventListener(persuasionProfilesChangedEvent, loadPersuasion);
      window.removeEventListener(selectedCompanyChangedEvent, loadPersuasion);
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
