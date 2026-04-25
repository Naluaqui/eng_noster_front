import { businessPersonas } from '@/shared/constants/personas';

export function PersonasMiniHeader() {
  return (
    <header className="personas-mini-header">
      <div>
        <span>Personas</span>
        <h2>Mentes de negócio</h2>
      </div>
      <div aria-label="Seleção de persona">
        {businessPersonas.map((persona) => (
          <button type="button" key={persona}>
            {persona}
          </button>
        ))}
      </div>
    </header>
  );
}
