/**
 * Identificador de estilo. Cada tarjeta del Tinder Cómo muestra un estilo distinto.
 * Estilos = métodos, acciones o formas de expresión que definen la paleta.
 * Se ampliará con las variantes que proporcione el usuario.
 */
export type ComoEstiloId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

/** Datos de una tarjeta del Tinder "Cómo" (contenido = estilos). */
export interface ComoEstiloCardData {
  id: string;
  estiloId: ComoEstiloId;
}

/** Props compartidas por todos los estilos. */
export interface ComoEstiloProps {
  className?: string;
  /** Color principal del estilo (por defecto usa el de metadata) */
  color?: string;
  /** Oculta la etiqueta (p. ej. en miniaturas del modal) */
  hideLabel?: boolean;
}
