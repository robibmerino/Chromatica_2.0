import type { ArchetypeAxisConfig, ArchetypeAxisState } from './archetypeAxesTypes';
import { FAMILIAR_COMPONENT_ID } from './archetypeCardComponents/familiares/constants';
import { HERRAMIENTAS_COMPONENT_ID } from './archetypeCardComponents/herramientas/constants';
import { CREATURE_COMPONENT_ID } from './archetypeCardComponents/creatures/constants';
import { SILHOUETTE_COMPONENT_ID } from './archetypeCardComponents/silhouettes/constants';
import { ESTILO_COMPONENT_ID } from './archetypeCardComponents/estilos/constants';
import { ATMOSPHERE_COMPONENT_ID, ATMOSPHERE_IDS, getAtmosphereMetadata } from './archetypeCardComponents/atmospheres';
import {
  BACKGROUND_IDS,
  BACKGROUND_DEFAULT_VERSION_ID,
  getBackgroundMetadata,
} from './archetypeCardComponents/backgrounds';
import {
  FAMILIAR_IDS,
  getFamiliarMetadata,
} from './archetypeCardComponents/familiares';
import {
  HERRAMIENTAS_IDS,
  getHerramientaMetadata,
} from './archetypeCardComponents/herramientas';
import {
  INSPIRACION_IDS,
  getInspiracionMetadata,
} from './archetypeCardComponents/inspiracion';
import { INSPIRACION_COMPONENT_ID } from './archetypeCardComponents/inspiracion/constants';
import {
  CREATURE_LABELS,
  CREATURE_DEFAULT_COLORS,
  CREATURE_AXIS_CONFIG,
} from './archetypeCardComponents/creatures';
import {
  SILHOUETTE_LABELS,
  SILHOUETTE_AXIS_CONFIG,
  SILHOUETTE_DEFAULT_COLORS,
} from './archetypeCardComponents/silhouettes';
import {
  ESTILO_LABELS,
  ESTILO_AXIS_CONFIG,
  ESTILO_DEFAULT_COLORS,
} from './archetypeCardComponents/estilos';
import type { QuienCharacterId } from './QuienTinderCards/types';
import type { QuienSilhouetteId } from './QuienSilhouettes/types';
import type { ComoEstiloId } from './ComoEstilos/types';
import { QUIEN_CHARACTER_IDS } from './QuienTinderCards';
import { QUIEN_SILHOUETTE_IDS } from './QuienSilhouettes';
import { QUIEN_ESTILO_IDS } from './ComoEstilos';
import { blendHex } from '../../utils/colorUtils';
import { isCustomOption, getBaseOptions, getCustomOptionIndex } from './archetypeAxesUtils';

/** Colores por defecto del eje de fondos. */
const BACKGROUND_DEFAULT_COLOR_LEFT = '#1f2937';
const BACKGROUND_DEFAULT_COLOR_RIGHT = '#e5e7eb';

/**
 * Configuración de ejes arquetipo. Cada eje está vinculado a un componente editable de la tarjeta
 * (fondos, accesorios, etc.). Las opciones del eje determinan qué variante se muestra.
 */
