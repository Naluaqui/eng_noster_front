'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useMultiAgents } from '../hooks/useMultiAgents';

type MultiAgentsContextValue = ReturnType<typeof useMultiAgents>;

const MultiAgentsContext = createContext<MultiAgentsContextValue | null>(null);

export function MultiAgentsProvider({ children }: { children: ReactNode }) {
  const value = useMultiAgents();

  return <MultiAgentsContext.Provider value={value}>{children}</MultiAgentsContext.Provider>;
}

export function useMultiAgentsContext() {
  const context = useContext(MultiAgentsContext);

  if (!context) {
    throw new Error('useMultiAgentsContext deve ser usado dentro de MultiAgentsProvider.');
  }

  return context;
}
