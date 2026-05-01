'use client';

import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { AccountSettings } from '../components/AccountSettings';
import { useSettings } from '../hooks/useSettings';

export function SettingsScreen() {
  const {
    companies,
    selectedCompanyId,
    settings,
    isLoading,
    isSaving,
    error,
    createCompany,
    deleteCompany,
    saveSettings,
    selectCompany,
  } = useSettings();

  if (isLoading) {
    return <LoadingState label="Carregando configuracoes..." />;
  }

  if (error) {
    return <EmptyState title="Erro ao carregar configuracoes" description={error} />;
  }

  return (
    <AccountSettings
      companies={companies}
      isSaving={isSaving}
      selectedCompanyId={selectedCompanyId}
      settings={settings}
      onCreateCompany={createCompany}
      onDeleteCompany={deleteCompany}
      onSave={saveSettings}
      onSelectCompany={selectCompany}
      key={selectedCompanyId ?? 'empty-company'}
    />
  );
}
