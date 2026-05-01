import type {
  PersuasionProfile,
  PersuasionSidebarStat,
  PersuasionSocial,
  PersuasionTrack,
  PersuasionWorklistItem,
} from '../types/persuasion';

export const persuasionProfile: PersuasionProfile = {
  name: 'Nicole Prokhorova',
  role: 'Especialista em persuasão estratégica',
  registeredAt: '24 novembro 2022',
  location: 'São Paulo, Brasil',
  birthDate: '08 abril 1993',
  email: 'nicole@noster.ai',
  phone: '+55 (11) 2565 236 25',
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
] ;

export const persuasionSidebarStats: PersuasionSidebarStat[] = [
  { id: 'worklist', label: 'Worklist', value: 6, tone: 'lime' },
  { id: 'new-leads', label: 'Novos leads', value: 27, tone: 'rose' },
  { id: 'updates', label: 'Atualizações', value: 22, tone: 'blue' },
  { id: 'assigned', label: 'Atribuídos', value: 3, tone: 'purple' },
];

export const persuasionWorklist: PersuasionWorklistItem[] = [
  {
    id: 'jessica-caballero',
    name: 'Jessica Caballero',
    role: 'Product manager - Microsoft',
    status: 'Aguardando proposta',
    priority: 'Alta',
    channel: 'document',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'jane-doe',
    name: 'Jane Doe',
    role: 'Marketing manager - Nike',
    status: 'Aguardando proposta',
    priority: 'Alta',
    channel: 'document',
    avatar:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'jack-donovan',
    name: 'Jack Donovan',
    role: 'CEO - ACME',
    status: 'Ligação marcada',
    priority: 'Média',
    channel: 'phone',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'barry-white',
    name: 'Barry White',
    role: 'CEO - Avocado',
    status: 'Follow-up',
    priority: 'Baixa',
    channel: 'email',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'lisa-gun',
    name: 'Lisa Gun',
    role: 'Head of sales - Totvs',
    status: 'Revisar objeções',
    priority: 'Média',
    channel: 'document',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80',
  },
];
