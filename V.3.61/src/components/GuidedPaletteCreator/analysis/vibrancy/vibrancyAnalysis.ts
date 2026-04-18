import { hexToRgb } from '../../../../utils/colorUtils';
import { hexToLabD65 } from '../../../../utils/ciede2000';

/** Roles evaluados (misma paleta que temperatura). */
export const VIBRANCY_ROLES = ['P', 'S', 'A', 'A2', 'F'] as const;

/** Acentos visuales (foco): deben concentrar más saturación que P/S. */
export const VIBRANCY_FOCUS_ROLES = ['A', 'A2'] as const;
/** Base de marca: suelen llevar menos croma que los acentos. */
export const VIBRANCY_BASE_ROLES = ['P', 'S'] as const;

export type VibrancyClass = 'vibrant' | 'medium' | 'muted';

export type VibrancySwatch = {
  role: string;
  hex: string;
  label: string;
  chromaPct: number;
  C: number;
  classification: VibrancyClass;
};

export type AccentChromaVsBases = {
  role: 'A' | 'A2';
  chromaPct: number;
  beatsP: boolean;
  beatsS: boolean;
  /** Croma del acento ≥ P y ≥ S (mismo índice 0–100 que las barras). */
  beatsBothBases: boolean;
};

export type VibrancyAccentFocus = {
  avgChromaAccents: number;
  avgChromaBase: number;
  maxChromaAccents: number;
  maxChromaBase: number;
  /** Promedio acentos − promedio P/S (solo referencia; el foco se mide por A/A2 vs P y S). */
  deltaAvgChroma: number;
  chromaP: number;
  chromaS: number;
  /** Croma de A y A2 frente a P y S (mínimo exigible: superar al menos a P o a S; ideal: a ambos). */
  accentVersusBases: AccentChromaVsBases[];
  /** A y A2 superan en croma tanto a P como a S (cada acento frente a cada base). Requisito para nota 100. */
  accentsDominateBothBases: boolean;
  /** Roles P/S/F clasificados como vibrant (compiten con el rol de foco A/A2). */
  vibrantOffFocusRoles: string[];
  /** A o A2 en rango vibrante. */
  vibrantOnFocusRoles: string[];
  /** 0–100: coherencia con «el foco cromático en acentos A / A2». */
  alignmentScore: number;
  alignmentLabel: 'Óptimo' | 'Bueno' | 'Mejorable' | 'Desalineado';
};

export type VibrancyAnalysisResult = {
  score: number;
  /** Puntuación combinada (patrón + foco) antes del tope 99 si A/A2 no superan a P y S. */
  scoreBeforeAccentCap: number;
  /** Puntuación por distribución vibrante/muda (antes del ajuste por foco A/A2). */
  patternScore: number;
  /** Ajuste aplicado por alineación A/A2 vs P/S (−18 … +12). */
  accentFocusModifier: number;
  pattern: string;
  vibrantCount: number;
  mediumCount: number;
  mutedCount: number;
  vibrantPct: number;
  mediumPct: number;
  mutedPct: number;
  avgChromaPct: number;
  colorfulnessVal: number;
  colorfulnessLabel: string;
  swatches: VibrancySwatch[];
  accentFocus: VibrancyAccentFocus;
};

function chromaStarFromAb(a: number, b: number): number {
  return Math.hypot(a, b);
}

/** C* normalizado a 0–100 (ancla ~130 como croma alto en sRGB). */
export function chromaPctFromHex(hex: string): number {
  const lab = hexToLabD65(hex);
  const C = chromaStarFromAb(lab.a, lab.b);
  return Math.min(100, (C / 130) * 100);
}

export function classifyVibrancy(chromaPct: number): VibrancyClass {
  if (chromaPct >= 60) return 'vibrant';
  if (chromaPct >= 25) return 'medium';
  return 'muted';
}

