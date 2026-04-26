import { ChevronDown, ShoppingBag, Store, Utensils, WashingMachine } from 'lucide-react';

const transactions = [
  { label: 'Shopping', date: '05 Junho 2026', value: 'R$ 300', icon: ShoppingBag },
  { label: 'Bakery', date: '04 Junho 2026', value: 'R$ 35', icon: Store },
  { label: 'Restaurant', date: '03 Junho 2026', value: 'R$ 400', icon: Utensils },
  { label: 'Laundry', date: '02 Junho 2026', value: 'R$ 25', icon: WashingMachine },
];

export function DecisionFinancialHistory() {
  return (
    <section className="decision-financial-history" aria-label="Histórico financeiro da decisão">
      <article className="decision-balance-card">
        <header>
          <div>
            <span>My Balance</span>
            <strong>R$17.754,00</strong>
          </div>
          <button type="button">
            Monthly
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <div className="decision-balance-chart">
          <svg viewBox="0 0 520 220" role="img" aria-label="Evolução do saldo mensal">
            <line x1="0" x2="520" y1="48" y2="48" />
            <line x1="0" x2="520" y1="98" y2="98" />
            <line x1="0" x2="520" y1="148" y2="148" />
            <path d="M8 168 C48 142 52 74 94 70 C132 66 126 142 168 140 C204 138 202 106 236 112 C274 118 268 155 306 134 C344 113 334 42 374 36 C420 30 394 169 438 168 C472 167 464 122 498 124 C512 126 514 150 522 138" />
            <circle cx="374" cy="36" r="8" />
          </svg>
          <aside>
            <span>Income</span>
            <strong>R$20.435,00</strong>
          </aside>
        </div>
      </article>

      <article className="decision-transaction-card">
        <header>
          <h2>Transaction History</h2>
          <button type="button">
            Sort by
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </header>

        <ul>
          {transactions.map((transaction) => {
            const Icon = transaction.icon;

            return (
              <li key={transaction.label}>
                <i>
                  <Icon size={16} aria-hidden="true" />
                </i>
                <span>{transaction.label}</span>
                <time>{transaction.date}</time>
                <strong>{transaction.value}</strong>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
