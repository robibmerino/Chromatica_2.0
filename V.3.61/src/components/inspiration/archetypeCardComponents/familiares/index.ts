import type { CardComponentVariant } from '../types';
import { type FamiliarVersionId } from './familiarMetadata';
import { Cactin } from './Cactin';
import { CosmicButterfly } from './CosmicButterfly';
import { Ember } from './Ember';
import { Ondulation } from './Ondulation';
import { Surge } from './Surge';
import { Void } from './Void';
import { DefaultFamiliar } from './DefaultFamiliar';
import { GhostCat } from './GhostCat';
import { MouseInventor } from './MouseInventor';
import { WiseFrog } from './WiseFrog';

export {
  getFamiliarMetadata,
  FAMILIAR_IDS,
  type FamiliarVersionId,
} from './familiarMetadata';

/** Registro de variantes de familiar (compañero de la criatura). Eje Familiar (accesorio-2). */
const FAMILIAR_VARIANTS_BASE: Record<FamiliarVersionId, CardComponentVariant> = {
  cactin: Cactin,
  'cosmic-butterfly': CosmicButterfly,
  'ghost-cat': GhostCat,
  'mouse-inventor': MouseInventor,
  'wise-frog': WiseFrog,
  ember: Ember,
  void: Void,
  ondulation: Ondulation,
  surge: Surge,
};

/** Incluye 'default' como fallback para versionId desconocido. */
export const FAMILIAR_VARIANTS: Record<string, CardComponentVariant> = {
  default: DefaultFamiliar,
  ...FAMILIAR_VARIANTS_BASE,
};
