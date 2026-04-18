import { getContrastRatioHex, hexToHsl, hslToHex, getLuminanceFromHex } from '../../../../utils/colorUtils';
import { ciede2000FromHex, hexToLabD65, labToHexD65 } from '../../../../utils/ciede2000';
import {
  evaluatePosterPerceptualDeltaE,
  POSTER_DELTA_E00_MIN,
  POSTER_DESIGN_LUMINANCE_RATIO_MIN,
  POSTER_MIN_ABS_DELTA_L_STAR,
  posterTripleSatisfied,
} from './posterPerceptualDeltaE';

function cloneRoleMap(map: Record<string, { hex: string; label: string }>): Record<string, { hex: string; label: string }> {
  const o: Record<string, { hex: string; label: string }> = {};
  for (const k of Object.keys(map)) {
    const v = map[k];
    if (v) o[k] = { hex: v.hex, label: v.label };
  }
  return o;
}

/** Ajusta luminancia del primer plano frente al fondo hasta alcanzar ratio mínimo (definición W3C / sRGB). */
function tweakTowardLuminanceRatio(fgHex: string, bgHex: string, minRatio: number = POSTER_DESIGN_LUMINANCE_RATIO_MIN): string {
  if (getContrastRatioHex(fgHex, bgHex) >= minRatio) return fgHex;
  const bgLum = getLuminanceFromHex(bgHex);
  const baseHsl = hexToHsl(fgHex);
  let l = baseHsl.l;
  const direction = bgLum > 0.5 ? -2 : 2;
  let attempts = 0;
  let ratio = getContrastRatioHex(fgHex, bgHex);
  while (ratio < minRatio && attempts < 55) {
    l = Math.max(0, Math.min(100, l + direction));
    const candidate = hslToHex(baseHsl.h, baseHsl.s, l);
    ratio = getContrastRatioHex(candidate, bgHex);
    if (ratio >= minRatio) return candidate;
    attempts += 1;
  }
  return hslToHex(baseHsl.h, baseHsl.s, l);
}

/**
 * Desplaza el primer plano en CIELAB a lo largo de (Lab_fg − Lab_bg) para subir ΔE₀₀.
 */
function tweakTowardDeltaE00(fgHex: string, bgHex: string, minDeltaE: number = POSTER_DELTA_E00_MIN): string {
  if (ciede2000FromHex(fgHex, bgHex) >= minDeltaE) return fgHex;

  let { L, a, b } = hexToLabD65(fgHex);
  const bg = hexToLabD65(bgHex);
  let dL = L - bg.L;
  let da = a - bg.a;
  let db = b - bg.b;
  let norm = Math.hypot(dL, da, db);
  if (norm < 1e-5) {
    dL = 1;
    da = 0;
    db = 0;
    norm = 1;
  }
  dL /= norm;
  da /= norm;
  db /= norm;

  const step = 1.2;
  for (let i = 0; i < 120; i++) {
    L += step * dL;
    a += step * da;
    b += step * db;
    L = Math.max(0, Math.min(100, L));
    a = Math.max(-110, Math.min(110, a));
    b = Math.max(-110, Math.min(110, b));
    const cand = labToHexD65(L, a, b);
    if (ciede2000FromHex(cand, bgHex) >= minDeltaE) return cand;
  }
  return labToHexD65(L, a, b);
}

/** Empuja L* del primer plano para separar claridad respecto al fondo. */
function tweakTowardDeltaLStar(fgHex: string, bgHex: string, minAbs: number = POSTER_MIN_ABS_DELTA_L_STAR): string {
  const labFg = hexToLabD65(fgHex);
  const labBg = hexToLabD65(bgHex);
  if (Math.abs(labFg.L - labBg.L) >= minAbs) return fgHex;
  const step = 6;
  const Ln = labFg.L + (labFg.L < labBg.L ? -step : step);
  return labToHexD65(Math.max(0, Math.min(100, Ln)), labFg.a, labFg.b);
}

/**
 * Heurística: prioriza el criterio que más falta y repite hasta cumplir el triple o agotar pasos.
 */
export function tweakTowardPosterTriple(fgHex: string, bgHex: string): string {
  let out = fgHex;
  for (let step = 0; step < 48; step++) {
    if (posterTripleSatisfied(out, bgHex)) return out;
    const de = ciede2000FromHex(out, bgHex);
    const lum = getContrastRatioHex(out, bgHex);
    const dL = Math.abs(hexToLabD65(out).L - hexToLabD65(bgHex).L);

    const deDef = POSTER_DELTA_E00_MIN - de;
    const lumDef = POSTER_DESIGN_LUMINANCE_RATIO_MIN - lum;
    const dlDef = POSTER_MIN_ABS_DELTA_L_STAR - dL;

    if (lumDef >= deDef && lumDef >= dlDef && lumDef > 0) {
      out = tweakTowardLuminanceRatio(out, bgHex);
    } else if (dlDef >= deDef && dlDef > 0) {
      out = tweakTowardDeltaLStar(out, bgHex);
    } else if (deDef > 0) {
      out = tweakTowardDeltaE00(out, bgHex);
    } else {
      break;
    }
  }
  return out;
}

/**
 * Devuelve roles cuyo hex cambió respecto a `roleHexMap` para aplicar con `applyHexToRole`.
 */
export function computeAutoAdjustedPerceptualHexes(
  roleHexMap: Record<string, { hex: string; label: string }>
): Record<string, string> {
  const working = cloneRoleMap(roleHexMap);

  for (let round = 0; round < 140; round++) {
    const rows = evaluatePosterPerceptualDeltaE(working);
    const failing = rows.filter((r) => !r.pass && !r.informativeOnly);
    if (!failing.length) break;

    const deficit = (r: (typeof failing)[0]) =>
      (r.passDeltaE ? 0 : POSTER_DELTA_E00_MIN - r.deltaE00) +
      (r.passLuminance ? 0 : POSTER_DESIGN_LUMINANCE_RATIO_MIN - r.luminanceRatio) +
      (r.passDeltaLStar ? 0 : POSTER_MIN_ABS_DELTA_L_STAR - r.absDeltaLStar);
    failing.sort((a, b) => deficit(b) - deficit(a));
    const target = failing[0];
    const bgHex = working[target.row.bgRole]?.hex;
    if (!bgHex) break;

    const fgKey = target.row.fgRole;
    const role = working[fgKey];
    if (!role) break;
    working[fgKey] = { ...role, hex: tweakTowardPosterTriple(role.hex, bgHex) };
  }

  const updates: Record<string, string> = {};
  for (const k of Object.keys(working)) {
    if (k === 'I') continue;
    const before = roleHexMap[k]?.hex;
    const after = working[k]?.hex;
    if (before && after && before.toLowerCase() !== after.toLowerCase()) {
      updates[k] = after;
    }
  }
  return updates;
}
