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

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: Date;
}
