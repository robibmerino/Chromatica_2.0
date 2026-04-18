import { hexToLabD65 } from '../../../../utils/ciede2000';

/** Roles de paleta considerados para temperatura (mismo criterio que el prototipo HTML). */
export const TEMPERATURE_HARMONY_ROLES = ['P', 'S', 'A', 'A2', 'F'] as const;
export type TemperatureHarmonyRole = (typeof TEMPERATURE_HARMONY_ROLES)[number];

export type TemperatureClass = 'warm' | 'cool' | 'neutral';

export type TemperatureSwatch = {
  role: string;
  hex: string;
  label: string;
  wc: number;
  classification: TemperatureClass;
};

export type TemperatureHarmonyResult = {
  score: number;
  pattern: string;
  warmCount: number;
  coolCount: number;
  neutralCount: number;
  warmPct: number;
  coolPct: number;
  neutralPct: number;
  avgWC: number;
  swatches: TemperatureSwatch[];
};

function labToLCh(L: number, a: number, b: number): { L: number; C: number; h: number } {
  const C = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

/** Eje warm–cool de Ou et al. (2004), en CIELAB L*C*h* (D65). */
export function warmCoolFromHex(hex: string): number {
  const lab = hexToLabD65(hex);
  const lch = labToLCh(lab.L, lab.a, lab.b);
  const hRad = ((lch.h - 50) * Math.PI) / 180;
  return -0.5 + 0.02 * Math.pow(lch.C, 1.07) * Math.cos(hRad);
}

export function classifyTemperature(wc: number): TemperatureClass {
  if (wc > 0.5) return 'warm';
  if (wc < -0.5) return 'cool';
  return 'neutral';
}

/** Posición 0–100 en la barra espectral (WC aprox. en [-2, 2]). */
export function wcToSpectrumPercent(wc: number): number {
  const clamped = Math.max(-2, Math.min(2, wc));
  return ((clamped + 2) / 4) * 100;
}

function collectSwatches(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): TemperatureSwatch[] {
  const out: TemperatureSwatch[] = [];
  for (const role of TEMPERATURE_HARMONY_ROLES) {
    const e = roleHexMap[role];
    if (!e?.hex) continue;
    const wc = warmCoolFromHex(e.hex);
    out.push({
      role,
      hex: e.hex,
      label: e.label,
      wc,
      classification: classifyTemperature(wc),
    });
  }
  return out;
}

/**
 * Evalúa armonía térmica perceptual (reglas del prototipo: monotermia, 80/20, 50/50, neutros).
 * Solo usa roles presentes en el mapa (típicamente P, S, A, A2, F).
 */
export function evaluateTemperatureHarmony(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): TemperatureHarmonyResult {
  const swatches = collectSwatches(roleHexMap);
  const n = swatches.length;
  if (n === 0) {
    return {
      score: 0,
      pattern: 'Sin colores suficientes',
      warmCount: 0,
      coolCount: 0,
      neutralCount: 0,
      warmPct: 0,
      coolPct: 0,
      neutralPct: 0,
      avgWC: 0,
      swatches: [],
    };
  }

  const classifications = swatches.map((s) => s.classification);
  const warmCount = classifications.filter((c) => c === 'warm').length;
  const coolCount = classifications.filter((c) => c === 'cool').length;
  const neutralCount = classifications.filter((c) => c === 'neutral').length;
  const total = n;

  const warmPct = (warmCount / total) * 100;
  const coolPct = (coolCount / total) * 100;
  const neutralPct = (neutralCount / total) * 100;

  const warmRatio = warmCount / total;
  const coolRatio = coolCount / total;

  let score = 50;
  let pattern = '';

  if (warmCount === total || coolCount === total) {
    score = 80;
    pattern = 'Monotérmica';
  } else if (
    (warmCount + neutralCount === total && warmRatio >= 0.5) ||
    (coolCount + neutralCount === total && coolRatio >= 0.5)
  ) {
    score = 85;
    pattern = 'Monotérmica equilibrada';
  } else if (warmRatio >= 0.6 && warmRatio <= 0.85 && coolRatio >= 0.15 && coolRatio <= 0.4) {
    score = 95 + (warmRatio === 0.75 ? 5 : 0);
    pattern = 'Dominante cálida con acento frío (80/20)';
  } else if (coolRatio >= 0.6 && coolRatio <= 0.85 && warmRatio >= 0.15 && warmRatio <= 0.4) {
    score = 95 + (coolRatio === 0.75 ? 5 : 0);
    pattern = 'Dominante fría con acento cálido (80/20)';
  } else if (Math.abs(warmRatio - coolRatio) < 0.15) {
    score = 60;
    pattern = 'Equilibrio 50/50 (puede generar tensión)';
  } else {
    score = 70;
    pattern = 'Mixta';
  }

  if (neutralCount >= 1 && neutralCount <= 2 && score < 95) {
    score += 5;
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  const avgWC = swatches.reduce((acc, s) => acc + s.wc, 0) / swatches.length;

  return {
    score,
    pattern,
    warmCount,
    coolCount,
    neutralCount,
    warmPct,
    coolPct,
    neutralPct,
    avgWC,
    swatches,
  };
}

export function temperatureHarmonyScore(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): number {
  return evaluateTemperatureHarmony(roleHexMap).score;
}

export function temperatureHarmonyScoreDescription(score: number): string {
  if (score >= 95) return 'Armonía térmica excelente';
  if (score >= 85) return 'Buena armonía de temperatura';
  if (score >= 70) return 'Armonía aceptable';
  if (score >= 55) return 'Mejorable';
  return 'Disonante o poco definida';
}

/** Misma escala visual que el subanálisis del póster (barra y % en columna izquierda). */
export function temperatureHarmonySidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function temperatureHarmonyBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export type TemperatureDiagnosticTone = 'good' | 'warning' | 'bad';

export type TemperatureDiagnostic = {
  tone: TemperatureDiagnosticTone;
  text: string;
};

export function buildTemperatureDiagnostics(analysis: TemperatureHarmonyResult): TemperatureDiagnostic[] {
  const diagnostics: TemperatureDiagnostic[] = [];
  const { score, pattern, warmPct, coolPct, neutralCount, warmCount, coolCount } = analysis;

  diagnostics.push({
    tone: score >= 85 ? 'good' : score >= 65 ? 'warning' : 'bad',
    text: `Patrón: ${pattern}`,
  });

  if (score >= 95) {
    diagnostics.push({
      tone: 'good',
      text: 'Balance ideal: dominancia clara con acento opuesto en proporción 80/20 aproximada.',
    });
  } else if (warmPct === 100 || coolPct === 100) {
    diagnostics.push({
      tone: 'warning',
      text: 'Sin acento térmico opuesto: añade un color de temperatura contraria para más interés visual.',
    });
  } else if (Math.abs(warmPct - coolPct) < 15) {
    diagnostics.push({
      tone: 'warning',
      text: 'Tensión 50/50: ninguna temperatura domina; puede competir la atención.',
    });
  }

  if (neutralCount === 0 && warmCount > 0 && coolCount > 0) {
    diagnostics.push({
      tone: 'warning',
      text: 'Sin neutros: un tono intermedio puede suavizar el salto térmico.',
    });
  } else if (neutralCount >= 1) {
    diagnostics.push({
      tone: 'good',
      text: `${neutralCount} color(es) neutro(s) actúan como puente armónico.`,
    });
  }

  return diagnostics;
}
