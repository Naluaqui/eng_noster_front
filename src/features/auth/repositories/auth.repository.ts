import { authenticatedRoutes } from '@/shared/constants/routes';
import type { AuthLoginRedirect, AuthProvider, AuthSession } from '../types/auth';

export async function getCurrentSession(): Promise<AuthSession | null> {
  return null;
}

export async function getLoginRedirect(provider: AuthProvider): Promise<AuthLoginRedirect> {
  return {
    provider,
    redirectTo: authenticatedRoutes.meetings,
  };
}

export async function loginWithGoogle() {
  return getLoginRedirect('google');
}

export async function logout() {
  return {
    redirectTo: '/',
  };
}
