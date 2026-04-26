import { ArrowRight, AtSign, Globe, MessageCircle, Pencil, Send, Share2 } from 'lucide-react';
import { persuasionProfile, persuasionSocials, persuasionTracks } from '../data/persuasionProfile';
import { PersuasionRightSidebar } from './PersuasionRightSidebar';

const socialIcons = {
  Instagram: AtSign,
  Facebook: Share2,
  X: MessageCircle,
  LinkedIn: Globe,
  Telegram: Send,
} as const;

export function PersuasionDashboard() {
  return (
    <main className="persuasion-page" aria-labelledby="persuasion-title">
      <div className="persuasion-page__main">
        <section className="persuasion-profile-card" aria-label="Perfil de persuasão">
          <img src={persuasionProfile.avatar} alt={`Retrato de ${persuasionProfile.name}`} />

          <div className="persuasion-profile-card__content">
            <header>
              <div>
                <span>Persuasão</span>
                <h2 id="persuasion-title">{persuasionProfile.name}</h2>
                <p>{persuasionProfile.role}</p>
              </div>

              <button type="button" aria-label="Editar perfil de persuasão">
                <Pencil size={16} aria-hidden="true" />
              </button>
            </header>

            <dl>
              <div>
                <dt>Data de registro:</dt>
                <dd>{persuasionProfile.registeredAt}</dd>
              </div>
              <div>
                <dt>País, cidade:</dt>
                <dd>{persuasionProfile.location}</dd>
              </div>
              <div>
                <dt>Data de nascimento:</dt>
                <dd>{persuasionProfile.birthDate}</dd>
              </div>
              <div>
                <dt>E-mail:</dt>
                <dd>{persuasionProfile.email}</dd>
              </div>
              <div>
                <dt>Telefone:</dt>
                <dd>{persuasionProfile.phone}</dd>
              </div>
            </dl>

            <nav className="persuasion-profile-card__socials" aria-label="Canais de persuasão">
              {persuasionSocials.map((social) => {
                const Icon = socialIcons[social];

                return (
                  <button type="button" key={social} aria-label={social}>
                    <Icon size={14} aria-hidden="true" />
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        <section className="persuasion-tracks-card" aria-labelledby="persuasion-tracks-title">
          <header>
            <div>
              <span>Jornadas</span>
              <h2 id="persuasion-tracks-title">Minhas trilhas de persuasão</h2>
            </div>
          </header>

          <div className="persuasion-tracks-card__body">
            <ol className="persuasion-timeline" aria-hidden="true">
              {persuasionTracks.map((track) => (
                <li key={track.id} />
              ))}
            </ol>

            <div className="persuasion-track-list">
              {persuasionTracks.map((track) => (
                <article className="persuasion-track-card" data-tone={track.tone} key={track.id}>
                  <div>
                    <h3>{track.title}</h3>
                    <p>{track.description}</p>
                    <span>{track.lessons}</span>
                  </div>

                  <strong>{track.status}</strong>

                  <button type="button" aria-label={`Abrir ${track.title}`}>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <PersuasionRightSidebar />
    </main>
  );
}
