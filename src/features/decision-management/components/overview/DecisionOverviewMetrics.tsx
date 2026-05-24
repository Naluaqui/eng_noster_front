'use client';

import { useState } from 'react';
import { Activity, CircleDollarSign, Filter, Share2, ShoppingCart, Workflow } from 'lucide-react';
import type {
  DecisionFilters,
  DecisionOfferingOption,
  DecisionOverviewMetric,
} from '../../types/decision-management';

const overviewMetrics: DecisionOverviewMetric[] = [
  {
    label: 'Aderência Oferta x Cliente',
    value: '80%',
    trend: '+10%',
    previous: 'Último mês: 70%',
    featured: true,
  },
  {
    label: 'Saúde Comercial',
    value: '68%',
    trend: '-7%',
    previous: 'Último mês: 75%',
  },
  {
    label: 'Gargalo Estratégico',
    value: '24%',
    trend: '+9%',
    previous: 'Último mês: 15%',
  },
  {
    label: 'Receita em risco',
    value: 'R$ 8.220,64',
    trend: 'crítico',
    previous: 'Último mês: R$ 520,00',
  },
];

const metricIcons = [ShoppingCart, Activity, Workflow, CircleDollarSign];

type DecisionOverviewMetricsProps = {
  data?: DecisionOverviewMetric[];
  filters: DecisionFilters;
  offeringOptions: DecisionOfferingOption[];
  onFiltersChange: (nextFilters: DecisionFilters) => void;
};

export function DecisionOverviewMetrics({
  data,
  filters,
  offeringOptions,
  onFiltersChange,
}: DecisionOverviewMetricsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const metrics = data ?? overviewMetrics;

  function updateFilter(field: keyof DecisionFilters, value: string) {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  }

  function clearFilters() {
    onFiltersChange({
      startDate: '',
      endDate: '',
      offering: '',
    });
  }

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
          <button
            aria-expanded={isFilterOpen}
            aria-controls="decision-overview-filter-menu"
            className="is-active"
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
          >
            <Filter size={15} aria-hidden="true" />
            Filtrar
          </button>
        </div>
      </header>

      {isFilterOpen ? (
        <div className="decision-overview-filter-menu" id="decision-overview-filter-menu">
          <label>
            <span>Data inicial</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => updateFilter('startDate', event.target.value)}
            />
          </label>

          <label>
            <span>Data final</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => updateFilter('endDate', event.target.value)}
            />
          </label>

          <label className="decision-overview-filter-menu__offering">
            <span>Produtos e Serviços, linhas e segmento</span>
            <select
              value={filters.offering}
              onChange={(event) => updateFilter('offering', event.target.value)}
            >
              <option value="">Portfólio completo TOTVS</option>
              {offeringOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.category}
                </option>
              ))}
            </select>
          </label>

          <button className="decision-overview-filter-menu__clear" onClick={clearFilters} type="button">
            Limpar filtros
          </button>
        </div>
      ) : null}

      <div className="decision-overview-metrics__grid">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[index] ?? ShoppingCart;

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
