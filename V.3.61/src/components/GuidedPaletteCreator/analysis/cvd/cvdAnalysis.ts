import { hexToRgb, rgbToHex } from '../../../../utils/colorUtils';
import { hexToLabD65 } from '../../../../utils/ciede2000';

/** Tipos con simulación en UI (incluye acromatopsia para vista; la nota global usa solo dicromacias frecuentes). */
export const CVD_UI_TYPES = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const;
export type CvdUiType = (typeof CVD_UI_TYPES)[number];

/** Subconjunto para la puntuación global (como en el HTML de referencia: no acromatopsia). */
export const CVD_SCORE_TYPES = ['protanopia', 'deuteranopia', 'tritanopia'] as const;

/** Roles evaluados en pares (misma paleta que vibración). */
export const CVD_ROLES = ['P', 'S', 'A', 'A2', 'F'] as const;

function srgbToLinear01(c255: number): number {
  const c = c255 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linear01ToSrgbByte(linear: number): number {
  const v = Math.max(0, Math.min(1, linear));
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

/** Matrices Viénot–Brettel–Mollon (1999) en RGB lineal. */
const CVD_MATRICES: Record<CvdUiType, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export function simulateCvdHex(hex: string, type: CvdUiType): string {
  const { r, g, b } = hexToRgb(hex);
  const M = CVD_MATRICES[type];
  const rl = srgbToLinear01(r);
  const gl = srgbToLinear01(g);
  const bl = srgbToLinear01(b);
  const r2 = M[0][0] * rl + M[0][1] * gl + M[0][2] * bl;
  const g2 = M[1][0] * rl + M[1][1] * gl + M[1][2] * bl;
  const b2 = M[2][0] * rl + M[2][1] * gl + M[2][2] * bl;
  return rgbToHex(linear01ToSrgbByte(r2), linear01ToSrgbByte(g2), linear01ToSrgbByte(b2));
}

/** ΔE en CIELAB (equivalente a ΔE76 con distancia euclídea en L*a*b*). */
export function deltaEabHex(hex1: string, hex2: string): number {
  const a = hexToLabD65(hex1);
  const b = hexToLabD65(hex2);
  return Math.sqrt((a.L - b.L) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2);
}

export type CvdConflictSeverity = 'critical' | 'warning';

export type CvdConflictPair = {
  role1: string;
  role2: string;
  simHex1: string;
  simHex2: string;
  deltaE: number;
  severity: CvdConflictSeverity;
};

function collectHexEntries(roleHexMap: Record<string, { hex: string; label: string } | undefined>): { role: string; hex: string }[] {
  const out: { role: string; hex: string }[] = [];
  for (const role of CVD_ROLES) {
    const e = roleHexMap[role];
    if (e?.hex) out.push({ role, hex: e.hex });
  }
  return out;
}

/** Pares conflictivos bajo un tipo CVD (ΔE en colores simulados). */
export function detectCvdConflicts(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>,
  type: CvdUiType
): CvdConflictPair[] {
  const entries = collectHexEntries(roleHexMap);
  const conflicts: CvdConflictPair[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const e1 = entries[i];
      const e2 = entries[j];
      const sim1 = simulateCvdHex(e1.hex, type);
      const sim2 = simulateCvdHex(e2.hex, type);
      const de = deltaEabHex(sim1, sim2);
      let severity: CvdConflictSeverity | null = null;
      if (de < 5) severity = 'critical';
      else if (de < 10) severity = 'warning';
      if (severity) {
        conflicts.push({
          role1: e1.role,
          role2: e2.role,
          simHex1: sim1,
          simHex2: sim2,
          deltaE: de,
          severity,
        });
      }
    }
  }
  return conflicts.sort((a, b) => a.deltaE - b.deltaE);
}

/**
 * Puntuación global 0–100: por cada par de roles únicos (P–F), se calcula el ΔE Lab entre colores
 * simulados bajo protanopia, deuteranopia y tritanopia y se toma el **mínimo** (peor caso entre esos
 * tres tipos). Si ese mínimo es &lt; 10, el par no se considera distinguible en la nota.
 * Así un conflicto grave en un solo tipo no queda diluido frente a los otros dos.
 * (Acromatopsia no entra en la nota global.)
 */
export function evaluateCvdGlobalScore(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): number {
  const entries = collectHexEntries(roleHexMap);
  const pairCount = (entries.length * (entries.length - 1)) / 2;
  if (pairCount === 0) return 0;

  let problematicPairs = 0;

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      let minDe = Number.POSITIVE_INFINITY;
      for (const cvdType of CVD_SCORE_TYPES) {
        const sim1 = simulateCvdHex(entries[i].hex, cvdType);
        const sim2 = simulateCvdHex(entries[j].hex, cvdType);
        const de = deltaEabHex(sim1, sim2);
        if (de < minDe) minDe = de;
      }
      if (minDe < 10) problematicPairs++;
    }
  }

  const passRate = ((pairCount - problematicPairs) / pairCount) * 100;
  return Math.min(100, Math.max(0, Math.round(passRate)));
}

export function cvdSidebarTone(score: number): { fillClass: string; textClass: string } {
  if (score >= 85) return { fillClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
  if (score >= 70) return { fillClass: 'bg-cyan-400', textClass: 'text-cyan-400' };
  if (score >= 50) return { fillClass: 'bg-amber-400', textClass: 'text-amber-400' };
  return { fillClass: 'bg-rose-500', textClass: 'text-rose-400' };
}

export function cvdBadge(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'Excelente', className: 'bg-emerald-500/15 text-emerald-300' };
  if (score >= 70) return { label: 'Bueno', className: 'bg-cyan-500/15 text-cyan-300' };
  if (score >= 50) return { label: 'Mejorable', className: 'bg-amber-500/15 text-amber-300' };
  return { label: 'Bajo', className: 'bg-rose-500/15 text-rose-300' };
}

export function cvdScoreDesc(score: number): string {
  if (score >= 95) return 'Excelente accesibilidad CVD';
  if (score >= 80) return 'Buena accesibilidad CVD';
  if (score >= 65) return 'Accesibilidad CVD aceptable';
  if (score >= 50) return 'Mejorable bajo simulación';
  return 'Conflictos críticos';
}

export const CVD_TYPE_META: Record<
  CvdUiType,
  { label: string; prevalence: string; description: string }
> = {
  protanopia: {
    label: 'Protanopia',
    prevalence: '~1 % personas',
    description:
      'Ausencia del cono L (rojo). Los rojos se perciben oscuros; rojo y verde pueden confundirse. Muy relevante en señalización.',
  },
  deuteranopia: {
    label: 'Deuteranopia',
    prevalence: '~1 % personas',
    description:
      'Ausencia del cono M (verde). Forma frecuente de daltonismo rojo–verde; verdes y rojos brillantes pueden parecer marrones similares.',
  },
  tritanopia: {
    label: 'Tritanopia',
    prevalence: '<0,01 %',
    description:
      'Ausencia del cono S (azul). Muy rara; confunde azul con verde y amarillo con violeta.',
  },
  achromatopsia: {
    label: 'Acromatopsia',
    prevalence: '<0,003 %',
    description:
      'Solo luminancia (escala de grises). Caso extremo: si la paleta se distingue aquí, suele ser robusta en muchos contextos.',
  },
};
