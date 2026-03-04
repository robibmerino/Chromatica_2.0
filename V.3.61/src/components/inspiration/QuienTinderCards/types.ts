/** Identificador del personaje (1–30). Cada tarjeta del Tinder Quién muestra un personaje distinto. */
export type QuienCharacterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

/** Datos de una tarjeta del Tinder "Quién". */
export interface QuienTinderCardData {
  id: string;
  characterId: QuienCharacterId;
}

/** Parámetros del eje para rotar colores de la criatura. */
export interface AxisColorParams {
  colorLeft: string;
  colorRight: string;
  defaultColorLeft: string;
  sliderValue: number;
}

/** Props compartidas por todos los personajes (para el registro). */
export interface QuienCharacterProps {
  className?: string;
  color?: string;
  /** Parámetros del eje Identidad (colores interactúan con el slider) */
  axisColorParams?: AxisColorParams;
  /** Oculta la etiqueta (p. ej. en miniaturas del modal) */
  hideLabel?: boolean;
}
