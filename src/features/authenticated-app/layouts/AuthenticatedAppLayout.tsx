import type { ReactNode } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Sidebar } from '../components/Sidebar';

type AuthenticatedAppLayoutProps = {
  children: ReactNode;
};

export function AuthenticatedAppLayout({ children }: AuthenticatedAppLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <AppHeader />
        {children}
      </div>
    </div>
  );
}
