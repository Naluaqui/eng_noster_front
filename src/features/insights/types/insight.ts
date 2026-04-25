import type { BusinessPersona } from '@/shared/constants/personas';

export type Insight = {
  id: string;
  title: string;
  description: string;
  persona: BusinessPersona;
};

export type InsightMetric = {
  label: string;
  value: number;
};
