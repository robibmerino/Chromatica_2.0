import type { Phase, InspirationMode } from '../../../types/guidedPalette';

export interface PhaseConfig {
  id: Phase;
  name: string;
  icon: string;
}

export const PHASES: PhaseConfig[] = [
  { id: 'inspiration-menu', name: 'Fábrica', icon: '🏭' },
  { id: 'refinement', name: 'Refinamiento', icon: '🔧' },
  { id: 'application', name: 'Aplicación', icon: '👁️' },
  { id: 'analysis', name: 'Análisis', icon: '🔍' },
  { id: 'save', name: 'Guardar', icon: '💾' },
];

/** Pasos mostrados en la barra superior: previa (4 colores) + Fábrica (opción elegida) + Refinar, Aplicar, Análisis, Guardar */
export interface StepperStepConfig {
  id: Phase | 'inspiration-detail';
  name: string;
  /** Si true, el paso se muestra solo como cuadradito de 4 colores, sin texto */
  showQuadOnly?: boolean;
  /** Si true, la etiqueta se obtiene dinámicamente según inspirationMode */
  dynamicLabel?: boolean;
}

export const STEPPER_STEPS: StepperStepConfig[] = [
  { id: 'inspiration-menu', name: '', showQuadOnly: true },
  { id: 'inspiration-detail', name: 'Fábrica', dynamicLabel: true },
  { id: 'refinement', name: 'Refinar' },
  { id: 'application', name: 'Aplicar' },
  { id: 'analysis', name: 'Análisis' },
  { id: 'save', name: 'Guardar' },
];

/** Etiquetas del paso Fábrica en la barra superior según el modo elegido */
export const INSPIRATION_MODE_LABELS: Record<InspirationMode, string> = {
  harmony: 'Fabrica de Armonía',
  image: 'Fabrica de Imagen',
  'archetypes-menu': 'Fabrica de Arquetipos',
  archetypes: 'Fabrica de Arquetipos',
  shapes: 'Fabrica de Arquetipos',
  aquarium: 'Pecera',
  design: 'Diseño',
  trending: 'Fabrica de Tendencias',
  'multi-origin': 'Paleta combinada',
};

/** Acentos de color de la cadena según el flujo (mismo orden que los 4 botones del menú) */
export interface FlowAccent {
  active: string;
  activeBg: string;
  activeRing: string;
  completed: string;
  completedBg: string;
  completedBorder: string;
  particle: string;
}

/** Colores de estado activo y del eje (Refinar-Aplicar-Análisis) más suaves (menos intensidad) */
const FLOW_ACCENT_MAP: Record<InspirationMode, FlowAccent> = {
  harmony: {
    active: '#047857',
    activeBg: 'rgba(4, 120, 87, 0.18)',
    activeRing: 'rgba(16, 185, 129, 0.35)',
    completed: '#10b981',
    completedBg: 'rgba(5, 150, 105, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.22)',
    particle: '#34d399',
  },
  image: {
    active: '#1d4ed8',
    activeBg: 'rgba(29, 78, 216, 0.18)',
    activeRing: 'rgba(96, 165, 250, 0.35)',
    completed: '#3b82f6',
    completedBg: 'rgba(37, 99, 235, 0.1)',
    completedBorder: 'rgba(59, 130, 246, 0.22)',
    particle: '#60a5fa',
  },
  'archetypes-menu': {
    active: '#a21caf',
    activeBg: 'rgba(162, 28, 175, 0.18)',
    activeRing: 'rgba(217, 70, 239, 0.35)',
    completed: '#a855f7',
    completedBg: 'rgba(192, 38, 211, 0.1)',
    completedBorder: 'rgba(168, 85, 247, 0.22)',
    particle: '#d946ef',
  },
  archetypes: {
    active: '#a21caf',
    activeBg: 'rgba(162, 28, 175, 0.18)',
    activeRing: 'rgba(217, 70, 239, 0.35)',
    completed: '#a855f7',
    completedBg: 'rgba(192, 38, 211, 0.1)',
    completedBorder: 'rgba(168, 85, 247, 0.22)',
    particle: '#d946ef',
  },
  shapes: {
    active: '#a21caf',
    activeBg: 'rgba(162, 28, 175, 0.18)',
    activeRing: 'rgba(217, 70, 239, 0.35)',
    completed: '#a855f7',
    completedBg: 'rgba(192, 38, 211, 0.1)',
    completedBorder: 'rgba(168, 85, 247, 0.22)',
    particle: '#d946ef',
  },
  aquarium: {
    active: '#0e7490',
    activeBg: 'rgba(14, 116, 144, 0.18)',
    activeRing: 'rgba(34, 211, 238, 0.35)',
    completed: '#06b6d4',
    completedBg: 'rgba(8, 145, 178, 0.1)',
    completedBorder: 'rgba(6, 182, 212, 0.22)',
    particle: '#22d3ee',
  },
  design: {
    active: '#0f766e',
    activeBg: 'rgba(15, 118, 110, 0.18)',
    activeRing: 'rgba(45, 212, 191, 0.35)',
    completed: '#14b8a6',
    completedBg: 'rgba(13, 148, 136, 0.1)',
    completedBorder: 'rgba(20, 184, 166, 0.22)',
    particle: '#2dd4bf',
  },
  trending: {
    active: '#c2410c',
    activeBg: 'rgba(194, 65, 12, 0.18)',
    activeRing: 'rgba(251, 146, 60, 0.35)',
    completed: '#f97316',
    completedBg: 'rgba(234, 88, 12, 0.1)',
    completedBorder: 'rgba(249, 115, 22, 0.22)',
    particle: '#fb923c',
  },
  'multi-origin': {
    active: '#0891b2',
    activeBg: 'rgba(8, 145, 178, 0.18)',
    activeRing: 'rgba(56, 189, 248, 0.35)',
    completed: '#06b6d4',
    completedBg: 'rgba(8, 145, 178, 0.1)',
    completedBorder: 'rgba(6, 182, 212, 0.22)',
    particle: '#22d3ee',
  },
};

export function getFlowAccent(mode: InspirationMode | null): FlowAccent | null {
  if (!mode) return null;
  return FLOW_ACCENT_MAP[mode] ?? null;
}
