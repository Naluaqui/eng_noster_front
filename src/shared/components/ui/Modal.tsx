import type { ReactNode } from 'react';

type ModalProps = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
};

export function Modal({ title, children, isOpen = false }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="ui-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="ui-modal__content">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
