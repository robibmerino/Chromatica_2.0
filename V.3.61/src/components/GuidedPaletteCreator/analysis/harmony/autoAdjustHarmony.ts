import { hexToHsl, hslToHex, rotateHue } from '../../../../utils/colorUtils';
import { HARMONY_ROLES, evaluateChromaticHarmony, type HarmonyAnalysisResult } from './harmonyAnalysis';

function cloneRoleMap(
  map: Record<string, { hex: string; label: string } | undefined>
): Record<string, { hex: string; label: string }> {
  const out: Record<string, { hex: string; label: string }> = {};
  for (const key of Object.keys(map)) {
    const value = map[key];
    if (value) out[key] = { hex: value.hex, label: value.label };
  }
  return out;
}

function scaleSaturation(hex: string, factor: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, Math.max(0, Math.min(100, s * factor)), l);
}

function shiftLightness(hex: string, delta: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + delta)));
}

function isBetter(next: HarmonyAnalysisResult, prev: HarmonyAnalysisResult): boolean {
  if (next.score > prev.score) return true;
  if (next.score < prev.score) return false;

  const prevDist = prev.bestPattern?.avgDist ?? Number.POSITIVE_INFINITY;
  const nextDist = next.bestPattern?.avgDist ?? Number.POSITIVE_INFINITY;
  if (nextDist < prevDist) return true;
  if (nextDist > prevDist) return false;

  return (next.bestPattern?.score ?? 0) > (prev.bestPattern?.score ?? 0);
}

function candidateHexes(baseHex: string): string[] {
  return [
    rotateHue(baseHex, 6),
    rotateHue(baseHex, -6),
    rotateHue(baseHex, 12),
    rotateHue(baseHex, -12),
    rotateHue(baseHex, 18),
    rotateHue(baseHex, -18),
    scaleSaturation(baseHex, 0.88),
    scaleSaturation(baseHex, 1.08),
    shiftLightness(baseHex, -4),
    shiftLightness(baseHex, 4),
  ];
}

function uniqHexes(hexes: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const hex of hexes) {
    const k = hex.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(hex);
  }
  return out;
}

export function computeAutoAdjustedHarmonyHexes(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);

  for (let round = 0; round < 120; round++) {
    const current = evaluateChromaticHarmony(working);
    if (current.score >= 100) break;

    let bestRole: string | null = null;
    let bestHex: string | null = null;
    let bestEval = current;

    for (const role of HARMONY_ROLES) {
      const cell = working[role];
      if (!cell?.hex) continue;

      const candidates = uniqHexes(candidateHexes(cell.hex));
      for (const candidate of candidates) {
        if (candidate.toLowerCase() === cell.hex.toLowerCase()) continue;
        const trial = { ...working, [role]: { ...cell, hex: candidate } };
        const trialEval = evaluateChromaticHarmony(trial);
        if (isBetter(trialEval, bestEval)) {
          bestRole = role;
          bestHex = candidate;
          bestEval = trialEval;
        }
      }
    }

    if (bestRole && bestHex && isBetter(bestEval, current)) {
      const cell = working[bestRole];
      if (cell) working[bestRole] = { ...cell, hex: bestHex };
    } else {
      break;
    }
  }

  const updates: Record<string, string> = {};
  for (const role of HARMONY_ROLES) {
    const before = roleHexMap[role]?.hex;
    const after = working[role]?.hex;
    if (before && after && before.toLowerCase() !== after.toLowerCase()) {
      updates[role] = after;
    }
  }

  return updates;
}
