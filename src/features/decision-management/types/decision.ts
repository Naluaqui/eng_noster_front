import type { BusinessPersona } from '@/shared/constants/personas';

export type DecisionMessageRole = 'user' | 'assistant';

export type DecisionMessage = {
  id: string;
  role: DecisionMessageRole;
  content: string;
  persona?: BusinessPersona;
};

export type DecisionInsight = {
  label: string;
  value: string;
};
