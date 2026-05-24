import { getSelectedCompanyHeaders } from '@/features/settings/repositories/workspace.repository';
import { agentAnalyses, multiAgentMessages } from '../mocks/multiAgentChat.mock';
import type { AiAnalysisResponse } from '../types/multiAgent';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3334';

export async function getMultiAgentWorkspace() {
  return {
    analyses: agentAnalyses,
    messages: multiAgentMessages,
  };
}

export async function analyzeMeetings(meetingIds: string[], question?: string) {
  const endpoint = `${apiUrl}/api/multi-agents/analyze`;
  const normalizedQuestion = question?.trim();
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...getSelectedCompanyHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meetingIds,
        ...(normalizedQuestion ? { question: normalizedQuestion } : {}),
      }),
    });
  } catch {
    throw new Error(`Nao foi possivel acessar a API NOSTER em ${endpoint}.`);
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error(`Resposta invalida ao solicitar analise (HTTP ${response.status} em ${endpoint}).`);
  }

  if (!response.ok) {
    throw new Error(
      `${getErrorMessage(result) ?? `Nao foi possivel analisar as reunioes (HTTP ${response.status}).`}\n\nRetorno bruto:\n${formatResponse(result)}`,
    );
  }

  if (!isAiAnalysisResponse(result)) {
    throw new Error(`A IA respondeu, mas o formato nao pode ser exibido no painel.\n\nRetorno bruto:\n${formatResponse(result)}`);
  }

  return result;
}

function getErrorMessage(value: unknown) {
  if (!value || typeof value !== 'object' || !('message' in value) || typeof value.message !== 'string') {
    return null;
  }

  return value.message;
}

function formatResponse(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string';
}

function isDetectedPeople(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (person) =>
        isRecord(person) &&
        typeof person.nome === 'string' &&
        typeof person.papel === 'string' &&
        typeof person.lado === 'string' &&
        isOptionalString(person.evidencia),
    )
  );
}

function isDetectedCompanies(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (company) =>
        typeof company === 'string' ||
        (isRecord(company) &&
          typeof company.nome === 'string' &&
          (company.setor === undefined || typeof company.setor === 'string')),
    )
  );
}

function isDetectedProducts(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (product) =>
        typeof product === 'string' ||
        (isRecord(product) &&
          typeof product.nome === 'string' &&
          (product.descricao === undefined || typeof product.descricao === 'string')),
    )
  );
}

function isDetectedThemes(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (theme) =>
        typeof theme === 'string' ||
        (isRecord(theme) && typeof theme.tema === 'string' && isOptionalString(theme.evidencia)),
    )
  );
}

function isDetectedDetails(value: unknown, label: 'prazo' | 'acao') {
  return (
    value === undefined ||
    (Array.isArray(value) &&
      value.every(
        (item) => isRecord(item) && typeof item[label] === 'string' && isOptionalString(item.evidencia),
      ))
  );
}

function isAiAnalysisResponse(value: unknown): value is AiAnalysisResponse {
  if (!isRecord(value) || !isRecord(value.analise)) {
    return false;
  }

  const analysis = value.analise;
  const entities = analysis.entidades_detectadas;
  const solution = analysis.solucao_final_clara;
  const personas = analysis.comentarios_relevantes_das_personas;

  return (
    typeof value.status === 'string' &&
    typeof value.id_reuniao === 'string' &&
    isRecord(entities) &&
    isDetectedPeople(entities.pessoas) &&
    isDetectedCompanies(entities.empresas) &&
    isDetectedProducts(entities.produtos) &&
    isDetectedThemes(entities.temas) &&
    isDetectedDetails(entities.prazos, 'prazo') &&
    isDetectedDetails(entities.proximas_acoes, 'acao') &&
    typeof analysis.resumo_executivo === 'string' &&
    typeof analysis.diagnostico_central === 'string' &&
    Array.isArray(personas) &&
    personas.every(
      (persona) =>
        isRecord(persona) &&
        typeof persona.persona === 'string' &&
        typeof persona.comentario_direcionador === 'string',
    ) &&
    isStringArray(analysis.riscos_criticos) &&
    isStringArray(analysis.oportunidades) &&
    isRecord(solution) &&
    typeof solution.onde_focar === 'string' &&
    typeof solution.o_que_fazer === 'string' &&
    typeof solution.como_fazer === 'string' &&
    typeof solution.porque === 'string' &&
    typeof solution.impactos === 'string' &&
    typeof solution.proximo_passo_imediato === 'string' &&
    isStringArray(analysis.pontos_de_incerteza)
  );
}
