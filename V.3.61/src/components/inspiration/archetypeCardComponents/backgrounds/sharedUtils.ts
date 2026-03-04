/**
 * Utilidades compartidas entre fondos de arquetipos.
 */

/** Convierte un array de [x,y] en un path SVG con curvas cuadráticas. */
export function pointsToPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    d += ` Q ${prev[0]} ${prev[1]} ${mx} ${my}`;
  }
  d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
  return d;
}

/** Hash determinista 0–1 para distribución pseudoaleatoria sin Math.random. */
export function deterministicHash(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Valor pseudoaleatorio en [a, b] a partir de seed (sin Math.random). */
export function scatter(seed: number, a: number, b: number): number {
  const t = ((seed * 7919 + 6163) % 10007) / 10007;
  return a + t * (b - a);
}
