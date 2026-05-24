'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authenticatedRoutes } from '@/shared/constants/routes';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { useAuth } from '../hooks/useAuth';

export function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeGoogleLogin } = useAuth();
  const handledCode = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.replace(authenticatedRoutes.meetings);
      return;
    }

    if (handledCode.current === code) {
      return;
    }

    handledCode.current = code;
    setErrorMessage(null);

    completeGoogleLogin(code)
      .then(() => {
        router.replace(authenticatedRoutes.meetings);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Nao foi possivel concluir o login Google.';

        if (process.env.NODE_ENV === 'development') {
          console.error('[auth] Falha ao concluir login Google.', { message });
        }

        setErrorMessage(message);
      });
  }, [completeGoogleLogin, router, searchParams]);

  if (errorMessage) {
    return <EmptyState title="Falha ao concluir login Google" description={errorMessage} />;
  }

  return <LoadingState label="Concluindo login com Google..." />;
}
