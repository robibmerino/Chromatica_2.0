import type { QuienSilhouetteId, QuienSilhouetteProps } from './types';
import { getSilhouetteComponent } from './silhouetteRegistry';
import { PlaceholderSilhouette } from './PlaceholderSilhouette';

interface SilhouetteSlotProps extends QuienSilhouetteProps {
  silhouetteId: QuienSilhouetteId;
}

/**
 * Muestra la silueta correspondiente a la tarjeta.
 * Usa el componente del registro si existe; si no, PlaceholderSilhouette.
 */
export function SilhouetteSlot({
  silhouetteId,
  className = '',
  color,
  hideLabel,
}: SilhouetteSlotProps) {
  const SilhouetteComponent = getSilhouetteComponent(silhouetteId);

  if (SilhouetteComponent) {
    return (
      <SilhouetteComponent
        className={className}
        color={color}
        hideLabel={hideLabel}
      />
    );
  }

  return (
    <PlaceholderSilhouette
      silhouetteId={silhouetteId}
      className={className}
      color={color}
      hideLabel={hideLabel}
    />
  );
}
