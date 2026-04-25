import { Outlet } from 'react-router-dom';

export function AuthenticatedLayout() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
