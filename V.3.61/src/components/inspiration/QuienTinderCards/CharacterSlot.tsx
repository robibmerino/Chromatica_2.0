import type { QuienCharacterId, AxisColorParams } from './types';
import { getCharacterComponent } from './characterRegistry';

interface CharacterSlotProps {
  characterId: QuienCharacterId;
  /** Color del personaje (cuando no se usan axisColorParams) */
  color?: string;
  /** Parámetros del eje para que la criatura interactúe con el slider */
  axisColorParams?: AxisColorParams;
  /** Clase extra para el contenedor */
  className?: string;
  /** Oculta la etiqueta del personaje (p. ej. en miniaturas del modal) */
  hideLabel?: boolean;
}

/**
 * Muestra el personaje correspondiente a la tarjeta.
 * Si axisColorParams está presente, la criatura rota sus colores según el eje.
 * Nuevos personajes: añadir en characterRegistry.tsx.
 */
export function CharacterSlot({
  characterId,
  className = '',
  color,
  axisColorParams,
  hideLabel,
}: CharacterSlotProps) {
  const Character = getCharacterComponent(characterId);
  if (Character) {
    return (
      <Character
        className={className}
        color={color}
        axisColorParams={axisColorParams}
        hideLabel={hideLabel}
      />
    );
  }
  return <CharacterPlaceholder characterId={characterId} className={className} />;
}

/** Placeholder para personajes aún no incorporados. */
function CharacterPlaceholder({ characterId, className }: { characterId: QuienCharacterId; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full min-h-[280px] bg-gray-800/30 rounded-xl border border-gray-600/30 ${className}`}
    >
      <p className="text-gray-500 text-sm">Personaje {characterId} (pendiente)</p>
    </div>
  );
}
