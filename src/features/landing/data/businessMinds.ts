import {
  Banknote,
  Building2,
  Handshake,
  HeartPulse,
  Megaphone,
  Scale,
  Telescope,
  UserRound,
} from 'lucide-react';

export const businessMinds = [
  {
    name: 'Cliente',
    description: 'Dores, objeções e expectativas que aparecem no discurso.',
    Icon: UserRound,
  },
  {
    name: 'Vendedor',
    description: 'Oportunidades de conversão, abordagem e timing comercial.',
    Icon: Handshake,
  },
  {
    name: 'Empresa',
    description: 'Coerência, posicionamento e alinhamento com a proposta.',
    Icon: Building2,
  },
  {
    name: 'Razão',
    description: 'Lógica, consistência e clareza dos argumentos.',
    Icon: Scale,
  },
  {
    name: 'Emoção',
    description: 'Sentimentos, tensões e sinais subjetivos da conversa.',
    Icon: HeartPulse,
  },
  {
    name: 'Financeiro',
    description: 'Impacto econômico, restrições e viabilidade.',
    Icon: Banknote,
  },
  {
    name: 'Marketing',
    description: 'Narrativa, percepção de valor e mensagens que conectam.',
    Icon: Megaphone,
  },
  {
    name: 'Estrategista',
    description: 'Visão macro, riscos sistêmicos e próximos passos.',
    Icon: Telescope,
  },
] as const;
