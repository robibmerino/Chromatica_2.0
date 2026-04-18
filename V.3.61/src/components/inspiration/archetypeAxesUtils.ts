import type { ArchetypeAxisConfig, ArchetypeAxisState, ArchetypeOption } from './archetypeAxesTypes';
import { rotateHue } from '../../utils/colorUtils';

/** Parsea "Extrovertido–Introvertido" en [izquierda, derecha]. */
export function parseArchetypeLabel(label: string): [string, string] {
  const parts = label.split(/[–-]/).map((s) => s.trim());
  if (parts.length >= 2) return [parts[0], parts[1]];
  return [label, label];
}

/** Indica si la opción es la personalizable ("Mi propio X"). */
export function isCustomOption(option: ArchetypeOption | undefined): boolean {
  return !!(option?.isCustom || option?.versionId === 'custom');
}

/** Opciones base (excluye la personalizable). */
export function getBaseOptions<T extends ArchetypeOption>(options: T[]): T[] {
  return options.filter((o) => !o.isCustom);
}

/** true si el eje tiene opción personalizable (modo solo-modal, sin desplegable). */
export function hasCustomOption(config: { archetypeOptions: ArchetypeOption[] }): boolean {
  return config.archetypeOptions.some((o) => o.isCustom);
}

/** Índice de la opción custom en archetypeOptions, o -1 si no existe. */
export function getCustomOptionIndex(config: { archetypeOptions: ArchetypeOption[] }): number {
  return config.archetypeOptions.findIndex((o) => o.isCustom);
}

/** Obtiene la opción base cuando estamos en modo custom (variante seleccionada o primera no custom). */
export function getBaseOptionForCustom(
  config: ArchetypeAxisConfig,
  state: ArchetypeAxisState
): ArchetypeOption | undefined {
  if (state.customVersionId) {
    return config.archetypeOptions.find((o) => o.versionId === state.customVersionId);
  }
  return config.archetypeOptions.find((o) => !o.isCustom);
}

/** Obtiene colores y labels para mostrar un eje (resuelve custom vs estándar). */
export function getAxisDisplayInfo(
  config: ArchetypeAxisConfig,
  state: ArchetypeAxisState,
  option: ArchetypeOption | undefined
): { colorLeft: string; colorRight: string; labelLeft: string; labelRight: string } {
  const custom = isCustomOption(option);
  const baseOption = custom ? getBaseOptionForCustom(config, state) : option;
  const colorLeft = state.colorLeft ?? baseOption?.defaultColorLeft ?? config.colorLeft;
  const colorRight = state.colorRight ?? baseOption?.defaultColorRight ?? config.colorRight;
  const axisLabel = baseOption?.axisLabel ?? baseOption?.label ?? '';
  const [defaultLeft, defaultRight] = baseOption ? parseArchetypeLabel(axisLabel) : ['', ''];
  const labelLeft = custom ? (state.customLabelLeft ?? defaultLeft) : defaultLeft;
  const labelRight = custom ? (state.customLabelRight ?? defaultRight) : defaultRight;
  return { colorLeft, colorRight, labelLeft, labelRight };
}

/** Paleta gris para estado inactivo (4 segmentos). */
export const INACTIVE_PALETTE = ['#4a4a4a', '#5f5f5f', '#757575', '#8a8a8a'];

/** Genera color análogo rotando el matiz ~30°. */
export function getAnalogousColor(hex: string, offsetDegrees = 30): string {
  return rotateHue(hex, offsetDegrees);
}

/**
 * Rellena los 4 slots: los configurados con su color real, los no configurados con análogos.
 * - 1 configurado: los otros 3 análogos del configurado (+30°, +60°, +90°)
 * - 2 configurados: slot 3 análogo del 1, slot 4 análogo del 2
 * - 3 configurados: slot 4 análogo del 3
 * items: array de 4 con { color, label, configured }
 */
export function buildPaletteWithAnalogous(
  items: { color: string; label: string; configured: boolean }[]
): { colors: string[]; labels: string[] } {
  const colors: string[] = [];
  const labels: string[] = [];
  const configured: { idx: number; color: string; label: string }[] = [];
  items.forEach((it, i) => {
    if (it.configured) configured.push({ idx: i, color: it.color, label: it.label });
  });

  for (let i = 0; i < 4; i++) {
    const item = items[i];
    if (item?.configured) {
      colors.push(item.color);
      labels.push(item.label);
    } else if (configured.length === 0) {
      // Ningún eje configurado: usar color real del eje (p. ej. fondo Fase 1) para coincidir con la tarjeta
      colors.push(item?.color ?? INACTIVE_PALETTE[i] ?? INACTIVE_PALETTE[0]);
      labels.push(item?.label ?? '—');
    } else {
      let sourceColor: string;
      let offset: number;
      const unconfiguredBeforeCount = items.slice(0, i).filter((x) => !x?.configured).length;
      const unconfiguredTotalCount = items.filter((x) => !x?.configured).length;
      if (configured.length === 1) {
        sourceColor = configured[0].color;
        offset = 30 * (unconfiguredBeforeCount + 1);
      } else {
        const sourceIdx =
          unconfiguredTotalCount <= configured.length
            ? Math.max(0, configured.length - unconfiguredTotalCount + unconfiguredBeforeCount)
            : unconfiguredBeforeCount % configured.length;
        sourceColor = configured[sourceIdx].color;
        offset = 25;
      }
      colors.push(getAnalogousColor(sourceColor, offset));
      labels.push('—');
    }
  }
  return { colors, labels };
}
