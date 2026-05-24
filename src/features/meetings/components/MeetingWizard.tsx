'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type { CreateMeetingInput, Meeting, MeetingCatalog, MeetingOption, UpdateMeetingInput } from '../types/meeting';

const steps = ['Agenda', 'Pessoas', 'Contexto'] as const;

type MeetingWizardMode = 'create' | 'edit';

type MeetingWizardProps = {
  catalog: MeetingCatalog;
  errorMessage: string;
  isOpen: boolean;
  meeting?: Meeting;
  mode: MeetingWizardMode;
  onClose: () => void;
  onSubmit: (input: CreateMeetingInput | UpdateMeetingInput) => Promise<Meeting>;
};

type MeetingForm = {
  title: string;
  date: string;
  time: string;
  participants: string[];
  product: string;
  description: string;
  notes: string;
};

type MeetingFormErrors = Partial<Record<keyof MeetingForm | 'form', string>>;

const initialForm: MeetingForm = {
  title: '',
  date: '',
  time: '',
  participants: [],
  product: '',
  description: '',
  notes: '',
};

function getInitialForm(meeting?: Meeting): MeetingForm {
  if (!meeting) {
    return initialForm;
  }

  return {
    title: meeting.title,
    date: meeting.date,
    time: meeting.time,
    participants: meeting.participants,
    product: meeting.product ?? '',
    description: meeting.description ?? '',
    notes: meeting.notes ?? '',
  };
}

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

function validateForm(form: MeetingForm, step: number) {
  const errors: MeetingFormErrors = {};
  const title = form.title.trim();
  const product = form.product.trim();
  const participants = form.participants;
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
    if (notes.length > 1000) {
      errors.notes = 'Use ate 1000 caracteres nas anotacoes.';
    }
  }

  return errors;
}

export function MeetingWizard({
  catalog,
  errorMessage,
  isOpen,
  meeting,
  mode,
  onClose,
  onSubmit,
}: MeetingWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<MeetingForm>(() => getInitialForm(meeting));
  const [errors, setErrors] = useState<MeetingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participants = form.participants;
  const productOptions = useMemo(
    () => includeCurrentOption(catalog.products, form.product),
    [catalog.products, form.product],
  );
  const peopleOptions = useMemo(
    () => includeCurrentOptions(catalog.people, form.participants),
    [catalog.people, form.participants],
  );
  const actionLabel = mode === 'edit' ? 'Salvar edicao' : 'Criar reuniao';
  const submittingLabel = mode === 'edit' ? 'Salvando' : 'Criando';

  function resetWizard() {
    setStep(0);
    setForm(getInitialForm(meeting));
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

  function toggleParticipant(participant: string) {
    setForm((currentForm) => ({
      ...currentForm,
      participants: currentForm.participants.includes(participant)
        ? currentForm.participants.filter((currentParticipant) => currentParticipant !== participant)
        : [...currentForm.participants, participant],
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      participants: undefined,
      form: undefined,
    }));
  }

  function closeWizard() {
    if (isSubmitting) {
      return;
    }

    resetWizard();
    onClose();
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
      await onSubmit({
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        participants,
        product: form.product.trim() || undefined,
        description: form.description.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });

      resetWizard();
      onClose();
    } catch {
      setErrors({
        form: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="meeting-wizard" role="dialog" aria-modal="true" aria-label={actionLabel}>
      <div className="meeting-wizard__panel">
        <header className="meeting-wizard__header">
          <div>
            <span>{mode === 'edit' ? 'Editar reuniao' : 'Nova reuniao'}</span>
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
            <span className={index === step ? 'meeting-wizard__step--active' : undefined} key={label}>
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
              <select
                aria-invalid={Boolean(errors.product)}
                onChange={(event) => updateField('product', event.target.value)}
                value={form.product}
              >
                <option value="">Sem produto selecionado</option>
                {productOptions.map((product) => (
                  <option key={product.value} value={product.label}>
                    {product.label}
                  </option>
                ))}
              </select>
              {catalog.products.length === 0 ? <em>Cadastre produtos em Configuracoes.</em> : null}
              {errors.product ? <small>{errors.product}</small> : null}
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="meeting-wizard__field">
            <span>Pessoas envolvidas</span>
            {peopleOptions.length > 0 ? (
              <div className="meeting-wizard__options">
                {peopleOptions.map((person) => (
                  <label key={person.value}>
                    <input
                      checked={form.participants.includes(person.label)}
                      onChange={() => toggleParticipant(person.label)}
                      type="checkbox"
                    />
                    {person.label}
                  </label>
                ))}
              </div>
            ) : (
              <p className="meeting-wizard__empty">Cadastre pessoas em Configuracoes para selecionar participantes.</p>
            )}
            <em>{participants.length} pessoas identificadas</em>
            {errors.participants ? <small>{errors.participants}</small> : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="meeting-wizard__stack">
            <label className="meeting-wizard__field">
              <span>Descricao / transcricao</span>
              <textarea
                className="meeting-wizard__textarea"
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Cole aqui a transcricao completa da reuniao."
                value={form.description}
              />
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
              {isSubmitting ? submittingLabel : actionLabel}
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}

function includeCurrentOption(options: MeetingOption[], currentValue: string) {
  const normalizedCurrentValue = currentValue.trim().toLowerCase();

  if (!normalizedCurrentValue || options.some((option) => option.label.toLowerCase() === normalizedCurrentValue)) {
    return options;
  }

  return [{ label: currentValue, value: normalizedCurrentValue }, ...options];
}

function includeCurrentOptions(options: MeetingOption[], currentValues: string[]) {
  const nextOptions = [...options];

  currentValues.forEach((currentValue) => {
    const normalizedCurrentValue = currentValue.trim().toLowerCase();

    if (
      normalizedCurrentValue &&
      !nextOptions.some((option) => option.label.toLowerCase() === normalizedCurrentValue)
    ) {
      nextOptions.unshift({
        label: currentValue,
        value: normalizedCurrentValue,
      });
    }
  });

  return nextOptions;
}
