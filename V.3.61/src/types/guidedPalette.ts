export interface ColorItem {
  id: string;
  hex: string;
  locked: boolean;
}

export type Phase =
  | 'inspiration-menu'
  | 'inspiration-detail'
  | 'refinement'
  | 'application'
  | 'analysis'
  | 'save';

export type InspirationMode =
  | 'harmony'
  | 'image'
  | 'archetypes'
  | 'shapes'
  | 'trending'
  | 'archetypes-menu'
  /** Flujo combinado creado desde las paletas activas de origen. */
  | 'multi-origin';

/** Sección de la cadena desde la que se guardó la paleta (Refinar, Aplicar, Análisis). */
export type SavedFromSection = 'refinement' | 'application' | 'analysis';

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: Date;
  /** Sección desde la que se guardó (para etiquetas en Mis paletas). */
  savedFromSection?: SavedFromSection;
  /** Número de versión cuando se guarda más de una vez desde la misma sección (2, 3, 4...). */
  version?: number;
}
