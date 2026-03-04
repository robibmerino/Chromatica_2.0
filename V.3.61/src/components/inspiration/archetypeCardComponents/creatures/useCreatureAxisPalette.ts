import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import { getCreatureAxisDefaults } from './creatureMetadata';
import type { QuienCharacterId } from '../../QuienTinderCards/types';
import type { AxisColorParams } from '../../QuienTinderCards/types';

/**
 * Hook para criaturas que usan paleta rotable según el eje.
 * Usa axisColorParams si existe; si no, usa los valores por defecto de la criatura.
 */
export function useCreatureAxisPalette<T extends Record<string, string>>(
  creatureId: QuienCharacterId,
  palette: T,
  axisColorParams?: AxisColorParams | null
): T {
  const defaults = getCreatureAxisDefaults(creatureId);
  const params: AxisColorParams =
    axisColorParams ??
    (defaults ?? {
      colorLeft: '#6366f1',
      colorRight: '#a78bfa',
      defaultColorLeft: '#6366f1',
      sliderValue: 50,
    });
  return useAxisRotatedPalette(palette, params);
}
