'use client';

import { useState, type ReactNode } from 'react';
import { MultiAgentsProvider } from '@/features/multi-agents/context/MultiAgentsContext';
import { AppHeader } from '../components/AppHeader';
import { Sidebar } from '../components/Sidebar';

type AuthenticatedAppLayoutProps = {
  children: ReactNode;
};

export function AuthenticatedAppLayout({ children }: AuthenticatedAppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <MultiAgentsProvider>
      <div className={isSidebarOpen ? 'app-shell' : 'app-shell app-shell--sidebar-collapsed'}>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((currentValue) => !currentValue)}
        />
        <div className="app-content">
          <AppHeader />
          {children}
        </div>
      </div>
    </MultiAgentsProvider>
  );
}
