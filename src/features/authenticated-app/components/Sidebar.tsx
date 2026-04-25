import Link from 'next/link';
import { authenticatedRoutes, publicRoutes } from '@/shared/constants/routes';
import { SidebarNav } from './SidebarNav';
import { UserProfileMenu } from './UserProfileMenu';

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <Link className="app-sidebar__brand" href={publicRoutes.landing}>
        Noster
      </Link>
      <UserProfileMenu />
      <SidebarNav />
      <Link className="app-sidebar__settings" href={authenticatedRoutes.settings}>
        Configurações
      </Link>
    </aside>
  );
}
