import { hexToRgb, rgbToHex } from './colorUtils';

/** Punto blanco D65 (CIE 15:2004, observador 2°), XYZ escalados ~0–100. */
const XN = 95.047;
const YN = 100;
const ZN = 108.883;

function srgbByteToLinear(channel255: number): number {
  const v = channel255 / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgbByte(linear01: number): number {
  const v = Math.max(0, Math.min(1, linear01));
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

function fLab(t: number): number {
  const d = 6 / 29;
  return t > d * d * d ? Math.cbrt(t) : t / (3 * d * d) + 4 / 29;
}

function fInvLab(ft: number): number {
  const d = 6 / 29;
  return ft > d ? ft * ft * ft : 3 * d * d * (ft - 4 / 29);
}

/** CIELAB (D65) a partir de sRGB en hex. */
export function hexToLabD65(hex: string): { L: number; a: number; b: number } {
  const { r, g, b } = hexToRgb(hex);
  const R = srgbByteToLinear(r);
  const G = srgbByteToLinear(g);
  const B = srgbByteToLinear(b);
  const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) * 100;
  const Y = (0.2126729 * R + 0.7151522 * G + 0.072175 * B) * 100;
  const Z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) * 100;
  const fx = fLab(X / XN);
  const fy = fLab(Y / YN);
  const fz = fLab(Z / ZN);
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/** sRGB hex desde CIELAB (D65), recortando RGB lineal a [0,1]. */
export function labToHexD65(L: number, a: number, b: number): string {
  const fy = (L + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  const X = XN * fInvLab(fx);
  const Y = YN * fInvLab(fy);
  const Z = ZN * fInvLab(fz);
  const x = X / 100;
  const y = Y / 100;
  const z = Z / 100;
  let rl = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  let gl = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
  let bl = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
  rl = Math.max(0, Math.min(1, rl));
  gl = Math.max(0, Math.min(1, gl));
  bl = Math.max(0, Math.min(1, bl));
  return rgbToHex(linearToSrgbByte(rl), linearToSrgbByte(gl), linearToSrgbByte(bl));
}

function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}

/** CIEDE2000 entre dos CIELAB (mismos supuestos D65 que `hexToLabD65`). */
export function ciede2000FromLabs(
  lab1: { L: number; a: number; b: number },
  lab2: { L: number; a: number; b: number }
): number {
  return ciede2000(lab1, lab2);
}

/** CIEDE2000 entre dos colores sRGB (hex). Parámetros kL=kC=kH=1 (referencia estándar). */
export function ciede2000FromHex(hex1: string, hex2: string): number {
  const L1 = hexToLabD65(hex1);
  const L2 = hexToLabD65(hex2);
  return ciede2000(L1, L2);
}

function ciede2000(
  lab1: { L: number; a: number; b: number },
  lab2: { L: number; a: number; b: number },
  kL = 1,
  kC = 1,
  kH = 1
): number {
  const { L: L1p, a: a1, b: b1 } = lab1;
  const { L: L2p, a: a2, b: b2 } = lab2;

  const avgLp = (L1p + L2p) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  let h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
  if (h1p < 0) h1p += 360;
  let h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;
  if (h2p < 0) h2p += 360;

  const dLp = L2p - L1p;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(dhp / 2));
  const avgLpp = (L1p + L2p) / 2;
  const avgCpp = (C1p + C2p) / 2;

  let avghp: number;
  if (C1p * C2p === 0) {
    avghp = (h1p + h2p) / 2;
  } else if (Math.abs(h1p - h2p) <= 180) {
    avghp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    avghp = (h1p + h2p + 360) / 2;
  } else {
    avghp = (h1p + h2p - 360) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos(deg2rad(avghp - 30)) +
    0.24 * Math.cos(deg2rad(2 * avghp)) +
    0.32 * Math.cos(deg2rad(3 * avghp + 6)) -
    0.2 * Math.cos(deg2rad(4 * avghp - 63));

  const dTheta = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avgCpp, 7) / (Math.pow(avgCpp, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(avgLpp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLpp - 50, 2));
  const Sc = 1 + 0.045 * avgCpp;
  const Sh = 1 + 0.015 * avgCpp * T;
  const RT = -Math.sin(deg2rad(2 * dTheta)) * RC;

  return Math.sqrt(
    Math.pow(dLp / (kL * Sl), 2) +
      Math.pow(dCp / (kC * Sc), 2) +
      Math.pow(dHp / (kH * Sh), 2) +
      RT * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
  );
}
