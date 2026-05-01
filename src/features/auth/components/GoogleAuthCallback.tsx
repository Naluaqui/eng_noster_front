'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authenticatedRoutes } from '@/shared/constants/routes';
import { useAuth } from '../hooks/useAuth';

export function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeGoogleLogin } = useAuth();
  const handledCode = useRef<string | null>(null);

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

    completeGoogleLogin(code)
      .then(() => {
        router.replace(authenticatedRoutes.meetings);
      })
      .catch(() => {
        router.replace('/landing');
      });
  }, [completeGoogleLogin, router, searchParams]);

  return null;
}
