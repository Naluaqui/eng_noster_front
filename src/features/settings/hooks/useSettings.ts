'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createCompany as createCompanyRepository,
  deleteCompany as deleteCompanyRepository,
  getCompanySettingsById,
  listCompanies,
  updateCompanySettings as updateCompanySettingsRepository,
} from '../repositories/settings.repository';
import {
  getSelectedCompanyId,
  selectedCompanyChangedEvent,
  setSelectedCompanyId,
} from '../repositories/workspace.repository';
import type {
  CompanySettings,
  CompanySummary,
  CreateCompanyInput,
  UpdateCompanySettingsInput,
} from '../types/settings';

export function useSettings() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nextCompanies = await listCompanies();
      const storedCompanyId = getSelectedCompanyId();
      const nextSelectedCompany =
        nextCompanies.find((company) => company.id === storedCompanyId) ?? nextCompanies[0] ?? null;

      setCompanies(nextCompanies);

      if (!nextSelectedCompany) {
        setSelectedCompanyId(null);
        setSelectedCompanyIdState(null);
        setSettings(null);
        return;
      }

      if (nextSelectedCompany.id !== storedCompanyId) {
        setSelectedCompanyId(nextSelectedCompany.id);
      }

      const nextSettings = await getCompanySettingsById(nextSelectedCompany.id);

      setSelectedCompanyIdState(nextSelectedCompany.id);
      setSettings(nextSettings);
    } catch {
      setError('Nao foi possivel carregar as configuracoes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadSettings);
  }, [loadSettings]);

  useEffect(() => {
    window.addEventListener(selectedCompanyChangedEvent, loadSettings);

    return () => {
      window.removeEventListener(selectedCompanyChangedEvent, loadSettings);
    };
  }, [loadSettings]);

  const selectCompany = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId);
  }, []);

  const createCompany = useCallback(async (input: CreateCompanyInput) => {
    setIsSaving(true);
    setError(null);

    try {
      const company = await createCompanyRepository(input);
      setSelectedCompanyId(company.id);
      return company;
    } catch {
      setError('Nao foi possivel criar a empresa.');
      throw new Error('Nao foi possivel criar a empresa.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteCompany = useCallback(
    async (companyId: string) => {
      setIsSaving(true);
      setError(null);

      try {
        const nextCompanies = await deleteCompanyRepository(companyId);
        const nextSelectedCompany =
          nextCompanies.find((company) => company.id === selectedCompanyId) ?? nextCompanies[0] ?? null;

        setCompanies(nextCompanies);

        if (!nextSelectedCompany) {
          setSelectedCompanyId(null);
          setSelectedCompanyIdState(null);
          setSettings(null);
          return nextCompanies;
        }

        setSelectedCompanyId(nextSelectedCompany.id);

        return nextCompanies;
      } catch {
        setError('Nao foi possivel excluir a empresa.');
        throw new Error('Nao foi possivel excluir a empresa.');
      } finally {
        setIsSaving(false);
      }
    },
    [selectedCompanyId],
  );

  const saveSettings = useCallback(
    async (input: UpdateCompanySettingsInput) => {
      if (!selectedCompanyId) {
        throw new Error('Selecione uma empresa antes de salvar.');
      }

      setIsSaving(true);
      setError(null);

      try {
        const savedSettings = await updateCompanySettingsRepository(selectedCompanyId, input);
        const nextCompanies = await listCompanies();

        setSettings(savedSettings);
        setCompanies(nextCompanies);

        return savedSettings;
      } catch {
        setError('Nao foi possivel salvar as configuracoes.');
        throw new Error('Nao foi possivel salvar as configuracoes.');
      } finally {
        setIsSaving(false);
      }
    },
    [selectedCompanyId],
  );

  return {
    companies,
    selectedCompanyId,
    selectedCompany: companies.find((company) => company.id === selectedCompanyId) ?? null,
    settings,
    isLoading,
    isSaving,
    error,
    createCompany,
    deleteCompany,
    saveSettings,
    selectCompany,
  };
}
