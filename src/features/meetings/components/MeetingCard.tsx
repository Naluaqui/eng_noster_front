import { useState, type DragEvent } from 'react';
import { CalendarDays, Signal, Trash2, UsersRound, X } from 'lucide-react';
import { AnalysisEntityTags } from '@/features/multi-agents/components/AnalysisEntityTags';
import { AnalysisResultPanel } from '@/features/multi-agents/components/AnalysisResultPanel';
import type { AiAnalysis, AiDetectedCompany, AiDetectedProduct, AiDetectedTheme } from '@/features/multi-agents/types/multiAgent';
import { ConfirmDialog } from '@/shared/components/feedback/ConfirmDialog';
import { Card } from '@/shared/components/ui/Card';
import { formatShortDate } from '@/shared/lib/formatters';
import type { Meeting, MeetingCatalog, UpdateMeetingInput } from '../types/meeting';
import { EditMeetingButton } from './EditMeetingButton';

type MeetingCardProps = {
  meeting: Meeting;
  catalog: MeetingCatalog;
  isMoving?: boolean;
  onDeleteMeeting: (meetingId: string) => Promise<Meeting>;
  onUpdateMeeting: (meetingId: string, input: UpdateMeetingInput) => Promise<Meeting>;
};

export function MeetingCard({
  meeting,
  catalog,
  isMoving = false,
  onDeleteMeeting,
  onUpdateMeeting,
}: MeetingCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const summary =
    meeting.description?.trim() || (meeting.analysis ? meeting.analysis.resumo_executivo : 'Sem descrição informada.');
  const tags = Array.from(new Set([...meeting.tags, ...getAnalysisTags(meeting.analysis)]));

  function handleDragStart(event: DragEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea')) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-noster-meeting-id', meeting.id);
    event.dataTransfer.setData('text/plain', meeting.id);
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await onDeleteMeeting(meeting.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card
        className={`meeting-card${isMoving ? ' meeting-card--moving' : ''}`}
        draggable={meeting.status !== 'analyzed'}
        onDragStart={handleDragStart}
        role="listitem"
      >
        <header>
          <span className="meeting-card__owner">{meeting.owner}</span>
          <div className="meeting-card__actions">
            <EditMeetingButton catalog={catalog} meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
            <button
              aria-label={`Excluir ${meeting.title}`}
              className="meeting-card__delete"
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="meeting-card__body">
          <h3>{meeting.title}</h3>
          <p>{summary}</p>
        </div>

        <div className="meeting-card__tags" aria-label="Etiquetas da reuniao">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {meeting.analysis ? (
          <button className="meeting-card__analysis" onClick={() => setIsAnalysisOpen(true)} type="button">
            Ver análise
          </button>
        ) : null}

        <footer>
          <span>
            <CalendarDays size={15} aria-hidden="true" />
            <time dateTime={`${meeting.date}T${meeting.time}`}>
              {formatShortDate(meeting.date)} {meeting.time}
            </time>
          </span>
          <span>
            <UsersRound size={15} aria-hidden="true" />
            {meeting.participants.length}
          </span>
          <span>
            <Signal size={15} aria-hidden="true" />
            {meeting.signalCount}
          </span>
        </footer>
      </Card>

      <ConfirmDialog
        description={`A reuniao "${meeting.title}" sera excluida deste workspace.`}
        isOpen={isDeleteDialogOpen}
        isSubmitting={isDeleting}
        title="Excluir reuniao?"
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

      {meeting.analysis && isAnalysisOpen ? (
        <div className="analysis-modal" role="dialog" aria-modal="true" aria-label={`Análise de ${meeting.title}`}>
          <div className="analysis-modal__panel">
            <header>
              <div>
                <span>Reunião analisada</span>
                <h2>{meeting.title}</h2>
              </div>
              <button aria-label="Fechar análise" onClick={() => setIsAnalysisOpen(false)} type="button">
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="analysis-modal__content">
              <AnalysisEntityTags analysis={meeting.analysis} />
              <AnalysisResultPanel analysis={meeting.analysis} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getAnalysisTags(analysis?: AiAnalysis) {
  if (!analysis) {
    return [];
  }

  const themes = analysis.entidades_detectadas.temas.map(getThemeName);
  const companies = analysis.entidades_detectadas.empresas.map((company) => `Empresa: ${getEntityName(company)}`);
  const products = analysis.entidades_detectadas.produtos.map(getEntityName);

  return Array.from(new Set([...companies, ...themes, ...products]));
}

function getEntityName(value: string | AiDetectedCompany | AiDetectedProduct) {
  return typeof value === 'string' ? value : value.nome;
}

function getThemeName(value: string | AiDetectedTheme) {
  return typeof value === 'string' ? value : value.tema;
}
