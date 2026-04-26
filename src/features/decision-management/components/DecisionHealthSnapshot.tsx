import { CalendarDays, MoreHorizontal } from 'lucide-react';

const progressItems = [
  { date: '22 Agosto, 2024', value: 72 },
  { date: '16 Agosto, 2024', value: 58 },
];

export function DecisionHealthSnapshot() {
  return (
    <section className="decision-health-snapshot" aria-label="Resumo de saúde da decisão">
      <article className="decision-health-report">
        <header>
          <h2>Health Report Pending</h2>
          <button type="button">Report</button>
        </header>
        <svg viewBox="0 0 260 130" role="img" aria-label="Tendência de relatório pendente">
          <path d="M8 76 C42 76 45 78 74 74 C102 70 112 96 139 73 C160 54 179 68 196 48 C216 24 234 30 252 44" />
          <path d="M8 76 C42 76 45 78 74 74 C102 70 112 96 139 73 C160 54 179 68 196 48 C216 24 234 30 252 44" />
          <line x1="88" x2="88" y1="18" y2="112" />
        </svg>
        <div className="decision-health-report__legend">
          <span>15 Report</span>
          <span>10 No Report</span>
        </div>
      </article>

      <article className="decision-doctor-card">
        <header>
          <i />
          <button type="button">Today&apos;s info</button>
        </header>
        <div>
          <span>News From The Doctor</span>
          <p>Our process is designed to make tracking opportunities, consultation, and treatments easy.</p>
        </div>
        <footer>
          <i />
          <i />
          <i />
        </footer>
      </article>

      <article className="decision-trend-card">
        <header>
          <h2>Health Trend Chart</h2>
          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </header>
        <strong>85%</strong>
        <em>+0.75%</em>
        <svg viewBox="0 0 180 90" role="img" aria-label="Tendência de saúde">
          <polyline points="0,70 35,70 35,48 70,48 70,32 105,32 105,20 140,20 140,4 176,4" />
        </svg>
      </article>

      <article className="decision-checkup-card">
        <header>
          <h2>Checkup progress</h2>
          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </header>
        <div>
          {progressItems.map((item) => (
            <section key={item.date}>
              <CalendarDays size={17} aria-hidden="true" />
              <div>
                <strong>{item.date}</strong>
                <i style={{ '--progress': `${item.value}%` } as React.CSSProperties} />
              </div>
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}
