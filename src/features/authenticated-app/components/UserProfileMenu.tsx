import { Avatar } from '@/shared/components/ui/Avatar';
import type { User } from '@/shared/types/user';

const defaultUser: User = {
  id: 'demo-user',
  name: 'Ana Lu',
  email: 'ana@noster.ai',
};

export function UserProfileMenu() {
  return (
    <section className="user-profile-menu" aria-label="Perfil do usuário">
      <Avatar name={defaultUser.name} src={defaultUser.avatarUrl} />
      <div>
        <strong>{defaultUser.name}</strong>
        <span>{defaultUser.email}</span>
      </div>
    </section>
  );
}
