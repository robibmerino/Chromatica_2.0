import { useMemo, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { X, Pencil, Trash2, Download } from 'lucide-react';
import { blendHex } from '../../utils/colorUtils';
import { cn } from '../../utils/cn';
import { TinderCardPreview } from './TinderCardPreview';
import {
  CharacterLabelFromEffectiveId,
  CharacterLabelBelowCard,
} from './QuienTinderCards/CharacterLabel';
import type { QuienTinderCardData } from './QuienTinderCards';
import type { QuienSilhouetteCardData, QuienSilhouetteId } from './QuienSilhouettes';
import type { ComoEstiloCardData, ComoEstiloId } from './ComoEstilos';
import {
  SILHOUETTE_LABELS,
  SILHOUETTE_SUBTITLES,
  SILHOUETTE_LABEL_VARIANTS,
} from './QuienSilhouettes';
import {
  ESTILO_LABELS,
  ESTILO_SUBTITLES,
  ESTILO_LABEL_VARIANTS,
} from './ComoEstilos';
import {
  getEffectiveCharacterId,
  getEffectiveSilhouetteId,
  getEffectiveEstiloId,
} from './archetypeAxesConfig';
import {
  AXIS_CONFIG_BY_ID,
  getFallbackAxisOrder,
  getComponentStateFromAxes,
} from './archetypeAxesConfig';
import type { ArchetypeAxisConfig } from './archetypeAxesTypes';
import { getBackgroundMetadata } from './archetypeCardComponents/backgrounds';
import { getFamiliarMetadata } from './archetypeCardComponents/familiares';
import { getHerramientaMetadata } from './archetypeCardComponents/herramientas';
import { getInspiracionMetadata } from './archetypeCardComponents/inspiracion';
import { getEstiloMetadata } from './archetypeCardComponents/estilos';
import { getAtmosphereMetadata } from './archetypeCardComponents/atmospheres';
import { getAxisDisplayInfo, hasCustomOption } from './archetypeAxesUtils';
import type { ArchetypeAxisState } from './archetypeAxesTypes';
import type { ColumnFlowState } from './ArchetypesCreator';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { COLUMN_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { QuienTinderErrorBoundary } from './QuienTinderErrorBoundary';
import { PaletteBar } from './PaletteBar';
import {
  applyColumnSummaryCloneLayoutFixes,
  COLUMN_SUMMARY_PNG_CAPTURE_ID,
  injectArchetypeSummaryPngExportStyles,
  sanitizeHtml2CanvasCaptureSubtree,
} from './archetypeSummaryPngExport';

interface ColumnSummaryModalProps {
  columnKey: ColumnKey;
  contentColumnKey: ColumnKey;
  flowState: ColumnFlowState;
  paletteColors: string[];
  paletteLabels?: string[];
  isPaletteActive?: boolean;
  onClose: () => void;
  onEditar: () => void;
  /** Restablece la columna (Quién / Qué / Cómo) como si no se hubiera usado. */
  onBorrar: () => void;
}

function sortMatchedCards(matched: ColumnFlowState['matchedCards']) {
  return [...matched].sort((a, b) =>
    a.direction === 'up' && b.direction === 'right'
      ? -1
      : a.direction === 'right' && b.direction === 'up'
        ? 1
        : a.card.id.localeCompare(b.card.id)
  );
}

const LEFT_COLUMN_MAX_WIDTH = 'max-w-[340px]';

/** Etiqueta de eje para el resumen: Identidad, Contexto, Esencia/Herramienta, Atmósfera. */
const AXIS_DISPLAY_LABELS: Record<string, string> = {
  'axis-background': 'Contexto',
  'axis-2': 'Esencia',
  'axis-2-herramientas': 'Herramienta',
  'axis-2-inspiracion': 'Inspiración',
  'axis-3': 'Identidad',
  'axis-3-silhouette': 'Identidad',
  'axis-3-estilo': 'Estilo',
  'axis-4': 'Atmósfera',
};

function getAxisDisplayLabel(configId: string, configLabel: string): string {
  return AXIS_DISPLAY_LABELS[configId] ?? configLabel;
}

const METADATA_GETTERS = {
  background: getBackgroundMetadata,
  'accesorio-2': getFamiliarMetadata,
  herramientas: getHerramientaMetadata,
  inspiracion: getInspiracionMetadata,
  estilo: getEstiloMetadata,
  atmosphere: getAtmosphereMetadata,
} as const;

function getComponentVariantName(
  componentId: keyof typeof METADATA_GETTERS,
  versionId: string | undefined,
  baseVersionId: string | undefined,
  customFallback: string,
  metadataFallback: string
): string {
  if (versionId === 'custom' && baseVersionId && baseVersionId !== 'custom') {
    return METADATA_GETTERS[componentId](baseVersionId)?.name ?? customFallback;
  }
  if (versionId === 'custom' || versionId === 'default' || !versionId) {
    return customFallback;
  }
  return METADATA_GETTERS[componentId](versionId)?.name ?? metadataFallback;
}

/** Etiqueta con color de fondo para variantes y paleta. Exportada para el resumen global. */
export function ColorTag({
  label,
  color,
  size = 'xs',
}: {
  label: string;
  color: string;
  size?: 'xs' | 'sm';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full py-1 shrink-0 font-medium border border-white/20 box-border max-w-full',
        size === 'xs' && 'text-xs px-2',
        size === 'sm' && 'text-sm px-2.5 font-semibold'
      )}
      style={{ backgroundColor: `${color}40`, color }}
    >
      <span className="relative z-[1] max-w-full leading-tight">{label}</span>
    </span>
  );
}

