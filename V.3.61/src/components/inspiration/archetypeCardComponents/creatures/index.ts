import type { CardComponentVariant } from '../types';
import { QUIEN_CHARACTER_IDS } from '../../QuienTinderCards';
import type { QuienCharacterId } from '../../QuienTinderCards/types';
import { createCreatureVariant } from './CreatureWrapper';
import {
  CREATURE_METADATA,
  getCreatureMetadata,
  type CreatureLabelVariant,
} from './creatureMetadata';

export { useCreatureAxisPalette } from './useCreatureAxisPalette';
export { getCreatureMetadata, getCreatureAxisDefaults } from './creatureMetadata';
export type { CreatureMetadata, CreatureLabelVariant } from './creatureMetadata';

/** Etiquetas para las criaturas en el modal de Identidad. */
export const CREATURE_LABELS: Record<QuienCharacterId, string> = Object.fromEntries(
  (QUIEN_CHARACTER_IDS as readonly number[]).map((id) => [
    id,
    CREATURE_METADATA[id as QuienCharacterId]?.name ?? `Criatura ${id}`,
  ])
) as Record<QuienCharacterId, string>;

/** Subtítulos (arquetipos) para las criaturas. Usado en etiquetas bajo la tarjeta. */
export const CREATURE_SUBTITLES: Record<QuienCharacterId, string> = Object.fromEntries(
  (QUIEN_CHARACTER_IDS as readonly number[]).map((id) => [
    id,
    CREATURE_METADATA[id as QuienCharacterId]?.subtitle ?? '—',
  ])
) as Record<QuienCharacterId, string>;

/** Variante de color para la etiqueta de cada criatura. */
export const CREATURE_LABEL_VARIANTS: Record<QuienCharacterId, CreatureLabelVariant> =
  Object.fromEntries(
    (QUIEN_CHARACTER_IDS as readonly number[]).map((id) => [
      id,
      CREATURE_METADATA[id as QuienCharacterId]?.labelVariant ?? 'slate',
    ])
  ) as Record<QuienCharacterId, CreatureLabelVariant>;

/** Configuración del eje por criatura (derivada de CREATURE_METADATA). */
export const CREATURE_AXIS_CONFIG = Object.fromEntries(
  (QUIEN_CHARACTER_IDS as readonly number[]).map((id) => {
    const meta = getCreatureMetadata(id as QuienCharacterId);
    return [
      id,
      meta?.axis
        ? {
            axisLabel: meta.axis.axisLabel,
            defaultColorLeft: meta.axis.defaultColorLeft,
            defaultColorRight: meta.axis.defaultColorRight,
            defaultSliderValue: meta.axis.defaultSliderValue,
          }
        : undefined,
    ];
  })
) as Partial<
  Record<
    QuienCharacterId,
    {
      axisLabel: string;
      defaultColorLeft: string;
      defaultColorRight: string;
      defaultSliderValue: number;
    }
  >
>;

/** Colores por defecto para cada criatura (derivados de CREATURE_METADATA o genéricos). */
const GENERIC_COLORS: Record<number, { left: string; right: string }> = {
  2: { left: '#0ea5e9', right: '#6366f1' },
  3: { left: '#f59e0b', right: '#78350f' },
  4: { left: '#d946ef', right: '#701a75' },
  5: { left: '#f59e0b', right: '#78716c' },
  6: { left: '#8b5cf6', right: '#4c1d95' },
  7: { left: '#fb7185', right: '#9f1239' },
  8: { left: '#f59e0b', right: '#92400e' },
  9: { left: '#0ea5e9', right: '#e0f2fe' },
  10: { left: '#64748b', right: '#1e293b' },
  11: { left: '#f97316', right: '#7c2d12' },
  12: { left: '#8b5cf6', right: '#c4b5fd' },
  13: { left: '#10b981', right: '#064e3b' },
  14: { left: '#22d3ee', right: '#0e7490' },
  15: { left: '#22d3ee', right: '#a78bfa' },
  16: { left: '#f59e0b', right: '#fef3c7' },
  17: { left: '#fb7185', right: '#fecdd3' },
  18: { left: '#22d3ee', right: '#0891b2' },
  19: { left: '#f59e0b', right: '#d97706' },
  20: { left: '#a78bfa', right: '#ddd6fe' },
  21: { left: '#10b981', right: '#34d399' },
  22: { left: '#0ea5e9', right: '#7dd3fc' },
  23: { left: '#f59e0b', right: '#065f46' },
  24: { left: '#f59e0b', right: '#fef3c7' },
  25: { left: '#64748b', right: '#94a3b8' },
  26: { left: '#ff6b9d', right: '#9d6bff' },
  27: { left: '#6366f1', right: '#a78bfa' },
  28: { left: '#6366f1', right: '#a78bfa' },
  29: { left: '#6366f1', right: '#a78bfa' },
  30: { left: '#6366f1', right: '#a78bfa' },
};

export const CREATURE_DEFAULT_COLORS: Record<QuienCharacterId, { left: string; right: string }> =
  Object.fromEntries(
    (QUIEN_CHARACTER_IDS as readonly number[]).map((id) => {
      const meta = getCreatureMetadata(id as QuienCharacterId);
      const colors = meta?.axis
        ? { left: meta.axis.defaultColorLeft, right: meta.axis.defaultColorRight }
        : GENERIC_COLORS[id] ?? { left: '#6366f1', right: '#a78bfa' };
      return [id, colors];
    })
  ) as Record<QuienCharacterId, { left: string; right: string }>;

/** Registro de variantes de criatura. Eje Identidad. */
export const CREATURE_VARIANTS: Record<string, CardComponentVariant> = Object.fromEntries(
  QUIEN_CHARACTER_IDS.map((id) => [String(id), createCreatureVariant(id)])
) as Record<string, CardComponentVariant>;
