import { ArrowUpRight, FileText, Mail, Phone } from 'lucide-react';
import type { PersuasionSidebarStat, PersuasionWorklistItem } from '../types/persuasion';

const channelIcons = {
  document: FileText,
  phone: Phone,
  email: Mail,
} as const;

type PersuasionRightSidebarProps = {
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  stats: PersuasionSidebarStat[];
  worklist: PersuasionWorklistItem[];
};

export function PersuasionRightSidebar({
  activeProfileId,
  onSelectProfile,
  stats,
  worklist,
}: PersuasionRightSidebarProps) {
  return (
    <aside className="persuasion-right-sidebar" aria-labelledby="persuasion-worklist-title">
      <section className="persuasion-sidebar-stats" aria-label="Resumo de persuasão">
        {stats.map((stat) => (
          <article className="persuasion-sidebar-stat" data-tone={stat.tone} key={stat.id}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="persuasion-worklist" aria-labelledby="persuasion-worklist-title">
        <header>
          <div>
            <span>Worklist</span>
            <h2 id="persuasion-worklist-title">Empresas persuasivas</h2>
          </div>
          <button type="button" aria-label="Expandir worklist">
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </header>

        <div className="persuasion-worklist__items">
          {worklist.map((item) => {
            const Icon = channelIcons[item.channel];

            return (
              <button
                className={`persuasion-worklist-item${item.profileId === activeProfileId ? ' is-active' : ''}`}
                key={item.id}
                onClick={() => onSelectProfile(item.profileId)}
                type="button"
              >
                <img src={item.avatar} alt={`Identidade de ${item.name}`} />

                <div className="persuasion-worklist-item__content">
                  <header>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.role}</p>
                    </div>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </header>

                  <footer>
                    <span>
                      <Icon size={13} aria-hidden="true" />
                      {item.status}
                    </span>
                    <strong data-priority={item.priority}>{item.priority}</strong>
                  </footer>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
