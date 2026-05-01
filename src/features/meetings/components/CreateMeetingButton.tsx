'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type { CreateMeetingInput, Meeting } from '../types/meeting';

const steps = ['Agenda', 'Pessoas', 'Contexto'] as const;

type CreateMeetingButtonProps = {
  onCreateMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
};

type MeetingForm = {
  title: string;
  date: string;
  time: string;
  participants: string;
  product: string;
  description: string;
  notes: string;
};

type MeetingFormErrors = Partial<Record<keyof MeetingForm | 'form', string>>;

const initialForm: MeetingForm = {
  title: '',
  date: '',
  time: '',
  participants: '',
  product: '',
  description: '',
  notes: '',
};

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function parseParticipants(value: string) {
  return value
    .split(/[\n,;]+/)
    .map((participant) => participant.trim())
    .filter(Boolean);
}

function validateForm(form: MeetingForm, step: number) {
  const errors: MeetingFormErrors = {};
  const title = form.title.trim();
  const product = form.product.trim();
  const participants = parseParticipants(form.participants);
  const description = form.description.trim();
  const notes = form.notes.trim();

  if (step >= 0) {
    if (title.length < 3) {
      errors.title = 'Informe um titulo com pelo menos 3 caracteres.';
    } else if (title.length > 120) {
      errors.title = 'Use ate 120 caracteres no titulo.';
    }

    if (!form.date) {
      errors.date = 'Informe a data da reuniao.';
    } else if (!isValidDate(form.date)) {
      errors.date = 'Informe uma data valida.';
    }

    if (!form.time) {
      errors.time = 'Informe a hora da reuniao.';
    } else if (!isValidTime(form.time)) {
      errors.time = 'Informe uma hora valida.';
    }

    if (product.length > 80) {
      errors.product = 'Use ate 80 caracteres no produto.';
    }
  }

  if (step >= 1) {
    if (participants.length > 24) {
      errors.participants = 'Informe no maximo 24 pessoas.';
    } else if (participants.some((participant) => participant.length > 80)) {
      errors.participants = 'Cada pessoa deve ter ate 80 caracteres.';
    }
  }

  if (step >= 2) {
    if (description.length > 500) {
      errors.description = 'Use ate 500 caracteres na descricao.';
    }

    if (notes.length > 1000) {
      errors.notes = 'Use ate 1000 caracteres nas anotacoes.';
    }
  }

  return errors;
}

