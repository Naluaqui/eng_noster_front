import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

type CardProps = HTMLAttributes<HTMLElement>;

export function Card({ className, ...props }: CardProps) {
  return <article className={cn('ui-card', className)} {...props} />;
}
