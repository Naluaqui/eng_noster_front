import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export function ProfileSettingsForm() {
  return (
    <form className="settings-form">
      <label>
        Nome
        <Input defaultValue="Ana Lu" />
      </label>
      <label>
        Email
        <Input defaultValue="ana@noster.ai" type="email" />
      </label>
      <Button type="submit">Salvar perfil</Button>
    </form>
  );
}
