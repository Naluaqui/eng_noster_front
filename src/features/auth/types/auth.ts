export type AuthProvider = 'google';

export type AuthPermission = 'meetings:read' | 'meetings:write' | 'decisions:read' | 'settings:write';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permissions: AuthPermission[];
};

export type AuthToken = {
  accessToken: string;
  expiresAt: string;
};

export type AuthSession = {
  user: AuthUser;
  token: AuthToken;
};

export type AuthLoginRedirect = {
  provider: AuthProvider;
  redirectTo: string;
};
