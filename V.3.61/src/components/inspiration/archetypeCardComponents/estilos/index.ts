import type { CardComponentVariant } from '../types';
import { QUIEN_ESTILO_IDS } from '../../ComoEstilos';
import type { ComoEstiloId } from '../../ComoEstilos/types';
import {
  ESTILO_LABELS,
  ESTILO_AXIS_CONFIG,
  ESTILO_DEFAULT_COLORS,
  getEstiloMetadata,
} from '../../ComoEstilos';
import { createEstiloVariant } from './EstiloWrapper';

export { ESTILO_COMPONENT_ID } from './constants';

/** Registro de variantes de estilo. Eje Estilo (Cómo). */
export const ESTILO_VARIANTS: Record<string, CardComponentVariant> = Object.fromEntries(
  QUIEN_ESTILO_IDS.map((id) => [String(id), createEstiloVariant(id as ComoEstiloId)])
) as Record<string, CardComponentVariant>;

export { ESTILO_LABELS, ESTILO_AXIS_CONFIG, ESTILO_DEFAULT_COLORS, getEstiloMetadata };
