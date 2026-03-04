/**
 * Tipos para la columna de ejes arquetipo (columna derecha en Quién - fase 2).
 *
 * Contexto: los elementos editables de la tarjeta tienen versiones (p. ej. bufanda, gorro, sombrero)
 * vinculadas a ejes de arquetipos. Cada eje permite:
 * 1) Cambiar el arquetipo → cambia la versión del componente
 * 2) Deslizar entre extremos → cambia el color (cada extremo tiene un color asignado)
 */

/** Opción de arquetipo: par de extremos (ej. "Extrovertido–Introvertido") que mapea a una versión del componente. */
export interface ArchetypeOption {
  /** Etiqueta mostrada (ej. "Molécula · Naturaleza") */
  label: string;
  /** Etiqueta del eje para el slider (ej. "Vida–Evolución"); si no se define, se parsea label */
  axisLabel?: string;
  /** ID de la versión del componente que se muestra (bufanda, gorro, etc.) */
  versionId: string;
  /** Color del extremo izquierdo cuando no está personalizado (opcional, por defecto usa config) */
  defaultColorLeft?: string;
  /** Color del extremo derecho cuando no está personalizado (opcional, por defecto usa config) */
  defaultColorRight?: string;
  /** Valor inicial del slider (0–100) para esta opción (opcional) */
  defaultSliderValue?: number;
  /** true = opción "Mi propio X" que abre modal de personalización */
  isCustom?: boolean;
}

/** Configuración de un eje: opciones de arquetipo y colores en los extremos del slider. */
export interface ArchetypeAxisConfig {
  id: string;
  /** ID del componente variable en la tarjeta al que está vinculado este eje */
  componentId: string;
  /** Etiqueta breve del eje (ej. "Complemento") */
  label: string;
  /** Etiqueta para la opción personalizable (ej. "Mi propio entorno", "Mi propio familiar") */
  customOptionLabel?: string;
  /** Opciones de arquetipo entre las que se puede elegir (cada una cambia la versión) */
  archetypeOptions: ArchetypeOption[];
  /** Color del extremo izquierdo del slider */
  colorLeft: string;
  /** Color del extremo derecho del slider */
  colorRight: string;
}

/** Estado actual de un eje (por tarjeta seleccionada). */
export interface ArchetypeAxisState {
  axisId: string;
  /** Índice en archetypeOptions: arquetipo/versión seleccionada */
  selectedOptionIndex: number;
  /** 0–100: posición del slider (0 = colorLeft, 100 = colorRight) */
  sliderValue: number;
  /** Color del extremo izquierdo (personalizable); si no se define, usa config.colorLeft */
  colorLeft?: string;
  /** Color del extremo derecho (personalizable); si no se define, usa config.colorRight */
  colorRight?: string;
  /** En modo custom: versionId de la variante base seleccionada */
  customVersionId?: string;
  /** En modo custom: etiqueta del extremo izquierdo */
  customLabelLeft?: string;
  /** En modo custom: etiqueta del extremo derecho */
  customLabelRight?: string;
  /** true cuando el usuario ha abierto el modal y guardado la configuración al menos una vez */
  hasBeenConfigured?: boolean;
}
