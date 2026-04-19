import type { AnalysisAspectId } from './types';

/**
 * Paleta por subanálisis: progresión azul → teal → ámbar → cielo → fucsia → rosa → violeta.
 * Unifica caja del SVG (aside + columna central), bordes del aside y acentos de tarjetas/botones del mismo aspecto.
 */
export type AnalysisAspectUiTokens = {
  iconBox: string;
  asideActive: string;
  asideHover: string;
  scoreCard: string;
  scoreValueGradient: string;
  /** Cabecera «Auto-ajustar»; omitir si el aspecto no expone acción. */
  autoAdjust?: string;
  /** Borde suave en bloques secundarios de la columna central (p. ej. secciones). */
  sectionBorder?: string;
};

export const ANALYSIS_ASPECT_UI: Record<AnalysisAspectId, AnalysisAspectUiTokens> = {
  wcagText: {
    iconBox: 'bg-blue-500/15 text-blue-300',
    asideActive: 'border-blue-400/70 bg-gray-800/90 ring-1 ring-blue-500/30',
    asideHover: 'hover:border-blue-400/55',
    scoreCard: 'border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-blue-300 to-indigo-300',
    autoAdjust: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400',
  },
  perceptualDeltaE: {
    iconBox: 'bg-teal-500/15 text-teal-300',
    asideActive: 'border-teal-400/70 bg-gray-800/90 ring-1 ring-teal-500/30',
    asideHover: 'hover:border-teal-400/55',
    scoreCard: 'border-teal-500/25 bg-gradient-to-br from-teal-500/10 to-emerald-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-teal-300 to-emerald-300',
    autoAdjust: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400',
  },
  temperatureHarmony: {
    iconBox: 'bg-amber-500/15 text-amber-300',
    asideActive: 'border-amber-400/70 bg-gray-800/90 ring-1 ring-amber-500/30',
    asideHover: 'hover:border-amber-400/50',
    scoreCard: 'border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-sky-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-amber-400 to-sky-400',
    autoAdjust: 'bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400',
  },
  lightnessBalance: {
    iconBox: 'bg-sky-500/15 text-sky-300',
    asideActive: 'border-sky-400/70 bg-gray-800/90 ring-1 ring-sky-500/30',
    asideHover: 'hover:border-sky-400/50',
    scoreCard: 'border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-blue-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-slate-200 to-sky-300',
    autoAdjust:
      'bg-gradient-to-r from-blue-950 to-sky-300 hover:from-blue-900 hover:to-sky-200',
  },
  vibrancyHarmony: {
    iconBox: 'bg-fuchsia-500/15 text-fuchsia-300',
    asideActive: 'border-fuchsia-400/70 bg-gray-800/90 ring-1 ring-fuchsia-500/30',
    asideHover: 'hover:border-fuchsia-400/45',
    scoreCard: 'border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 to-amber-400/10',
    scoreValueGradient: 'bg-gradient-to-r from-fuchsia-400 to-amber-300',
    autoAdjust: 'bg-gradient-to-r from-fuchsia-500 to-amber-400 hover:from-fuchsia-400 hover:to-amber-300',
    sectionBorder: 'border-fuchsia-500/25',
  },
  cvdSimulation: {
    iconBox: 'bg-rose-500/15 text-rose-300',
    asideActive: 'border-rose-400/70 bg-gray-800/90 ring-1 ring-rose-500/30',
    asideHover: 'hover:border-rose-400/50',
    scoreCard: 'border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-cyan-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-rose-400 to-cyan-300',
    autoAdjust: 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-400 hover:to-cyan-300',
  },
  chromaticHarmony: {
    iconBox: 'bg-violet-500/15 text-violet-300',
    asideActive: 'border-violet-400/70 bg-gray-800/90 ring-1 ring-violet-500/30',
    asideHover: 'hover:border-violet-400/45',
    scoreCard: 'border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10',
    scoreValueGradient: 'bg-gradient-to-r from-violet-400 to-fuchsia-300',
    autoAdjust: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400',
  },
};

/** Acentos del explorador de ratios (solo vista contraste WCAG). */
export const ANALYSIS_CONTRAST_EXPLORER_ACCENT = {
  chipActive: 'border-blue-400 bg-blue-500/10 text-slate-50',
  gridSelected:
    'bg-slate-900 border-blue-400/80 shadow-[0_0_0_1px_rgba(96,165,250,0.5)]',
  pillPass: 'bg-blue-500/15 text-blue-300',
  textPassAa: 'text-blue-400',
} as const;
