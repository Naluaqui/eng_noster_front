import { Activity, CircleDollarSign, Filter, Share2, ShoppingCart, Workflow } from 'lucide-react';

const overviewMetrics = [
  {
    label: 'Aderência Produto x Cliente',
    value: '80%',
    trend: '+10%',
    previous: 'Último mês: 70%',
    icon: ShoppingCart,
    featured: true,
  },
  {
    label: 'Saúde Comercial',
    value: '68%',
    trend: '-7%',
    previous: 'Último mês: 75%',
    icon: Activity,
  },
  {
    label: 'Gargalo Estratégico',
    value: '24%',
    trend: '+9%',
    previous: 'Último mês: 15%',
    icon: Workflow,
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
          <h2 id="decision-overview-title">Resumo de conversão</h2>
          <p>Síntese atual de sinais, risco e avanço comercial.</p>
        </div>

        <div className="decision-overview-metrics__actions">
          <button type="button">Este mês</button>
          <button type="button">
            <Share2 size={15} aria-hidden="true" />
            Exportar
          </button>
          <button className="is-active" type="button">
            <Filter size={15} aria-hidden="true" />
            Filtrar
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
