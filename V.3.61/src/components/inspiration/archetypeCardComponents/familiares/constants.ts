/** ID del componente familiar en el registro de ejes. */
export const FAMILIAR_COMPONENT_ID = 'accesorio-2' as const;

/** Tamaño del familiar en px (cuadrado). */
export const FAMILIAR_SIZE = 88;

/** Posición del familiar: top en porcentaje de la tarjeta. */
export const FAMILIAR_TOP_PCT = 18;

/** Configuración de animación flotar/rotar del familiar. */
export const FAMILIAR_ANIMATION = {
  y: [0, -8, 0] as [number, number, number],
  rotate: [-4, 4, -4] as [number, number, number],
  duration: 2.8,
  ease: 'easeInOut' as const,
} as const;
