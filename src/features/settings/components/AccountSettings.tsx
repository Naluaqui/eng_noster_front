'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Plus, Save, Trash2, UsersRound } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/feedback/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type {
  CompanyGroupSettings,
  CompanyPersonSettings,
  CompanyProductSettings,
  CompanySettings,
  CompanySummary,
  CompanyTeamSettings,
  CreateCompanyInput,
  UpdateCompanySettingsInput,
} from '../types/settings';

type AccountSettingsProps = {
  companies: CompanySummary[];
  isSaving: boolean;
  selectedCompanyId: string | null;
  settings: CompanySettings | null;
  onCreateCompany: (input: CreateCompanyInput) => Promise<CompanySummary>;
  onDeleteCompany: (companyId: string) => Promise<CompanySummary[]>;
  onSave: (input: UpdateCompanySettingsInput) => Promise<CompanySettings>;
  onSelectCompany: (companyId: string) => void;
};

type SettingsErrors = Record<string, string>;
type SettingsDraft = UpdateCompanySettingsInput;
type ConfirmDialogState = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
} | null;

const blankProduct: CompanyProductSettings = {
  name: '',
  about: '',
  solutionObjective: '',
  technology: '',
  targetAudience: '',
  averagePrice: '',
};

const blankPerson: CompanyPersonSettings = {
  email: '',
  role: '',
  reportsToEmail: '',
};

const blankGroup: CompanyGroupSettings = {
  name: '',
  about: '',
  people: [],
};

const blankTeam: CompanyTeamSettings = {
  name: '',
  about: '',
  people: [],
  groups: [],
};

const emptySettings: CompanySettings = {
  company: {
    id: '',
    name: '',
    about: '',
    objectives: '',
    culture: '',
  },
  products: [],
  teams: [],
};

function createDraftId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneProduct(product: CompanyProductSettings = blankProduct): CompanyProductSettings {
  return {
    id: product.id ?? createDraftId('product'),
    name: product.name,
    about: product.about,
    solutionObjective: product.solutionObjective,
    technology: product.technology,
    targetAudience: product.targetAudience,
    averagePrice: product.averagePrice,
  };
}

function clonePerson(person: CompanyPersonSettings = blankPerson): CompanyPersonSettings {
  return {
    id: person.id ?? createDraftId('person'),
    email: person.email,
    role: person.role ?? '',
    reportsToEmail: person.reportsToEmail ?? '',
  };
}

function cloneGroup(group: CompanyGroupSettings = blankGroup): CompanyGroupSettings {
  return {
    id: group.id ?? createDraftId('group'),
    name: group.name,
    about: group.about ?? '',
    people: group.people.map(clonePerson),
  };
}

function cloneTeam(team: CompanyTeamSettings = blankTeam): CompanyTeamSettings {
  return {
    id: team.id ?? createDraftId('team'),
    name: team.name,
    about: team.about ?? '',
    people: team.people.map(clonePerson),
    groups: team.groups.map(cloneGroup),
  };
}

function createDraft(settings: CompanySettings): SettingsDraft {
  return {
    company: {
      name: settings.company.name,
      about: settings.company.about,
      objectives: settings.company.objectives,
      culture: settings.company.culture,
    },
    products: settings.products.map(cloneProduct),
    teams: settings.teams.map(cloneTeam),
  };
}

