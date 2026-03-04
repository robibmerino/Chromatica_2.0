/** ID del componente inspiración en el registro de ejes. Solo para columna Cómo. */
export const INSPIRACION_COMPONENT_ID = 'inspiracion' as const;

/** Ancho del elemento inspiración en px. */
export const INSPIRACION_WIDTH = 72;

/** Alto del elemento inspiración en px (rectangular: más alto que ancho). */
export const INSPIRACION_HEIGHT = 104;

/** Posición: top en porcentaje de la tarjeta. */
export const INSPIRACION_TOP_PCT = 18;

/** Configuración de animación flotar (solo sube y baja, sin giro). */
export const INSPIRACION_ANIMATION = {
  y: [0, -8, 0] as [number, number, number],
  duration: 2.8,
  ease: 'easeInOut' as const,
} as const;
