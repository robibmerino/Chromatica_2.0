export type RoleKey = string;

export const TOP_COMBOS_ROLE = '__TOP_COMBOS__';

export type ContrastComboConfig = {
  fgRole: RoleKey;
  bgRole: RoleKey;
  description: string;
};

export const DEFAULT_CONTRAST_COMBOS: ContrastComboConfig[] = [
  { fgRole: 'T', bgRole: 'F', description: 'Texto sobre fondo' },
  { fgRole: 'P', bgRole: 'F', description: 'Primario sobre fondo' },
  { fgRole: 'S', bgRole: 'P', description: 'Secundario sobre primario' },
  { fgRole: 'A', bgRole: 'P', description: 'Acento sobre primario' },
];

export type SupportSwatch = { role: string; label: string; initial: string; hex: string };

export type ReferenceItem = {
  id: string;
  category: string;
  title: string;
  authors: string;
  source: string;
  summaryParagraphs: string[];
  linkLabel: string;
  href: string;
};

export type InfoPanelKey = 'ratio' | 'importance' | 'tip' | 'references';

/** Aspecto activo dentro de la fase Análisis (más tipos se pueden añadir después). */
export type AnalysisAspectId =
  | 'wcagText'
  | 'perceptualDeltaE'
  | 'temperatureHarmony'
  | 'vibrancyHarmony'
  | 'cvdSimulation';

export type EditingColor =
  | { type: 'main'; index: number }
  | { type: 'support'; role: string }
  | null;
