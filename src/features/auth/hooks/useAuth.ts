'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentSession,
  loginWithGoogle as loginWithGoogleRepository,
  logout as logoutRepository,
} from '../repositories/auth.repository';
import type { AuthSession } from '../types/auth';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [googleLoginHref, setGoogleLoginHref] = useState('/app/reunioes');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthState() {
      try {
        setIsLoading(true);
        setError(null);

        const [currentSession, googleRedirect] = await Promise.all([
          getCurrentSession(),
          loginWithGoogleRepository(),
        ]);

        if (isMounted) {
          setSession(currentSession);
          setGoogleLoginHref(googleRedirect.redirectTo);
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar a autenticacao.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const redirect = await loginWithGoogleRepository();
    return redirect.redirectTo;
  }, []);

  const logout = useCallback(async () => {
    const redirect = await logoutRepository();
    setSession(null);
    return redirect.redirectTo;
  }, []);

  return {
    session,
    user: session?.user ?? null,
    googleLoginHref,
    isAuthenticated: Boolean(session),
    isLoading,
    error,
    loginWithGoogle,
    logout,
  };
}
