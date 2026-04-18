import { ANALYSIS_GLOBAL_MODE_LABEL, ANALYSIS_LEFT_ASIDE } from '../analysis/analysisPhaseConvention';

export type AnalysisTypeId = 'basic' | 'scientific' | 'temperature' | 'vibrancy' | 'cvd' | 'harmony';

export interface AnalysisTypeTab {
  id: AnalysisTypeId;
  label: string;
  icon: string;
}

/** Icono solo metadato (la UI de análisis usa SVG); evita emojis sin color explícito en branding. */
export const ANALYSIS_TYPE_TABS: AnalysisTypeTab[] = [
  { id: 'basic', label: ANALYSIS_GLOBAL_MODE_LABEL.basicMode, icon: 'wcag-text' },
  { id: 'scientific', label: ANALYSIS_LEFT_ASIDE.shortLabelPerceptualMode, icon: 'wcag-ui' },
  { id: 'temperature', label: ANALYSIS_GLOBAL_MODE_LABEL.temperatureMode, icon: 'thermometer' },
  { id: 'vibrancy', label: ANALYSIS_GLOBAL_MODE_LABEL.vibrancyMode, icon: 'vibrancy' },
  { id: 'cvd', label: ANALYSIS_GLOBAL_MODE_LABEL.cvdMode, icon: 'cvd' },
  { id: 'harmony', label: ANALYSIS_GLOBAL_MODE_LABEL.harmonyMode, icon: 'harmony' },
];
