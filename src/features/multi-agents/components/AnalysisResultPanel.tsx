import type { AiAnalysis, AiDetectedCompany, AiDetectedProduct, AiDetectedTheme } from '../types/multiAgent';

type AnalysisResultPanelProps = {
  analysis: AiAnalysis;
};

const solutionLabels = [
  ['onde_focar', 'Onde focar'],
  ['o_que_fazer', 'O que fazer'],
  ['como_fazer', 'Como fazer'],
  ['porque', 'Por que'],
  ['impactos', 'Impactos'],
  ['proximo_passo_imediato', 'Proximo passo imediato'],
] as const;

export function AnalysisResultPanel({ analysis }: AnalysisResultPanelProps) {
  const focusProductName = getFocusProductName(analysis);

  return (
    <section className="analysis-result" aria-label="Analise consolidada">
      {analysis.resposta_da_pergunta ? (
        <article className="analysis-result__answer">
          <span>Resposta da pergunta</span>
          <p>{analysis.resposta_da_pergunta}</p>
        </article>
      ) : null}

      {focusProductName ? (
        <article className="analysis-result__focus-product" aria-label="Produto recomendado">
          <strong>{focusProductName}</strong>
        </article>
      ) : null}

      <article className="analysis-result__diagnosis">
        <span>Diagnostico central</span>
        <h4>{analysis.diagnostico_central}</h4>
      </article>

      <div className="analysis-result__grid">
        <article>
          <h4>Resumo executivo</h4>
          <p>{analysis.resumo_executivo}</p>
        </article>

        <article>
          <h4>Pessoas detectadas</h4>
          {analysis.entidades_detectadas.pessoas.length > 0 ? (
            <ul className="analysis-result__people">
              {analysis.entidades_detectadas.pessoas.map((person) => (
                <li key={`${person.nome}-${person.papel}`}>
                  <strong>{person.nome}</strong>
                  <small>
                    {person.papel} | {person.lado}
                  </small>
                  {person.evidencia ? <p>{person.evidencia}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma pessoa identificada.</p>
          )}
        </article>

        <DetectedEntitiesCard analysis={analysis} />
        <ListCard className="analysis-result__risks" title="Riscos criticos" values={analysis.riscos_criticos} />
      </div>

      <ListCard className="analysis-result__opportunities" title="Oportunidades" values={analysis.oportunidades} />

      <article className="analysis-result__solution">
        <header>
          <span>Direcao recomendada</span>
          <h4>Solucao final clara</h4>
        </header>
        <div>
          {solutionLabels.map(([key, label]) => (
            <section key={key}>
              <strong>{label}</strong>
              <p>{analysis.solucao_final_clara[key]}</p>
            </section>
          ))}
        </div>
      </article>

      <ListCard className="analysis-result__uncertainty" title="Pontos de incerteza" values={analysis.pontos_de_incerteza} />
    </section>
  );
}

function DetectedEntitiesCard({ analysis }: { analysis: AiAnalysis }) {
  const { empresas, produtos, temas, prazos = [], proximas_acoes: nextActions = [] } = analysis.entidades_detectadas;

  return (
    <article className="analysis-result__entities">
      <h4>Entidades detectadas</h4>
      {empresas.length > 0 ? (
        <EntityGroup
          label="Empresas"
          values={empresas.map((company) => ({
            name: getEntityName(company),
            detail: typeof company === 'string' ? undefined : company.setor,
          }))}
        />
      ) : null}
      {produtos.length > 0 ? (
        <EntityGroup
          label="Produtos e serviços"
          values={produtos.map((product) => ({
            name: getEntityName(product),
            detail: typeof product === 'string' ? undefined : product.descricao,
          }))}
        />
      ) : null}
      {temas.length > 0 ? (
        <EntityGroup
          label="Temas"
          values={temas.map((theme) => ({
            name: getThemeName(theme),
            detail: typeof theme === 'string' ? undefined : theme.evidencia,
          }))}
        />
      ) : null}
      {prazos.length > 0 ? (
        <EntityGroup
          label="Prazos"
          values={prazos.map((deadline) => ({
            name: deadline.prazo,
            detail: deadline.evidencia,
          }))}
        />
      ) : null}
      {nextActions.length > 0 ? (
        <EntityGroup
          label="Proximas acoes"
          values={nextActions.map((action) => ({
            name: action.acao,
            detail: action.evidencia,
          }))}
        />
      ) : null}
    </article>
  );
}

function EntityGroup({ label, values }: { label: string; values: Array<{ name: string; detail?: string }> }) {
  return (
    <section>
      <strong>{label}</strong>
      <ul className="analysis-result__people">
        {values.map((value) => (
          <li key={`${label}-${value.name}`}>
            <strong>{value.name}</strong>
            {value.detail ? <p>{value.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function getEntityName(value: string | AiDetectedCompany | AiDetectedProduct) {
  return typeof value === 'string' ? value : value.nome;
}

function getFocusProductName(analysis: AiAnalysis) {
  const focusText = analysis.solucao_final_clara.onde_focar ?? '';
  const match = focusText.match(/produto foco:\s*(.+?)(?:\s+-\s+|$)/i);

  if (match?.[1]) {
    return match[1].trim();
  }

  const [firstProduct] = analysis.entidades_detectadas.produtos;
  return firstProduct ? getEntityName(firstProduct) : null;
}

function getThemeName(value: string | AiDetectedTheme) {
  return typeof value === 'string' ? value : value.tema;
}

function ListCard({ className, title, values }: { className?: string; title: string; values: string[] }) {
  return (
    <article className={className}>
      <h4>{title}</h4>
      {values.length > 0 ? (
        <ul className="analysis-result__list">
          {values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum item identificado.</p>
      )}
    </article>
  );
}
