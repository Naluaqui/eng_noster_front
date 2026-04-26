import { BadgeDollarSign, Brain, HeartPulse, Megaphone } from 'lucide-react';

const suggestions = [
  {
    title: 'Cliente',
    description: 'Mapear dores, objeções e expectativas ocultas.',
    icon: HeartPulse,
  },
  {
    title: 'Razão',
    description: 'Testar coerência lógica e inconsistências.',
    icon: Brain,
  },
  {
    title: 'Financeiro',
    description: 'Medir impacto econômico e viabilidade.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Marketing',
    description: 'Avaliar narrativa e percepção de valor.',
    icon: Megaphone,
  },
];

export function AgentSuggestionGrid() {
  return (
    <section className="agent-suggestions" aria-label="Sugestões de agentes">
      {suggestions.map((suggestion) => {
        const Icon = suggestion.icon;

        return (
          <button type="button" key={suggestion.title}>
            <Icon size={17} aria-hidden="true" />
            <strong>{suggestion.title}</strong>
            <span>{suggestion.description}</span>
          </button>
        );
      })}
    </section>
  );
}
