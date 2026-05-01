'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '../hooks/useAuth';

type GoogleLoginButtonProps = {
  className?: string;
  compact?: boolean;
};

export function GoogleLoginButton({ className, compact = false }: GoogleLoginButtonProps) {
  const { googleLoginHref } = useAuth();

  return (
    <Link
      className={cn('hero-login', compact && 'hero-login--compact', className)}
      href={googleLoginHref}
    >
      <LogIn size={18} aria-hidden="true" />
      Login
    </Link>
  );
}
