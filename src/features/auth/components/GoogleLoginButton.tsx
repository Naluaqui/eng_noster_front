import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { authenticatedRoutes } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';

type GoogleLoginButtonProps = {
  className?: string;
  compact?: boolean;
};

export function GoogleLoginButton({ className, compact = false }: GoogleLoginButtonProps) {
  return (
    <Link
      className={cn('hero-login', compact && 'hero-login--compact', className)}
      href={authenticatedRoutes.meetings}
    >
      <LogIn size={18} aria-hidden="true" />
      Login
    </Link>
  );
}
