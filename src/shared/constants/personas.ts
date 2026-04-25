export const businessPersonas = [
  'Cliente',
  'Vendedor',
  'Empresa',
  'Razão',
  'Emoção',
  'Financeiro',
  'Marketing',
  'Estrategista',
] as const;

export type BusinessPersona = (typeof businessPersonas)[number];
