import { hexToLabD65, labToHexD65 } from '../../../../utils/ciede2000';

/** Roles evaluados (se excluyen Ts y Sf: texto secundario y superficie de apoyo). */
const ROLE_ORDER = ['P', 'S', 'A', 'A2', 'F', 'T', 'I'] as const;

const EXCLUDED_FROM_LIGHTNESS = new Set<string>(['Ts', 'Sf']);

/** Roles de la paleta principal (no F/T ni otros de apoyo): separación muy estrecha aquí penaliza más. */
const MAIN_PALETTE_KEYS = new Set<string>(['P', 'S', 'A', 'A2']);

function isMainMainGap(aKey: string, bKey: string): boolean {
  return MAIN_PALETTE_KEYS.has(aKey) && MAIN_PALETTE_KEYS.has(bKey);
}

export type LightnessZone = 'dark' | 'mid' | 'light';

export type LightnessSwatch = {
  key: string;
  label: string;
  hex: string;
  lstar: number;
  zone: LightnessZone;
};

export type LightnessGapStatus = 'excelente' | 'bueno' | 'cercano' | 'muyCercano';

export type LightnessGap = {
  higher: LightnessSwatch;
  lower: LightnessSwatch;
  delta: number;
  status: LightnessGapStatus;
  statusLabel: string;
};

export type LightnessBalanceResult = {
  swatches: LightnessSwatch[];
  sorted: LightnessSwatch[];
  score: number;
  scoreDesc: string;
  range: number;
  maxL: number;
  minL: number;
  avg: number;
  gaps: LightnessGap[];
  darkCount: number;
  midCount: number;
  lightCount: number;
  zonesPresent: number;
  evenness: number;
};

function zoneFromLstar(l: number): LightnessZone {
  if (l < 30) return 'dark';
  if (l <= 70) return 'mid';
  return 'light';
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function gapStatus(delta: number): { status: LightnessGapStatus; label: string } {
  if (delta >= 25) return { status: 'excelente', label: 'Excelente' };
  if (delta >= 15) return { status: 'bueno', label: 'Bueno' };
  if (delta >= 8) return { status: 'cercano', label: 'Cercano' };
  return { status: 'muyCercano', label: 'Muy cercano' };
}

/** Gris sRGB neutro con el mismo L* (a*=b*=0 en CIELAB). */
export function grayHexFromLstar(L: number): string {
  return labToHexD65(Math.max(0, Math.min(100, L)), 0, 0);
}

export function evaluateLightnessBalance(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>,
): LightnessBalanceResult {
  const seen = new Set<string>();
  const entries: { key: string; label: string; hex: string }[] = [];

  for (const key of ROLE_ORDER) {
    if (EXCLUDED_FROM_LIGHTNESS.has(key)) continue;
    const v = roleHexMap[key];
    if (v?.hex) {
      entries.push({ key, label: v.label, hex: v.hex });
      seen.add(key);
    }
  }
  for (const key of Object.keys(roleHexMap).sort()) {
    if (seen.has(key) || EXCLUDED_FROM_LIGHTNESS.has(key)) continue;
    const v = roleHexMap[key];
    if (v?.hex) entries.push({ key, label: v.label, hex: v.hex });
  }

  if (!entries.length) {
    return {
      swatches: [],
      sorted: [],
      score: 0,
      scoreDesc: 'Sin colores en la paleta',
      range: 0,
      maxL: 0,
      minL: 0,
      avg: 0,
      gaps: [],
      darkCount: 0,
      midCount: 0,
      lightCount: 0,
      zonesPresent: 0,
      evenness: 0,
    };
  }

  const swatches: LightnessSwatch[] = entries.map((e) => {
    const L = hexToLabD65(e.hex).L;
    const lstar = round1(L);
    return {
      key: e.key,
      label: e.label,
      hex: e.hex,
      lstar,
      zone: zoneFromLstar(lstar),
    };
  });

  const sorted = [...swatches].sort((a, b) => b.lstar - a.lstar);
  const lstars = swatches.map((s) => s.lstar);
  const maxL = Math.max(...lstars);
  const minL = Math.min(...lstars);
  const range = maxL - minL;
  const avg = lstars.reduce((a, b) => a + b, 0) / lstars.length;

  const darkCount = swatches.filter((s) => s.zone === 'dark').length;
  const midCount = swatches.filter((s) => s.zone === 'mid').length;
  const lightCount = swatches.filter((s) => s.zone === 'light').length;
  const zonesPresent =
    (darkCount > 0 ? 1 : 0) + (midCount > 0 ? 1 : 0) + (lightCount > 0 ? 1 : 0);

  const gaps: LightnessGap[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const hi = sorted[i]!;
    const lo = sorted[i + 1]!;
    const delta = round1(hi.lstar - lo.lstar);
    const { status, label } = gapStatus(delta);
    gaps.push({ higher: hi, lower: lo, delta, status, statusLabel: label });
  }

  const idealGap = sorted.length > 1 ? range / (sorted.length - 1) : 0;
  let weightedSqSum = 0;
  let weightTotal = 0;
  for (const g of gaps) {
    const w = isMainMainGap(g.higher.key, g.lower.key) ? 3 : 1;
    const d = g.delta - idealGap;
    weightedSqSum += w * d * d;
    weightTotal += w;
  }
  const gapVariance = weightTotal > 0 ? weightedSqSum / weightTotal : 0;
  const evenness = Math.max(0, 100 - Math.sqrt(gapVariance) * 3);

  /** Pares consecutivos P–S–A–A2 con ΔL* &lt; 8 (muy cercanos): penalización extra frente a huecos con apoyo. */
  let mainMainClosePenalty = 0;
  for (const g of gaps) {
    if (!isMainMainGap(g.higher.key, g.lower.key)) continue;
    if (g.delta >= 8) continue;
    mainMainClosePenalty += (8 - g.delta) * 2.4;
  }
  const cappedMainMainPenalty = Math.min(32, Math.round(mainMainClosePenalty));

  let score = 30;
  if (range >= 70) score += 25;
  else if (range >= 50) score += 18;
  else if (range >= 30) score += 10;
  else score += 2;

  if (zonesPresent === 3) score += 20;
  else if (zonesPresent === 2) score += 10;

  score += evenness * 0.2;
  if (maxL >= 85) score += 5;
  if (minL <= 20) score += 5;

  score -= cappedMainMainPenalty;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let scoreDesc = 'Rango tonal insuficiente';
  if (score >= 85) scoreDesc = 'Excelente rango tonal';
  else if (score >= 70) scoreDesc = 'Buena distribución de luminosidad';
  else if (score >= 50) scoreDesc = 'Rango mejorable';

  return {
    swatches,
    sorted,
    score,
    scoreDesc,
    range: Math.round(range),
    maxL: Math.round(maxL),
    minL: Math.round(minL),
    avg: Math.round(avg),
    gaps,
    darkCount,
    midCount,
    lightCount,
    zonesPresent,
    evenness: Math.round(evenness),
  };
}

export function lightnessSidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function lightnessBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export function gapStatusBadgeClass(status: LightnessGapStatus): string {
  switch (status) {
    case 'excelente':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'bueno':
      return 'bg-amber-500/15 text-amber-300';
    case 'cercano':
      return 'bg-orange-500/15 text-orange-300';
    default:
      return 'bg-rose-500/15 text-rose-300';
  }
}
