import { authenticatedRoutes } from '@/shared/constants/routes';
import type { AuthApiResponse, AuthLoginRedirect, AuthProvider, AuthSession } from '../types/auth';

const authStorageKey = 'noster.auth.session';
export const authSessionChangedEvent = 'noster.auth.session.changed';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const googleRedirectUri =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/app';

function isBrowser() {
  return typeof window !== 'undefined';
}

function saveSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  window.dispatchEvent(new Event(authSessionChangedEvent));
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  if (!isBrowser()) {
    return null;
  }

  const storedSession = window.localStorage.getItem(authStorageKey);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(authStorageKey);
    return null;
  }
}

export async function getLoginRedirect(provider: AuthProvider): Promise<AuthLoginRedirect> {
  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleRedirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return {
      provider,
      redirectTo: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    };
  }

  return {
    provider,
    redirectTo: authenticatedRoutes.meetings,
  };
}

export async function loginWithGoogle() {
  return getLoginRedirect('google');
}

export async function completeGoogleLogin(code: string): Promise<AuthSession> {
  const response = await fetch(`${apiUrl}/api/auth/google/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUri: googleRedirectUri,
    }),
  });

  const result = (await response.json()) as AuthApiResponse<AuthSession>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Nao foi possivel fazer login com Google.');
  }

  saveSession(result.data);

  return result.data;
}

export async function logout() {
  if (isBrowser()) {
    window.localStorage.removeItem(authStorageKey);
    window.dispatchEvent(new Event(authSessionChangedEvent));
  }

  return {
    redirectTo: '/',
  };
}
