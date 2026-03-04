import type { CardComponentVariant } from '../types';
import { AtmospherePlaceholder } from './AtmospherePlaceholder';
import { AtmosphereStardustOrbit } from './AtmosphereStardustOrbit';
import { AtmosphereAuroraVeil } from './AtmosphereAuroraVeil';
import { AtmosphereMist } from './AtmosphereMist';
import { AtmosphereSparks } from './AtmosphereSparks';
import { AtmosphereRain } from './AtmosphereRain';
import { AtmosphereRipples } from './AtmosphereRipples';
import { AtmosphereSnow } from './AtmosphereSnow';
import { AtmosphereBubbles } from './AtmosphereBubbles';
import { AtmosphereAsh } from './AtmosphereAsh';
import { AtmosphereGlow } from './AtmosphereGlow';
import { AtmosphereAurora } from './AtmosphereAurora';
import { AtmosphereRays } from './AtmosphereRays';
export { ATMOSPHERE_COMPONENT_ID, EASING_SMOOTH, EASING_SOFT, EASING_EASE_OUT } from './constants';
export { makeDriftPath, hexWithAlpha } from './utils';
export { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
export {
  type AtmosphereVersionId,
  ATMOSPHERE_IDS,
  getAtmosphereMetadata,
} from './atmosphereMetadata';

/** Registro de variantes de Atmósfera. */
export const ATMOSPHERE_VARIANTS: Record<string, CardComponentVariant> = {
  'stardust-orbit': AtmosphereStardustOrbit,
  'aurora-veil': AtmosphereAuroraVeil,
  mist: AtmosphereMist,
  sparks: AtmosphereSparks,
  rain: AtmosphereRain,
  ripples: AtmosphereRipples,
  snow: AtmosphereSnow,
  bubbles: AtmosphereBubbles,
  ash: AtmosphereAsh,
  glow: AtmosphereGlow,
  aurora: AtmosphereAurora,
  rays: AtmosphereRays,
  // Alias legacy para estados antiguos
  default: AtmosphereStardustOrbit,
  // Fallback genérico por si alguna versión futura no existe
  placeholder: AtmospherePlaceholder,
};