/** Devuelve las etiquetas (variantes de ejes + paleta) como en el resumen individual, para reutilizar en el resumen global. */
export function getSummaryTagsForColumn(
  flowState: ColumnFlowState,
  contentColumnKey: ColumnKey,
  selectedCard: NonNullable<ColumnFlowState['selectedCard']>,
  fallbackAxisOrder: string[],
  paletteColors: string[],
  paletteLabels?: string[]
): {
  axisVariants: { label: string; color: string }[];
  paletteColorsSlice: string[];
  paletteLabelsSlice: string[];
} {
  const axesState = flowState.axesByCard[selectedCard.card.id] ?? [];
  const axisOrder = flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder;
  const accessoryId =
    contentColumnKey === 'que' ? 'herramientas' : contentColumnKey === 'como' ? 'estilo' : 'accesorio-2';
  const componentIds = ['background', accessoryId, 'atmosphere'] as const;
  const axisVariants: { label: string; color: string }[] = [];
  for (const componentId of componentIds) {
    const componentState = getComponentStateFromAxes(componentId, axesState, axisOrder);
    const axisConfig = [...AXIS_CONFIG_BY_ID.values()].find((c) => c.componentId === componentId);
    if (!axisConfig) continue;
    const axisState = axesState.find((s) => s.axisId === axisConfig.id);
    if (!axisState?.hasBeenConfigured) continue;
    const customFallback = axisConfig.customOptionLabel ?? axisConfig.label;
    const variantName = getComponentVariantName(
      componentId,
      componentState.versionId,
      axisState.customVersionId ?? componentState.versionId,
      customFallback,
      axisConfig.label
    );
    axisVariants.push({ label: variantName, color: componentState.blendedColor });
  }
  return {
    axisVariants,
    paletteColorsSlice: paletteColors.slice(0, 4),
    paletteLabelsSlice: paletteLabels?.slice(0, 4) ?? [],
  };
}

/** Caja de color con etiqueta para los extremos del eje. */
function AxisColorBox({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0 min-w-[4rem]">
      <div
        className="w-6 h-6 rounded-md border-2 border-white/30 shrink-0"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-xs font-semibold text-gray-300 text-center leading-tight max-w-[5rem]">
        {label}
      </span>
    </div>
  );
}

