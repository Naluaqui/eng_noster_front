import { Card } from '@/shared/components/ui/Card';

const summaryItems = [
  { label: 'Risco principal', value: 'Baixa clareza de prioridade' },
  { label: 'Próximo passo', value: 'Validar impacto financeiro' },
  { label: 'Sinal forte', value: 'Cliente demonstrou urgência' },
];

export function DecisionSummary() {
  return (
    <aside className="decision-summary" aria-label="Resumo da decisão">
      {summaryItems.map((item) => (
        <Card key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </Card>
      ))}
    </aside>
  );
}
