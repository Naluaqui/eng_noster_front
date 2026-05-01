'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { publicRoutes } from '@/shared/constants/routes';
import { SidebarNav } from './SidebarNav';
import { UserProfileMenu } from './UserProfileMenu';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    const redirect = await logout();
    router.replace(redirect);
  }

  return (
    <aside className={isOpen ? 'app-sidebar' : 'app-sidebar app-sidebar--collapsed'}>
      <button
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        className="app-sidebar__toggle"
        onClick={onToggle}
        type="button"
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <>
          <Link className="app-sidebar__brand" href={publicRoutes.landing}>
            Noster
          </Link>
          <UserProfileMenu />
          <SidebarNav />
          <div className="app-sidebar__footer">
            <button className="app-sidebar__logout" onClick={handleLogout} type="button">
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </>
      ) : null}
    </aside>
  );
}
