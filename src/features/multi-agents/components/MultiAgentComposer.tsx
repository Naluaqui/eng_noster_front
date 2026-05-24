'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUp, FileDown, Paperclip, Search, Sparkles, X } from 'lucide-react';
import type { Meeting } from '@/features/meetings/types/meeting';
import { formatShortDate } from '@/shared/lib/formatters';
import { exportAnalysisPdf } from '../utils/exportAnalysisPdf';
import type { AiAnalysis } from '../types/multiAgent';

type MultiAgentComposerProps = {
  analysisResult: AiAnalysis | null;
  attachedMeetings: Meeting[];
  isAnalyzing: boolean;
  meetings: Meeting[];
  onAttachMeeting: (meetingId: string) => void;
  onDetachMeeting: (meetingId: string) => void;
  onSendMessage: (content: string) => Promise<boolean>;
};

export function MultiAgentComposer({
  analysisResult,
  attachedMeetings,
  isAnalyzing,
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

    if (attachedMeetings.length === 0 || isAnalyzing) {
      return;
    }

    void onSendMessage(message);
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
                  className="multi-agent-composer__detach"
                  disabled={isAnalyzing}
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
            disabled={isAnalyzing}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Peca uma analise, compare perspectivas ou descreva a decisao..."
            value={message}
          />
        </label>

        {attachedMeetings.length === 0 ? (
          <p className="multi-agent-composer__hint">Anexe pelo menos uma reuniao para iniciar a analise.</p>
        ) : null}

        <footer>
          <button disabled={isAnalyzing} onClick={() => setIsMeetingPickerOpen(true)} type="button">
            <Paperclip size={15} aria-hidden="true" />
            Anexar reuniao
          </button>
          <button disabled={isAnalyzing} type="button">
            <Sparkles size={15} aria-hidden="true" />
            Agentes
          </button>
          {analysisResult ? (
            <button
              className="multi-agent-composer__export"
              disabled={isAnalyzing}
              onClick={() => void exportAnalysisPdf(analysisResult)}
              type="button"
            >
              <FileDown size={15} aria-hidden="true" />
              Exportar analise
            </button>
          ) : null}
          <button
            type="submit"
            aria-label="Enviar mensagem"
            disabled={isAnalyzing || attachedMeetings.length === 0}
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
                placeholder="Buscar por titulo, pessoa, produto ou serviço"
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
