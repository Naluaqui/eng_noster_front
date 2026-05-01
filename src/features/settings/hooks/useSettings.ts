'use client';

import { useEffect, useState } from 'react';
import { getSettingsSections } from '../repositories/settings.repository';
import type { SettingsSection } from '../types/settings';

export function useSettings() {
  const [sections, setSections] = useState<SettingsSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setError(null);

        const nextSections = await getSettingsSections();

        if (isMounted) {
          setSections(nextSections);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar as configuracoes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    sections,
    isLoading,
    error,
  };
}
