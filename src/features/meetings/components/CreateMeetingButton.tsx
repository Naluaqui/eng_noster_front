import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export function CreateMeetingButton() {
  return (
    <Button>
      <Plus size={16} aria-hidden="true" />
      Criar reunião
    </Button>
  );
}
