'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  authSessionChangedEvent,
  completeGoogleLogin as completeGoogleLoginRepository,
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

    async function loadAuthState(showLoading = true) {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

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

  useEffect(() => {
    async function syncSession() {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
    }

    window.addEventListener(authSessionChangedEvent, syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener(authSessionChangedEvent, syncSession);
      window.removeEventListener('storage', syncSession);
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

  const completeGoogleLogin = useCallback(async (code: string) => {
    const authenticatedSession = await completeGoogleLoginRepository(code);
    setSession(authenticatedSession);
    return authenticatedSession;
  }, []);

  return {
    session,
    user: session?.user ?? null,
    googleLoginHref,
    isAuthenticated: Boolean(session),
    isLoading,
    error,
    loginWithGoogle,
    completeGoogleLogin,
    logout,
  };
}
