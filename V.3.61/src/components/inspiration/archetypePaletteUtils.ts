/**
 * Utilidades para combinación de paletas en Explora Arquetipos.
 * Mezcla colores de las columnas Quién, Qué y Cómo según el modo seleccionado.
 */
import { hexToHsl, hslToHex } from '../../utils/colorUtils';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';

export type CombineMode =
  | 'balanced'
  | 'flow-first'
  | 'palette-first'
  | 'soft-gradient'
  | 'custom';

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
  balanced: 'Equilibrada',
  'flow-first': 'Orden de flujos',
  'palette-first': 'Orden de paleta',
  'soft-gradient': 'Gradiente suave',
  custom: 'Personalizada',
};

export const COMBINE_MODE_TOOLTIPS: Record<CombineMode, string> = {
  balanced:
    'Mezcla las columnas activas a partes iguales y reduce saturaciones demasiado altas.',
  'flow-first':
    'Recorre 1º color de cada columna activa, luego el 2º, etc., respetando el orden.',
  'palette-first':
    'Avanza dentro de cada paleta: 1º de la primera, 2º de la segunda, 3º de la tercera…',
  'soft-gradient':
    'Construye un degradado continuo mezclando suavemente todos los colores activos.',
  custom:
    'Punto de partida editable: parte de un equilibrio suave para que puedas ajustarla después.',
};

export const COMBINE_MODES: CombineMode[] = [
  'balanced',
  'flow-first',
  'palette-first',
  'soft-gradient',
  'custom',
];

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
  const palettes: string[][] = [];
  if (activated.quien) palettes.push(quien);
  if (activated.que) palettes.push(que);
  if (activated.como) palettes.push(como);

  if (palettes.length === 0) {
    return NEUTRAL_PALETTE.slice(0, count);
  }

  const safeCount = Math.max(1, count);
  const getPaletteColor = (palette: string[], index: number) =>
    palette[index % palette.length] ?? palette[palette.length - 1] ?? '#666666';

  const MAX_SAT = 72;
  let result: string[] = [];

  if (mode === 'balanced' || mode === 'custom') {
    const raw = Array.from({ length: safeCount }, (_, i) =>
      blendColorsVibrant(palettes.map((pal) => getPaletteColor(pal, i)))
    );
    result = raw.map((hex) => {
      const hsl = hexToHsl(hex);
      if (hsl.s <= MAX_SAT) return hex;
      const newS = MAX_SAT;
      return hslToHex(hsl.h, newS, hsl.l);
    });
  } else if (mode === 'flow-first') {
    let round = 0;
    while (result.length < safeCount) {
      for (const pal of palettes) {
        if (!pal.length) continue;
        result.push(getPaletteColor(pal, round));
        if (result.length >= safeCount) break;
      }
      round += 1;
    }
  } else if (mode === 'palette-first') {
    const n = palettes.length;
    if (n === 0) {
      return NEUTRAL_PALETTE.slice(0, safeCount);
    }
    let cycle = 0;
    while (result.length < safeCount) {
      for (let pIdx = 0; pIdx < n && result.length < safeCount; pIdx++) {
        const pal = palettes[pIdx];
        if (!pal.length) continue;
        const colorIndex = pIdx + cycle;
        result.push(getPaletteColor(pal, colorIndex));
      }
      cycle += 1;
    }
  } else if (mode === 'soft-gradient') {
    const flattened: string[] = [];
    palettes.forEach((pal) => {
      pal.forEach((hex) => flattened.push(hex));
    });
    if (!flattened.length) {
      return NEUTRAL_PALETTE.slice(0, safeCount);
    }
    const len = flattened.length;
    const raw = Array.from({ length: safeCount }, (_, i) => {
      if (safeCount === 1) return flattened[0];
      const t = i / (safeCount - 1);
      const idxFloat = t * (len - 1);
      const idx0 = Math.floor(idxFloat);
      const idx1 = Math.min(len - 1, idx0 + 1);
      const c0 = flattened[idx0];
      const c1 = flattened[idx1];
      if (c0 === c1) return c0;
      return blendColorsVibrant([c0, c1]);
    });
    result = raw.map((hex) => {
      const hsl = hexToHsl(hex);
      if (hsl.s <= MAX_SAT) return hex;
      const newS = MAX_SAT;
      return hslToHex(hsl.h, newS, hsl.l);
    });
  }

  return result;
}
