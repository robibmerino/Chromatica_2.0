/**
 * Utilidades compartidas para componentes de atmósfera.
 */

/** Trayectoria ondulante para partículas (x en px): [0, a, b, c, a*0.5] */
export function makeDriftPath(a: number, b: number, c: number): number[] {
  return [0, a, b, c, a * 0.5];
}

/** Hex con canal alpha (0-255) para estilos inline */
export function hexWithAlpha(hex: string, alpha: number): string {
  return `${hex}${Math.round(Math.min(255, Math.max(0, alpha))).toString(16).padStart(2, '0')}`;
}
