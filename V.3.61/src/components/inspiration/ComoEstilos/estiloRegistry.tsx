import type { ComponentType } from 'react';
import type { ComoEstiloId, ComoEstiloProps } from './types';
import { MaximalistStyle, OrganicStyle, MinimalistStyle, GeometricStyle, BrutalistStyle, KineticStyle, ArtDecoStyle, GlitchStyle, IsometricStyle, PixelArtStyle, LineArtStyle, MemphisStyle, BauhausStyle, OpArtStyle, ConstructivistStyle, ZenStyle, WireframeStyle, PsychedelicStyle, TribalStyle, TopographicStyle, ArtNouveauStyle, BlueprintStyle, CollageStyle, StainedGlassStyle } from './estilos';

type EstiloComponent = ComponentType<ComoEstiloProps>;

/**
 * Registro de estilos. Para añadir uno: crear estilos/Nombre.tsx y registrarlo aquí.
 */
const REGISTRY: Partial<Record<ComoEstiloId, EstiloComponent>> = {
  1: MaximalistStyle,
  2: OrganicStyle,
  3: MinimalistStyle,
  4: GeometricStyle,
  5: BrutalistStyle,
  6: KineticStyle,
  7: ArtDecoStyle,
  8: GlitchStyle,
  9: IsometricStyle,
  10: PixelArtStyle,
  11: LineArtStyle,
  12: MemphisStyle,
  13: BauhausStyle,
  14: OpArtStyle,
  15: ConstructivistStyle,
  16: ZenStyle,
  17: WireframeStyle,
  18: PsychedelicStyle,
  19: TribalStyle,
  20: TopographicStyle,
  21: ArtNouveauStyle,
  22: BlueprintStyle,
  23: CollageStyle,
  24: StainedGlassStyle,
};

export function getEstiloComponent(id: ComoEstiloId): EstiloComponent | null {
  return REGISTRY[id] ?? null;
}
