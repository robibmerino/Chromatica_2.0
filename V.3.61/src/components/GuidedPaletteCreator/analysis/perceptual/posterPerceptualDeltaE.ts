import { getContrastRatioHex } from '../../../../utils/colorUtils';
import { ciede2000FromHex, hexToLabD65 } from '../../../../utils/ciede2000';
import type { RoleKey } from '../types';

/** CIEDE2000 (CIE): umbral orientativo de diferencia de color entre roles del mockup. */
export const POSTER_DELTA_E00_MIN = 5;

/**
 * Ratio mínimo de luminancias relativas (sRGB, misma definición que en WCAG 2.x / W3C).
 * Umbral de **diseño para póster**, no se presenta como conformidad 1.4.11 ni AA de texto.
 */
export const POSTER_DESIGN_LUMINANCE_RATIO_MIN = 2;

/**
 * Separación mínima en el eje de claridad CIELAB L* (CIE 1976 L*a*b*, D65).
 * Magnitud estándar del espacio de color; el corte es criterio de producto para capas casi neutras.
 */
export const POSTER_MIN_ABS_DELTA_L_STAR = 6;

export type PosterPairCheckRow = {
  id: string;
  name: string;
  fgRole: RoleKey;
  bgRole: RoleKey;
  /** Si true: se listan métricas pero no cuentan para %, global ni auto-ajuste. */
  informativeOnly?: boolean;
};

/**
 * Orden: dos pares acento (A), dos acento S (A2); luego dos filas informativas (sin impacto en nota).
 */
export const POSTER_PERCEPTUAL_CHECKS: PosterPairCheckRow[] = [
  { id: 'blobA', name: 'Acento / principal — círculo mediano', fgRole: 'A', bgRole: 'P' },
  { id: 'icons', name: 'Acento / secundario — iconos', fgRole: 'A', bgRole: 'S' },
  { id: 'blobA2', name: 'Acento S / principal — círculo pequeño', fgRole: 'A2', bgRole: 'P' },
  { id: 'stars', name: 'Acento S / secundario — estrellas', fgRole: 'A2', bgRole: 'S' },
  {
    id: 'infoA2Marco',
    name: 'Acento / Acento S — Botón Cubo',
    fgRole: 'A',
    bgRole: 'A2',
    informativeOnly: true,
  },
  {
    id: 'infoBlobS',
    name: 'Secundario / principal — círculo grande',
    fgRole: 'S',
    bgRole: 'P',
    informativeOnly: true,
  },
];

export function resolveIconBorderHex(map: Record<string, { hex: string; label: string }>): string {
  return map.Ts?.hex ?? map.T?.hex ?? map.P?.hex ?? '#334155';
}

export function augmentRoleMapWithIcon(
  map: Record<string, { hex: string; label: string }>
): Record<string, { hex: string; label: string }> {
  const iconHex = resolveIconBorderHex(map);
  return { ...map, I: { hex: iconHex, label: 'Icono / borde' } };
}

export type PosterPerceptualEvaluatedRow = {
  row: PosterPairCheckRow;
  informativeOnly: boolean;
  deltaE00: number;
  luminanceRatio: number;
  absDeltaLStar: number;
  passDeltaE: boolean;
  passLuminance: boolean;
  passDeltaLStar: boolean;
  pass: boolean;
};

function evalOnePair(
  row: PosterPairCheckRow,
  fgHex: string,
  bgHex: string
): Omit<PosterPerceptualEvaluatedRow, 'row'> {
  const deltaE00 = ciede2000FromHex(fgHex, bgHex);
  const luminanceRatio = getContrastRatioHex(fgHex, bgHex);
  const l1 = hexToLabD65(fgHex).L;
  const l2 = hexToLabD65(bgHex).L;
  const absDeltaLStar = Math.abs(l1 - l2);
  const passDeltaE = deltaE00 >= POSTER_DELTA_E00_MIN;
  const passLuminance = luminanceRatio >= POSTER_DESIGN_LUMINANCE_RATIO_MIN;
  const passDeltaLStar = absDeltaLStar >= POSTER_MIN_ABS_DELTA_L_STAR;
  const pass = passDeltaE && passLuminance && passDeltaLStar;
  return {
    informativeOnly: Boolean(row.informativeOnly),
    deltaE00,
    luminanceRatio,
    absDeltaLStar,
    passDeltaE,
    passLuminance,
    passDeltaLStar,
    pass,
  };
}

