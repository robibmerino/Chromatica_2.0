import { hexToHsl, hexToRgb } from '../../../../utils/colorUtils';
import type { AnalysisDiagnosticItem } from '../AnalysisDiagnosticList';

export const HARMONY_ROLES = ['P', 'S', 'A', 'A2'] as const;
export type HarmonyRole = (typeof HARMONY_ROLES)[number];

export type HarmonyPatternId =
  | 'mono'
  | 'analogous'
  | 'complementary'
  | 'doubleComplementary'
  | 'splitComplementary'
  | 'triadic'
  | 'tetradic'
  | 'square';

export type HarmonyPattern = {
  id: HarmonyPatternId;
  name: string;
  angles: number[];
  tolerance: number;
  desc: string;
};

export type HarmonySwatch = {
  role: HarmonyRole;
  hex: string;
  /** Matiz en grados (float); mostrar redondeado en UI. */
  h: number;
  s: number;
  l: number;
  isNeutral: boolean;
};

export type HarmonyPatternScore = HarmonyPattern & {
  score: number;
  avgDist: number;
  bestRotation: number;
};

export type HarmonyAnalysisResult = {
  score: number;
  scoreDesc: string;
  swatches: HarmonySwatch[];
  chromatic: HarmonySwatch[];
  patternScores: HarmonyPatternScore[];
  bestPattern: HarmonyPatternScore | null;
  hueRange: number;
  neutralCount: number;
};

/**
 * Los 8 patrones coinciden con la sección «Armonía de color» (`ColorHarmonyCreator`):
 * monocromático, análogo, complementario, doble complementario, complementario dividido,
 * triádico, tetrádico (rectángulo 0/60/180/240) y cuadrado (0/90/180/270).
 */
export const HARMONY_PATTERNS: HarmonyPattern[] = [
  { name: 'Monocromático', id: 'mono', angles: [0], tolerance: 20, desc: 'Un solo tono' },
  {
    name: 'Análogo',
    id: 'analogous',
    angles: [0, 30, 60, 90, 120],
    tolerance: 20,
    desc: '±30° adyacentes',
  },
  {
    name: 'Complementario',
    id: 'complementary',
    angles: [0, 180],
    tolerance: 25,
    desc: '180° opuestos',
  },
  {
    name: 'Doble complementario',
    id: 'doubleComplementary',
    angles: [0, 30, 180, 210],
    tolerance: 25,
    desc: '0°/30° + 180°/210°',
  },
  {
    name: 'Complementario dividido',
    id: 'splitComplementary',
    angles: [0, 150, 210],
    tolerance: 25,
    desc: '150° + 210°',
  },
  {
    name: 'Triádico',
    id: 'triadic',
    angles: [0, 120, 240],
    tolerance: 25,
    desc: '120° equidistantes',
  },
  {
    name: 'Tetrádico',
    id: 'tetradic',
    angles: [0, 60, 180, 240],
    tolerance: 25,
    desc: '90° rectángulo',
  },
  {
    name: 'Cuadrado',
    id: 'square',
    angles: [0, 90, 180, 270],
    tolerance: 25,
    desc: '90° equidistantes',
  },
];

/** Mínimo de tonos cromáticos para que el patrón tenga sentido; no se penaliza por tener más tonos. */
function minChromaticCountForPattern(id: HarmonyPatternId): number {
  switch (id) {
    case 'mono':
      return 1;
    case 'analogous':
      return 2;
    case 'complementary':
      return 2;
    case 'doubleComplementary':
      return 4;
    case 'splitComplementary':
      return 3;
    case 'triadic':
      return 3;
    case 'tetradic':
      return 4;
    case 'square':
      return 4;
  }
}

function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Matiz 0–360° en coma flotante (sin redondeo de `hexToHsl`) para que el scoring angular sea estable. */
function hueFloatDegreesFromHex(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      break;
    case gn:
      h = ((bn - rn) / d + 2) / 6;
      break;
    default:
      h = ((rn - gn) / d + 4) / 6;
      break;
  }
  return ((h * 360) % 360 + 360) % 360;
}

function calcHueRange(hues: number[]): number {
  if (hues.length <= 1) return 0;
  const sorted = [...hues].sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[(i + 1) % sorted.length] + (i === sorted.length - 1 ? 360 : 0);
    maxGap = Math.max(maxGap, next - current);
  }
  return Math.round(360 - maxGap);
}

