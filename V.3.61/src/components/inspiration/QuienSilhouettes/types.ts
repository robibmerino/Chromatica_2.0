/**
 * Identificador de silueta. Cada tarjeta del Tinder Quién muestra una silueta distinta.
 * Siluetas = personas etéreas con distintas características (postura, género, edad sugerida, etc.).
 * 19 variantes (Soñador es la última).
 */
export type QuienSilhouetteId =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

/** Datos de una tarjeta del Tinder "Quién" (contenido = siluetas). */
export interface QuienSilhouetteCardData {
  id: string;
  silhouetteId: QuienSilhouetteId;
}

/** Props compartidas por todas las siluetas. */
export interface QuienSilhouetteProps {
  className?: string;
  /** Color principal de la silueta (por defecto usa el de metadata) */
  color?: string;
  /** Oculta la etiqueta (p. ej. en miniaturas del modal) */
  hideLabel?: boolean;
}
