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

/** Paneles informativos del aside derecho (criterio, por qué importa, consejo, referencias). */
export type AnalysisAsideInfoKey = 'criterion' | 'why' | 'tip' | 'references';

export const ANALYSIS_ASIDE_INFO_KEYS: readonly AnalysisAsideInfoKey[] = [
  'criterion',
  'why',
  'tip',
  'references',
];

export function createAsideInfoPanelsClosed(): Record<AnalysisAsideInfoKey, boolean> {
  return { criterion: false, why: false, tip: false, references: false };
}

/** Aspecto activo dentro de la fase Análisis (más tipos se pueden añadir después). */
export type AnalysisAspectId =
  | 'wcagText'
  | 'perceptualDeltaE'
  | 'temperatureHarmony'
  | 'lightnessBalance'
  | 'vibrancyHarmony'
  | 'cvdSimulation'
  | 'chromaticHarmony';

export type EditingColor =
  | { type: 'main'; index: number }
  | { type: 'support'; role: string }
  | null;
