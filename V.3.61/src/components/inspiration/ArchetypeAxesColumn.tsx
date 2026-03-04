import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { Reorder, useDragControls, motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { type ArchetypeAxisConfig, type ArchetypeAxisState } from './archetypeAxesTypes';
import {
  AXIS_CONFIG_BY_ID,
  DEFAULT_AXIS_ORDER,
  getPhase2InitialAxisState,
  getComponentStateFromAxes,
} from './archetypeAxesConfig';
import { blendHex } from '../../utils/colorUtils';
import { CustomAxisModal } from './CustomAxisModal';
import {
  isCustomOption,
  getAxisDisplayInfo,
  hasCustomOption,
  getCustomOptionIndex,
  INACTIVE_PALETTE,
  buildPaletteWithAnalogous,
} from './archetypeAxesUtils';
import { DragHandleButton } from './ArchetypeIcons';
import { CREATURE_COMPONENT_ID } from './archetypeCardComponents/creatures/constants';
import { SILHOUETTE_COMPONENT_ID } from './archetypeCardComponents/silhouettes/constants';
import { ESTILO_COMPONENT_ID } from './archetypeCardComponents/estilos/constants';

interface ArchetypeAxisSlotProps {
  config: ArchetypeAxisConfig;
  state: ArchetypeAxisState;
  onChangeArchetype: (axisId: string, optionIndex: number) => void;
  onChangeSlider: (axisId: string, value: number) => void;
  onChangeColorLeft: (axisId: string, hex: string) => void;
  onChangeColorRight: (axisId: string, hex: string) => void;
  onOpenCustomModal?: (axisId: string) => void;
  onDeactivateAxis?: (axisId: string) => void;
  dragControls?: ReturnType<typeof useDragControls>;
}

const ArchetypeAxisSlot = memo(function ArchetypeAxisSlot({
  config,
  state,
  onChangeArchetype,
  onChangeSlider,
  onChangeColorLeft,
  onChangeColorRight,
  onOpenCustomModal,
  onDeactivateAxis,
  dragControls,
}: ArchetypeAxisSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const customOnly = hasCustomOption(config);
  const isConfigured = state.hasBeenConfigured === true;
  const option = customOnly
    ? config.archetypeOptions.find((o) => o.isCustom)
    : config.archetypeOptions[state.selectedOptionIndex];
  const { colorLeft, colorRight, labelLeft, labelRight } = getAxisDisplayInfo(config, state, option);

  const blendedColor = useMemo(
    () => blendHex(colorLeft, colorRight, state.sliderValue / 100),
    [colorLeft, colorRight, state.sliderValue]
  );

  const gradientStyle = useMemo(
    () => ({ background: `linear-gradient(to right, ${colorLeft}, ${colorRight})` }),
    [colorLeft, colorRight]
  );

  const isActive = isConfigured || isHovered;

  // Eje inactivo: solo botón estilo Explora Arquetipos (sin slider ni colores)
  if (!isConfigured && onOpenCustomModal) {
    return (
      <motion.button
          type="button"
          onClick={() => onOpenCustomModal(config.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden w-full rounded-xl border border-gray-600/50 bg-gray-800/70 p-4 text-left group cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300"
          title={`Configurar ${config.customOptionLabel ?? 'eje'}`}
        >
          <ButtonParticles isHovered={isHovered} color="#6366f1" count={20} intensity="medium" />
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 flex items-start gap-3">
            {dragControls && <DragHandleButton dragControls={dragControls} />}
            <div className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-indigo-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-200 transition-colors">
                  {config.customOptionLabel ?? 'Mi propio eje'}
                </span>
              </div>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                Arquetipo inactivo
              </p>
            </div>
            <motion.div
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                isHovered ? 'bg-indigo-500/20' : 'bg-gray-600/40'
              }`}
              animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 3 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className={`flex items-center justify-center w-full h-full [&_svg]:shrink-0 ${isHovered ? 'text-indigo-400 [&_svg]:!text-inherit' : '[&_svg]:!text-gray-400'}`}>
                <svg className="w-6 h-6 block translate-x-[3px]" fill="none" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </span>
            </motion.div>
          </div>
        </motion.button>
    );
  }

  // Eje activo: slider completo con colores
  return (
    <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border p-4 space-y-3 flex gap-3 transition-all duration-300 ${
          isActive ? 'border-gray-600/50 bg-gray-900/50' : 'border-gray-600/50 bg-gray-700/50 opacity-90'
        }`}
      >
        {dragControls && <DragHandleButton dragControls={dragControls} />}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {customOnly && onOpenCustomModal ? (
              <button
                type="button"
                onClick={() => onOpenCustomModal(config.id)}
                className={`flex-1 min-w-0 rounded-lg border px-3 py-2 text-sm transition-colors text-left font-medium italic ${
                  isActive
                    ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20'
                    : 'border-gray-600/50 bg-gray-600/40 text-gray-400 hover:border-gray-500 hover:bg-gray-600/60 hover:text-gray-300'
                }`}
                title={`Abrir ${config.customOptionLabel ?? 'personalización'}`}
              >
                {config.customOptionLabel ?? 'Mi propio eje'}
              </button>
            ) : (
              <>
                <label className="sr-only">Eje arquetipo</label>
                <select
                  value={state.selectedOptionIndex}
                  onChange={(e) => onChangeArchetype(config.id, Number(e.target.value))}
                  className="flex-1 min-w-0 rounded-lg border border-gray-600 bg-gray-800/80 px-2 py-1.5 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {config.archetypeOptions.map((opt, i) => (
                    <option key={opt.versionId} value={i}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {isConfigured && onDeactivateAxis && (
              <button
                type="button"
                onClick={() => onDeactivateAxis(config.id)}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
                title="Desactivar eje"
                aria-label="Desactivar eje"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </button>
            )}
          </div>

          <div className={`flex items-center gap-2 transition-opacity duration-300 ${!isActive ? 'opacity-60' : ''}`}>
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <input
                type="color"
                value={colorLeft}
                onChange={(e) => onChangeColorLeft(config.id, e.target.value)}
                className="w-7 h-7 rounded border border-gray-500/50 cursor-pointer bg-transparent"
                title="Color extremo izquierdo"
              />
              <span className="text-[10px] text-gray-400 text-center whitespace-nowrap" title={labelLeft}>
                {labelLeft}
              </span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="relative h-6 flex items-center">
                <div
                  className="absolute inset-x-0 h-2 rounded-full"
                  style={gradientStyle}
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.sliderValue}
                  onChange={(e) => onChangeSlider(config.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-400 shadow pointer-events-none"
                  style={{ left: `calc(${state.sliderValue}% - 8px)` }}
                />
              </div>
              <div className="flex justify-end items-center">
                <span
                  className="w-5 h-5 rounded border border-white/20 shrink-0"
                  style={{ backgroundColor: blendedColor }}
                  title={blendedColor}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <input
                type="color"
                value={colorRight}
                onChange={(e) => onChangeColorRight(config.id, e.target.value)}
                className="w-7 h-7 rounded border border-gray-500/50 cursor-pointer bg-transparent"
                title="Color extremo derecho"
              />
              <span className="text-[10px] text-gray-400 text-center whitespace-nowrap" title={labelRight}>
                {labelRight}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
  );
});

interface ReorderAxisItemProps {
  axisId: string;
  config: ArchetypeAxisConfig;
  state: ArchetypeAxisState;
  onChangeArchetype: (axisId: string, optionIndex: number) => void;
  onChangeSlider: (axisId: string, value: number) => void;
  onChangeColorLeft: (axisId: string, hex: string) => void;
  onChangeColorRight: (axisId: string, hex: string) => void;
  onOpenCustomModal?: (axisId: string) => void;
  onDeactivateAxis?: (axisId: string) => void;
}

function ReorderAxisItem({
  axisId,
  config,
  state,
  onChangeArchetype,
  onChangeSlider,
  onChangeColorLeft,
  onChangeColorRight,
  onOpenCustomModal,
  onDeactivateAxis,
}: ReorderAxisItemProps) {
  const dragControls = useDragControls();
  const hasCustomOption = config.archetypeOptions.some((o) => o.isCustom);
  return (
    <Reorder.Item
      value={axisId}
      dragListener={false}
      dragControls={dragControls}
    >
      <ArchetypeAxisSlot
        config={config}
        state={state}
        onChangeArchetype={onChangeArchetype}
        onChangeSlider={onChangeSlider}
        onChangeColorLeft={onChangeColorLeft}
        onChangeColorRight={onChangeColorRight}
        onOpenCustomModal={hasCustomOption ? onOpenCustomModal : undefined}
        onDeactivateAxis={hasCustomOption ? onDeactivateAxis : undefined}
        dragControls={dragControls}
      />
    </Reorder.Item>
  );
}

interface ArchetypeAxesColumnProps {
  /** ID de la tarjeta seleccionada (para mantener estado por tarjeta). Por ahora opcional. */
  selectedCardId?: string | null;
  /** Callback cuando cambia el estado de los ejes (para sincronizar con la columna central). */
  onAxesChange?: (axes: ArchetypeAxisState[]) => void;
  /** Callback con colores, labels y si la paleta está activa (algún eje configurado). */
  onBlendedColorsChange?: (colors: string[], labels: string[], isPaletteActive: boolean) => void;
  /** Estado de ejes por tarjeta (controlado, para persistir entre navegaciones). */
  axesByCard?: Record<string, ArchetypeAxisState[]>;
  setAxesByCard?: React.Dispatch<React.SetStateAction<Record<string, ArchetypeAxisState[]>>>;
  /** Orden de ejes por tarjeta (controlado). */
  axisOrderByCard?: Record<string, string[]>;
  setAxisOrderByCard?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  /** Para el modal de Identidad: ordenar criaturas por preselected, SuperMatch/Match, Mismatch. */
  creatureOrderContext?: {
    preselectedCharacterId: number | null;
    superMatchIds: number[];
    matchIds: number[];
    mismatchIds: number[];
  };
  /** Para el modal de Identidad (siluetas): ordenar por preselected, SuperMatch/Match, Mismatch. */
  silhouetteOrderContext?: {
    preselectedSilhouetteId: number | null;
    superMatchIds: number[];
    matchIds: number[];
    mismatchIds: number[];
  };
  /** Para el modal de Estilo (Cómo): ordenar por preselected, SuperMatch/Match, Mismatch. */
  estiloOrderContext?: {
    preselectedEstiloId: number | null;
    superMatchIds: number[];
    matchIds: number[];
    mismatchIds: number[];
  };
  /** Orden de ejes por defecto cuando no hay entrada en axisOrderByCard. Si no se pasa, usa DEFAULT_AXIS_ORDER. */
  defaultAxisOrder?: string[];
}

const configById = AXIS_CONFIG_BY_ID;

export function ArchetypeAxesColumn({
  selectedCardId,
  onAxesChange,
  onBlendedColorsChange,
  axesByCard: axesByCardProp,
  setAxesByCard: setAxesByCardProp,
  axisOrderByCard: axisOrderByCardProp,
  setAxisOrderByCard: setAxisOrderByCardProp,
  creatureOrderContext,
  silhouetteOrderContext,
  estiloOrderContext,
  defaultAxisOrder,
}: ArchetypeAxesColumnProps) {
  const [axesByCardInternal, setAxesByCardInternal] = useState<Record<string, ArchetypeAxisState[]>>({});
  const [axisOrderByCardInternal, setAxisOrderByCardInternal] = useState<Record<string, string[]>>({});
  const [customModalAxisId, setCustomModalAxisId] = useState<string | null>(null);
  const axesByCard = axesByCardProp ?? axesByCardInternal;
  const setAxesByCard = setAxesByCardProp ?? setAxesByCardInternal;
  const axisOrderByCard = axisOrderByCardProp ?? axisOrderByCardInternal;
  const setAxisOrderByCard = setAxisOrderByCardProp ?? setAxisOrderByCardInternal;
  const rawFromCard = selectedCardId ? axesByCard[selectedCardId] : undefined;
  const rawAxesState =
    rawFromCard && rawFromCard.length > 0 ? rawFromCard : getPhase2InitialAxisState();

  const axesState = useMemo(() => {
    return rawAxesState.map((s) => {
      const cfg = configById.get(s.axisId);
      if (!cfg || !hasCustomOption(cfg)) return s;
      const customIdx = getCustomOptionIndex(cfg);
      if (customIdx < 0 || s.selectedOptionIndex === customIdx) return s;
      return { ...s, selectedOptionIndex: customIdx };
    });
  }, [rawAxesState]);

  useEffect(() => {
    if (!selectedCardId) return;
    // No migrar [] a getPhase2InitialAxisState: mantener [] para que el fondo use
    // el fallback de Fase 1 (Firmamento #48106a) y replique las condiciones de Fase 1
    const needsMigration = rawAxesState.some((s) => {
      const cfg = configById.get(s.axisId);
      if (!cfg || !hasCustomOption(cfg)) return false;
      const customIdx = getCustomOptionIndex(cfg);
      return customIdx >= 0 && s.selectedOptionIndex !== customIdx;
    });
    if (needsMigration) {
      setAxesByCard((prev) => {
        const current =
          (prev[selectedCardId]?.length ?? 0) > 0
            ? prev[selectedCardId]!
            : getPhase2InitialAxisState();
        const migrated = current.map((s) => {
          const cfg = configById.get(s.axisId);
          if (!cfg || !hasCustomOption(cfg)) return s;
          const customIdx = getCustomOptionIndex(cfg);
          if (customIdx < 0 || s.selectedOptionIndex === customIdx) return s;
          return { ...s, selectedOptionIndex: customIdx };
        });
        return { ...prev, [selectedCardId]: migrated };
      });
    }
  }, [selectedCardId, rawAxesState, axesByCard, setAxesByCard]);
  const fallbackOrder = defaultAxisOrder ?? DEFAULT_AXIS_ORDER;
  const axisOrder = selectedCardId
    ? axisOrderByCard[selectedCardId] ?? fallbackOrder
    : fallbackOrder;

  const getState = useCallback(
    (axisId: string) => axesState.find((s) => s.axisId === axisId) ?? { axisId, selectedOptionIndex: 0, sliderValue: 50 },
    [axesState]
  );

  const updateState = useCallback(
    (updater: (prev: ArchetypeAxisState[]) => ArchetypeAxisState[]) => {
      if (!selectedCardId) return;
      setAxesByCard((prev) => {
        // Si axes está vacío ([]), usar getPhase2InitialAxisState como base para editar
        const current =
          (prev[selectedCardId]?.length ?? 0) > 0
            ? prev[selectedCardId]!
            : getPhase2InitialAxisState();
        const next = updater(current);
        onAxesChange?.(next);
        return { ...prev, [selectedCardId]: next };
      });
    },
    [selectedCardId, setAxesByCard, onAxesChange]
  );

  const handleArchetypeChange = useCallback(
    (axisId: string, optionIndex: number) => {
      const config = configById.get(axisId);
      const option = config?.archetypeOptions[optionIndex];
      const custom = isCustomOption(option);

      updateState((prev) => {
        const defaultSlider = option?.defaultSliderValue;
        return prev.map((s) =>
          s.axisId === axisId
            ? {
                ...s,
                selectedOptionIndex: optionIndex,
                ...(defaultSlider !== undefined && { sliderValue: defaultSlider }),
                hasBeenConfigured: true,
              }
            : s
        );
      });

      if (custom) setCustomModalAxisId(axisId);
    },
    [updateState]
  );

  const handleSliderChange = useCallback(
    (axisId: string, value: number) => {
      updateState((prev) =>
        prev.map((s) => (s.axisId === axisId ? { ...s, sliderValue: value } : s))
      );
    },
    [updateState]
  );

  const handleColorLeftChange = useCallback(
    (axisId: string, hex: string) => {
      updateState((prev) =>
        prev.map((s) => (s.axisId === axisId ? { ...s, colorLeft: hex } : s))
      );
    },
    [updateState]
  );

  const handleColorRightChange = useCallback(
    (axisId: string, hex: string) => {
      updateState((prev) =>
        prev.map((s) => (s.axisId === axisId ? { ...s, colorRight: hex } : s))
      );
    },
    [updateState]
  );

  const handleCustomAxisSave = useCallback(
    (axisId: string, updates: Partial<ArchetypeAxisState>) => {
      updateState((prev) =>
        prev.map((s) => (s.axisId === axisId ? { ...s, ...updates } : s))
      );
      setCustomModalAxisId(null);
    },
    [updateState]
  );

  const handleDeactivateAxis = useCallback(
    (axisId: string) => {
      updateState((prev) =>
        prev.map((s) => (s.axisId === axisId ? { ...s, hasBeenConfigured: false } : s))
      );
    },
    [updateState]
  );

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      if (!selectedCardId) return;
      setAxisOrderByCard((prev) => ({ ...prev, [selectedCardId]: newOrder }));
    },
    [selectedCardId, setAxisOrderByCard]
  );

  const blendedColorsAndLabels = useMemo(() => {
    const result: { color: string; label: string; configured: boolean }[] = [];
    for (const axisId of axisOrder.slice(0, 4)) {
      const config = configById.get(axisId);
      const state = axesState.find((s) => s.axisId === axisId);
      if (!config || !state) continue;
      const option = config.archetypeOptions[state.selectedOptionIndex];
      const { colorLeft, colorRight, labelLeft, labelRight } = getAxisDisplayInfo(config, state, option);
      const color = blendHex(colorLeft, colorRight, state.sliderValue / 100);
      const configured = state.hasBeenConfigured === true;
      result.push({
        color,
        label: state.sliderValue <= 50 ? labelLeft : labelRight,
        configured,
      });
    }
    return result;
  }, [axisOrder, axesState]);

  const paletteOutput = useMemo(() => {
    const configuredCount = blendedColorsAndLabels.filter((r) => r.configured).length;
    if (configuredCount === 0) {
      // Sin ejes configurados: paleta gris para reflejar estado inactivo
      return {
        colors: INACTIVE_PALETTE.slice(0, 4),
        labels: ['—', '—', '—', '—'],
        isPaletteActive: false,
      };
    }
    const { colors, labels } = buildPaletteWithAnalogous(blendedColorsAndLabels);
    return {
      colors,
      labels,
      isPaletteActive: true,
    };
  }, [blendedColorsAndLabels]);

  useEffect(() => {
    onBlendedColorsChange?.(
      paletteOutput.colors,
      paletteOutput.labels,
      paletteOutput.isPaletteActive
    );
  }, [paletteOutput, onBlendedColorsChange]);

  const configuredCount = useMemo(
    () => blendedColorsAndLabels.filter((r) => r.configured).length,
    [blendedColorsAndLabels]
  );

  const modalConfig = customModalAxisId ? configById.get(customModalAxisId) : null;
  const modalState = customModalAxisId ? getState(customModalAxisId) : null;

  const preselectedCreatureVersionId = useMemo(() => {
    if (!modalConfig || modalConfig.componentId !== CREATURE_COMPONENT_ID) return undefined;
    const creatureState = axesState.find(
      (s) => AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === CREATURE_COMPONENT_ID
    );
    if (creatureState?.hasBeenConfigured) {
      const comp = getComponentStateFromAxes(
        CREATURE_COMPONENT_ID,
        axesState,
        axisOrder
      );
      return comp.versionId !== 'custom' && comp.versionId !== 'default'
        ? comp.versionId
        : undefined;
    }
    return creatureOrderContext?.preselectedCharacterId != null
      ? String(creatureOrderContext.preselectedCharacterId)
      : undefined;
  }, [modalConfig, axesState, axisOrder, creatureOrderContext?.preselectedCharacterId]);

  const preselectedSilhouetteVersionId = useMemo(() => {
    if (!modalConfig || modalConfig.componentId !== SILHOUETTE_COMPONENT_ID) return undefined;
    const silhouetteState = axesState.find(
      (s) => AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === SILHOUETTE_COMPONENT_ID
    );
    if (silhouetteState?.hasBeenConfigured) {
      const comp = getComponentStateFromAxes(
        SILHOUETTE_COMPONENT_ID,
        axesState,
        axisOrder
      );
      return comp.versionId !== 'custom' && comp.versionId !== 'default'
        ? comp.versionId
        : undefined;
    }
    return silhouetteOrderContext?.preselectedSilhouetteId != null
      ? String(silhouetteOrderContext.preselectedSilhouetteId)
      : undefined;
  }, [modalConfig, axesState, axisOrder, silhouetteOrderContext?.preselectedSilhouetteId]);

  const preselectedEstiloVersionId = useMemo(() => {
    if (!modalConfig || modalConfig.componentId !== ESTILO_COMPONENT_ID) return undefined;
    const estiloState = axesState.find(
      (s) => AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId === ESTILO_COMPONENT_ID
    );
    if (estiloState?.hasBeenConfigured) {
      const comp = getComponentStateFromAxes(
        ESTILO_COMPONENT_ID,
        axesState,
        axisOrder
      );
      return comp.versionId !== 'custom' && comp.versionId !== 'default'
        ? comp.versionId
        : undefined;
    }
    return estiloOrderContext?.preselectedEstiloId != null
      ? String(estiloOrderContext.preselectedEstiloId)
      : undefined;
  }, [modalConfig, axesState, axisOrder, estiloOrderContext?.preselectedEstiloId]);

  return (
    <>
      <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
      <h3 className="text-sm font-medium text-gray-300 mb-4">
        Arquetipos
        <span className="block text-xs font-normal text-gray-500 mt-0.5">
          {configuredCount === 0 ? 'Los ejes están inactivos. Configura uno para activar la paleta.' : 'Arrastra para reordenar'}
        </span>
      </h3>
      {!selectedCardId ? (
        <p className="text-xs text-gray-500">Selecciona una tarjeta para editar sus ejes.</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={axisOrder}
          onReorder={handleReorder}
          className="space-y-4 flex flex-col"
        >
          {axisOrder.map((axisId) => {
            const config = configById.get(axisId);
            if (!config) return null;
            return (
              <ReorderAxisItem
                key={axisId}
                axisId={axisId}
                config={config}
                state={getState(config.id)}
                onChangeArchetype={handleArchetypeChange}
                onChangeSlider={handleSliderChange}
                onChangeColorLeft={handleColorLeftChange}
                onChangeColorRight={handleColorRightChange}
                onOpenCustomModal={setCustomModalAxisId}
                onDeactivateAxis={handleDeactivateAxis}
              />
            );
          })}
        </Reorder.Group>
      )}
    </div>

      {modalConfig && modalState && (
        <CustomAxisModal
          isOpen={!!customModalAxisId}
          onClose={() => setCustomModalAxisId(null)}
          config={modalConfig}
          state={modalState}
          onSave={(updates) => customModalAxisId && handleCustomAxisSave(customModalAxisId, updates)}
          creatureOrderContext={
            modalConfig?.componentId === CREATURE_COMPONENT_ID ? creatureOrderContext : undefined
          }
          silhouetteOrderContext={
            modalConfig?.componentId === SILHOUETTE_COMPONENT_ID ? silhouetteOrderContext : undefined
          }
          estiloOrderContext={
            modalConfig?.componentId === ESTILO_COMPONENT_ID ? estiloOrderContext : undefined
          }
          preselectedCreatureVersionId={preselectedCreatureVersionId}
          preselectedSilhouetteVersionId={preselectedSilhouetteVersionId}
          preselectedEstiloVersionId={preselectedEstiloVersionId}
        />
      )}
    </>
  );
}
