import { businessPersonas } from '@/shared/constants/personas';

export function PerspectiveSelector() {
  return (
    <div className="perspective-selector" aria-label="Perspectivas estratégicas">
      {businessPersonas.map((persona) => (
        <button type="button" key={persona}>
          {persona}
        </button>
      ))}
    </div>
  );
}
