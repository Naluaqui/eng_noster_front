'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '../hooks/useAuth';

type GoogleLoginButtonProps = {
  className?: string;
  compact?: boolean;
};

export function GoogleLoginButton({ className, compact = false }: GoogleLoginButtonProps) {
  const { googleLoginHref, loginWithGoogle } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleLoginClick() {
    setIsRedirecting(true);
    const redirectTo = await loginWithGoogle();
    window.location.href = redirectTo || googleLoginHref;
  }

  return (
    <button
      className={cn('hero-login', compact && 'hero-login--compact', className)}
      disabled={isRedirecting}
      onClick={handleLoginClick}
      type="button"
    >
      <LogIn size={18} aria-hidden="true" />
      {isRedirecting ? 'Entrando' : 'Login'}
    </button>
  );
}
