import { ProfileSettingsForm } from './ProfileSettingsForm';
import { PreferencesForm } from './PreferencesForm';

export function AccountSettings() {
  return (
    <main className="feature-page">
      <header className="feature-page__header">
        <div>
          <span>Configurações</span>
          <h2>Conta e preferências</h2>
        </div>
      </header>
      <section className="settings-grid">
        <ProfileSettingsForm />
        <PreferencesForm />
      </section>
    </main>
  );
}
