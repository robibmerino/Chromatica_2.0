import type { CardComponentProps } from '../types';
import { CharacterSlot } from '../../QuienTinderCards';
import type { QuienCharacterId } from '../../QuienTinderCards/types';

/**
 * Wrapper que adapta un personaje a CardComponentProps.
 * Pasa axisColorParams para que la criatura interactúe con el slider del eje.
 */
export function createCreatureVariant(characterId: QuienCharacterId) {
  return function CreatureVariant({
    blendedColor,
    colorLeft,
    colorRight,
    sliderValue = 50,
    defaultColorLeft,
    className = '',
    hideLabel = false,
  }: CardComponentProps) {
    const axisColorParams =
      colorLeft != null &&
      colorRight != null &&
      defaultColorLeft != null &&
      sliderValue != null
        ? { colorLeft, colorRight, defaultColorLeft, sliderValue }
        : undefined;

    return (
      <CharacterSlot
        characterId={characterId}
        color={blendedColor}
        axisColorParams={axisColorParams}
        className={className}
        hideLabel={hideLabel}
      />
    );
  };
}
