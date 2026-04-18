import { hexToHsl, hslToHex, rotateHue } from '../../../../utils/colorUtils';
import {
  CVD_ROLES,
  CVD_SCORE_TYPES,
  deltaEabHex,
  evaluateCvdGlobalScore,
  simulateCvdHex,
} from './cvdAnalysis';

function cloneRoleMap(
  map: Record<string, { hex: string; label: string } | undefined>
): Record<string, { hex: string; label: string }> {
  const o: Record<string, { hex: string; label: string }> = {};
  for (const k of Object.keys(map)) {
    const v = map[k];
    if (v) o[k] = { hex: v.hex, label: v.label };
  }
  return o;
}

function scaleSaturation(hex: string, factor: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, Math.max(0, Math.min(100, s * factor)), l);
}

function scaleLightness(hex: string, delta: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + delta)));
}

function minWorstCaseDeltaEForPair(hex1: string, hex2: string): number {
  let minAcrossTypes = Number.POSITIVE_INFINITY;
  for (const t of CVD_SCORE_TYPES) {
    const de = deltaEabHex(simulateCvdHex(hex1, t), simulateCvdHex(hex2, t));
    if (de < minAcrossTypes) minAcrossTypes = de;
  }
  return minAcrossTypes;
}

function globalMinWorstCaseDeltaE(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): number {
  const entries: { hex: string }[] = [];
  for (const role of CVD_ROLES) {
    const e = roleHexMap[role];
    if (e?.hex) entries.push({ hex: e.hex });
  }
  if (entries.length < 2) return Number.POSITIVE_INFINITY;

  let gMin = Number.POSITIVE_INFINITY;
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const m = minWorstCaseDeltaEForPair(entries[i].hex, entries[j].hex);
      if (m < gMin) gMin = m;
    }
  }
  return gMin;
}

/** No acepta bajar la nota global; a nota igual, prefiere mayor ΔE mínimo (peor par, peor dicromacía). */
function isBetterCvdStep(
  nextScore: number,
  nextGMin: number,
  prevScore: number,
  prevGMin: number
): boolean {
  if (nextScore > prevScore) return true;
  if (nextScore < prevScore) return false;
  return nextGMin > prevGMin;
}

function candidateHexes(baseHex: string): string[] {
  const deltas = [-12, -10, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 10, 12];
  const out: string[] = [];
  for (const d of deltas) {
    out.push(scaleLightness(baseHex, d));
  }
  out.push(
    scaleSaturation(baseHex, 0.88),
    scaleSaturation(baseHex, 0.94),
    scaleSaturation(baseHex, 1.06),
    scaleSaturation(baseHex, 1.14),
    rotateHue(baseHex, 6),
    rotateHue(baseHex, -6),
    rotateHue(baseHex, 10),
    rotateHue(baseHex, -10)
  );
  return out;
}

function uniqHexes(hexes: string[]): string[] {
  const seen = new Set<string>();
  const r: string[] = [];
  for (const h of hexes) {
    const k = h.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    r.push(h);
  }
  return r;
}

/**
 * Heurística iterativa sobre P/S/A/A2/F para subir `evaluateCvdGlobalScore`
 * (pares distinguibles bajo peor dicromacía con umbral ΔE Lab 10).
 */
export function computeAutoAdjustedCvdHexes(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);

  for (let round = 0; round < 140; round++) {
    const currentScore = evaluateCvdGlobalScore(working);
    const currentGMin = globalMinWorstCaseDeltaE(working);
    if (currentScore >= 100) break;

    let bestRole: string | null = null;
    let bestHex: string | null = null;
    let bestScore = currentScore;
    let bestGMin = currentGMin;

    for (const role of CVD_ROLES) {
      const cell = working[role];
      if (!cell?.hex) continue;
      const candidates = uniqHexes(candidateHexes(cell.hex));
      for (const cand of candidates) {
        if (cand.toLowerCase() === cell.hex.toLowerCase()) continue;
        const trial = { ...working, [role]: { ...cell, hex: cand } };
        const trialScore = evaluateCvdGlobalScore(trial);
        const trialGMin = globalMinWorstCaseDeltaE(trial);
        if (isBetterCvdStep(trialScore, trialGMin, bestScore, bestGMin)) {
          bestScore = trialScore;
          bestGMin = trialGMin;
          bestRole = role;
          bestHex = cand;
        }
      }
    }

    if (bestRole && bestHex && isBetterCvdStep(bestScore, bestGMin, currentScore, currentGMin)) {
      const cell = working[bestRole];
      if (cell) working[bestRole] = { ...cell, hex: bestHex };
    } else {
      break;
    }
  }

  const updates: Record<string, string> = {};
  for (const k of CVD_ROLES) {
    const before = roleHexMap[k]?.hex;
    const after = working[k]?.hex;
    if (before && after && before.toLowerCase() !== after.toLowerCase()) {
      updates[k] = after;
    }
  }
  return updates;
}
