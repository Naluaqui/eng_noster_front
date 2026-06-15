import type {
  PersuasionProfile,
  PersuasionSidebarStat,
  PersuasionSocial,
  PersuasionTrack,
  PersuasionWorklistItem,
} from '../types/persuasion';

export const persuasionProfile: PersuasionProfile = {
  id: 'mock-janete-padaria',
  name: 'Janete Padaria',
  role: 'Proprietária',
  registeredAt: '24 novembro 2022',
  location: 'Belo Horizonte, Brasil',
  industry: 'Alimentação e Panificação',
  email: 'janete@padariajanete.com.br',
  phone: '(31) 99876-5432',
  source: 'mock',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=80',
};

export const persuasionSocials: PersuasionSocial[] = [
  'Instagram',
  'Facebook',
  'X',
  'LinkedIn',
  'Telegram',
];

export const persuasionTracks: PersuasionTrack[] = [
  {
    id: 'valor-roi',
    title: 'Persuasão por valor e ROI',
    description: 'Transformar preço em retorno percebido, urgência e clareza de decisão.',
    lessons: '68 sinais',
    status: 'Concluído',
    tone: 'blue',
  },
  {
    id: 'objections',
    title: 'Objeções e contra-argumentos',
    description: 'Detectar hesitação, reformular risco e conduzir a conversa para avanço.',
    lessons: '12 padrões',
    status: 'Concluído',
    tone: 'purple',
  },
  {
    id: 'closing',
    title: 'Fechamento consultivo',
    description: 'Criar CTAs, próximos passos e compromissos sem parecer pressão.',
    lessons: '12 gatilhos',
    status: 'Iniciar: 13.06.2026',
    tone: 'pink',
  },
];

export const persuasionSidebarStats: PersuasionSidebarStat[] = [
  { id: 'worklist', label: 'Worklist', value: 1, tone: 'lime' },
  { id: 'new-leads', label: 'Novos leads', value: 0, tone: 'rose' },
  { id: 'updates', label: 'Atualizações', value: 0, tone: 'blue' },
  { id: 'assigned', label: 'Atribuídos', value: 0, tone: 'purple' },
];

export const persuasionWorklist: PersuasionWorklistItem[] = [
  {
    id: 'janete-padaria',
    profileId: persuasionProfile.id,
    name: persuasionProfile.name,
    role: persuasionProfile.role,
    status: 'Aguardando proposta',
    priority: 'Alta',
    channel: 'document',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  },
];
