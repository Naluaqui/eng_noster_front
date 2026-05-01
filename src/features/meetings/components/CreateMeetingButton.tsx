'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { CreateMeetingInput, Meeting, MeetingCatalog } from '../types/meeting';
import { MeetingWizard } from './MeetingWizard';

type CreateMeetingButtonProps = {
  catalog: MeetingCatalog;
  onCreateMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
};

export function CreateMeetingButton({ catalog, onCreateMeeting }: CreateMeetingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={16} aria-hidden="true" />
        Criar reuniao
      </Button>

      {isOpen ? (
        <MeetingWizard
          errorMessage="Nao foi possivel criar a reuniao."
          catalog={catalog}
          isOpen={isOpen}
          mode="create"
          onClose={() => setIsOpen(false)}
          onSubmit={onCreateMeeting}
        />
      ) : null}
    </>
  );
}
