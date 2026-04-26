import { redirect } from 'next/navigation';
import { authenticatedRoutes } from '@/shared/constants/routes';

export default function PersonasRoute() {
  redirect(authenticatedRoutes.personas);
}
