export type MultiAgentRole = 'user' | 'agent';

export type MultiAgentMeetingAttachment = {
  id: string;
  title: string;
  date: string;
  time: string;
  summary: string;
};

export type MultiAgentMessage = {
  id: string;
  role: MultiAgentRole;
  agent?: string;
  content: string;
  attachments?: MultiAgentMeetingAttachment[];
};

export type AnalysisStatus = 'active' | 'draft' | 'archived';

export type AgentAnalysis = {
  id: string;
  title: string;
  description: string;
  status: AnalysisStatus;
  agentCount: number;
};

export type AiDetectedPerson = {
  nome: string;
  papel: string;
  lado: string;
  evidencia?: string;
};

export type AiDetectedCompany = {
  nome: string;
  setor?: string;
};

export type AiDetectedProduct = {
  nome: string;
  descricao?: string;
};

export type AiDetectedTheme = {
  tema: string;
  evidencia?: string;
};

export type AiDetectedDeadline = {
  prazo: string;
  evidencia?: string;
};

export type AiNextAction = {
  acao: string;
  evidencia?: string;
};

export type AiAnalysis = {
  id_reuniao?: string;
  pergunta_opcional?: string | null;
  resposta_da_pergunta?: string | null;
  entidades_detectadas: {
    pessoas: AiDetectedPerson[];
    empresas: Array<string | AiDetectedCompany>;
    produtos: Array<string | AiDetectedProduct>;
    temas: Array<string | AiDetectedTheme>;
    prazos?: AiDetectedDeadline[];
    proximas_acoes?: AiNextAction[];
  };
  resumo_executivo: string;
  diagnostico_central: string;
  comentarios_relevantes_das_personas: Array<{
    persona: string;
    comentario_direcionador: string;
  }>;
  riscos_criticos: string[];
  oportunidades: string[];
  aprendizados_aplicados?: Array<{
    origem: string;
    regra: string;
    como_foi_aplicada: string;
  }>;
  solucao_final_clara: {
    onde_focar: string;
    o_que_fazer: string;
    como_fazer: string;
    porque: string;
    impactos: string;
    proximo_passo_imediato: string;
  };
  pontos_de_incerteza: string[];
};

export type AiAnalysisResponse = {
  status: string;
  id_reuniao: string;
  pergunta_opcional: string | null;
  analise: AiAnalysis;
};
