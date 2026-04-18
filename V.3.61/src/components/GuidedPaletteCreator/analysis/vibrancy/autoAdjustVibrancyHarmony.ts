import { hexToHsl, hslToHex, rotateHue } from '../../../../utils/colorUtils';
import { evaluateVibrancy, VIBRANCY_ROLES, type VibrancyAnalysisResult } from './vibrancyAnalysis';

/** Acepta un paso si no baja la nota; a nota igual, prefiere mejor foco A/A2 vs P/S (para desatascar el tope 99). */
function isBetterVibrancyResult(next: VibrancyAnalysisResult, prev: VibrancyAnalysisResult): boolean {
  if (next.score > prev.score) return true;
  if (next.score < prev.score) return false;
  if (next.accentFocus.alignmentScore > prev.accentFocus.alignmentScore) return true;
  if (next.accentFocus.alignmentScore < prev.accentFocus.alignmentScore) return false;
  if (next.accentFocus.accentsDominateBothBases && !prev.accentFocus.accentsDominateBothBases) return true;
  if (!next.accentFocus.accentsDominateBothBases && prev.accentFocus.accentsDominateBothBases) return false;
  return next.scoreBeforeAccentCap > prev.scoreBeforeAccentCap;
}

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

function candidateHexes(baseHex: string, analysis: VibrancyAnalysisResult, role: string): string[] {
  const { vibrantCount, mutedCount, accentFocus } = analysis;
  const { maxChromaBase, maxChromaAccents, vibrantOffFocusRoles, accentVersusBases, chromaP, chromaS } = accentFocus;

  const rowA = accentVersusBases.find((r) => r.role === 'A');
  const rowA2 = accentVersusBases.find((r) => r.role === 'A2');

  const out: string[] = [
    rotateHue(baseHex, 6),
    rotateHue(baseHex, -6),
    rotateHue(baseHex, 12),
    rotateHue(baseHex, -12),
    scaleSaturation(baseHex, 0.88),
    scaleSaturation(baseHex, 0.72),
    scaleSaturation(baseHex, 1.06),
    scaleSaturation(baseHex, 1.16),
    scaleLightness(baseHex, 2),
    scaleLightness(baseHex, -2),
  ];

  if (vibrantCount >= 3 && role !== 'F') {
    out.push(scaleSaturation(baseHex, 0.62), scaleSaturation(baseHex, 0.52));
  }

  if (vibrantCount === 0 && (role === 'A' || role === 'A2' || role === 'P')) {
    out.push(scaleSaturation(baseHex, 1.28), scaleSaturation(baseHex, 1.38), rotateHue(baseHex, 14));
  }

  if (mutedCount >= 4 && role !== 'F') {
    out.push(scaleSaturation(baseHex, 1.12), scaleSaturation(baseHex, 1.22));
  }

  if (role === 'F') {
    out.push(scaleSaturation(baseHex, 0.85), scaleLightness(baseHex, 3));
  }

  const rowForRole = role === 'A' ? rowA : role === 'A2' ? rowA2 : undefined;
  if (rowForRole && !rowForRole.beatsBothBases) {
    out.push(scaleSaturation(baseHex, 1.22), scaleSaturation(baseHex, 1.35), scaleSaturation(baseHex, 1.48));
    if (!rowForRole.beatsP || !rowForRole.beatsS) {
      out.push(scaleSaturation(baseHex, 1.58), rotateHue(baseHex, 10), rotateHue(baseHex, -10));
    }
  }

  if ((role === 'A' || role === 'A2') && maxChromaBase > maxChromaAccents + 4) {
    out.push(scaleSaturation(baseHex, 1.2), scaleSaturation(baseHex, 1.3), rotateHue(baseHex, 8));
  }

  const maxAccentCh = Math.max(rowA?.chromaPct ?? 0, rowA2?.chromaPct ?? 0);

  if (role === 'P') {
    const blocksA = rowA && !rowA.beatsP;
    const blocksA2 = rowA2 && !rowA2.beatsP;
    if (vibrantOffFocusRoles.includes(role) || blocksA || blocksA2 || chromaP > maxAccentCh + 3) {
      out.push(scaleSaturation(baseHex, 0.68), scaleSaturation(baseHex, 0.58), scaleSaturation(baseHex, 0.48));
    }
  }

  if (role === 'S') {
    const blocksA = rowA && !rowA.beatsS;
    const blocksA2 = rowA2 && !rowA2.beatsS;
    if (vibrantOffFocusRoles.includes(role) || blocksA || blocksA2 || chromaS > maxAccentCh + 3) {
      out.push(scaleSaturation(baseHex, 0.68), scaleSaturation(baseHex, 0.58), scaleSaturation(baseHex, 0.48));
    }
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
 * Heurística iterativa sobre P/S/A/A2/F para subir la puntuación de `evaluateVibrancy`.
 */
export function computeAutoAdjustedVibrancyHexes(
  roleHexMap: Record<string, { hex: string; label: string }>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);

  for (let round = 0; round < 100; round++) {
    const current = evaluateVibrancy(working);
    if (current.score >= 100) break;
    if (current.swatches.length === 0) break;

    let bestRole: string | null = null;
    let bestHex: string | null = null;
    let bestTrial = current;

    for (const role of VIBRANCY_ROLES) {
      const cell = working[role];
      if (!cell?.hex) continue;
      const candidates = uniqHexes(candidateHexes(cell.hex, current, role));
      for (const cand of candidates) {
        if (cand.toLowerCase() === cell.hex.toLowerCase()) continue;
        const trial = { ...working, [role]: { ...cell, hex: cand } };
        const trialEval = evaluateVibrancy(trial);
        if (isBetterVibrancyResult(trialEval, bestTrial)) {
          bestTrial = trialEval;
          bestRole = role;
          bestHex = cand;
        }
      }
    }

    if (bestRole && bestHex && isBetterVibrancyResult(bestTrial, current)) {
      const cell = working[bestRole];
      if (cell) working[bestRole] = { ...cell, hex: bestHex };
    } else {
      break;
    }
  }

  const updates: Record<string, string> = {};
  for (const k of VIBRANCY_ROLES) {
    const before = roleHexMap[k]?.hex;
    const after = working[k]?.hex;
    if (before && after && before.toLowerCase() !== after.toLowerCase()) {
      updates[k] = after;
    }
  }
  return updates;
}
