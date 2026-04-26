import { redirect } from 'next/navigation';
import { authenticatedRoutes } from '@/shared/constants/routes';

export default function InsightsRoute() {
  redirect(authenticatedRoutes.insights);
}
