/** Colores del símbolo Chromatica (caras, sentido horario) — mismo orden que en el logo SVG. */
export const CHROMATICA_BRAND_COLORS = [
  '#2BB0C8',
  '#E8AE1E',
  '#CE3B7F',
  '#7B40A8',
  '#1A8FAA',
] as const;

export const CHROMATICA_BRAND_COLOR_COUNT = CHROMATICA_BRAND_COLORS.length;

export function lerpColor(hexA: string, hexB: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

/** `phase` avanza en la rueda (fracciones permitidas); `faceOffset` desplaza cada elemento. */
export function colorAtPhase(phase: number, faceOffset: number): string {
  const N = CHROMATICA_BRAND_COLOR_COUNT;
  const pos = ((phase + faceOffset) % N + N) % N;
  const i = Math.floor(pos);
  const t = pos - i;
  return lerpColor(CHROMATICA_BRAND_COLORS[i]!, CHROMATICA_BRAND_COLORS[(i + 1) % N]!, t);
}