/** Eje en modo solo lectura para el resumen. */
function SummaryAxisSlot({
  config,
  state,
}: {
  config: ArchetypeAxisConfig;
  state: ArchetypeAxisState;
}) {
  const customOnly = hasCustomOption(config);
  const isConfigured = state.hasBeenConfigured === true;
  const option = customOnly
    ? config.archetypeOptions.find((o) => o.isCustom)
    : config.archetypeOptions[state.selectedOptionIndex];
  const { colorLeft, colorRight, labelLeft, labelRight } = getAxisDisplayInfo(
    config,
    state,
    option
  );
  const blendedColor = useMemo(
    () => blendHex(colorLeft, colorRight, state.sliderValue / 100),
    [colorLeft, colorRight, state.sliderValue]
  );
  const axisLabel = getAxisDisplayLabel(config.id, config.label);

  if (!isConfigured) return null;

  return (
    <div className="column-summary-png-axis-slot rounded-xl border border-gray-600/50 bg-gray-800/50 p-4 space-y-3">
      <p className="column-summary-png-axis-label text-[10px] text-gray-400">{axisLabel}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <AxisColorBox color={colorLeft} label={labelLeft} />
          <div className="flex-1 min-w-0 relative flex items-center">
            <div
              className="column-summary-png-axis-track w-full h-3 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${colorLeft}, ${colorRight})`,
              }}
              aria-hidden
            />
            {/* Indicador de posición */}
            <div
              className="column-summary-png-axis-thumb absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
              style={{
                left: `clamp(0px, calc(${state.sliderValue}% - 10px), calc(100% - 20px))`,
                backgroundColor: blendedColor,
              }}
              title={`Posición: ${state.sliderValue}%`}
            />
          </div>
          <AxisColorBox color={colorRight} label={labelRight} />
        </div>
      </div>
    </div>
  );
}

