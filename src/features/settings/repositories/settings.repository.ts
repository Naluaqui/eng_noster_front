import type {
  CompanySettings,
  CompanySummary,
  CreateCompanyInput,
  UpdateCompanySettingsInput,
} from '../types/settings';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3334';

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Nao foi possivel carregar as configuracoes.');
  }

  return result.data;
}

export async function getCompanySettings() {
  const response = await fetch(`${apiUrl}/api/settings/company`);

  return parseApiResponse<CompanySettings>(response);
}

export async function listCompanies() {
  const response = await fetch(`${apiUrl}/api/settings/companies`);

  return parseApiResponse<CompanySummary[]>(response);
}

export async function createCompany(input: CreateCompanyInput) {
  const response = await fetch(`${apiUrl}/api/settings/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<CompanySummary>(response);
}

export async function deleteCompany(companyId: string) {
  const response = await fetch(`${apiUrl}/api/settings/companies/${companyId}`, {
    method: 'DELETE',
  });

  return parseApiResponse<CompanySummary[]>(response);
}

export async function getCompanySettingsById(companyId: string) {
  const response = await fetch(`${apiUrl}/api/settings/company?companyId=${encodeURIComponent(companyId)}`);

  return parseApiResponse<CompanySettings>(response);
}

export async function updateCompanySettings(companyId: string, input: UpdateCompanySettingsInput) {
  const response = await fetch(`${apiUrl}/api/settings/company?companyId=${encodeURIComponent(companyId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<CompanySettings>(response);
}