export function evaluatePosterPerceptualDeltaE(
  roleHexMap: Record<string, { hex: string; label: string }>
): PosterPerceptualEvaluatedRow[] {
  const m = augmentRoleMapWithIcon(roleHexMap);
  return POSTER_PERCEPTUAL_CHECKS.map((row) => {
    const fg = m[row.fgRole];
    const bg = m[row.bgRole];
    if (!fg?.hex || !bg?.hex) {
      return {
        row,
        informativeOnly: Boolean(row.informativeOnly),
        deltaE00: 0,
        luminanceRatio: 1,
        absDeltaLStar: 0,
        passDeltaE: false,
        passLuminance: false,
        passDeltaLStar: false,
        pass: false,
      };
    }
    return { row, ...evalOnePair(row, fg.hex, bg.hex) };
  });
}

export function posterScoredRows(rows: PosterPerceptualEvaluatedRow[]): PosterPerceptualEvaluatedRow[] {
  return rows.filter((r) => !r.informativeOnly);
}

export type PosterDimensionScores = {
  deltaEPercent: number;
  luminancePercent: number;
  deltaLStarPercent: number;
  overallPercent: number;
};

export function posterPerceptualDimensionScores(rows: PosterPerceptualEvaluatedRow[]): PosterDimensionScores {
  const scored = posterScoredRows(rows);
  if (!scored.length) {
    return { deltaEPercent: 0, luminancePercent: 0, deltaLStarPercent: 0, overallPercent: 0 };
  }
  const n = scored.length;
  const deltaEPercent = Math.round((scored.filter((r) => r.passDeltaE).length / n) * 100);
  const luminancePercent = Math.round((scored.filter((r) => r.passLuminance).length / n) * 100);
  const deltaLStarPercent = Math.round((scored.filter((r) => r.passDeltaLStar).length / n) * 100);
  const overallPercent = Math.round((deltaEPercent + luminancePercent + deltaLStarPercent) / 3);
  return { deltaEPercent, luminancePercent, deltaLStarPercent, overallPercent };
}

export function posterPerceptualScore(rows: PosterPerceptualEvaluatedRow[]): number {
  return posterPerceptualDimensionScores(rows).overallPercent;
}

export function posterPerceptualScoreDescription(score: number): string {
  if (score === 100) return 'Las tres dimensiones cumplen en todos los pares evaluados';
  if (score >= 85) return 'Muy buen equilibrio ΔE₀₀, luminancia y L*';
  if (score >= 70) return 'Aceptable; revisa la dimensión más baja';
  if (score >= 50) return 'Una o más dimensiones flojas';
  return 'Separación insuficiente en varios pares';
}

export function posterPerceptualSidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function posterPerceptualBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export function posterTripleSatisfied(fgHex: string, bgHex: string): boolean {
  const deltaE00 = ciede2000FromHex(fgHex, bgHex);
  const luminanceRatio = getContrastRatioHex(fgHex, bgHex);
  const absDeltaLStar = Math.abs(hexToLabD65(fgHex).L - hexToLabD65(bgHex).L);
  return (
    deltaE00 >= POSTER_DELTA_E00_MIN &&
    luminanceRatio >= POSTER_DESIGN_LUMINANCE_RATIO_MIN &&
    absDeltaLStar >= POSTER_MIN_ABS_DELTA_L_STAR
  );
}