/** M de Hasler & Süsstrunk (2003) sobre canales rg/yb en RGB 0–255. */
export function colorfulnessMetric(hexes: string[]): number {
  if (!hexes.length) return 0;
  const rgs: number[] = [];
  const ybs: number[] = [];
  for (const hex of hexes) {
    const { r, g, b } = hexToRgb(hex);
    rgs.push(r - g);
    ybs.push(0.5 * (r + g) - b);
  }
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = (arr: number[]) => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  };
  const stdRG = std(rgs);
  const stdYB = std(ybs);
  const muRG = Math.abs(mean(rgs));
  const muYB = Math.abs(mean(ybs));
  return Math.sqrt(stdRG ** 2 + stdYB ** 2) + 0.3 * Math.sqrt(muRG ** 2 + muYB ** 2);
}

export function colorfulnessLabelFromM(M: number): string {
  if (M < 15) return 'No colorida';
  if (M < 33) return 'Ligeramente';
  if (M < 45) return 'Moderada';
  if (M < 59) return 'Notable';
  if (M < 82) return 'Bastante';
  return 'Extrema';
}

function mean(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function swatchByRole(swatches: VibrancySwatch[], role: string): VibrancySwatch | undefined {
  return swatches.find((s) => s.role === role);
}

const CHROMA_VS_EPS = 0.5;

function accentBeatsBase(accentChroma: number, baseChroma: number): boolean {
  return accentChroma >= baseChroma - CHROMA_VS_EPS;
}

export function computeAccentFocus(swatches: VibrancySwatch[]): VibrancyAccentFocus & { modifier: number } {
  if (!swatches.length) {
    return {
      avgChromaAccents: 0,
      avgChromaBase: 0,
      maxChromaAccents: 0,
      maxChromaBase: 0,
      deltaAvgChroma: 0,
      chromaP: 0,
      chromaS: 0,
      accentVersusBases: [],
      accentsDominateBothBases: false,
      vibrantOffFocusRoles: [],
      vibrantOnFocusRoles: [],
      alignmentScore: 0,
      alignmentLabel: 'Desalineado',
      modifier: 0,
    };
  }

  const accentChroma = VIBRANCY_FOCUS_ROLES.map((r) => swatchByRole(swatches, r))
    .filter((s): s is VibrancySwatch => Boolean(s))
    .map((s) => s.chromaPct);
  const baseChroma = VIBRANCY_BASE_ROLES.map((r) => swatchByRole(swatches, r))
    .filter((s): s is VibrancySwatch => Boolean(s))
    .map((s) => s.chromaPct);

  const avgChromaAccents = mean(accentChroma);
  const avgChromaBase = mean(baseChroma);
  const maxChromaAccents = accentChroma.length ? Math.max(...accentChroma) : 0;
  const maxChromaBase = baseChroma.length ? Math.max(...baseChroma) : 0;
  const deltaAvgChroma = avgChromaAccents - avgChromaBase;

  const swP = swatchByRole(swatches, 'P');
  const swS = swatchByRole(swatches, 'S');
  const chromaP = swP?.chromaPct ?? 0;
  const chromaS = swS?.chromaPct ?? 0;

  const accentVersusBases: AccentChromaVsBases[] = (['A', 'A2'] as const).map((role) => {
    const sw = swatchByRole(swatches, role);
    const chromaPct = sw?.chromaPct ?? 0;
    const beatsP = accentBeatsBase(chromaPct, chromaP);
    const beatsS = accentBeatsBase(chromaPct, chromaS);
    return {
      role,
      chromaPct,
      beatsP,
      beatsS,
      beatsBothBases: beatsP && beatsS,
    };
  });

  const accentsDominateBothBases = accentVersusBases.length
    ? accentVersusBases.every((row) => row.beatsBothBases)
    : false;

  const vibrantOffFocusRoles = swatches
    .filter((s) => s.classification === 'vibrant' && (s.role === 'P' || s.role === 'S' || s.role === 'F'))
    .map((s) => s.role);

  const vibrantOnFocusRoles = swatches
    .filter((s) => s.classification === 'vibrant' && (s.role === 'A' || s.role === 'A2'))
    .map((s) => s.role);

  const vibrantCount = swatches.filter((s) => s.classification === 'vibrant').length;
  const vibrantRoles = swatches.filter((s) => s.classification === 'vibrant').map((s) => s.role);
  const onlyFocusVibrant =
    vibrantRoles.length > 0 && vibrantRoles.every((r) => r === 'A' || r === 'A2');

  // Puntuación 0–100: cada acento frente a P y S (no solo medias).
  let alignmentScore = 38;
  for (const row of accentVersusBases) {
    if (row.beatsBothBases) alignmentScore += 30;
    else if (row.beatsP || row.beatsS) alignmentScore += 14;
    else alignmentScore -= 6;
  }
  alignmentScore -= vibrantOffFocusRoles.length * 22;
  const baseSteals = maxChromaBase - maxChromaAccents - 6;
  if (baseSteals > 0) alignmentScore -= Math.min(28, baseSteals * 0.8);
  if (onlyFocusVibrant && vibrantCount >= 1 && vibrantCount <= 2) alignmentScore += 18;
  if (!vibrantRoles.length && accentsDominateBothBases) alignmentScore += 10;
  alignmentScore = Math.min(100, Math.max(0, Math.round(alignmentScore)));

  let alignmentLabel: VibrancyAccentFocus['alignmentLabel'] = 'Desalineado';
  if (alignmentScore >= 86) alignmentLabel = 'Óptimo';
  else if (alignmentScore >= 70) alignmentLabel = 'Bueno';
  else if (alignmentScore >= 48) alignmentLabel = 'Mejorable';

  const modifier = Math.round(
    Math.min(12, Math.max(-18, (alignmentScore - 56) * 0.38))
  );

  return {
    avgChromaAccents,
    avgChromaBase,
    maxChromaAccents,
    maxChromaBase,
    deltaAvgChroma,
    chromaP,
    chromaS,
    accentVersusBases,
    accentsDominateBothBases,
    vibrantOffFocusRoles,
    vibrantOnFocusRoles,
    alignmentScore,
    alignmentLabel,
    modifier,
  };
}

function collectSwatches(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): VibrancySwatch[] {
  const out: VibrancySwatch[] = [];
  for (const role of VIBRANCY_ROLES) {
    const e = roleHexMap[role];
    if (!e?.hex) continue;
    const lab = hexToLabD65(e.hex);
    const C = chromaStarFromAb(lab.a, lab.b);
    const chromaPct = chromaPctFromHex(e.hex);
    out.push({
      role,
      hex: e.hex,
      label: e.label,
      chromaPct,
      C,
      classification: classifyVibrancy(chromaPct),
    });
  }
  return out;
}

export function evaluateVibrancy(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): VibrancyAnalysisResult {
  const swatches = collectSwatches(roleHexMap);
  const n = swatches.length;
  if (n === 0) {
    const emptyFocus = computeAccentFocus([]);
    return {
      score: 0,
      scoreBeforeAccentCap: 0,
      patternScore: 0,
      accentFocusModifier: 0,
      pattern: 'Sin colores suficientes',
      vibrantCount: 0,
      mediumCount: 0,
      mutedCount: 0,
      vibrantPct: 0,
      mediumPct: 0,
      mutedPct: 0,
      avgChromaPct: 0,
      colorfulnessVal: 0,
      colorfulnessLabel: colorfulnessLabelFromM(0),
      swatches: [],
      accentFocus: {
        avgChromaAccents: emptyFocus.avgChromaAccents,
        avgChromaBase: emptyFocus.avgChromaBase,
        maxChromaAccents: emptyFocus.maxChromaAccents,
        maxChromaBase: emptyFocus.maxChromaBase,
        deltaAvgChroma: emptyFocus.deltaAvgChroma,
        chromaP: emptyFocus.chromaP,
        chromaS: emptyFocus.chromaS,
        accentVersusBases: emptyFocus.accentVersusBases,
        accentsDominateBothBases: emptyFocus.accentsDominateBothBases,
        vibrantOffFocusRoles: emptyFocus.vibrantOffFocusRoles,
        vibrantOnFocusRoles: emptyFocus.vibrantOnFocusRoles,
        alignmentScore: emptyFocus.alignmentScore,
        alignmentLabel: emptyFocus.alignmentLabel,
      },
    };
  }

  const classifications = swatches.map((s) => s.classification);
  const vibrantCount = classifications.filter((c) => c === 'vibrant').length;
  const mediumCount = classifications.filter((c) => c === 'medium').length;
  const mutedCount = classifications.filter((c) => c === 'muted').length;
  const vibrantPct = (vibrantCount / n) * 100;
  const mediumPct = (mediumCount / n) * 100;
  const mutedPct = (mutedCount / n) * 100;

  const hexes = swatches.map((s) => s.hex);
  const colorfulnessVal = colorfulnessMetric(hexes);
  const colorfulnessLabel = colorfulnessLabelFromM(colorfulnessVal);
  const avgChromaPct = swatches.reduce((a, s) => a + s.chromaPct, 0) / n;

  const accentBlock = computeAccentFocus(swatches);
  const { modifier: accentFocusModifier, ...accentFocus } = accentBlock;

  let patternScore = 50;
  let pattern = '';

  if (vibrantCount >= 1 && vibrantCount <= 2 && mediumCount + mutedCount >= 2) {
    patternScore = 95;
    pattern = 'Jerarquía focal clara (1–2 vibrantes destacados)';
    if (mutedCount >= 1) patternScore = 100;
  } else if (vibrantCount === n) {
    patternScore = 45;
    pattern = 'Saturación excesiva (todos vibrantes compiten)';
  } else if (mutedCount === n) {
    patternScore = 55;
    pattern = 'Paleta monótona (todos apagados, sin energía)';
  } else if (mediumCount === n) {
    patternScore = 70;
    pattern = 'Gradación media uniforme (correcta pero plana)';
  } else if (vibrantCount === 0 && mediumCount > 0 && mutedCount > 0) {
    patternScore = 75;
    pattern = 'Paleta sobria (medios + apagados, sin punto focal)';
  } else if (vibrantCount >= 3) {
    patternScore = 60;
    pattern = 'Múltiples puntos vibrantes (compiten por atención)';
  } else {
    patternScore = 75;
    pattern = 'Distribución mixta';
  }

  patternScore = Math.min(100, Math.max(0, Math.round(patternScore)));
  const scoreBeforeAccentCap = Math.min(100, Math.max(0, Math.round(patternScore + accentFocusModifier)));
  const hasCriticalFocusFailure = accentFocus.accentVersusBases.some((row) => !row.beatsP && !row.beatsS);

  // Evita notas “excelentes” cuando el foco cromático está roto:
  // - Crítico (algún acento no supera ni P ni S): techo 69.
  // - Parcial (no dominan ambos acentos a ambas bases): techo 89.
  let score = scoreBeforeAccentCap;
  if (hasCriticalFocusFailure) score = Math.min(score, 69);
  else if (!accentFocus.accentsDominateBothBases) score = Math.min(score, 89);

  return {
    score,
    scoreBeforeAccentCap,
    patternScore,
    accentFocusModifier,
    pattern,
    vibrantCount,
    mediumCount,
    mutedCount,
    vibrantPct,
    mediumPct,
    mutedPct,
    avgChromaPct,
    colorfulnessVal,
    colorfulnessLabel,
    swatches,
    accentFocus,
  };
}

export function vibrancyScore(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): number {
  return evaluateVibrancy(roleHexMap).score;
}

/** Misma escala que póster / temperatura en la columna izquierda. */
export function vibrancySidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function vibrancyBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export type VibrancyDiagnosticTone = 'good' | 'warning' | 'bad';

export type VibrancyDiagnostic = { tone: VibrancyDiagnosticTone; text: string };

export function buildVibrancyDiagnostics(analysis: VibrancyAnalysisResult): VibrancyDiagnostic[] {
  const d: VibrancyDiagnostic[] = [];
  const { score, pattern, vibrantCount, colorfulnessVal, accentFocus, accentFocusModifier } = analysis;
  const { vibrantOffFocusRoles, alignmentLabel, maxChromaBase, maxChromaAccents, accentsDominateBothBases } =
    accentFocus;

  d.push({
    tone: score >= 85 ? 'good' : score >= 65 ? 'warning' : 'bad',
    text: `Patrón: ${pattern}`,
  });

  const modClause =
    accentFocusModifier !== 0
      ? ` · ajuste en nota global: ${accentFocusModifier > 0 ? '+' : ''}${accentFocusModifier}`
      : '';
  d.push({
    tone:
      accentFocus.alignmentScore >= 72 ? 'good' : accentFocus.alignmentScore >= 48 ? 'warning' : 'bad',
    text: `Foco visual (A/A2 frente a P/S): ${alignmentLabel} (${accentFocus.alignmentScore}/100)${modClause}.`,
  });

  if (vibrantOffFocusRoles.length) {
    d.push({
      tone: 'warning',
      text: `Roles vibrantes fuera de acento: ${vibrantOffFocusRoles.join(', ')}. Lo habitual es reservar «vibrante» para A y/o A2.`,
    });
  }

  if (maxChromaBase > maxChromaAccents + 8) {
    d.push({
      tone: 'warning',
      text: `El croma máximo en P/S supera al de A/A2: la base compite con los acentos en saturación.`,
    });
  }

  if (!accentsDominateBothBases) {
    const hasCriticalFocusFailure = accentFocus.accentVersusBases.some((row) => !row.beatsP && !row.beatsS);
    const capCeil = hasCriticalFocusFailure ? 69 : 89;
    const capNote =
      analysis.scoreBeforeAccentCap >= capCeil
        ? ` La nota se ha limitado a ${analysis.score} (máximo ${capCeil} sin esta condición).`
        : '';
    d.push({
      tone: 'warning',
      text: `Para llegar a 100, A y A2 deben superar en croma (misma escala 0–100) tanto a P como a S, cada acento frente a cada base.${capNote}`,
    });
  }

  if (score >= 95 && accentsDominateBothBases) {
    d.push({
      tone: 'good',
      text: 'Jerarquía óptima: punto focal claro, respiraderos apagados y acentos A/A2 por encima de P y S en croma.',
    });
  } else if (vibrantCount === 0) {
    d.push({
      tone: 'warning',
      text: 'Sin punto focal: añadir 1 color vibrante suele reforzar la jerarquía visual.',
    });
  } else if (vibrantCount >= 3) {
    d.push({
      tone: 'warning',
      text: `${vibrantCount} colores vibrantes compiten por atención; prueba reducir a 1–2.`,
    });
  }

  if (colorfulnessVal < 33) {
    d.push({
      tone: 'warning',
      text: `Colorfulness baja (${colorfulnessVal.toFixed(1)}): la paleta puede percibirse sin energía cromática.`,
    });
  } else if (colorfulnessVal > 82) {
    d.push({
      tone: 'warning',
      text: `Colorfulness extrema (${colorfulnessVal.toFixed(1)}): puede resultar visualmente cansina.`,
    });
  } else {
    d.push({
      tone: 'good',
      text: `Colorfulness equilibrada (${colorfulnessVal.toFixed(1)}): rango perceptualmente agradable.`,
    });
  }

  return d;
}
