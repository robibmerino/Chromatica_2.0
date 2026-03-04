import type { CardComponentProps } from '../types';
import { EstiloSlot } from '../../ComoEstilos';
import type { ComoEstiloId } from '../../ComoEstilos/types';

/**
 * Wrapper que adapta un estilo a CardComponentProps.
 * Usado en el modal de Estilo para las variantes del eje axis-3-estilo.
 */
export function createEstiloVariant(estiloId: ComoEstiloId) {
  return function EstiloVariant({
    blendedColor,
    className = '',
    hideLabel = false,
  }: CardComponentProps) {
    return (
      <EstiloSlot
        estiloId={estiloId}
        color={blendedColor}
        className={className}
        hideLabel={hideLabel}
      />
    );
  };
}
