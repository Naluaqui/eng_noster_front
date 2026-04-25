import { Button } from '@/shared/components/ui/Button';

export function PreferencesForm() {
  return (
    <form className="settings-form">
      <label>
        <input type="checkbox" defaultChecked />
        Receber resumo das decisões
      </label>
      <label>
        <input type="checkbox" defaultChecked />
        Destacar riscos críticos
      </label>
      <Button type="submit" variant="secondary">
        Salvar preferências
      </Button>
    </form>
  );
}
