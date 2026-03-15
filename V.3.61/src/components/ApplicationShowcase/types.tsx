import React from 'react';
import type { InteriorPalette } from '../InteriorPreviews';

export type SupportPaletteVariant = 'claro' | 'oscuro';

export interface SupportColorItem {
  role: string;
  label: string;
  initial: string;
  hex: string;
}

export interface ApplicationShowcaseProps {
  colors: string[];
  paletteName?: string;
  onUpdateColors?: (newColors: string[], changeDescription?: string) => void;
  supportColorsList?: SupportColorItem[];
  supportVariant?: SupportPaletteVariant;
  setSupportVariant?: (v: SupportPaletteVariant) => void;
  updateSupportColor?: (role: string, hex: string) => void;
  /** Restaurar paleta de apoyo al valor predeterminado (como en Refinar). */
  resetSupportPalette?: () => void;
}

export type EditingInRightColumn =
  | null
  | { type: 'main'; index: number }
  | { type: 'support'; role: string }
  | { type: 'background' };

export type CategoryType = 'architecture' | 'poster' | 'branding';

/** IDs de variante por categoría (alineados con categories[].variants[].id). */
export type ArchitectureVariant = 'estudio' | 'cafeteria' | 'oficina' | 'stand' | 'fachada';
export type PosterVariant = 'conference' | 'exhibition-swiss' | 'festival-gig' | 'collage' | 'competition';
export type BrandingVariant = 'territorio-visual' | 'direccion-fotografica' | 'mockup' | 'packaging' | 'redes-sociales-webs' | 'aplicacion-espacio' | 'ilustraciones' | 'patrones' | 'papeleria' | 'publicidad' | 'storytelling';

export interface VariantInfo {
  id: string;
  name: string;
  icon: string;
}

/** Paleta para Poster/Branding: InteriorPalette + text, textLight y opcional accent2 (A2). */
export type PosterPalette = InteriorPalette & { text: string; textLight: string; accent2?: string };

export const categories: { id: CategoryType; name: string; icon: string; tip: string; variants: VariantInfo[] }[] = [
  {
    id: 'architecture',
    name: 'Arquitectura',
    icon: '🏠',
    tip: 'Diseño de interiores: aplica tu paleta a estudios, cafeterías, oficinas y más.',
    variants: [
      { id: 'estudio', name: 'Estudio', icon: '🛋️' },
      { id: 'cafeteria', name: 'Cafetería', icon: '☕' },
      { id: 'oficina', name: 'Oficina', icon: '🏢' },
      { id: 'stand', name: 'Stand corporativo', icon: '🏪' },
      { id: 'fachada', name: 'Fachada corporativa', icon: '🏛️' },
    ]
  },
  {
    id: 'poster',
    name: 'Poster',
    icon: '🖼️',
    tip: 'Carteles y pósters: aplica tu paleta con versión claro/oscuro y paleta de apoyo.',
    variants: [
      { id: 'conference', name: 'Conference', icon: '🎤' },
      { id: 'exhibition-swiss', name: 'Exhibition Swiss', icon: '🔤' },
      { id: 'festival-gig', name: 'Festival Gig', icon: '🎸' },
      { id: 'collage', name: 'Collage', icon: '📢' },
      { id: 'competition', name: 'Competition', icon: '🏆' },
    ]
  },
  {
    id: 'branding',
    name: 'Branding',
    icon: '🎨',
    tip: 'Identidad y territorio visual: misma plantilla A3/A2, modos claro/oscuro y paleta de apoyo.',
    variants: [
      { id: 'territorio-visual', name: 'Territorio visual', icon: '🌿' },
      { id: 'direccion-fotografica', name: 'Dirección fotográfica', icon: '📷' },
      { id: 'mockup', name: 'Mockup', icon: '🖼️' },
      { id: 'packaging', name: 'Packaging', icon: '📦' },
      { id: 'redes-sociales-webs', name: 'Redes sociales y Webs', icon: '📱' },
      { id: 'aplicacion-espacio', name: 'Aplicación al Espacio', icon: '🏠' },
      { id: 'ilustraciones', name: 'Ilustraciones', icon: '✏️' },
      { id: 'patrones', name: 'Patrones', icon: '🔲' },
      { id: 'papeleria', name: 'Papelería', icon: '📄' },
      { id: 'publicidad', name: 'Publicidad', icon: '📢' },
      { id: 'storytelling', name: 'Storytelling', icon: '📖' },
    ]
  },
];

/** Iconos SVG por categoría (24x24) para el menú de aplicación */
export const CategoryIcons: Record<CategoryType, React.ReactNode> = {
  architecture: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  poster: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  branding: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};