function scorePattern(pattern: HarmonyPattern, hues: number[]): HarmonyPatternScore {
  if (hues.length === 0) {
    return { ...pattern, score: 0, avgDist: 180, bestRotation: 0 };
  }

  let bestScore = 0;
  let bestAvgDist = Number.POSITIVE_INFINITY;
  let bestRotation = 0;

  for (let rotation = 0; rotation < 360; rotation += 1) {
    const rotatedTemplate = pattern.angles.map((a) => (a + rotation) % 360);
    let totalDist = 0;

    for (const hue of hues) {
      let minDist = 360;
      for (const ta of rotatedTemplate) {
        const d = angularDistance(hue, ta);
        if (d < minDist) minDist = d;
      }
      totalDist += minDist;
    }

    const avgDist = totalDist / hues.length;
    const baseScore = Math.max(0, 100 - (avgDist / pattern.tolerance) * 50);
    const need = minChromaticCountForPattern(pattern.id);
    const shortfall = need - hues.length;
    const countPenalty = shortfall > 0 ? shortfall * 5 : 0;
    const score = Math.max(0, Math.min(100, Math.round(baseScore - countPenalty)));

    if (score > bestScore || (score === bestScore && avgDist < bestAvgDist)) {
      bestScore = score;
      bestAvgDist = avgDist;
      bestRotation = rotation;
    }
  }

  return {
    ...pattern,
    score: bestScore,
    avgDist: bestAvgDist,
    bestRotation,
  };
}

function scoreDescFromScore(score: number): string {
  if (score >= 85) return 'Excelente armonía cromática';
  if (score >= 70) return 'Buena relación entre tonos';
  if (score >= 50) return 'Armonía moderada';
  if (score >= 30) return 'Relación débil entre tonos';
  return 'Tonos dispersos sin patrón claro';
}

export function evaluateChromaticHarmony(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): HarmonyAnalysisResult {
  const swatches: HarmonySwatch[] = [];
  for (const role of HARMONY_ROLES) {
    const entry = roleHexMap[role];
    if (!entry?.hex) continue;
    const hsl = hexToHsl(entry.hex);
    swatches.push({
      role,
      hex: entry.hex,
      h: hueFloatDegreesFromHex(entry.hex),
      s: hsl.s,
      l: hsl.l,
      isNeutral: hsl.s <= 10,
    });
  }

  const chromatic = swatches.filter((s) => !s.isNeutral);
  const hues = chromatic.map((s) => s.h);
  const patternScores = HARMONY_PATTERNS.map((p) => scorePattern(p, hues)).sort((a, b) => b.score - a.score);
  const bestPattern = patternScores[0] ?? null;
  const score = bestPattern?.score ?? 0;

  return {
    score,
    scoreDesc: scoreDescFromScore(score),
    swatches,
    chromatic,
    patternScores,
    bestPattern,
    hueRange: calcHueRange(hues),
    neutralCount: swatches.length - chromatic.length,
  };
}

export function harmonySidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function harmonyBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export function buildHarmonyDiagnostics(analysis: HarmonyAnalysisResult): AnalysisDiagnosticItem[] {
  if (!analysis.swatches.length) {
    return [{ tone: 'bad', text: 'No hay roles cromáticos evaluables todavía.' }];
  }

  const diagnostics: AnalysisDiagnosticItem[] = [];
  if (analysis.bestPattern) {
    if (analysis.bestPattern.score >= 80) {
      diagnostics.push({
        tone: 'good',
        text: `El patrón dominante (${analysis.bestPattern.name}) está bien definido y aporta coherencia visual.`,
      });
    } else if (analysis.bestPattern.score >= 55) {
      diagnostics.push({
        tone: 'warning',
        text: `Se intuye un patrón ${analysis.bestPattern.name}, pero hay desviaciones de tono que debilitan la armonía.`,
      });
    } else {
      diagnostics.push({
        tone: 'bad',
        text: 'La distribución de tonos es dispersa; conviene acercarla a un patrón armónico claro.',
      });
    }
  }

  if (analysis.neutralCount >= 2) {
    diagnostics.push({
      tone: 'good',
      text: 'Hay neutros de soporte: ayudan a que los tonos cromáticos no compitan todos al mismo nivel.',
    });
  } else if (analysis.neutralCount === 0 && analysis.chromatic.length >= 4) {
    diagnostics.push({
      tone: 'warning',
      text: 'Todos los roles son cromáticos; un neutro estratégico puede mejorar la legibilidad general.',
    });
  }

  if (analysis.hueRange >= 220) {
    diagnostics.push({
      tone: 'warning',
      text: 'El rango de tonos es muy amplio; puede transmitir energía, pero también sensación de menor unidad.',
    });
  } else {
    diagnostics.push({
      tone: 'good',
      text: 'El rango tonal está contenido y favorece la percepción de familia cromática.',
    });
  }

  return diagnostics.slice(0, 3);
}
