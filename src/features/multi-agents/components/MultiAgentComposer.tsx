'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUp, Paperclip, Search, Sparkles, X } from 'lucide-react';
import type { Meeting } from '@/features/meetings/types/meeting';
import { formatShortDate } from '@/shared/lib/formatters';

type MultiAgentComposerProps = {
  attachedMeetings: Meeting[];
  meetings: Meeting[];
  onAttachMeeting: (meetingId: string) => void;
  onDetachMeeting: (meetingId: string) => void;
  onSendMessage: (content: string) => void;
};

export function MultiAgentComposer({
  attachedMeetings,
  meetings,
  onAttachMeeting,
  onDetachMeeting,
  onSendMessage,
}: MultiAgentComposerProps) {
  const [message, setMessage] = useState('');
  const [isMeetingPickerOpen, setIsMeetingPickerOpen] = useState(false);
  const [meetingSearch, setMeetingSearch] = useState('');
  const attachedMeetingIds = useMemo(
    () => new Set(attachedMeetings.map((meeting) => meeting.id)),
    [attachedMeetings],
  );
  const filteredMeetings = useMemo(() => {
    const search = normalizeValue(meetingSearch);

    if (!search) {
      return meetings;
    }

    return meetings.filter((meeting) => {
      const searchableText = [meeting.title, meeting.summary, meeting.product, meeting.description, ...meeting.participants]
        .filter(Boolean)
        .join(' ');

      return normalizeValue(searchableText).includes(search);
    });
  }, [meetingSearch, meetings]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSendMessage(message);
    setMessage('');
  }

  function handleAttachMeeting(meetingId: string) {
    onAttachMeeting(meetingId);
    setIsMeetingPickerOpen(false);
  }

  return (
    <>
      <form className="multi-agent-composer" onSubmit={handleSubmit}>
        {attachedMeetings.length > 0 ? (
          <div className="multi-agent-composer__attachments" aria-label="Reunioes anexadas">
            {attachedMeetings.map((meeting) => (
              <span key={meeting.id}>
                {meeting.title}
                <button
                  aria-label={`Remover ${meeting.title}`}
                  onClick={() => onDetachMeeting(meeting.id)}
                  type="button"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <label>
          <span className="sr-only">Mensagem para os agentes</span>
          <textarea
            name="message"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Peca uma analise, compare perspectivas ou descreva a decisao..."
            value={message}
          />
        </label>

        <footer>
          <button onClick={() => setIsMeetingPickerOpen(true)} type="button">
            <Paperclip size={15} aria-hidden="true" />
            Anexar reuniao
          </button>
          <button type="button">
            <Sparkles size={15} aria-hidden="true" />
            Agentes
          </button>
          <button
            type="submit"
            aria-label="Enviar mensagem"
            disabled={!message.trim() && attachedMeetings.length === 0}
          >
            <ArrowUp size={17} aria-hidden="true" />
          </button>
        </footer>
      </form>

      {isMeetingPickerOpen ? (
        <div className="meeting-attachment-picker" role="dialog" aria-modal="true" aria-label="Anexar reuniao">
          <div className="meeting-attachment-picker__panel">
            <header>
              <div>
                <span>Reunioes</span>
                <h2>Anexar ao chat</h2>
              </div>
              <button
                aria-label="Fechar"
                className="meeting-attachment-picker__close"
                onClick={() => setIsMeetingPickerOpen(false)}
                type="button"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <label className="meeting-attachment-picker__search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Buscar reuniao</span>
              <input
                onChange={(event) => setMeetingSearch(event.target.value)}
                placeholder="Buscar por titulo, pessoa ou produto"
                type="search"
                value={meetingSearch}
              />
            </label>

            <div className="meeting-attachment-picker__list">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => {
                  const isAttached = attachedMeetingIds.has(meeting.id);

                  return (
                    <article key={meeting.id}>
                      <div>
                        <strong>{meeting.title}</strong>
                        <small>
                          {formatShortDate(meeting.date)} as {meeting.time}
                        </small>
                        <p>{meeting.summary}</p>
                      </div>
                      <button
                        disabled={isAttached}
                        onClick={() => handleAttachMeeting(meeting.id)}
                        type="button"
                      >
                        {isAttached ? 'Anexada' : 'Anexar'}
                      </button>
                    </article>
                  );
                })
              ) : (
                <p className="meeting-attachment-picker__empty">Nenhuma reuniao encontrada.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function normalizeValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
