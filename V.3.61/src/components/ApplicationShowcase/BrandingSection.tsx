import React from 'react';
import type { PosterPalette, BrandingVariant } from './types';
import { TerritorioVisual, DireccionFotografica, Mockup, Packaging, RedesSocialesWebs, AplicacionEspacio, Ilustraciones, Patrones, Papeleria, Publicidad, Storytelling } from './branding';

interface Props {
  posterColors: PosterPalette;
  variant: BrandingVariant | string;
  sceneOnly?: boolean;
}

const BRANDING_VARIANTS: Record<string, React.ComponentType<{ posterColors: PosterPalette; sceneOnly?: boolean }>> = {
  'territorio-visual': TerritorioVisual,
  'direccion-fotografica': DireccionFotografica,
  mockup: Mockup,
  packaging: Packaging,
  'redes-sociales-webs': RedesSocialesWebs,
  'aplicacion-espacio': AplicacionEspacio,
  ilustraciones: Ilustraciones,
  patrones: Patrones,
  papeleria: Papeleria,
  publicidad: Publicidad,
  storytelling: Storytelling,
};

export function BrandingSection({ posterColors, variant, sceneOnly }: Props) {
  const VariantComponent = BRANDING_VARIANTS[variant] ?? TerritorioVisual;
  return <VariantComponent posterColors={posterColors} sceneOnly={sceneOnly} />;
}
