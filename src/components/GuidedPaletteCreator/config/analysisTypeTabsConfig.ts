export type AnalysisTypeId = 'basic' | 'scientific';

export interface AnalysisTypeTab {
  id: AnalysisTypeId;
  label: string;
  icon: string;
}

export const ANALYSIS_TYPE_TABS: AnalysisTypeTab[] = [
  { id: 'basic', label: 'Análisis Básico', icon: '📋' },
  { id: 'scientific', label: 'Evidencia Científica', icon: '🔬' },
];
