import type React from 'react';

/**
 * Tipos para componentes editables de las tarjetas Tinder (fondos, accesorios, etc.).
 * Cada eje de arquetipo está vinculado a un componentId; cada opción del eje mapea a un versionId.
 */

export interface CardComponentProps {
  /** versionId seleccionado para este componente */
  versionId: string;
  /** Color mezclado del slider del eje (0-100 entre colorLeft y colorRight) */
  blendedColor?: string;
  /** Color del extremo izquierdo del eje (personalizable por usuario) */
  colorLeft?: string;
  /** Color del extremo derecho del eje (personalizable por usuario) */
  colorRight?: string;
  /** Posición del slider 0-100 (0 = colorLeft, 100 = colorRight) */
  sliderValue?: number;
  /** Color predeterminado del extremo izquierdo (ancla para rotación de paleta) */
  defaultColorLeft?: string;
  /** Clase extra para el contenedor */
  className?: string;
  /** Oculta la etiqueta del personaje (p. ej. en miniaturas del modal Identidad) */
  hideLabel?: boolean;
}

/** Componente React que renderiza una variante (ej. un fondo específico). */
export type CardComponentVariant = React.FC<CardComponentProps>;
