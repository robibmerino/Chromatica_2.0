import { hexToHsl, hslToHex, rotateHue } from '../../../../utils/colorUtils';
import {
  evaluateTemperatureHarmony,
  TEMPERATURE_HARMONY_ROLES,
  type TemperatureHarmonyResult,
} from './temperatureHarmonyAnalysis';

function cloneRoleMap(map: Record<string, { hex: string; label: string }>): Record<string, { hex: string; label: string }> {
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

/** Candidatos de un solo paso a partir del estado de armonía actual. */
function candidateHexes(baseHex: string, analysis: TemperatureHarmonyResult, role: string): string[] {
  const { warmCount, coolCount, neutralCount, swatches } = analysis;
  const n = swatches.length || 1;
  const warmRatio = warmCount / n;
  const coolRatio = coolCount / n;
  const tension5050 = warmCount > 0 && coolCount > 0 && Math.abs(warmRatio - coolRatio) < 0.15;

  const out: string[] = [
    rotateHue(baseHex, 8),
    rotateHue(baseHex, -8),
    rotateHue(baseHex, 14),
    rotateHue(baseHex, -14),
    rotateHue(baseHex, 22),
    rotateHue(baseHex, -22),
    scaleSaturation(baseHex, 0.9),
    scaleSaturation(baseHex, 0.82),
    scaleSaturation(baseHex, 1.06),
    scaleLightness(baseHex, 3),
    scaleLightness(baseHex, -3),
  ];

  // Acentos: empujar hacia temperatura opuesta cuando la paleta es monotérmica
  const monoWarm = coolCount === 0 && warmCount === n && n > 0;
  const monoCool = warmCount === 0 && coolCount === n && n > 0;
  if ((role === 'A' || role === 'A2') && monoWarm) {
    out.push(rotateHue(baseHex, -32), rotateHue(baseHex, -48), scaleSaturation(baseHex, 1.12));
  }
  if ((role === 'A' || role === 'A2') && monoCool) {
    out.push(rotateHue(baseHex, 32), rotateHue(baseHex, 48), scaleSaturation(baseHex, 1.12));
  }

  // Tensión 50/50: suavizar el rol más extremo en WC hacia el bando minoritario
  if (tension5050) {
    const mine = swatches.find((s) => s.role === role);
    if (mine) {
      if (mine.classification === 'warm' && coolRatio < warmRatio) {
        out.push(rotateHue(baseHex, -18), rotateHue(baseHex, -28), scaleSaturation(baseHex, 0.88));
      }
      if (mine.classification === 'cool' && warmRatio < coolRatio) {
        out.push(rotateHue(baseHex, 18), rotateHue(baseHex, 28), scaleSaturation(baseHex, 0.88));
      }
    }
  }

  // Sin neutros con mezcla: volver un secundario más “puente”
  if (neutralCount === 0 && warmCount > 0 && coolCount > 0 && (role === 'S' || role === 'F')) {
    out.push(scaleSaturation(baseHex, 0.75), scaleSaturation(baseHex, 0.68), scaleLightness(baseHex, 4));
  }

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
 * Heurística iterativa: prueba rotaciones de matiz y ajustes HSL en roles P/S/A/A2/F
 * y conserva cambios que suban la puntuación de `evaluateTemperatureHarmony`.
 */
export function computeAutoAdjustedTemperatureHexes(
  roleHexMap: Record<string, { hex: string; label: string }>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);
  let bestScore = evaluateTemperatureHarmony(working).score;

  for (let round = 0; round < 100; round++) {
    const current = evaluateTemperatureHarmony(working);
    if (current.score >= 96) break;
    if (current.swatches.length === 0) break;

    let bestRole: string | null = null;
    let bestHex: string | null = null;
    let best = current.score;

    for (const role of TEMPERATURE_HARMONY_ROLES) {
      const cell = working[role];
      if (!cell?.hex) continue;
      const candidates = uniqHexes(candidateHexes(cell.hex, current, role));
      for (const cand of candidates) {
        if (cand.toLowerCase() === cell.hex.toLowerCase()) continue;
        const trial = { ...working, [role]: { ...cell, hex: cand } };
        const sc = evaluateTemperatureHarmony(trial).score;
        if (sc > best) {
          best = sc;
          bestRole = role;
          bestHex = cand;
        }
      }
    }

    if (bestRole && bestHex && best > bestScore) {
      const cell = working[bestRole];
      if (cell) working[bestRole] = { ...cell, hex: bestHex };
      bestScore = best;
    } else {
      break;
    }
  }

  const updates: Record<string, string> = {};
  for (const k of TEMPERATURE_HARMONY_ROLES) {
    const before = roleHexMap[k]?.hex;
    const after = working[k]?.hex;
    if (before && after && before.toLowerCase() !== after.toLowerCase()) {
      updates[k] = after;
    }
  }
  return updates;
}