export function CreateMeetingButton({ onCreateMeeting }: CreateMeetingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<MeetingForm>(initialForm);
  const [errors, setErrors] = useState<MeetingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participants = useMemo(() => parseParticipants(form.participants), [form.participants]);

  function resetWizard() {
    setIsOpen(false);
    setStep(0);
    setForm(initialForm);
    setErrors({});
  }

  function updateField(field: keyof MeetingForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      form: undefined,
    }));
  }

  function closeWizard() {
    if (isSubmitting) {
      return;
    }

    resetWizard();
  }

  function goNext() {
    const stepErrors = validateForm(form, step);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  async function handleSubmit() {
    const formErrors = validateForm(form, steps.length - 1);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onCreateMeeting({
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        participants,
        product: form.product.trim() || undefined,
        description: form.description.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });

      resetWizard();
    } catch {
      setErrors({
        form: 'Nao foi possivel criar a reuniao.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={16} aria-hidden="true" />
        Criar reuniao
      </Button>

      {isOpen ? (
        <div className="meeting-wizard" role="dialog" aria-modal="true" aria-label="Criar reuniao">
          <div className="meeting-wizard__panel">
            <header className="meeting-wizard__header">
              <div>
                <span>Nova reuniao</span>
                <h2>{steps[step]}</h2>
              </div>
              <button
                aria-label="Fechar"
                className="meeting-wizard__close"
                disabled={isSubmitting}
                onClick={closeWizard}
                type="button"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="meeting-wizard__steps" aria-label="Etapas do formulario">
              {steps.map((label, index) => (
                <span
                  className={index === step ? 'meeting-wizard__step--active' : undefined}
                  key={label}
                >
                  {index + 1}. {label}
                </span>
              ))}
            </div>

            {errors.form ? <p className="meeting-wizard__error">{errors.form}</p> : null}

            {step === 0 ? (
              <div className="meeting-wizard__grid">
                <label className="meeting-wizard__field meeting-wizard__field--wide">
                  <span>Titulo *</span>
                  <Input
                    aria-invalid={Boolean(errors.title)}
                    maxLength={120}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="Ex.: Priorizacao de roadmap"
                    value={form.title}
                  />
                  {errors.title ? <small>{errors.title}</small> : null}
                </label>

                <label className="meeting-wizard__field">
                  <span>Data *</span>
                  <Input
                    aria-invalid={Boolean(errors.date)}
                    onChange={(event) => updateField('date', event.target.value)}
                    type="date"
                    value={form.date}
                  />
                  {errors.date ? <small>{errors.date}</small> : null}
                </label>

                <label className="meeting-wizard__field">
                  <span>Hora *</span>
                  <Input
                    aria-invalid={Boolean(errors.time)}
                    onChange={(event) => updateField('time', event.target.value)}
                    type="time"
                    value={form.time}
                  />
                  {errors.time ? <small>{errors.time}</small> : null}
                </label>

                <label className="meeting-wizard__field meeting-wizard__field--wide">
                  <span>Produto</span>
                  <Input
                    aria-invalid={Boolean(errors.product)}
                    maxLength={80}
                    onChange={(event) => updateField('product', event.target.value)}
                    placeholder="Ex.: NOSTER"
                    value={form.product}
                  />
                  {errors.product ? <small>{errors.product}</small> : null}
                </label>
              </div>
            ) : null}

            {step === 1 ? (
              <label className="meeting-wizard__field">
                <span>Pessoas envolvidas</span>
                <textarea
                  aria-invalid={Boolean(errors.participants)}
                  className="meeting-wizard__textarea"
                  onChange={(event) => updateField('participants', event.target.value)}
                  placeholder="Ana Lu, Produto, Comercial"
                  value={form.participants}
                />
                <em>{participants.length} pessoas identificadas</em>
                {errors.participants ? <small>{errors.participants}</small> : null}
              </label>
            ) : null}

            {step === 2 ? (
              <div className="meeting-wizard__stack">
                <label className="meeting-wizard__field">
                  <span>Descricao</span>
                  <textarea
                    aria-invalid={Boolean(errors.description)}
                    className="meeting-wizard__textarea"
                    maxLength={500}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Contexto, objetivo e criterio de sucesso."
                    value={form.description}
                  />
                  <em>{form.description.trim().length}/500</em>
                  {errors.description ? <small>{errors.description}</small> : null}
                </label>

                <label className="meeting-wizard__field">
                  <span>Anotacoes</span>
                  <textarea
                    aria-invalid={Boolean(errors.notes)}
                    className="meeting-wizard__textarea meeting-wizard__textarea--large"
                    maxLength={1000}
                    onChange={(event) => updateField('notes', event.target.value)}
                    placeholder="Pontos soltos, sinais, riscos ou perguntas abertas."
                    value={form.notes}
                  />
                  <em>{form.notes.trim().length}/1000</em>
                  {errors.notes ? <small>{errors.notes}</small> : null}
                </label>
              </div>
            ) : null}

            <footer className="meeting-wizard__footer">
              <Button disabled={step === 0 || isSubmitting} onClick={goBack} variant="ghost">
                <ChevronLeft size={16} aria-hidden="true" />
                Voltar
              </Button>

              {step < steps.length - 1 ? (
                <Button onClick={goNext}>
                  Proximo
                  <ChevronRight size={16} aria-hidden="true" />
                </Button>
              ) : (
                <Button disabled={isSubmitting} onClick={handleSubmit}>
                  <Check size={16} aria-hidden="true" />
                  {isSubmitting ? 'Criando' : 'Criar reuniao'}
                </Button>
              )}
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