function required(value: string) {
  return value.trim().length > 0;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateDraft(draft: SettingsDraft) {
  const errors: SettingsErrors = {};

  if (!required(draft.company.name)) errors['company.name'] = 'Nome da empresa obrigatorio.';
  if (!required(draft.company.about)) errors['company.about'] = 'Sobre da empresa obrigatorio.';
  if (!required(draft.company.objectives)) errors['company.objectives'] = 'Objetivos obrigatorios.';
  if (!required(draft.company.culture)) errors['company.culture'] = 'Cultura obrigatoria.';

  draft.products.forEach((product, productIndex) => {
    if (!required(product.name)) errors[`products.${productIndex}.name`] = 'Nome obrigatorio.';
    if (!required(product.about)) errors[`products.${productIndex}.about`] = 'Sobre obrigatorio.';
    if (!required(product.solutionObjective)) {
      errors[`products.${productIndex}.solutionObjective`] = 'Objetivo obrigatorio.';
    }
    if (!required(product.technology)) {
      errors[`products.${productIndex}.technology`] = 'Tecnologia obrigatoria.';
    }
    if (!required(product.targetAudience)) {
      errors[`products.${productIndex}.targetAudience`] = 'Publico alvo obrigatorio.';
    }
    if (!required(product.averagePrice)) {
      errors[`products.${productIndex}.averagePrice`] = 'Media de preco obrigatoria.';
    }
  });

  draft.teams.forEach((team, teamIndex) => {
    if (!required(team.name)) errors[`teams.${teamIndex}.name`] = 'Nome do time obrigatorio.';

    team.people.forEach((person, personIndex) => {
      validatePerson(person, errors, `teams.${teamIndex}.people.${personIndex}`);
    });

    team.groups.forEach((group, groupIndex) => {
      if (!required(group.name)) {
        errors[`teams.${teamIndex}.groups.${groupIndex}.name`] = 'Nome do grupo obrigatorio.';
      }

      group.people.forEach((person, personIndex) => {
        validatePerson(person, errors, `teams.${teamIndex}.groups.${groupIndex}.people.${personIndex}`);
      });
    });
  });

  return errors;
}

function validatePerson(person: CompanyPersonSettings, errors: SettingsErrors, key: string) {
  if (!required(person.email)) {
    errors[`${key}.email`] = 'Email obrigatorio.';
    return;
  }

  if (!isEmail(person.email.trim())) {
    errors[`${key}.email`] = 'Email invalido.';
  }

  if (person.reportsToEmail && person.reportsToEmail.trim() && !isEmail(person.reportsToEmail.trim())) {
    errors[`${key}.reportsToEmail`] = 'Email invalido.';
  }
}

function trimDraft(draft: SettingsDraft): SettingsDraft {
  return {
    company: {
      name: draft.company.name.trim(),
      about: draft.company.about.trim(),
      objectives: draft.company.objectives.trim(),
      culture: draft.company.culture.trim(),
    },
    products: draft.products.map((product) => ({
      id: product.id,
      name: product.name.trim(),
      about: product.about.trim(),
      solutionObjective: product.solutionObjective.trim(),
      technology: product.technology.trim(),
      targetAudience: product.targetAudience.trim(),
      averagePrice: product.averagePrice.trim(),
    })),
    teams: draft.teams.map((team) => ({
      id: team.id,
      name: team.name.trim(),
      about: team.about?.trim() || undefined,
      people: team.people.map((person) => ({
        id: person.id,
        email: person.email.trim(),
        role: person.role?.trim() || undefined,
        reportsToEmail: person.reportsToEmail?.trim() || undefined,
      })),
      groups: team.groups.map((group) => ({
        id: group.id,
        name: group.name.trim(),
        about: group.about?.trim() || undefined,
        people: group.people.map((person) => ({
          id: person.id,
          email: person.email.trim(),
          role: person.role?.trim() || undefined,
          reportsToEmail: person.reportsToEmail?.trim() || undefined,
        })),
      })),
    })),
  };
}

export function AccountSettings({
  companies,
  isSaving,
  selectedCompanyId,
  settings,
  onCreateCompany,
  onDeleteCompany,
  onSave,
  onSelectCompany,
}: AccountSettingsProps) {
  const [draft, setDraft] = useState<SettingsDraft>(() => createDraft(settings ?? emptySettings));
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function setCompanyField(field: keyof SettingsDraft['company'], value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      company: {
        ...currentDraft.company,
        [field]: value,
      },
    }));
  }

  function updateProduct(index: number, field: keyof CompanyProductSettings, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      products: currentDraft.products.map((product, productIndex) =>
        productIndex === index ? { ...product, [field]: value } : product,
      ),
    }));
  }

  function updateTeam(index: number, field: keyof Pick<CompanyTeamSettings, 'name' | 'about'>, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, teamIndex) =>
        teamIndex === index ? { ...team, [field]: value } : team,
      ),
    }));
  }

  function updateTeamPerson(
    teamIndex: number,
    personIndex: number,
    field: keyof CompanyPersonSettings,
    value: string,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              people: team.people.map((person, currentPersonIndex) =>
                currentPersonIndex === personIndex ? { ...person, [field]: value } : person,
              ),
            }
          : team,
      ),
    }));
  }

  function updateGroup(
    teamIndex: number,
    groupIndex: number,
    field: keyof Pick<CompanyGroupSettings, 'name' | 'about'>,
    value: string,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              groups: team.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex ? { ...group, [field]: value } : group,
              ),
            }
          : team,
      ),
    }));
  }

  function updateGroupPerson(
    teamIndex: number,
    groupIndex: number,
    personIndex: number,
    field: keyof CompanyPersonSettings,
    value: string,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              groups: team.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex
                  ? {
                      ...group,
                      people: group.people.map((person, currentPersonIndex) =>
                        currentPersonIndex === personIndex ? { ...person, [field]: value } : person,
                      ),
                    }
                  : group,
              ),
            }
          : team,
      ),
    }));
  }

  function removeProduct(index: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      products: currentDraft.products.filter((_product, productIndex) => productIndex !== index),
    }));
  }

  function removeTeam(index: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.filter((_team, teamIndex) => teamIndex !== index),
    }));
  }

  function removeTeamPerson(teamIndex: number, personIndex: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              people: team.people.filter((_person, currentPersonIndex) => currentPersonIndex !== personIndex),
            }
          : team,
      ),
    }));
  }

  function removeGroup(teamIndex: number, groupIndex: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              groups: team.groups.filter((_group, currentGroupIndex) => currentGroupIndex !== groupIndex),
            }
          : team,
      ),
    }));
  }

  function removeGroupPerson(teamIndex: number, groupIndex: number, personIndex: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      teams: currentDraft.teams.map((team, currentTeamIndex) =>
        currentTeamIndex === teamIndex
          ? {
              ...team,
              groups: team.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex
                  ? {
                      ...group,
                      people: group.people.filter(
                        (_person, currentPersonIndex) => currentPersonIndex !== personIndex,
                      ),
                    }
                  : group,
              ),
            }
          : team,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage('');

    const nextErrors = validateDraft(draft);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      const savedSettings = await onSave(trimDraft(draft));
      setDraft(createDraft(savedSettings));
      setSuccessMessage('Configuracoes salvas.');
    } catch {
      setErrors({
        form: 'Nao foi possivel salvar as configuracoes.',
      });
    }
  }

  async function handleCreateCompany() {
    const name = newCompanyName.trim();

    if (!name) {
      setErrors({
        companySelector: 'Informe o nome da empresa.',
      });
      return;
    }

    setErrors({});
    await onCreateCompany({ name });
    setNewCompanyName('');
  }

  async function handleConfirmDelete() {
    if (!confirmDialog) {
      return;
    }

    setIsConfirmSubmitting(true);

    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } finally {
      setIsConfirmSubmitting(false);
    }
  }

  function requestDelete(dialog: NonNullable<ConfirmDialogState>) {
    setSuccessMessage('');
    setConfirmDialog(dialog);
  }

  function requestDeleteCompany() {
    if (!selectedCompanyId) {
      return;
    }

    if (companies.length <= 1) {
      setErrors({
        companySelector: 'Nao e possivel excluir o ultimo workspace.',
      });
      return;
    }

    const companyName =
      companies.find((company) => company.id === selectedCompanyId)?.name ?? 'workspace selecionado';

    requestDelete({
      title: 'Excluir workspace?',
      description: `Todos os dados de "${companyName}" serao excluidos: configuracoes, reunioes e analises deste workspace. Essa acao nao pode ser desfeita.`,
      confirmLabel: 'Excluir workspace',
      onConfirm: async () => {
        await onDeleteCompany(selectedCompanyId);
        setSuccessMessage('Workspace excluido.');
      },
    });
  }

  return (
    <form className="company-settings" onSubmit={handleSubmit}>
      <header className="feature-page__header company-settings__header">
        <div>
          <span>Configuracoes</span>
          <h2>Perfil da empresa</h2>
          <p>Organize a empresa, os produtos, os times, os grupos e as pessoas usadas pelo NOSTER.</p>
        </div>
        {settings ? (
          <Button disabled={isSaving} type="submit">
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando' : 'Salvar configuracoes'}
          </Button>
        ) : null}
      </header>

      {errors.form ? <p className="company-settings__error">{errors.form}</p> : null}
      {successMessage ? <p className="company-settings__success">{successMessage}</p> : null}

      <section className="company-settings__section">
        <div className="company-settings__section-heading">
          <div>
            <span>Workspace</span>
            <h3>Empresa ativa</h3>
          </div>
        </div>

        <div className="company-settings__workspace">
          <label className="company-settings__field">
            <span>Selecionar empresa</span>
            <select
              disabled={companies.length === 0}
              value={selectedCompanyId ?? ''}
              onChange={(event) => onSelectCompany(event.target.value)}
            >
              {companies.length === 0 ? <option value="">Nenhuma empresa criada</option> : null}
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

          <label className="company-settings__field">
            <span>Nova empresa</span>
            <Input
              value={newCompanyName}
              onChange={(event) => setNewCompanyName(event.target.value)}
              placeholder="Nome da empresa"
            />
            {errors.companySelector ? <small>{errors.companySelector}</small> : null}
          </label>

          <Button disabled={isSaving} onClick={handleCreateCompany} type="button" variant="secondary">
            <Plus size={16} aria-hidden="true" />
            Criar empresa
          </Button>
          <Button
            disabled={!selectedCompanyId || companies.length <= 1 || isSaving}
            onClick={requestDeleteCompany}
            type="button"
            variant="ghost"
          >
            <Trash2 size={16} aria-hidden="true" />
            Excluir workspace
          </Button>
        </div>
      </section>

      {!settings ? (
        <p className="company-settings__empty">
          Crie uma empresa para liberar produtos, times, grupos, pessoas, reunioes e analises.
        </p>
      ) : null}

      {settings ? (
      <section className="company-settings__section">
        <div className="company-settings__section-heading">
          <span>Empresa</span>
          <h3>Montar perfil</h3>
        </div>
        <div className="company-settings__grid">
          <Field error={errors['company.name']} label="Nome *">
            <Input value={draft.company.name} onChange={(event) => setCompanyField('name', event.target.value)} />
          </Field>
          <TextAreaField
            error={errors['company.about']}
            label="Sobre *"
            value={draft.company.about}
            onChange={(value) => setCompanyField('about', value)}
          />
          <TextAreaField
            error={errors['company.objectives']}
            label="Objetivos *"
            value={draft.company.objectives}
            onChange={(value) => setCompanyField('objectives', value)}
          />
          <TextAreaField
            error={errors['company.culture']}
            label="Cultura *"
            value={draft.company.culture}
            onChange={(value) => setCompanyField('culture', value)}
          />
        </div>
      </section>
      ) : null}

      {settings ? (
      <section className="company-settings__section">
        <div className="company-settings__section-heading">
          <div>
            <span>Empresa</span>
            <h3>Produtos</h3>
          </div>
          <Button
            onClick={() =>
              setDraft((currentDraft) => ({
                ...currentDraft,
                products: [...currentDraft.products, cloneProduct()],
              }))
            }
            type="button"
            variant="secondary"
          >
            <Plus size={16} aria-hidden="true" />
            Produto
          </Button>
        </div>

        <div className="company-settings__stack">
          {draft.products.map((product, productIndex) => (
            <article className="company-settings__card" key={product.id ?? productIndex}>
              <CardHeader
                title={`Produto ${productIndex + 1}`}
                onRemove={() =>
                  requestDelete({
                    title: 'Excluir produto?',
                    description: `O produto "${product.name || `Produto ${productIndex + 1}`}" sera removido deste workspace ao salvar.`,
                    onConfirm: () => removeProduct(productIndex),
                  })
                }
              />
              <div className="company-settings__grid">
                <Field error={errors[`products.${productIndex}.name`]} label="Nome *">
                  <Input value={product.name} onChange={(event) => updateProduct(productIndex, 'name', event.target.value)} />
                </Field>
                <Field error={errors[`products.${productIndex}.averagePrice`]} label="Media de preco *">
                  <Input
                    value={product.averagePrice}
                    onChange={(event) => updateProduct(productIndex, 'averagePrice', event.target.value)}
                    placeholder="Ex.: R$ 299/mes"
                  />
                </Field>
                <TextAreaField
                  error={errors[`products.${productIndex}.about`]}
                  label="Sobre *"
                  value={product.about}
                  onChange={(value) => updateProduct(productIndex, 'about', value)}
                />
                <TextAreaField
                  error={errors[`products.${productIndex}.solutionObjective`]}
                  label="Objetivo da solucao *"
                  value={product.solutionObjective}
                  onChange={(value) => updateProduct(productIndex, 'solutionObjective', value)}
                />
                <TextAreaField
                  error={errors[`products.${productIndex}.technology`]}
                  label="Tecnologia *"
                  value={product.technology}
                  onChange={(value) => updateProduct(productIndex, 'technology', value)}
                />
                <TextAreaField
                  error={errors[`products.${productIndex}.targetAudience`]}
                  label="Publico alvo *"
                  value={product.targetAudience}
                  onChange={(value) => updateProduct(productIndex, 'targetAudience', value)}
                />
              </div>
            </article>
          ))}
          {draft.products.length === 0 ? <EmptyBlock label="Nenhum produto cadastrado." /> : null}
        </div>
      </section>
      ) : null}

      {settings ? (
      <section className="company-settings__section">
        <div className="company-settings__section-heading">
          <div>
            <span>Empresa</span>
            <h3>Times, grupos e pessoas</h3>
          </div>
          <Button
            onClick={() =>
              setDraft((currentDraft) => ({
                ...currentDraft,
                teams: [...currentDraft.teams, cloneTeam()],
              }))
            }
            type="button"
            variant="secondary"
          >
            <Plus size={16} aria-hidden="true" />
            Time
          </Button>
        </div>

        <div className="company-settings__stack">
          {draft.teams.map((team, teamIndex) => (
            <article className="company-settings__card" key={team.id ?? teamIndex}>
              <CardHeader
                title={`Time ${teamIndex + 1}`}
                onRemove={() =>
                  requestDelete({
                    title: 'Excluir time?',
                    description: `O time "${team.name || `Time ${teamIndex + 1}`}" e seus grupos/pessoas serao removidos ao salvar.`,
                    onConfirm: () => removeTeam(teamIndex),
                  })
                }
              />
              <div className="company-settings__grid">
                <Field error={errors[`teams.${teamIndex}.name`]} label="Nome do time *">
                  <Input value={team.name} onChange={(event) => updateTeam(teamIndex, 'name', event.target.value)} />
                </Field>
                <TextAreaField
                  label="Sobre"
                  value={team.about ?? ''}
                  onChange={(value) => updateTeam(teamIndex, 'about', value)}
                />
              </div>

              <PeopleEditor
                errors={errors}
                people={team.people}
                title="Pessoas diretas"
                baseKey={`teams.${teamIndex}.people`}
                onAdd={() =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    teams: currentDraft.teams.map((currentTeam, currentTeamIndex) =>
                      currentTeamIndex === teamIndex
                        ? { ...currentTeam, people: [...currentTeam.people, clonePerson()] }
                        : currentTeam,
                    ),
                  }))
                }
                onRemove={(personIndex) =>
                  requestDelete({
                    title: 'Excluir pessoa?',
                    description: `A pessoa "${team.people[personIndex]?.email || 'selecionada'}" sera removida deste time ao salvar.`,
                    onConfirm: () => removeTeamPerson(teamIndex, personIndex),
                  })
                }
                onUpdate={(personIndex, field, value) => updateTeamPerson(teamIndex, personIndex, field, value)}
              />

              <div className="company-settings__nested-heading">
                <div>
                  <UsersRound size={16} aria-hidden="true" />
                  <strong>Grupos do time</strong>
                </div>
                <Button
                  onClick={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      teams: currentDraft.teams.map((currentTeam, currentTeamIndex) =>
                        currentTeamIndex === teamIndex
                          ? { ...currentTeam, groups: [...currentTeam.groups, cloneGroup()] }
                          : currentTeam,
                      ),
                    }))
                  }
                  type="button"
                  variant="ghost"
                >
                  <Plus size={16} aria-hidden="true" />
                  Grupo
                </Button>
              </div>

              <div className="company-settings__stack">
                {team.groups.map((group, groupIndex) => (
                  <article className="company-settings__subcard" key={group.id ?? groupIndex}>
                    <CardHeader
                      title={`Grupo ${groupIndex + 1}`}
                      onRemove={() =>
                        requestDelete({
                          title: 'Excluir grupo?',
                          description: `O grupo "${group.name || `Grupo ${groupIndex + 1}`}" e suas pessoas serao removidos ao salvar.`,
                          onConfirm: () => removeGroup(teamIndex, groupIndex),
                        })
                      }
                    />
                    <div className="company-settings__grid">
                      <Field error={errors[`teams.${teamIndex}.groups.${groupIndex}.name`]} label="Nome do grupo *">
                        <Input
                          value={group.name}
                          onChange={(event) => updateGroup(teamIndex, groupIndex, 'name', event.target.value)}
                        />
                      </Field>
                      <TextAreaField
                        label="Sobre"
                        value={group.about ?? ''}
                        onChange={(value) => updateGroup(teamIndex, groupIndex, 'about', value)}
                      />
                    </div>
                    <PeopleEditor
                      errors={errors}
                      people={group.people}
                      title="Pessoas do grupo"
                      baseKey={`teams.${teamIndex}.groups.${groupIndex}.people`}
                      onAdd={() =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          teams: currentDraft.teams.map((currentTeam, currentTeamIndex) =>
                            currentTeamIndex === teamIndex
                              ? {
                                  ...currentTeam,
                                  groups: currentTeam.groups.map((currentGroup, currentGroupIndex) =>
                                    currentGroupIndex === groupIndex
                                      ? { ...currentGroup, people: [...currentGroup.people, clonePerson()] }
                                      : currentGroup,
                                  ),
                                }
                              : currentTeam,
                          ),
                        }))
                      }
                      onRemove={(personIndex) =>
                        requestDelete({
                          title: 'Excluir pessoa?',
                          description: `A pessoa "${group.people[personIndex]?.email || 'selecionada'}" sera removida deste grupo ao salvar.`,
                          onConfirm: () => removeGroupPerson(teamIndex, groupIndex, personIndex),
                        })
                      }
                      onUpdate={(personIndex, field, value) =>
                        updateGroupPerson(teamIndex, groupIndex, personIndex, field, value)
                      }
                    />
                  </article>
                ))}
              </div>
            </article>
          ))}
          {draft.teams.length === 0 ? <EmptyBlock label="Nenhum time cadastrado." /> : null}
        </div>
      </section>
      ) : null}
      <ConfirmDialog
        confirmLabel={confirmDialog?.confirmLabel}
        description={confirmDialog?.description ?? ''}
        isOpen={Boolean(confirmDialog)}
        isSubmitting={isConfirmSubmitting}
        title={confirmDialog?.title ?? ''}
        onClose={() => setConfirmDialog(null)}
        onConfirm={handleConfirmDelete}
      />
    </form>
  );
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return (
    <label className="company-settings__field">
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function TextAreaField({
  error,
  label,
  onChange,
  value,
}: {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="company-settings__field company-settings__field--wide">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function CardHeader({ onRemove, title }: { onRemove: () => void; title: string }) {
  return (
    <header className="company-settings__card-header">
      <h4>{title}</h4>
      <button aria-label={`Remover ${title}`} onClick={onRemove} type="button">
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </header>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return <p className="company-settings__empty">{label}</p>;
}

function PeopleEditor({
  baseKey,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  people,
  title,
}: {
  baseKey: string;
  errors: SettingsErrors;
  onAdd: () => void;
  onRemove: (personIndex: number) => void;
  onUpdate: (personIndex: number, field: keyof CompanyPersonSettings, value: string) => void;
  people: CompanyPersonSettings[];
  title: string;
}) {
  return (
    <section className="company-settings__people">
      <div className="company-settings__nested-heading">
        <strong>{title}</strong>
        <Button onClick={onAdd} type="button" variant="ghost">
          <Plus size={16} aria-hidden="true" />
          Pessoa
        </Button>
      </div>

      <div className="company-settings__people-list">
        {people.map((person, personIndex) => (
          <article className="company-settings__person" key={person.id ?? personIndex}>
            <Field error={errors[`${baseKey}.${personIndex}.email`]} label="Email *">
              <Input
                value={person.email}
                onChange={(event) => onUpdate(personIndex, 'email', event.target.value)}
                type="email"
              />
            </Field>
            <Field label="Cargo">
              <Input value={person.role ?? ''} onChange={(event) => onUpdate(personIndex, 'role', event.target.value)} />
            </Field>
            <Field error={errors[`${baseKey}.${personIndex}.reportsToEmail`]} label="Responde a quem">
              <Input
                value={person.reportsToEmail ?? ''}
                onChange={(event) => onUpdate(personIndex, 'reportsToEmail', event.target.value)}
                placeholder="email@empresa.com"
                type="email"
              />
            </Field>
            <button aria-label="Remover pessoa" onClick={() => onRemove(personIndex)} type="button">
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </article>
        ))}
        {people.length === 0 ? <EmptyBlock label="Nenhuma pessoa cadastrada aqui." /> : null}
      </div>
    </section>
  );
}
