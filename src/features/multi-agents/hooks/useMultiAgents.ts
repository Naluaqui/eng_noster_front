'use client';

import { useEffect, useState } from 'react';
import { getMultiAgentWorkspace } from '../repositories/multi-agents.repository';

type MultiAgentWorkspaceData = Awaited<ReturnType<typeof getMultiAgentWorkspace>>;

export function useMultiAgents() {
  const [data, setData] = useState<MultiAgentWorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMultiAgents() {
      try {
        setIsLoading(true);
        setError(null);

        const nextData = await getMultiAgentWorkspace();

        if (isMounted) {
          setData(nextData);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar os agentes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMultiAgents();

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
