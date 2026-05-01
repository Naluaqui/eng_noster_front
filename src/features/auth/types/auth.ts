export type AuthProvider = 'google';

export type AuthPermission = 'meetings:read' | 'meetings:write' | 'decisions:read' | 'settings:write';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  permissions?: AuthPermission[];
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};

export type AuthLoginRedirect = {
  provider: AuthProvider;
  redirectTo: string;
};

export type AuthApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
