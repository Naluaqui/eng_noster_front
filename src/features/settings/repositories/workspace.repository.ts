const selectedCompanyStorageKey = 'noster.selectedCompanyId';
export const selectedCompanyChangedEvent = 'noster.selectedCompany.changed';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getSelectedCompanyId() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(selectedCompanyStorageKey);
}

export function setSelectedCompanyId(companyId: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (companyId) {
    window.localStorage.setItem(selectedCompanyStorageKey, companyId);
  } else {
    window.localStorage.removeItem(selectedCompanyStorageKey);
  }

  window.dispatchEvent(new Event(selectedCompanyChangedEvent));
}

export function getSelectedCompanyHeaders(): Record<string, string> {
  const companyId = getSelectedCompanyId();

  return companyId ? { 'X-Company-Id': companyId } : {};
}
