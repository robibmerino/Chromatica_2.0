import { useMemo } from 'react';
import {
  getFallbackAxisOrder,
  AXIS_CONFIG_BY_ID,
} from '../inspiration/archetypeAxesConfig';
import { TinderCardPreview } from '../inspiration/TinderCardPreview';
import type { AvatarArchetypeColumn, AvatarAxisSelections } from './AvatarPersonalizationModal';
import type { ArchetypeAxisState } from '../inspiration/archetypeAxesTypes';

/** axisId del eje de identidad por columna (creature, silhouette, estilo). */
const IDENTITY_AXIS_BY_COLUMN: Record<AvatarArchetypeColumn, string> = {
  quien: 'axis-3',
  que: 'axis-3-silhouette',
  como: 'axis-3-estilo',
};

interface AvatarPreviewProps {
  column: AvatarArchetypeColumn;
  selections: AvatarAxisSelections;
  className?: string;
}

/**
 * Muestra el avatar usando el mismo sistema que las tarjetas de Arquetipos (TinderCardPreview):
 * mismo layout (fondo, figura centrada, detalle posicionado, atmósfera), colores y animaciones.
 * Se recorta en círculo para el hueco del avatar.
 */
export function AvatarPreview({ column, selections, className = '' }: AvatarPreviewProps) {
  const axisOrder = useMemo(() => getFallbackAxisOrder(column), [column]);

  const axesState: ArchetypeAxisState[] = useMemo(() => {
    return axisOrder.map((axisId) => {
      const config = AXIS_CONFIG_BY_ID.get(axisId);
      const optionIndex = selections[axisId] ?? 0;
      const option =
        optionIndex >= 0 && config?.archetypeOptions[optionIndex]
          ? config.archetypeOptions[optionIndex]
          : undefined;
      return {
        axisId,
        selectedOptionIndex: optionIndex,
        hasBeenConfigured: true,
        sliderValue: option?.defaultSliderValue ?? 50,
        colorLeft: option?.defaultColorLeft,
        colorRight: option?.defaultColorRight,
      };
    });
  }, [axisOrder, selections]);

  const identityAxisId = axisOrder[0] ?? null;
  const detailAxisId = axisOrder[2] ?? null;
  const identitySelected = (selections[identityAxisId] ?? 0) >= 0;
  const detailSelected = (selections[detailAxisId] ?? -1) >= 0;
  const centerLayer = detailSelected && !identitySelected ? 'detail' : 'figure';

  const card = useMemo(() => {
    const idAxisId = IDENTITY_AXIS_BY_COLUMN[column];
    const config = AXIS_CONFIG_BY_ID.get(idAxisId);
    const optionIndex = selections[idAxisId] ?? 0;
    const option = config?.archetypeOptions[optionIndex];
    const versionId = option?.versionId ?? '1';
    const numId = Number(versionId);
    const id = Number.isFinite(numId) ? Math.max(1, Math.min(numId, 30)) : 1;

    if (column === 'quien') {
      return { id: 'avatar', characterId: id as 1 };
    }
    if (column === 'que') {
      return { id: 'avatar', silhouetteId: Math.min(19, Math.max(1, id)) as 1 };
    }
    return { id: 'avatar', estiloId: Math.min(24, Math.max(1, id)) as 1 };
  }, [column, selections]);

  return (
    <div className={`absolute inset-0 rounded-full overflow-hidden bg-gray-800 ${className}`.trim()}>
      <div
        className="absolute left-0 right-0 w-full overflow-hidden"
        style={{ top: '-16.67%', height: '133.33%' }}
      >
        <TinderCardPreview
          card={card}
          axesState={axesState}
          axisOrder={axisOrder}
          columnKey={column}
          fullSize
          hideLabels
          hideBackground={false}
          centerLayer={centerLayer}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
