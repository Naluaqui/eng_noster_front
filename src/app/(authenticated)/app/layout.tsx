import type { ReactNode } from 'react';
import { AuthenticatedAppLayout } from '@/features/authenticated-app/layouts/AuthenticatedAppLayout';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>;
}
