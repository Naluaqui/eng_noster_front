'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarRoutes } from '@/shared/constants/routes';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav" aria-label="Navegação principal">
      {sidebarRoutes.map((route) => {
        const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);

        return (
          <Link className={isActive ? 'is-active' : undefined} href={route.href} key={route.href}>
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
