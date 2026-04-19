import { hexToLabD65, labToHexD65 } from '../../../../utils/ciede2000';
import { evaluateLightnessBalance } from './lightnessBalanceAnalysis';

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

/** Candidatos moviendo solo L* en CIELAB (a*, b* fijos), dentro de gamut sRGB vía `labToHexD65`. */
function labLightnessCandidates(hex: string): string[] {
  const { L, a, b } = hexToLabD65(hex);
  const deltas = [-14, -10, -7, -5, -3, -2, 2, 3, 5, 7, 10, 14];
  const out: string[] = [];
  for (const d of deltas) {
    const L2 = Math.max(0.5, Math.min(99.5, L + d));
    out.push(labToHexD65(L2, a, b));
  }
  return uniqHexes(out);
}

type RoleMap = Record<string, { hex: string; label: string } | undefined>;

function evalMap(m: Record<string, { hex: string; label: string }>) {
  return evaluateLightnessBalance(m as RoleMap);
}

/**
 * Ajuste greedy por pasos: en cada ronda elige el cambio de un solo rol que más suba
 * la puntuación de `evaluateLightnessBalance` (misma métrica que la UI), moviendo L* en Lab.
 */
export function computeAutoAdjustedLightnessHexes(
  roleHexMap: Record<string, { hex: string; label: string } | undefined>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);
  if (Object.keys(working).length < 2) return {};

  const maxRounds = 96;

  for (let round = 0; round < maxRounds; round++) {
    const current = evalMap(working);
    if (current.score >= 99 || !current.swatches.length) break;

    let bestScore = current.score;
    let bestRole: string | null = null;
    let bestHex: string | null = null;

    const keys = [...current.swatches.map((s) => s.key)].sort((a, b) => (round % 2 === 0 ? a.localeCompare(b) : b.localeCompare(a)));

    for (const role of keys) {
      const cell = working[role];
      if (!cell?.hex) continue;
      const base = cell.hex.toLowerCase();

      for (const cand of labLightnessCandidates(cell.hex)) {
        if (cand.toLowerCase() === base) continue;
        const trial = { ...working, [role]: { hex: cand, label: cell.label } };
        const ev = evalMap(trial);
        if (ev.score > bestScore) {
          bestScore = ev.score;
          bestRole = role;
          bestHex = cand;
        }
      }
    }

    if (!bestRole || !bestHex) break;
    working[bestRole] = { ...working[bestRole]!, hex: bestHex };
  }

  const updates: Record<string, string> = {};
  for (const key of Object.keys(working)) {
    const orig = roleHexMap[key]?.hex;
    const next = working[key]!.hex;
    if (orig && next.toLowerCase() !== orig.toLowerCase()) {
      updates[key] = next;
    }
  }
  return updates;
}
