import type { CardComponentVariant } from '../types';
import { Background1 } from './Background1';
import { Background2 } from './Background2';
import { Background3 } from './Background3';
import { Background4 } from './Background4';
import { Background5 } from './Background5';
import { Background6 } from './Background6';
import { Background7 } from './Background7';
import { Background8 } from './Background8';
import { Background9 } from './Background9';
import { BackgroundPlaceholder } from './BackgroundPlaceholder';
import { BACKGROUND_IDS } from './constants';

export { BACKGROUND_IDS, BACKGROUND_DEFAULT_VERSION_ID } from './constants';
export type { BackgroundId } from './constants';
export { getBackgroundMetadata } from './backgroundMetadata';
export type { BackgroundMetadata } from './backgroundMetadata';

const BACKGROUND_COMPONENT_MAP: Record<string, CardComponentVariant> = {
  'background-1': Background1,
  'background-2': Background2,
  'background-3': Background3,
  'background-4': Background4,
  'background-5': Background5,
  'background-6': Background6,
  'background-7': Background7,
  'background-8': Background8,
  'background-9': Background9,
};

/** Registro de variantes de fondo. El primero es el predeterminado en Fase 1. */
export const BACKGROUND_VARIANTS: Record<string, CardComponentVariant> = {
  ...Object.fromEntries(
    BACKGROUND_IDS.map((id) => [id, BACKGROUND_COMPONENT_MAP[id] ?? BackgroundPlaceholder])
  ),
  default: Background1,
};
