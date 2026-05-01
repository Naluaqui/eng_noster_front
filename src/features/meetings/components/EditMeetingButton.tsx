'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { Meeting, MeetingCatalog, UpdateMeetingInput } from '../types/meeting';
import { MeetingWizard } from './MeetingWizard';

type EditMeetingButtonProps = {
  meeting: Meeting;
  catalog: MeetingCatalog;
  onUpdateMeeting: (meetingId: string, input: UpdateMeetingInput) => Promise<Meeting>;
};

export function EditMeetingButton({ meeting, catalog, onUpdateMeeting }: EditMeetingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="meeting-card__edit" onClick={() => setIsOpen(true)} type="button">
        <Pencil size={13} aria-hidden="true" />
        Editar
      </button>

      {isOpen ? (
        <MeetingWizard
          errorMessage="Nao foi possivel salvar a edicao."
          catalog={catalog}
          isOpen={isOpen}
          meeting={meeting}
          mode="edit"
          onClose={() => setIsOpen(false)}
          onSubmit={(input) => onUpdateMeeting(meeting.id, input)}
        />
      ) : null}
    </>
  );
}
