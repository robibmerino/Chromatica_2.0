/**
 * Utilidades para combinación de paletas en Explora Arquetipos.
 * Mezcla colores de las columnas Quién, Qué y Cómo según el modo seleccionado.
 */
import { hexToHsl, hslToHex } from '../../utils/colorUtils';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';

export type CombineMode = 'balanced' | 'quien-first' | 'que-first' | 'como-first';

/** Paletas por defecto por columna (placeholder hasta que se definan flujos de creación). */
export const DEFAULT_COLUMN_PALETTES: Record<ColumnKey, string[]> = {
  quien: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3', '#FFF8DC', '#FAEBD7', '#FFEFD5'],
  que: ['#4169E1', '#5B9BD5', '#87CEEB', '#B0E0E6', '#E0FFFF', '#F0F8FF', '#ADD8E6', '#B0C4DE'],
  como: ['#9370DB', '#BA55D3', '#DDA0DD', '#EE82EE', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'],
};

/** Paleta neutra cuando ninguna columna está activa. */
export const NEUTRAL_PALETTE = [
  '#4a4a4a', '#5f5f5f', '#757575', '#8a8a8a',
  '#a0a0a0', '#b5b5b5', '#cacaca', '#e0e0e0',
];

export const COMBINE_MODE_LABELS: Record<CombineMode, string> = {
  balanced: 'Equilibrado',
  'quien-first': 'Quién primero',
  'que-first': 'Qué primero',
  'como-first': 'Cómo primero',
};

export const COMBINE_MODE_TOOLTIPS: Record<CombineMode, string> = {
  balanced: 'Mezcla los colores de las tres columnas equilibradamente, preservando saturación',
  'quien-first': 'Alterna priorizando Quién, luego Qué y Cómo',
  'que-first': 'Alterna priorizando Qué, luego Quién y Cómo',
  'como-first': 'Alterna priorizando Cómo, luego Quién y Qué',
};

export const COMBINE_MODES: CombineMode[] = ['balanced', 'quien-first', 'que-first', 'como-first'];

/**
 * Mezcla colores en HSL con refuerzo de saturación para evitar resultados apagados.
 * El promedio RGB de tonos muy distintos (p. ej. naranja, azul, púrpura) produce grises;
 * en HSL promediamos matiz/luminosidad pero reforzamos la saturación.
 */
export function blendColorsVibrant(hexes: string[]): string {
  if (hexes.length === 0) return '#666666';
  const hsls = hexes.map(hexToHsl);

  // Matiz: promedio circular (tratando 360° como vecino de 0°)
  const sinSum = hsls.reduce((a, c) => a + Math.sin((c.h * Math.PI) / 180), 0);
  const cosSum = hsls.reduce((a, c) => a + Math.cos((c.h * Math.PI) / 180), 0);
  const avgH = (Math.atan2(sinSum, cosSum) * 180) / Math.PI;
  const h = (avgH + 360) % 360;

  // Saturación: refuerzo para evitar apagados (promedio RGB los apaga mucho)
  const maxS = Math.max(...hsls.map((c) => c.s));
  const avgS = hsls.reduce((a, c) => a + c.s, 0) / hsls.length;
  const s = Math.min(100, Math.max(maxS * 0.9, avgS * 1.5));

  // Luminosidad: promedio, evitando extremos
  const avgL = hsls.reduce((a, c) => a + c.l, 0) / hsls.length;
  const l = Math.max(15, Math.min(88, avgL));

  return hslToHex(h, Math.round(s), Math.round(l));
}

/**
 * Estrategias de combinación de paletas. Solo incluye columnas activadas.
 */
export function combineColumnPalettes(
  quien: string[],
  que: string[],
  como: string[],
  activated: Record<ColumnKey, boolean>,
  count: number,
  mode: CombineMode
): string[] {
  const activePalettes: [ColumnKey, string[]][] = [];
  if (activated.quien) activePalettes.push(['quien', quien]);
  if (activated.que) activePalettes.push(['que', que]);
  if (activated.como) activePalettes.push(['como', como]);

  if (activePalettes.length === 0) {
    return NEUTRAL_PALETTE.slice(0, count);
  }

  const get = (col: string[], i: number) => col[i % col.length] ?? col[col.length - 1] ?? '#666666';
  const order: (0 | 1 | 2)[] =
    mode === 'quien-first' ? [0, 1, 2] : mode === 'que-first' ? [1, 0, 2] : [2, 0, 1];

  if (mode === 'balanced') {
    const toBlend = activePalettes.map(([, pal]) => pal);
    return Array.from({ length: count }, (_, i) =>
      blendColorsVibrant(toBlend.map((pal) => get(pal, i)))
    );
  }

  const columns = [quien, que, como];
  const activeIndices = activePalettes.map(([k]) => (k === 'quien' ? 0 : k === 'que' ? 1 : 2));
  const sortedByMode = order.filter((idx) => activeIndices.includes(idx));
  if (sortedByMode.length === 0) return NEUTRAL_PALETTE.slice(0, count);

  const result: string[] = [];
  let colOrderIdx = 0;
  let rowIdx = 0;
  while (result.length < count) {
    const colIdx = sortedByMode[colOrderIdx % sortedByMode.length];
    result.push(get(columns[colIdx], rowIdx));
    colOrderIdx++;
    if (colOrderIdx % sortedByMode.length === 0) rowIdx++;
  }
  return result;
}
