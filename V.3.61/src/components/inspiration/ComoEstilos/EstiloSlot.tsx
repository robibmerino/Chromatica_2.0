import type { ComoEstiloId, ComoEstiloProps } from './types';
import { getEstiloComponent } from './estiloRegistry';
import { PlaceholderEstilo } from './PlaceholderEstilo';

interface EstiloSlotProps extends ComoEstiloProps {
  estiloId: ComoEstiloId;
}

/**
 * Muestra el estilo correspondiente a la tarjeta.
 * Usa el componente del registro si existe; si no, PlaceholderEstilo.
 */
export function EstiloSlot({
  estiloId,
  className = '',
  color,
  hideLabel,
}: EstiloSlotProps) {
  const EstiloComponent = getEstiloComponent(estiloId);

  if (EstiloComponent) {
    return <EstiloComponent color={color} className={className} />;
  }

  return (
    <PlaceholderEstilo
      estiloId={estiloId}
      className={className}
      color={color}
      hideLabel={hideLabel}
    />
  );
}