export const ARCHETYPE_AXES_CONFIG: ArchetypeAxisConfig[] = [
  {
    id: 'axis-background',
    componentId: 'background',
    label: 'Fondo',
    customOptionLabel: 'Contexto',
    archetypeOptions: [
      ...BACKGROUND_IDS.map((versionId, i) => {
        const meta = getBackgroundMetadata(versionId);
        return {
          label: meta?.axis.axisLabel ?? `Fondo ${i + 1}`,
          versionId,
          defaultColorLeft: meta?.axis.defaultColorLeft ?? BACKGROUND_DEFAULT_COLOR_LEFT,
          defaultColorRight: meta?.axis.defaultColorRight ?? BACKGROUND_DEFAULT_COLOR_RIGHT,
          defaultSliderValue: meta?.axis.defaultSliderValue ?? 0,
        };
      }),
      { label: 'Contexto', versionId: 'custom', isCustom: true },
    ],
    colorLeft: BACKGROUND_DEFAULT_COLOR_LEFT,
    colorRight: BACKGROUND_DEFAULT_COLOR_RIGHT,
  },
  {
    id: 'axis-2',
    componentId: FAMILIAR_COMPONENT_ID,
    label: 'Familiar',
    customOptionLabel: 'Esencia',
    archetypeOptions: [
      ...FAMILIAR_IDS.map((versionId) => {
        const meta = getFamiliarMetadata(versionId);
        if (!meta) {
          return {
            label: versionId,
            versionId,
            defaultColorLeft: '#374151',
            defaultColorRight: '#9ca3af',
            defaultSliderValue: 0,
          };
        }
        return {
          label: meta.name,
          axisLabel: meta.axis.axisLabel,
          versionId,
          defaultColorLeft: meta.axis.defaultColorLeft,
          defaultColorRight: meta.axis.defaultColorRight,
          defaultSliderValue: meta.axis.defaultSliderValue,
        };
      }),
      { label: 'Esencia', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#059669',
    colorRight: '#d97706',
  },
  {
    id: 'axis-2-herramientas',
    componentId: HERRAMIENTAS_COMPONENT_ID,
    label: 'Herramienta',
    customOptionLabel: 'Herramienta',
    archetypeOptions: [
      ...HERRAMIENTAS_IDS.map((versionId) => {
        const meta = getHerramientaMetadata(versionId);
        if (!meta) {
          return {
            label: versionId,
            versionId,
            defaultColorLeft: '#374151',
            defaultColorRight: '#9ca3af',
            defaultSliderValue: 0,
          };
        }
        return {
          label: meta.name,
          axisLabel: meta.axis.axisLabel,
          versionId,
          defaultColorLeft: meta.axis.defaultColorLeft,
          defaultColorRight: meta.axis.defaultColorRight,
          defaultSliderValue: meta.axis.defaultSliderValue,
        };
      }),
      { label: 'Herramienta', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#059669',
    colorRight: '#d97706',
  },
  {
    id: 'axis-2-inspiracion',
    componentId: INSPIRACION_COMPONENT_ID,
    label: 'Inspiración',
    customOptionLabel: 'Inspiración',
    archetypeOptions: [
      ...INSPIRACION_IDS.map((versionId) => {
        const meta = getInspiracionMetadata(versionId);
        if (!meta) {
          return {
            label: versionId,
            versionId,
            defaultColorLeft: '#374151',
            defaultColorRight: '#9ca3af',
            defaultSliderValue: 0,
          };
        }
        return {
          label: meta.name,
          axisLabel: meta.axis.axisLabel,
          versionId,
          defaultColorLeft: meta.axis.defaultColorLeft,
          defaultColorRight: meta.axis.defaultColorRight,
          defaultSliderValue: meta.axis.defaultSliderValue,
        };
      }),
      { label: 'Inspiración', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#059669',
    colorRight: '#d97706',
  },
  {
    id: 'axis-3',
    componentId: CREATURE_COMPONENT_ID,
    label: 'Identidad',
    customOptionLabel: 'Identidad',
    archetypeOptions: [
      ...QUIEN_CHARACTER_IDS.map((id) => {
        const creatureId = id as QuienCharacterId;
        const colors = CREATURE_DEFAULT_COLORS[creatureId];
        const axisOverride = CREATURE_AXIS_CONFIG[creatureId];
        return {
          label: axisOverride?.axisLabel ?? CREATURE_LABELS[creatureId],
          versionId: String(id),
          defaultColorLeft: axisOverride?.defaultColorLeft ?? colors.left,
          defaultColorRight: axisOverride?.defaultColorRight ?? colors.right,
          defaultSliderValue: axisOverride?.defaultSliderValue ?? 50,
        };
      }),
      { label: 'Identidad', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#6366f1',
    colorRight: '#a78bfa',
  },
  {
    id: 'axis-3-silhouette',
    componentId: SILHOUETTE_COMPONENT_ID,
    label: 'Identidad',
    customOptionLabel: 'Identidad',
    archetypeOptions: [
      ...QUIEN_SILHOUETTE_IDS.map((id) => {
        const silhouetteId = id as QuienSilhouetteId;
        const colors = SILHOUETTE_DEFAULT_COLORS[silhouetteId];
        const axisOverride = SILHOUETTE_AXIS_CONFIG[silhouetteId];
        return {
          label: axisOverride?.axisLabel ?? SILHOUETTE_LABELS[silhouetteId],
          versionId: String(id),
          defaultColorLeft: axisOverride?.defaultColorLeft ?? colors.left,
          defaultColorRight: axisOverride?.defaultColorRight ?? colors.right,
          defaultSliderValue: axisOverride?.defaultSliderValue ?? 50,
        };
      }),
      { label: 'Identidad', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#64748b',
    colorRight: '#a78bfa',
  },
  {
    id: 'axis-3-estilo',
    componentId: ESTILO_COMPONENT_ID,
    label: 'Estilo',
    customOptionLabel: 'Estilo',
    archetypeOptions: [
      ...QUIEN_ESTILO_IDS.map((id) => {
        const estiloId = id as ComoEstiloId;
        const colors = ESTILO_DEFAULT_COLORS[estiloId];
        const axisOverride = ESTILO_AXIS_CONFIG[estiloId];
        return {
          label: ESTILO_LABELS[estiloId],
          axisLabel: axisOverride?.axisLabel ?? ESTILO_LABELS[estiloId],
          versionId: String(id),
          defaultColorLeft: axisOverride?.defaultColorLeft ?? colors.left,
          defaultColorRight: axisOverride?.defaultColorRight ?? colors.right,
          defaultSliderValue: axisOverride?.defaultSliderValue ?? 50,
        };
      }),
      { label: 'Estilo', versionId: 'custom', isCustom: true },
    ],
    colorLeft: '#64748b',
    colorRight: '#a78bfa',
  },
  {
    id: 'axis-4',
    componentId: ATMOSPHERE_COMPONENT_ID,
    label: 'Atmósfera',
    customOptionLabel: 'Atmósfera',
    archetypeOptions: [
      ...ATMOSPHERE_IDS.map((versionId, i) => {
        const meta = getAtmosphereMetadata(versionId);
        return {
          label: meta?.axis.axisLabel ?? `Atmósfera ${i + 1}`,
          versionId,
          defaultColorLeft: meta?.axis.defaultColorLeft ?? '#7287f3',
          defaultColorRight: meta?.axis.defaultColorRight ?? '#22d3ee',
          defaultSliderValue: meta?.axis.defaultSliderValue ?? 0,
        };
      }),
      {
        label: 'Atmósfera',
        versionId: 'custom',
        isCustom: true,
      },
    ],
    colorLeft: '#7287f3',
    colorRight: '#22d3ee',
  },
];

/** Orden por defecto: Identidad (criaturas), Esencia. Para columnas Qué y Cómo. */
export const DEFAULT_AXIS_ORDER: string[] = [
  'axis-3', // Identidad (criaturas)
  'axis-background',
  'axis-2', // Esencia (Familiar)
  'axis-4',
];

/**
 * Orden para UI "Qué" (columnKey 'quien'): criaturas + Esencia.
 * NOTA: getContentColumnKey intercambia Quién↔Qué; el botón "Qué" usa flow 'quien' (criaturas).
 */
export const DEFAULT_AXIS_ORDER_QUE: string[] = [
  'axis-3', // Identidad (criaturas)
  'axis-background',
  'axis-2', // Esencia (Familiar)
  'axis-4',
];

/**
 * Orden para UI "Quién" (columnKey 'que'): siluetas + Herramientas.
 * NOTA: getContentColumnKey intercambia Quién↔Qué; el botón "Quién" usa flow 'que' (siluetas).
 */
export const DEFAULT_AXIS_ORDER_QUIEN: string[] = [
  'axis-3-silhouette', // Identidad (siluetas)
  'axis-background',
  'axis-2-herramientas', // Herramientas (solo UI Quién)
  'axis-4',
];

/**
 * Orden para UI "Cómo" (columnKey 'como'): estilos + Esencia.
 */
export const DEFAULT_AXIS_ORDER_COMO: string[] = [
  'axis-3-estilo', // Estilo (solo UI Cómo)
  'axis-background',
  'axis-2-inspiracion', // Inspiración (solo UI Cómo)
  'axis-4',
];

/** Tipo para la clave de columna (contentColumnKey: quien=Esencia, que=Herramientas, como=Estilo). */
export type AxisOrderColumnKey = 'quien' | 'que' | 'como';

/**
 * Convierte la clave del botón de la UI en la clave de contenido (orden de ejes).
 * Intercambio Quién↔Qué: botón "Quién" (key 'quien') → content 'que' (siluetas); botón "Qué" (key 'que') → content 'quien' (criaturas).
 */
export function getContentColumnKey(buttonKey: AxisOrderColumnKey): AxisOrderColumnKey {
  if (buttonKey === 'quien') return 'que';
  if (buttonKey === 'que') return 'quien';
  return buttonKey;
}

/**
 * Devuelve el orden de ejes por defecto según la columna de contenido.
 * Intercambio Quién↔Qué: columnKey 'que' = UI Quién (Herramientas/siluetas), 'quien' = UI Qué (Esencia/criaturas).
 */
export function getFallbackAxisOrder(columnKey: AxisOrderColumnKey): string[] {
  return columnKey === 'que'
    ? DEFAULT_AXIS_ORDER_QUIEN
    : columnKey === 'quien'
      ? DEFAULT_AXIS_ORDER_QUE
      : DEFAULT_AXIS_ORDER_COMO;
}

/** Estado por defecto. Ejes con custom: índice custom, slider 50. Resto: índice 0, slider 50. */
export function getDefaultAxisState(): ArchetypeAxisState[] {
  return ARCHETYPE_AXES_CONFIG.map((c) => {
    const customIdx = getCustomOptionIndex(c);
    const selectedOptionIndex = customIdx >= 0 ? customIdx : 0;
    const opt = c.archetypeOptions[selectedOptionIndex];
    const sliderValue = opt?.defaultSliderValue ?? 50;
    return {
      axisId: c.id,
      selectedOptionIndex,
      sliderValue,
    };
  });
}

export const AXIS_BACKGROUND_ID = 'axis-background';

/**
 * Estado mínimo para Fase 1: fondo predeterminado, sin herramientas ni complementos.
 * Las tarjetas de Phase 1 solo muestran personaje sobre fondo por defecto.
 */
export function getPhase1AxisState(): ArchetypeAxisState[] {
  return [];
}

/**
 * Estado inicial para Fase 2 cuando se transiciona desde Fase 1.
 * Mantiene Firmamento como fondo predeterminado (color #48106a).
 */
export function getPhase2InitialAxisState(): ArchetypeAxisState[] {
  return ARCHETYPE_AXES_CONFIG.map((c) => {
    let selectedOptionIndex: number;
    if (c.id === AXIS_BACKGROUND_ID) {
      selectedOptionIndex = 0; // Firmamento
    } else {
      const customIdx = getCustomOptionIndex(c);
      selectedOptionIndex = customIdx >= 0 ? customIdx : 0;
    }
    const opt = c.archetypeOptions[selectedOptionIndex];
    const sliderValue = opt?.defaultSliderValue ?? 50;
    return { axisId: c.id, selectedOptionIndex, sliderValue };
  });
}

/**
 * Estado aleatorio (deprecated para Fase 1). Se usa getPhase1AxisState en su lugar.
 */
export function getRandomizedAxisState(): ArchetypeAxisState[] {
  return ARCHETYPE_AXES_CONFIG.map((c) => {
    const realOptions = getBaseOptions(c.archetypeOptions);
    const selectedIndex = Math.floor(Math.random() * realOptions.length);
    const option = realOptions[selectedIndex];
    let sliderValue: number;
    if (c.id === AXIS_BACKGROUND_ID && c.archetypeOptions.length > 0) {
      sliderValue = Math.random() < 0.5 ? 0 : 100;
    } else {
      sliderValue =
        option?.defaultSliderValue !== undefined
          ? option.defaultSliderValue
          : Math.floor(Math.random() * 101);
    }
    const selectedOptionIndex = c.archetypeOptions.findIndex((o) => o.versionId === option.versionId);
    return {
      axisId: c.id,
      selectedOptionIndex: selectedOptionIndex >= 0 ? selectedOptionIndex : 0,
      sliderValue,
    };
  });
}

/** Mapa id → config para búsqueda rápida. */
export const AXIS_CONFIG_BY_ID = new Map(ARCHETYPE_AXES_CONFIG.map((c) => [c.id, c]));

/** Estado completo del eje para un componente (versionId, colores, slider). */
export interface ComponentAxisState {
  versionId: string;
  blendedColor: string;
  colorLeft: string;
  colorRight: string;
  sliderValue: number;
  /** Color predeterminado del extremo izquierdo (ancla para rotación; solo si la opción lo define) */
  defaultColorLeft?: string;
}

/** Obtiene el estado completo del eje vinculado a un componentId. */
export function getComponentStateFromAxes(
  componentId: string,
  axesState: ArchetypeAxisState[],
  axisOrder: string[] = DEFAULT_AXIS_ORDER
): ComponentAxisState {
  const axisId = axisOrder.find((id) => AXIS_CONFIG_BY_ID.get(id)?.componentId === componentId);
  const config = axisId ? AXIS_CONFIG_BY_ID.get(axisId) : undefined;
  const state = axisId ? axesState.find((s) => s.axisId === axisId) : undefined;
  if (!config || !state) {
    const versionId =
      componentId === 'background' ? BACKGROUND_DEFAULT_VERSION_ID : 'default';
    if (componentId === 'background') {
      const meta = getBackgroundMetadata(BACKGROUND_DEFAULT_VERSION_ID);
      const colorLeft = meta?.axis.defaultColorLeft ?? BACKGROUND_DEFAULT_COLOR_LEFT;
      const colorRight = meta?.axis.defaultColorRight ?? BACKGROUND_DEFAULT_COLOR_RIGHT;
      const sliderValue = meta?.axis.defaultSliderValue ?? 50;
      return {
        versionId,
        blendedColor: blendHex(colorLeft, colorRight, sliderValue / 100),
        colorLeft,
        colorRight,
        sliderValue,
      };
    }
    return {
      versionId,
      blendedColor: '#374151',
      colorLeft: '#1f2937',
      colorRight: '#e5e7eb',
      sliderValue: 50,
    };
  }
  const option =
    state.selectedOptionIndex >= 0 && state.selectedOptionIndex < config.archetypeOptions.length
      ? config.archetypeOptions[state.selectedOptionIndex]
      : undefined;
  const custom = isCustomOption(option);
  const baseOption = custom && state.customVersionId
    ? config.archetypeOptions.find((o) => o.versionId === state.customVersionId)
    : option;
  const versionId = custom
    ? (state.customVersionId ?? config.archetypeOptions[0]?.versionId ?? 'default')
    : (option?.versionId ?? 'default');
  const colorLeft = state.colorLeft ?? baseOption?.defaultColorLeft ?? config.colorLeft;
  const colorRight = state.colorRight ?? baseOption?.defaultColorRight ?? config.colorRight;
  const sliderVal = state.sliderValue ?? 50;
  const blendedColor = blendHex(colorLeft, colorRight, sliderVal / 100);
  return {
    versionId,
    blendedColor,
    colorLeft,
    colorRight,
    sliderValue: sliderVal,
    defaultColorLeft: baseOption?.defaultColorLeft,
  };
}

/**
 * Obtiene el ID efectivo de la criatura para una tarjeta Quién.
 * Si el eje criatura está configurado, usa la variante del eje; si no, usa characterId de la tarjeta.
 */
export function getEffectiveCharacterId(
  card: { id: string; characterId?: number },
  axesState: ArchetypeAxisState[],
  axisOrder: string[] = DEFAULT_AXIS_ORDER
): number | null {
  if (!('characterId' in card) || card.characterId == null) return null;
  const creatureAxisConfigured = axesState.some(
    (s) =>
      AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === CREATURE_COMPONENT_ID && s.hasBeenConfigured
  );
  if (!creatureAxisConfigured) return card.characterId;
  const componentState = getComponentStateFromAxes(
    CREATURE_COMPONENT_ID,
    axesState,
    axisOrder
  );
  const versionId = componentState.versionId;
  if (versionId === 'custom' || versionId === 'default') return card.characterId;
  const num = Number(versionId);
  return Number.isFinite(num) && num in CREATURE_LABELS ? num : card.characterId;
}

/**
 * Obtiene el ID efectivo de la silueta para una tarjeta Quién (contenido = siluetas).
 * Si el eje silueta está configurado, usa la variante del eje; si no, usa silhouetteId de la tarjeta.
 * Usa DEFAULT_AXIS_ORDER_QUIEN (axis-3-silhouette) como orden por defecto para siluetas.
 */
export function getEffectiveSilhouetteId(
  card: { id: string; silhouetteId?: number },
  axesState: ArchetypeAxisState[],
  axisOrder: string[] = DEFAULT_AXIS_ORDER_QUIEN
): number | null {
  if (!('silhouetteId' in card) || card.silhouetteId == null) return null;
  const silhouetteAxisConfigured = axesState.some(
    (s) =>
      AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === SILHOUETTE_COMPONENT_ID && s.hasBeenConfigured
  );
  if (!silhouetteAxisConfigured) return card.silhouetteId;
  const componentState = getComponentStateFromAxes(
    SILHOUETTE_COMPONENT_ID,
    axesState,
    axisOrder
  );
  const versionId = componentState.versionId;
  if (versionId === 'custom' || versionId === 'default') return card.silhouetteId;
  const num = Number(versionId);
  return Number.isFinite(num) && num in SILHOUETTE_LABELS ? num : card.silhouetteId;
}

/**
 * Obtiene el ID efectivo del estilo para una tarjeta Cómo.
 * Si el eje estilo está configurado, usa la variante del eje; si no, usa estiloId de la tarjeta.
 */
export function getEffectiveEstiloId(
  card: { id: string; estiloId?: number },
  axesState: ArchetypeAxisState[],
  axisOrder: string[] = DEFAULT_AXIS_ORDER_COMO
): number | null {
  if (!('estiloId' in card) || card.estiloId == null) return null;
  const estiloAxisConfigured = axesState.some(
    (s) =>
      AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === ESTILO_COMPONENT_ID && s.hasBeenConfigured
  );
  if (!estiloAxisConfigured) return card.estiloId;
  const componentState = getComponentStateFromAxes(
    ESTILO_COMPONENT_ID,
    axesState,
    axisOrder
  );
  const versionId = componentState.versionId;
  if (versionId === 'custom' || versionId === 'default') return card.estiloId;
  const num = Number(versionId);
  return Number.isFinite(num) && num in ESTILO_LABELS ? num : card.estiloId;
}
