/**
 * Utilidades compartidas para componentes de arquetipos.
 */

/** Convierte coordenadas polares (ángulo en grados, 0° = arriba) a cartesianas. */
export function polar(cx: number, cy: number, angleDeg: number, radius: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius };
}
