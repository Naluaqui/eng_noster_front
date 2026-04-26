import { Box, CircleDollarSign, Filter, Share2, ShoppingCart, UsersRound } from 'lucide-react';

const overviewMetrics = [
  {
    label: 'Reuniões analisadas',
    value: '2500',
    trend: '+4.8%',
    previous: 'Último mês: 2345',
    icon: ShoppingCart,
    featured: true,
  },
  {
    label: 'Novos sinais',
    value: '110',
    trend: '+7.5%',
    previous: 'Último mês: 89',
    icon: UsersRound,
  },
  {
    label: 'Objeções recorrentes',
    value: '72',
    trend: '-6.8%',
    previous: 'Último mês: 60',
    icon: Box,
  },
  {
    label: 'Receita em risco',
    value: 'R$ 8.220,64',
    trend: 'crítico',
    previous: 'Último mês: R$ 520,00',
    icon: CircleDollarSign,
  },
];

export function DecisionOverviewMetrics() {
  return (
    <section className="decision-overview-metrics" aria-labelledby="decision-overview-title">
      <header>
        <div>
          <h2 id="decision-overview-title">Sales Overview</h2>
          <p>Your current sales summary and activity</p>
        </div>

        <div className="decision-overview-metrics__actions">
          <button type="button">This Month</button>
          <button type="button">
            <Share2 size={15} aria-hidden="true" />
            Export
          </button>
          <button className="is-active" type="button">
            <Filter size={15} aria-hidden="true" />
            Filter
          </button>
        </div>
      </header>

      <div className="decision-overview-metrics__grid">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className={metric.featured ? 'is-featured' : undefined} key={metric.label}>
              <div>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.previous}</small>
              </div>
              <div className="decision-overview-metrics__meta">
                <em>{metric.trend}</em>
                <i>
                  <Icon size={18} aria-hidden="true" />
                </i>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
