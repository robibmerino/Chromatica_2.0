import type { CardComponentVariant } from '../types';
import { QUIEN_SILHOUETTE_IDS } from '../../QuienSilhouettes';
import type { QuienSilhouetteId } from '../../QuienSilhouettes/types';
import {
  SILHOUETTE_LABELS,
  SILHOUETTE_AXIS_CONFIG,
  SILHOUETTE_DEFAULT_COLORS,
  getSilhouetteMetadata,
} from '../../QuienSilhouettes';
import { createSilhouetteVariant } from './SilhouetteWrapper';

export { SILHOUETTE_COMPONENT_ID } from './constants';

/** Registro de variantes de silueta. Eje Identidad (Quién). Contemplativo (1) primero. */
export const SILHOUETTE_VARIANTS: Record<string, CardComponentVariant> = Object.fromEntries(
  QUIEN_SILHOUETTE_IDS.map((id) => [String(id), createSilhouetteVariant(id as QuienSilhouetteId)])
) as Record<string, CardComponentVariant>;

export { SILHOUETTE_LABELS, SILHOUETTE_AXIS_CONFIG, SILHOUETTE_DEFAULT_COLORS, getSilhouetteMetadata };
