import type { Phase } from '../../../types/guidedPalette';

export interface PhaseConfig {
  id: Phase;
  name: string;
  icon: string;
}

export const PHASES: PhaseConfig[] = [
  { id: 'inspiration-menu', name: 'Inspiración', icon: '✨' },
  { id: 'refinement', name: 'Refinamiento', icon: '🔧' },
  { id: 'application', name: 'Aplicación', icon: '👁️' },
  { id: 'analysis', name: 'Análisis', icon: '🔍' },
  { id: 'save', name: 'Guardar', icon: '💾' },
];
