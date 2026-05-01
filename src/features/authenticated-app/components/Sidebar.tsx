'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { publicRoutes } from '@/shared/constants/routes';
import { SidebarNav } from './SidebarNav';
import { UserProfileMenu } from './UserProfileMenu';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
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
        </>
      ) : null}
    </aside>
  );
}
