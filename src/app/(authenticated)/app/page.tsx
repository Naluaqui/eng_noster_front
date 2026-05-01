import { redirect } from 'next/navigation';
import { authenticatedRoutes } from '@/shared/constants/routes';

export default function AppIndexPage() {
  redirect(authenticatedRoutes.meetings);
}
