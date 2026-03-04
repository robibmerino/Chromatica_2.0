/** ID del componente herramientas en el registro de ejes. Solo para columna Quién. */
export const HERRAMIENTAS_COMPONENT_ID = 'herramientas' as const;

/** ViewBox estándar para herramientas (80×240). BookTool usa 100×240. */
export const TOOL_SVG_VIEWBOX = '0 0 80 240';

/** Estilo base para SVG de herramienta. */
export const TOOL_SVG_STYLE = { width: '100%', height: '100%' } as const;

/** preserveAspectRatio para herramientas. */
export const TOOL_SVG_PRESERVE_ASPECT_RATIO = 'xMidYMid meet';

/** Tamaño de la herramienta en px (cuadrado). */
export const HERRAMIENTAS_SIZE = 104;

/** Posición de la herramienta: top en porcentaje de la tarjeta. */
export const HERRAMIENTAS_TOP_PCT = 18;

/** Configuración de animación flotar/rotar de la herramienta. */
export const HERRAMIENTAS_ANIMATION = {
  y: [0, -8, 0] as [number, number, number],
  rotate: [-4, 4, -4] as [number, number, number],
  duration: 2.8,
  ease: 'easeInOut' as const,
} as const;
