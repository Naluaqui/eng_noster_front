import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export function ChatInput() {
  return (
    <form className="chat-input">
      <Input aria-label="Mensagem para a IA" placeholder="Pergunte sobre uma decisão..." />
      <Button type="submit">Enviar</Button>
    </form>
  );
}