export function ColumnSummaryModal({
  columnKey,
  contentColumnKey,
  flowState,
  paletteColors,
  paletteLabels,
  isPaletteActive = true,
  onClose,
  onEditar,
  onBorrar,
}: ColumnSummaryModalProps) {
  const sortedMatched = useMemo(
    () => sortMatchedCards(flowState.matchedCards),
    [flowState.matchedCards]
  );
  const selectedCard = flowState.selectedCard ?? sortedMatched[0];
  const config = COLUMN_BUTTON_CONFIG[columnKey];

  // Intercambio: contentColumnKey 'que' = Quién (Herramientas), 'quien' = Qué (Esencia), 'como' = Cómo (Estilo)
  const fallbackAxisOrder = getFallbackAxisOrder(contentColumnKey);
  const axesForCard = useMemo(() => {
    if (!selectedCard) return [];
    const rawAxes = flowState.axesByCard[selectedCard.card.id] ?? [];
    const order = flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder;
    const byId = new Map(rawAxes.map((a) => [a.axisId, a]));
    return order
      .map((id) => {
        const cfg = AXIS_CONFIG_BY_ID.get(id);
        const st = byId.get(id);
        return cfg && st ? { config: cfg, state: st } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [selectedCard, flowState.axesByCard, flowState.axisOrderByCard, fallbackAxisOrder]);

  const effectiveCharId =
    contentColumnKey === 'quien' &&
    selectedCard &&
    'characterId' in selectedCard.card
      ? getEffectiveCharacterId(
          selectedCard.card as QuienTinderCardData,
          flowState.axesByCard[selectedCard.card.id] ?? [],
          flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder
        )
      : null;

  const effectiveSilhouetteId =
    contentColumnKey === 'que' &&
    selectedCard &&
    'silhouetteId' in selectedCard.card
      ? getEffectiveSilhouetteId(
          selectedCard.card as QuienSilhouetteCardData,
          flowState.axesByCard[selectedCard.card.id] ?? [],
          flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder
        )
      : null;

  const effectiveEstiloId =
    contentColumnKey === 'como' &&
    selectedCard &&
    'estiloId' in selectedCard.card
      ? getEffectiveEstiloId(
          selectedCard.card as ComoEstiloCardData,
          flowState.axesByCard[selectedCard.card.id] ?? [],
          flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder
        )
      : null;

  const axisVariants = useMemo(() => {
    if (!selectedCard) return [];
    const axesState = flowState.axesByCard[selectedCard.card.id] ?? [];
    const axisOrder = flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder;
    // contentColumnKey 'que' = Herramientas, 'quien' = Esencia (accesorio-2), 'como' = Estilo
    const accessoryId =
      contentColumnKey === 'que' ? 'herramientas' : contentColumnKey === 'como' ? 'estilo' : 'accesorio-2';
    const componentIds = ['background', accessoryId, 'atmosphere'] as const;
    const result: { label: string; color: string }[] = [];
    for (const componentId of componentIds) {
      const componentState = getComponentStateFromAxes(componentId, axesState, axisOrder);
      const axisConfig = [...AXIS_CONFIG_BY_ID.values()].find((c) => c.componentId === componentId);
      if (!axisConfig) continue;
      const axisState = axesState.find((s) => s.axisId === axisConfig.id);
      if (!axisState?.hasBeenConfigured) continue;
      const customFallback = axisConfig.customOptionLabel ?? axisConfig.label;
      const variantName = getComponentVariantName(
        componentId,
        componentState.versionId,
        axisState.customVersionId ?? componentState.versionId,
        customFallback,
        axisConfig.label
      );
      result.push({ label: variantName, color: componentState.blendedColor });
    }
    return result;
  }, [selectedCard, flowState.axesByCard, flowState.axisOrderByCard, contentColumnKey, fallbackAxisOrder]);

  const paletteSlice = paletteColors.slice(0, 4);
  const paletteLabelsSlice = paletteLabels?.slice(0, 4);

  const captureRef = useRef<HTMLDivElement>(null);
  const downloadInFlightRef = useRef(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPng = useCallback(async () => {
    const el = captureRef.current;
    if (!el || downloadInFlightRef.current) return;
    downloadInFlightRef.current = true;
    setIsDownloadingPng(true);
    setDownloadError(null);

    const motionShell = el.parentElement as HTMLElement | null;
    const prevTransition = motionShell?.style.transition ?? '';
    const prevWillChange = motionShell?.style.willChange ?? '';

    if (motionShell) {
      motionShell.style.transition = 'none';
      motionShell.style.willChange = 'auto';
      motionShell.style.setProperty('transform', 'none', 'important');
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#111827',
        useCORS: true,
        allowTaint: false,
        logging: false,
        foreignObjectRendering: false,
        ignoreElements: (node) =>
          node instanceof HTMLElement && node.dataset.exportSkip === 'true',
        onclone: (clonedDoc) => {
          injectArchetypeSummaryPngExportStyles(clonedDoc, {
            rootId: COLUMN_SUMMARY_PNG_CAPTURE_ID,
            styleElementId: 'column-summary-export-snapshot-css',
            cssOptions: {
              tagWrapMaxWidth: '100%',
              columnModalCapture: true,
            },
          });
          sanitizeHtml2CanvasCaptureSubtree(clonedDoc, COLUMN_SUMMARY_PNG_CAPTURE_ID);
          applyColumnSummaryCloneLayoutFixes(clonedDoc, COLUMN_SUMMARY_PNG_CAPTURE_ID);
        },
      });

      if (canvas.width < 2 || canvas.height < 2) {
        throw new Error('Captura vacía');
      }

      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const fileName = `chromatica-resumen-seleccion-${columnKey}-${stamp}.png`;

      const blob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1);
      });
      if (!blob || blob.size < 24) {
        throw new Error('PNG inválido');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 2500);
    } catch (e) {
      console.error('Export PNG resumen columna:', e);
      const detail = e instanceof Error ? e.message : String(e);
      setDownloadError(
        `No se pudo generar el PNG (${detail}). Vuelve a intentarlo; si persiste, prueba con Chrome o Edge actualizado.`
      );
    } finally {
      if (motionShell) {
        motionShell.style.removeProperty('transform');
        motionShell.style.transition = prevTransition;
        motionShell.style.willChange = prevWillChange;
      }
      downloadInFlightRef.current = false;
      setIsDownloadingPng(false);
    }
  }, [columnKey]);

  if (!selectedCard) {
    // Fallback: sin tarjetas con match, ofrecer ir a editar (fase 2) en vez de pantalla vacía
    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-gray-600/60 bg-gray-900 p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-400 mb-6">
              No hay datos de selección guardados. Puedes empezar de nuevo para crear tu paleta.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={onEditar}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
              >
                Ir a editar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700/50 text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden
          onClick={onClose}
        />
        <QuienTinderErrorBoundary
          fallback={
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-600/60 bg-gray-900 p-8 text-center shadow-2xl">
              <p className="text-amber-400 font-medium mb-2">Error al cargar el resumen</p>
              <p className="text-gray-400 text-sm mb-6">Recarga la página o cierra para volver.</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          }
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[95vh] min-h-[85vh] flex flex-col shadow-2xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            id={COLUMN_SUMMARY_PNG_CAPTURE_ID}
            ref={captureRef}
            className="column-summary-png-capture-root flex flex-col flex-1 min-h-0 w-full h-full overflow-hidden rounded-2xl border border-gray-600/60 bg-gradient-to-b from-gray-900 via-gray-900/98 to-gray-900 ring-2 ring-white/5"
          >
          {downloadError && (
            <div className="shrink-0 mx-4 mt-3 rounded-xl border border-red-500/35 bg-red-950/50 px-4 py-3 flex items-start justify-between gap-3">
              <p className="text-xs text-red-100 leading-relaxed">{downloadError}</p>
              <button
                type="button"
                onClick={() => setDownloadError(null)}
                className="shrink-0 text-xs font-medium text-red-200 hover:text-white underline-offset-2 hover:underline"
              >
                Cerrar aviso
              </button>
            </div>
          )}
          {/* Header */}
          <div className="archetypes-png-header shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-700/60 bg-gray-800/30">
            <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
              <span
                className={`flex shrink-0 w-10 h-10 rounded-xl items-center justify-center ${config.iconBg}`}
              >
                <span className={config.iconColor}>{config.icon}</span>
              </span>
              <div className="min-w-0 archetypes-png-header-title">
                <h2 className="text-lg font-semibold text-white truncate">
                  Resumen de tu selección
                </h2>
                <p className="text-sm text-gray-400">{config.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0" data-export-skip="true">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isDownloadingPng}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-600 text-sm text-gray-200 hover:bg-gray-800 hover:border-gray-500 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <Download className="w-4 h-4 shrink-0" aria-hidden />
                {isDownloadingPng ? 'Generando…' : 'PNG'}
              </button>
              <button
                type="button"
                onClick={onEditar}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={onBorrar}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/45 text-red-300 hover:bg-red-500/10 text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Borrar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: dos columnas horizontales (vertical en móvil) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Columna izquierda: Tarjeta */}
            <div className="shrink-0 md:w-[380px] md:min-w-[320px] flex flex-col items-center justify-center p-6 md:border-r border-b md:border-b-0 border-gray-700/60 bg-gray-800/20">
              <div className="column-summary-png-no-lift flex flex-col items-center w-full -translate-y-4">
                <h3 className="column-summary-png-section-h3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 self-start">
                  Tu tarjeta
                </h3>
                <QuienTinderErrorBoundary fallback={<p className="text-gray-500 text-sm p-4">Error al cargar</p>}>
                <div className="flex flex-col items-center gap-4 w-full">
                  <div
                    className={cn(
                      'column-summary-png-card-frame w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-xl shadow-indigo-500/10',
                      LEFT_COLUMN_MAX_WIDTH
                    )}
                  >
                    <TinderCardPreview
                      card={selectedCard.card}
                      axesState={flowState.axesByCard[selectedCard.card.id] ?? []}
                      axisOrder={flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder}
                      columnKey={contentColumnKey}
                      fullSize
                      hideLabels
                      useDefaultBackgroundUnlessConfigured
                      className="w-full h-full"
                    />
                  </div>
                  {contentColumnKey === 'quien' && effectiveCharId != null && (
                    <CharacterLabelFromEffectiveId
                      effectiveCharId={effectiveCharId}
                      className={cn('w-full', LEFT_COLUMN_MAX_WIDTH)}
                    />
                  )}
                  {contentColumnKey === 'que' &&
                    effectiveSilhouetteId != null &&
                    effectiveSilhouetteId in SILHOUETTE_LABELS && (
                      <CharacterLabelBelowCard
                        title={SILHOUETTE_LABELS[effectiveSilhouetteId as QuienSilhouetteId]}
                        subtitle={SILHOUETTE_SUBTITLES[effectiveSilhouetteId as QuienSilhouetteId] ?? '—'}
                        variant={SILHOUETTE_LABEL_VARIANTS[effectiveSilhouetteId as QuienSilhouetteId] ?? 'slate'}
                        className={cn('w-full', LEFT_COLUMN_MAX_WIDTH)}
                      />
                    )}
                  {contentColumnKey === 'como' &&
                    effectiveEstiloId != null &&
                    effectiveEstiloId in ESTILO_LABELS && (
                      <CharacterLabelBelowCard
                        title={ESTILO_LABELS[effectiveEstiloId as ComoEstiloId]}
                        subtitle={ESTILO_SUBTITLES[effectiveEstiloId as ComoEstiloId] ?? '—'}
                        variant={ESTILO_LABEL_VARIANTS[effectiveEstiloId as ComoEstiloId] ?? 'slate'}
                        className={cn('w-full', LEFT_COLUMN_MAX_WIDTH)}
                      />
                    )}
                  {axisVariants.length > 0 && (
                    <div
                      className={cn(
                        'archetypes-png-tag-wrap flex flex-wrap gap-2 justify-center w-full',
                        LEFT_COLUMN_MAX_WIDTH
                      )}
                    >
                      {axisVariants.map(({ label, color }) => (
                        <ColorTag key={label} label={label} color={color} />
                      ))}
                    </div>
                  )}
                  {paletteSlice.length >= 4 && (
                    <div
                      className={cn(
                        'archetypes-png-tag-wrap flex flex-wrap gap-2 justify-center w-full',
                        LEFT_COLUMN_MAX_WIDTH
                      )}
                    >
                      {paletteSlice.map((color, i) => (
                        <ColorTag
                          key={`palette-${i}`}
                          label={paletteLabelsSlice?.[i] ?? '—'}
                          color={color}
                          size="sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </QuienTinderErrorBoundary>
              </div>
            </div>

            {/* Columna derecha: Ejes y selecciones */}
            <div className="flex-1 min-w-0 overflow-y-auto inspiration-scroll-area p-6 space-y-6">
              {/* Ejes personalizados */}
              {axesForCard.some(({ state }) => state.hasBeenConfigured) && (
                <section>
                  <h3 className="column-summary-png-section-h3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Ejes configurados
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {axesForCard.map(({ config: cfg, state }) => (
                      <SummaryAxisSlot key={cfg.id} config={cfg} state={state} />
                    ))}
                  </div>
                </section>
              )}

              {/* Etiquetas de selección (Match/SuperMatch) */}
              {sortedMatched.length > 1 && (
                <section>
                  <h3 className="column-summary-png-section-h3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Tus selecciones
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sortedMatched.map((item) => (
                      <span
                        key={item.card.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          item.direction === 'right'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        }`}
                      >
                        {item.direction === 'right' ? 'Match' : 'SuperMatch'}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Paleta final (mismo formato que paleta vinculada a los ejes) */}
              {paletteSlice.length >= 4 && (
                <section className="column-summary-png-palette-block pt-4 border-t border-gray-600/50">
                  <p className="text-xs text-gray-500 mb-2 text-center">
                    Paleta vinculada a los Arquetipos{!isPaletteActive ? ' (inactiva)' : ''}
                  </p>
                  <div className="palette-bar-png-export w-full">
                    <PaletteBar
                      colors={paletteSlice}
                      labels={paletteLabelsSlice}
                      className="h-10"
                    />
                  </div>
                </section>
              )}
            </div>
          </div>
          </div>
        </motion.div>
        </QuienTinderErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
