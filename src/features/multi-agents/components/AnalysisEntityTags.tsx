import type { AiAnalysis, AiDetectedCompany, AiDetectedProduct, AiDetectedTheme } from '../types/multiAgent';

type AnalysisEntityTagsProps = {
  analysis: AiAnalysis;
};

export function AnalysisEntityTags({ analysis }: AnalysisEntityTagsProps) {
  const groups: Array<{ label: string; values: Array<string | AiDetectedCompany | AiDetectedProduct | AiDetectedTheme> }> = [
    { label: 'Temas', values: analysis.entidades_detectadas.temas },
    { label: 'Empresas', values: analysis.entidades_detectadas.empresas },
    { label: 'Produtos', values: analysis.entidades_detectadas.produtos },
  ].filter((group) => group.values.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="analysis-entity-tags" aria-label="Entidades detectadas">
      {groups.map((group) => (
        <div key={group.label}>
          <strong>{group.label}</strong>
          <ul>
            {group.values.map((value) => (
              <li key={`${group.label}-${getEntityName(value)}`}>{getEntityName(value)}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function getEntityName(value: string | AiDetectedCompany | AiDetectedProduct | AiDetectedTheme) {
  if (typeof value === 'string') {
    return value;
  }

  return 'tema' in value ? value.tema : value.nome;
}
