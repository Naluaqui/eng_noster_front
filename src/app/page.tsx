import { redirect } from 'next/navigation';
import { publicRoutes } from '@/shared/constants/routes';

export default function HomePage() {
  redirect(publicRoutes.landing);
}
