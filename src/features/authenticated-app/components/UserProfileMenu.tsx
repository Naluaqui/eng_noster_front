'use client';

import { Avatar } from '@/shared/components/ui/Avatar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User } from '@/shared/types/user';

const defaultUser: User = {
  id: 'demo-user',
  name: 'Ana Lu',
  email: 'ana@noster.ai',
};

export function UserProfileMenu() {
  const { user } = useAuth();
  const profileUser = user ?? defaultUser;

  return (
    <section className="user-profile-menu" aria-label="Perfil do usuário">
      <Avatar name={profileUser.name} src={profileUser.avatarUrl} />
      <div>
        <strong>{profileUser.name}</strong>
        <span>{profileUser.email}</span>
      </div>
    </section>
  );
}
