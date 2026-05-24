import { authenticatedRoutes } from '@/shared/constants/routes';
import type { AuthApiResponse, AuthLoginRedirect, AuthProvider, AuthSession } from '../types/auth';

const authStorageKey = 'noster.auth.session';
export const authSessionChangedEvent = 'noster.auth.session.changed';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3334';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const googleRedirectUri =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/app';
const isDevelopment = process.env.NODE_ENV === 'development';

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
  const loginCompletionUrl = `${apiUrl}/api/auth/google/code`;
  let response: Response;

  if (isDevelopment) {
    console.info('[auth] Finalizando login Google.', { url: loginCompletionUrl });
  }

  try {
    response = await fetch(loginCompletionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirectUri: googleRedirectUri,
      }),
    });
  } catch (error) {
    if (isDevelopment) {
      console.error('[auth] Falha ao acessar a API durante o login.', {
        url: loginCompletionUrl,
        error: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }

    throw new Error(
      `Nao foi possivel acessar a API NOSTER em ${loginCompletionUrl}. Verifique se o backend esta disponivel.`,
      { cause: error },
    );
  }

  if (isDevelopment) {
    console.info('[auth] Resposta da conclusao do login recebida.', {
      url: loginCompletionUrl,
      status: response.status,
    });
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.toLowerCase().includes('application/json')) {
    if (isDevelopment) {
      console.error('[auth] Resposta nao JSON ao concluir login.', {
        url: loginCompletionUrl,
        status: response.status,
        contentType: contentType || 'nao informado',
      });
    }

    throw new Error(
      `Resposta invalida da API ao concluir login (HTTP ${response.status} em ${loginCompletionUrl}). Esperado JSON, recebido ${contentType || 'tipo nao informado'}.`,
    );
  }

  let result: AuthApiResponse<AuthSession>;

  try {
    result = (await response.json()) as AuthApiResponse<AuthSession>;
  } catch (error) {
    if (isDevelopment) {
      console.error('[auth] Erro ao interpretar JSON da conclusao do login.', {
        url: loginCompletionUrl,
        status: response.status,
        error: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }

    throw new Error(
      `Resposta JSON invalida da API ao concluir login (HTTP ${response.status} em ${loginCompletionUrl}).`,
      { cause: error },
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      `${result.message || 'Nao foi possivel fazer login com Google.'} (HTTP ${response.status} em ${loginCompletionUrl})`,
    );
  }

  if (!result.data?.user || !result.data.accessToken) {
    throw new Error(
      `A API retornou uma sessao incompleta ao concluir login (HTTP ${response.status} em ${loginCompletionUrl}).`,
    );
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
