/** Dimensiones estándar del viewBox de fondos (Background2–9). */
export const CARD_VIEWBOX_W = 200;
export const CARD_VIEWBOX_H = 320;

/**
 * IDs de los 9 fondos. El primero es el predeterminado en Fase 1 (sin variantes).
 */
export const BACKGROUND_IDS = [
  'background-1',
  'background-2',
  'background-3',
  'background-4',
  'background-5',
  'background-6',
  'background-7',
  'background-8',
  'background-9',
] as const;

export type BackgroundId = (typeof BACKGROUND_IDS)[number];

/** ID del fondo predeterminado en Fase 1 (solo se muestra este, sin opciones de variante). */
export const BACKGROUND_DEFAULT_VERSION_ID: BackgroundId = 'background-1';

/** Gradiente placeholder para fondos hasta incorporar los definitivos. */
export const DEFAULT_BACKGROUND_STYLE = {
  background: 'linear-gradient(180deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
} as const;
