import type { CSSProperties } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

const performanceMonths = [
  { month: 'Mai', total: 88, revenue: 43 },
  { month: 'Jun', total: 36, revenue: 27 },
  { month: 'Jul', total: 29, revenue: 22 },
  { month: 'Ago', total: 72, revenue: 58, selected: true },
  { month: 'Set', total: 46, revenue: 18 },
  { month: 'Out', total: 62, revenue: 34 },
  { month: 'Nov', total: 86, revenue: 48 },
  { month: 'Dez', total: 54, revenue: 21 },
];

const gaugeSegments = Array.from({ length: 18 }, (_, index) => index);

export function DecisionPerformanceOverview() {
  return (
    <section className="decision-performance-overview" aria-label="Performance da gestão de decisão">
      <article className="decision-performance-card">
        <header>
          <h2>Performance Overview</h2>
          <button type="button">
            This Week
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <div className="decision-performance-chart" aria-label="Comparativo mensal de vendas e receita">
          {performanceMonths.map((item) => (
            <figure className={item.selected ? 'is-selected' : undefined} key={item.month}>
              <div>
                <i style={{ '--height': `${item.total}%` } as CSSProperties} />
                <i style={{ '--height': `${item.revenue}%` } as CSSProperties} />
              </div>
              <figcaption>{item.month}</figcaption>
            </figure>
          ))}

          <aside className="decision-performance-tooltip" aria-label="Agosto de 2026">
            <strong>Agosto 2026</strong>
            <span>Total Sales <b>440</b></span>
            <span>Total Revenue <b>$4.5k</b></span>
          </aside>
        </div>
      </article>

      <article className="decision-growth-card">
        <header>
          <h2>Sales Overview</h2>
          <button type="button" aria-label="Mais opções">
            <MoreHorizontal size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="decision-growth-gauge" aria-label="70.8 por cento de crescimento">
          {gaugeSegments.map((segment) => (
            <i
              className={segment < 13 ? 'is-active' : undefined}
              key={segment}
              style={{ '--segment': segment } as CSSProperties}
            />
          ))}
          <strong>70.8%</strong>
          <span>Sales Growth</span>
        </div>

        <footer>
          <div>
            <span>Number of Sales</span>
            <strong>2,343</strong>
            <em>+5.1%</em>
          </div>
          <div>
            <span>Total Revenue</span>
            <strong>$30.9k</strong>
            <em>+4.5%</em>
          </div>
        </footer>
      </article>
    </section>
  );
}
