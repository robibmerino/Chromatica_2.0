import type { CardComponentProps } from '../types';
import { SilhouetteSlot } from '../../QuienSilhouettes';
import type { QuienSilhouetteId } from '../../QuienSilhouettes/types';

/**
 * Wrapper que adapta una silueta a CardComponentProps.
 * Usado en el modal de Identidad para las variantes del eje axis-3-silhouette.
 */
export function createSilhouetteVariant(silhouetteId: QuienSilhouetteId) {
  return function SilhouetteVariant({
    blendedColor,
    className = '',
    hideLabel = false,
  }: CardComponentProps) {
    return (
      <SilhouetteSlot
        silhouetteId={silhouetteId}
        color={blendedColor}
        className={className}
        hideLabel={hideLabel}
      />
    );
  };
}
