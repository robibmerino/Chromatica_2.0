import type { CardComponentVariant } from '../types';
import { DefaultInspiracion } from './DefaultInspiracion';
import { MaximalistBadge } from './MaximalistBadge';
import { OrganicBadge } from './OrganicBadge';
import { MinimalistBadge } from './MinimalistBadge';
import { GeometricBadge } from './GeometricBadge';
import { BrutalistBadge } from './BrutalistBadge';
import { KineticBadge } from './KineticBadge';
import { ArtDecoBadge } from './ArtDecoBadge';
import { GlitchBadge } from './GlitchBadge';
import { IsometricBadge } from './IsometricBadge';
import { PixelArtBadge } from './PixelArtBadge';
import { LineArtBadge } from './LineArtBadge';
import { MemphisBadge } from './MemphisBadge';
import { BauhausBadge } from './BauhausBadge';
import { OpArtBadge } from './OpArtBadge';
import { ConstructivistBadge } from './ConstructivistBadge';
import { ZenBadge } from './ZenBadge';
import { TribalBadge } from './TribalBadge';
import { CollageBadge } from './CollageBadge';

export {
  getInspiracionMetadata,
  INSPIRACION_IDS,
  type InspiracionVersionId,
  type InspiracionMetadata,
} from './inspiracionMetadata';

/** Registro de variantes de inspiración. Eje Inspiración (solo UI Cómo). */
export const INSPIRACION_VARIANTS: Record<string, CardComponentVariant> = {
  default: DefaultInspiracion,
  'inspiracion-maximalista': MaximalistBadge,
  'inspiracion-organico': OrganicBadge,
  'inspiracion-minimalista': MinimalistBadge,
  'inspiracion-geometrico': GeometricBadge,
  'inspiracion-brutalista': BrutalistBadge,
  'inspiracion-cinetico': KineticBadge,
  'inspiracion-art-deco': ArtDecoBadge,
  'inspiracion-glitch': GlitchBadge,
  'inspiracion-isometrico': IsometricBadge,
  'inspiracion-pixel-art': PixelArtBadge,
  'inspiracion-line-art': LineArtBadge,
  'inspiracion-memphis': MemphisBadge,
  'inspiracion-bauhaus': BauhausBadge,
  'inspiracion-op-art': OpArtBadge,
  'inspiracion-constructivista': ConstructivistBadge,
  'inspiracion-zen': ZenBadge,
  'inspiracion-tribal': TribalBadge,
  'inspiracion-collage': CollageBadge,
};
