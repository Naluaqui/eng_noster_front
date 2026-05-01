import { Suspense } from 'react';
import { GoogleAuthCallback } from '@/features/auth/components/GoogleAuthCallback';
import { LoadingState } from '@/shared/components/feedback/LoadingState';

export default function AppIndexPage() {
  return (
    <Suspense fallback={<LoadingState label="Conectando sua conta Google..." />}>
      <GoogleAuthCallback />
    </Suspense>
  );
}
