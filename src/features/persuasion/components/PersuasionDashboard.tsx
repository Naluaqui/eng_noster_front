import { ArrowRight, AtSign, Globe, MessageCircle, Pencil, Send, Share2 } from 'lucide-react';
import type {
  PersuasionProfile,
  PersuasionSidebarStat,
  PersuasionSocial,
  PersuasionTrack,
  PersuasionWorklistItem,
} from '../types/persuasion';
import { PersuasionRightSidebar } from './PersuasionRightSidebar';

const socialIcons = {
  Instagram: AtSign,
  Facebook: Share2,
  X: MessageCircle,
  LinkedIn: Globe,
  Telegram: Send,
} satisfies Record<PersuasionSocial, typeof AtSign>;

type PersuasionDashboardProps = {
  profile: PersuasionProfile;
  socials: PersuasionSocial[];
  tracks: PersuasionTrack[];
  sidebarStats: PersuasionSidebarStat[];
  worklist: PersuasionWorklistItem[];
  onSelectProfile: (profileId: string) => void;
};

export function PersuasionDashboard({
  profile,
  socials,
  tracks,
  sidebarStats,
  worklist,
  onSelectProfile,
}: PersuasionDashboardProps) {
  return (
    <main className="persuasion-page" aria-labelledby="persuasion-title">
      <div className="persuasion-page__main">
        <section className="persuasion-profile-card" aria-label="Perfil de persuasão da empresa">
          <img src={profile.avatar} alt={`Identidade de ${profile.name}`} />

          <div className="persuasion-profile-card__content">
            <header>
              <div>
                <span>Persuasão</span>
                <h2 id="persuasion-title">{profile.name}</h2>
                <p>{profile.role}</p>
              </div>

              <button type="button" aria-label="Editar perfil de persuasão">
                <Pencil size={16} aria-hidden="true" />
              </button>
            </header>

            <dl>
              <div>
                <dt>Data de registro:</dt>
                <dd>{profile.registeredAt}</dd>
              </div>
              <div>
                <dt>País, cidade:</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Setor:</dt>
                <dd>{profile.industry}</dd>
              </div>
              <div>
                <dt>E-mail:</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Telefone:</dt>
                <dd>{profile.phone}</dd>
              </div>
              {profile.linkedMeetings && profile.linkedMeetings.length > 0 ? (
                <div>
                  <dt>Reunião vinculada:</dt>
                  <dd>{profile.linkedMeetings.map((meeting) => meeting.title).join(', ')}</dd>
                </div>
              ) : null}
            </dl>

            <nav className="persuasion-profile-card__socials" aria-label="Canais de persuasão">
              {socials.map((social) => {
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
              {tracks.map((track) => (
                <li key={track.id} />
              ))}
            </ol>

            <div className="persuasion-track-list">
              {tracks.map((track) => (
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

      <PersuasionRightSidebar
        activeProfileId={profile.id}
        onSelectProfile={onSelectProfile}
        stats={sidebarStats}
        worklist={worklist}
      />
    </main>
  );
}
