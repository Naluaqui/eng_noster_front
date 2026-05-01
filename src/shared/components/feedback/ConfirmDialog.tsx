import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  cancelLabel = 'Cancelar',
  confirmLabel = 'Excluir',
  description,
  isOpen,
  isSubmitting = false,
  title,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-dialog__panel">
        <header>
          <span aria-hidden="true">
            <AlertTriangle size={18} />
          </span>
          <button aria-label="Fechar" disabled={isSubmitting} onClick={onClose} type="button">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <footer>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="ghost">
            {cancelLabel}
          </Button>
          <Button disabled={isSubmitting} onClick={onConfirm} type="button" variant="secondary">
            {isSubmitting ? 'Excluindo' : confirmLabel}
          </Button>
        </footer>
      </div>
    </div>
  );
}
