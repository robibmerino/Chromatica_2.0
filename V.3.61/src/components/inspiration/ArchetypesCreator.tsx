import { useState, useMemo, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ARCHETYPE_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeShapeButtonConfig';
import { COLUMN_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { ArchetypeColumnCard } from '../GuidedPaletteCreator/ArchetypeColumnCard';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { SwipeDeck, type MatchedCard } from './SwipeDeck';
import {
  DEFAULT_COLUMN_PALETTES,
  NEUTRAL_PALETTE,
  combineColumnPalettes,
  COMBINE_MODE_LABELS,
  COMBINE_MODE_TOOLTIPS,
  COMBINE_MODES,
  type CombineMode,
} from './archetypePaletteUtils';
import { ArchetypeAxesColumn } from './ArchetypeAxesColumn';
import type { ArchetypeAxisState } from './archetypeAxesTypes';
import { QUIEN_CHARACTER_IDS } from './QuienTinderCards';
import { QUIEN_SILHOUETTE_IDS } from './QuienSilhouettes';
import type { QuienSilhouetteCardData } from './QuienSilhouettes';
import { QUIEN_ESTILO_IDS } from './ComoEstilos';
import type { ComoEstiloCardData } from './ComoEstilos';
import type { QuienTinderCardData } from './QuienTinderCards';
import {
  getEffectiveCharacterId,
  getEffectiveSilhouetteId,
  getEffectiveEstiloId,
  getFallbackAxisOrder,
} from './archetypeAxesConfig';
import {
  CharacterLabelFromEffectiveId,
  CharacterLabelBelowCard,
} from './QuienTinderCards/CharacterLabel';
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
import { QuienTinderErrorBoundary } from './QuienTinderErrorBoundary';
import { TinderCardPreview } from './TinderCardPreview';
import { getPhase1AxisState } from './archetypeAxesConfig';
import { PaletteBar } from './PaletteBar';
import { ColumnSummaryModal } from './ColumnSummaryModal';
import { ArchetypesGlobalSummaryModal } from './ArchetypesGlobalSummaryModal';

/** Helper: etiquetas para silueta según ID efectivo. Devuelve null si no hay título. */
function renderSilhouetteLabels(
  effectiveSid: number | null,
  compact = false,
  className = ''
): ReactNode {
  if (effectiveSid == null) return null;
  const title = SILHOUETTE_LABELS[effectiveSid];
  if (title == null) return null;
  return (
    <CharacterLabelBelowCard
      title={title}
      subtitle={SILHOUETTE_SUBTITLES[effectiveSid] ?? '—'}
      variant={SILHOUETTE_LABEL_VARIANTS[effectiveSid] ?? 'slate'}
      compact={compact}
      className={className}
    />
  );
}

const COLUMN_KEYS: ColumnKey[] = ['quien', 'que', 'como'];

/**
 * Intercambio Quién↔Qué: el botón "Quién" usa flow 'que' (siluetas), el botón "Qué" usa flow 'quien' (criaturas).
 * IMPORTANTE para ejes: columnKey 'que' = UI Quién (Herramientas), columnKey 'quien' = UI Qué (Esencia).
 */
function getContentColumnKey(buttonKey: ColumnKey): ColumnKey {
  if (buttonKey === 'quien') return 'que';
  if (buttonKey === 'que') return 'quien';
  return buttonKey;
}

/** Transiciones de ascenso suave (misma sutileza que InspirationMenuPhase). */
const ASCEND_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
/** Fase 1 Tinder: duración algo mayor para compensar carga del SwipeDeck. */
const ASCEND_TRANSITION_TINDER = { ...ASCEND_TRANSITION, duration: 0.45 };
const COLOR_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8] as const;

/** Placeholder de tarjetas para Qué y Cómo (contenido por definir). */
const TINDER_PLACEHOLDER_CARDS = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));

/** Texto del item para el mensaje "no congeniaste" por columna. */
const NO_MATCH_ITEM_LABEL: Record<ColumnKey, string> = {
  quien: 'criatura',
  que: 'silueta',
  como: 'estilo',
};

/** Fisher–Yates shuffle. Devuelve nueva matriz sin mutar la original. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Tarjetas de Quién (contenido Qué): criaturas en orden aleatorio. */
function createQuienTinderCards(): QuienTinderCardData[] {
  return shuffle([...QUIEN_CHARACTER_IDS]).map((characterId) => ({
    id: `quien-char-${characterId}`,
    characterId,
  }));
}

/** Tarjetas de Quién (contenido Quién): siluetas etéreas en orden aleatorio. */
function createQuienSilhouetteCards(): QuienSilhouetteCardData[] {
  return shuffle([...QUIEN_SILHOUETTE_IDS]).map((silhouetteId) => ({
    id: `quien-sil-${silhouetteId}`,
    silhouetteId,
  }));
}

/** Tarjetas de Cómo: estilos en orden aleatorio. */
function createComoEstiloCards(): ComoEstiloCardData[] {
  return shuffle([...QUIEN_ESTILO_IDS]).map((estiloId) => ({
    id: `como-estilo-${estiloId}`,
    estiloId,
  }));
}

/** Helper: etiquetas para estilo según ID efectivo. Devuelve null si no hay título. */
function renderEstiloLabels(
  effectiveEid: number | null,
  compact = false,
  className = ''
): ReactNode {
  if (effectiveEid == null) return null;
  const title = ESTILO_LABELS[effectiveEid as keyof typeof ESTILO_LABELS];
  if (title == null) return null;
  return (
    <CharacterLabelBelowCard
      title={title}
      subtitle={ESTILO_SUBTITLES[effectiveEid as keyof typeof ESTILO_SUBTITLES] ?? '—'}
      variant={ESTILO_LABEL_VARIANTS[effectiveEid as keyof typeof ESTILO_LABEL_VARIANTS] ?? 'slate'}
      compact={compact}
      className={className}
    />
  );
}

export interface ColumnFlowState {
  phase: 1 | 2;
  matchedCards: MatchedCard<{ id: string }>[];
  selectedCard: MatchedCard<{ id: string }> | null;
  axesByCard: Record<string, ArchetypeAxisState[]>;
  axisOrderByCard: Record<string, string[]>;
  phase2FromEditar: boolean;
  /** true cuando se descartaron todas las tarjetas sin hacer match */
  allDiscarded?: boolean;
  /** se incrementa al reiniciar la baraja para forzar nueva baraja */
  deckResetKey?: number;
  /** estado fase 2 guardado antes de resetear; se restaura al pulsar Volver desde fase 1 reseteada */
  phase2StateBeforeReset?: ColumnFlowState;
  /** true cuando estamos en fase 1 porque el usuario pulsó Resetear desde fase 2 */
  phase1FromReset?: boolean;
}

const createInitialColumnFlowState = (): ColumnFlowState => ({
  phase: 1,
  matchedCards: [],
  selectedCard: null,
  axesByCard: {},
  axisOrderByCard: {},
  phase2FromEditar: false,
  allDiscarded: false,
  deckResetKey: 0,
});

/** Estado serializable de ArchetypesCreator para restaurar al volver desde Refinar. */
export interface ArchetypeSavedState {
  quienPalette: string[];
  quePalette: string[];
  comoPalette: string[];
  quienPaletteLabels: string[];
  quePaletteLabels: string[];
  comoPaletteLabels: string[];
  combineMode: CombineMode;
  activeColumnView: ColumnKey | null;
  columnFlowState: Record<ColumnKey, ColumnFlowState>;
  axesPaletteColors: string[];
  axesPaletteLabels: string[];
  isAxesPaletteActive: boolean;
  activatedColumns: Record<ColumnKey, boolean>;
}

interface ColumnTinderPhaseProps {
  columnKey: ColumnKey;
  flowState: ColumnFlowState;
  setFlowState: React.Dispatch<React.SetStateAction<Record<ColumnKey, ColumnFlowState>>>;
  axesPaletteColors: string[];
  axesPaletteLabels: string[];
  isAxesPaletteActive: boolean;
  onAxesPaletteChange: (colors: string[], labels: string[], isPaletteActive: boolean) => void;
}

function ColumnTinderPhase({
  columnKey,
  flowState,
  setFlowState,
  axesPaletteColors,
  axesPaletteLabels,
  isAxesPaletteActive,
  onAxesPaletteChange,
}: ColumnTinderPhaseProps) {
  const { phase, matchedCards, selectedCard, axesByCard, axisOrderByCard, allDiscarded, deckResetKey } = flowState;

  const updateFlow = useCallback(
    (updater: (prev: ColumnFlowState) => ColumnFlowState) =>
      setFlowState((prev) => ({ ...prev, [columnKey]: updater(prev[columnKey]) })),
    [columnKey, setFlowState]
  );

  const setAxesByCard = useCallback(
    (action: React.SetStateAction<Record<string, ArchetypeAxisState[]>>) =>
      setFlowState((prev) => ({
        ...prev,
        [columnKey]: {
          ...prev[columnKey],
          axesByCard: typeof action === 'function' ? action(prev[columnKey].axesByCard) : action,
        },
      })),
    [columnKey, setFlowState]
  );

  const setAxisOrderByCard = useCallback(
    (action: React.SetStateAction<Record<string, string[]>>) =>
      setFlowState((prev) => ({
        ...prev,
        [columnKey]: {
          ...prev[columnKey],
          axisOrderByCard: typeof action === 'function' ? action(prev[columnKey].axisOrderByCard) : action,
        },
      })),
    [columnKey, setFlowState]
  );

  const onSwipeRight = useCallback(
    (card: { id: string }) =>
      updateFlow((p) => ({
        ...p,
        matchedCards: [...p.matchedCards, { card, direction: 'right' }],
        axesByCard: { ...p.axesByCard, [card.id]: p.axesByCard[card.id] ?? getPhase1AxisState() },
      })),
    [updateFlow]
  );

  const onSwipeUp = useCallback(
    (card: { id: string }) =>
      updateFlow((p) => ({
        ...p,
        matchedCards: [...p.matchedCards, { card, direction: 'up' }],
        axesByCard: { ...p.axesByCard, [card.id]: p.axesByCard[card.id] ?? getPhase1AxisState() },
      })),
    [updateFlow]
  );

  const onSwipeComplete = useCallback(
    () =>
      updateFlow((p) =>
        p.matchedCards.length === 0
          ? { ...p, allDiscarded: true }
          : { ...p, phase: 2, phase2FromEditar: false }
      ),
    [updateFlow]
  );

  const renderCard = useCallback(
    (card: { id: string }) => {
      const cardAxes =
        axesByCard[card.id] ?? (pendingAxesRef.current[card.id] ??= getPhase1AxisState());
      // Intercambio Quién↔Qué: columnKey 'que' = UI Quién (Herramientas), columnKey 'quien' = UI Qué (Esencia)
      const thumbAxisOrder = axisOrderByCard[card.id] ?? getFallbackAxisOrder(columnKey);
      const cardContent = (
        <TinderCardPreview
          card={card}
          axesState={cardAxes}
          axisOrder={thumbAxisOrder}
          columnKey={columnKey}
          fullSize
          hideLabels
        />
      );
      if (columnKey === 'quien' && 'characterId' in card) {
        const effectiveCharacterId = getEffectiveCharacterId(
          card as QuienTinderCardData,
          cardAxes,
          thumbAxisOrder
        );
        return {
          card: cardContent,
          labels: (
            <CharacterLabelFromEffectiveId effectiveCharId={effectiveCharacterId} />
          ),
        };
      }
      if (columnKey === 'que' && 'silhouetteId' in card) {
        const effectiveSid = getEffectiveSilhouetteId(
          card as QuienSilhouetteCardData,
          cardAxes,
          thumbAxisOrder
        );
        return {
          card: cardContent,
          labels: renderSilhouetteLabels(effectiveSid),
        };
      }
      if (columnKey === 'como' && 'estiloId' in card) {
        const effectiveEid = getEffectiveEstiloId(
          card as ComoEstiloCardData,
          cardAxes,
          thumbAxisOrder
        );
        return {
          card: cardContent,
          labels: renderEstiloLabels(effectiveEid),
        };
      }
      return cardContent;
    },
    [axesByCard, axisOrderByCard, columnKey]
  );

  const [cards] = useState(() => {
    if (columnKey === 'quien') {
      const quienCards = createQuienTinderCards();
      if (quienCards.length === 0) {
        console.warn('[Quién] createQuienTinderCards devolvió vacío, usando orden por defecto');
        return QUIEN_CHARACTER_IDS.map((characterId) => ({
          id: `quien-char-${characterId}`,
          characterId,
        }));
      }
      return quienCards;
    }
    if (columnKey === 'que') {
      return createQuienSilhouetteCards();
    }
    if (columnKey === 'como') {
      return createComoEstiloCards();
    }
    return TINDER_PLACEHOLDER_CARDS as { id: string }[];
  });

  const pendingAxesRef = useRef<Record<string, ArchetypeAxisState[]>>({});

  useEffect(() => {
    pendingAxesRef.current = {};
  }, [deckResetKey]);

  useEffect(() => {
    if (phase !== 1 || cards.length === 0) return;
    const toAdd: Record<string, ArchetypeAxisState[]> = {};
    for (const card of cards) {
      if (!(card.id in axesByCard) && !(card.id in pendingAxesRef.current)) {
        toAdd[card.id] = getPhase1AxisState();
      }
    }
    if (Object.keys(toAdd).length > 0) {
      setAxesByCard((prev) => ({ ...prev, ...toAdd }));
      Object.assign(pendingAxesRef.current, toAdd);
    }
  }, [phase, cards, axesByCard, setAxesByCard]);

  const creatureOrderContext = useMemo(() => {
    if (columnKey !== 'quien') return undefined;
    return {
      preselectedCharacterId:
        selectedCard?.card && 'characterId' in selectedCard.card
          ? (selectedCard.card as QuienTinderCardData).characterId
          : null,
      superMatchIds: matchedCards
        .filter((m) => m.direction === 'up' && 'characterId' in m.card)
        .map((m) => (m.card as QuienTinderCardData).characterId),
      matchIds: matchedCards
        .filter((m) => m.direction === 'right' && 'characterId' in m.card)
        .map((m) => (m.card as QuienTinderCardData).characterId),
      mismatchIds: cards
        .filter(
          (c) =>
            'characterId' in c &&
            !matchedCards.some((m) => m.card.id === c.id)
        )
        .map((c) => (c as QuienTinderCardData).characterId),
    };
  }, [columnKey, selectedCard, matchedCards, cards]);

  const silhouetteOrderContext = useMemo(() => {
    if (columnKey !== 'que') return undefined;
    return {
      preselectedSilhouetteId:
        selectedCard?.card && 'silhouetteId' in selectedCard.card
          ? (selectedCard.card as QuienSilhouetteCardData).silhouetteId
          : null,
      superMatchIds: matchedCards
        .filter((m) => m.direction === 'up' && 'silhouetteId' in m.card)
        .map((m) => (m.card as QuienSilhouetteCardData).silhouetteId),
      matchIds: matchedCards
        .filter((m) => m.direction === 'right' && 'silhouetteId' in m.card)
        .map((m) => (m.card as QuienSilhouetteCardData).silhouetteId),
      mismatchIds: cards
        .filter(
          (c) =>
            'silhouetteId' in c &&
            !matchedCards.some((m) => m.card.id === c.id)
        )
        .map((c) => (c as QuienSilhouetteCardData).silhouetteId),
    };
  }, [columnKey, selectedCard, matchedCards, cards]);

  const estiloOrderContext = useMemo(() => {
    if (columnKey !== 'como') return undefined;
    return {
      preselectedEstiloId:
        selectedCard?.card && 'estiloId' in selectedCard.card
          ? (selectedCard.card as ComoEstiloCardData).estiloId
          : null,
      superMatchIds: matchedCards
        .filter((m) => m.direction === 'up' && 'estiloId' in m.card)
        .map((m) => (m.card as ComoEstiloCardData).estiloId),
      matchIds: matchedCards
        .filter((m) => m.direction === 'right' && 'estiloId' in m.card)
        .map((m) => (m.card as ComoEstiloCardData).estiloId),
      mismatchIds: cards
        .filter(
          (c) =>
            'estiloId' in c &&
            !matchedCards.some((m) => m.card.id === c.id)
        )
        .map((c) => (c as ComoEstiloCardData).estiloId),
    };
  }, [columnKey, selectedCard, matchedCards, cards]);

  const sortedMatched = useMemo(
    () =>
      [...matchedCards].sort(
        (a, b) =>
          a.direction === 'up' && b.direction === 'right'
            ? -1
            : a.direction === 'right' && b.direction === 'up'
              ? 1
              : a.card.id.localeCompare(b.card.id)
      ),
    [matchedCards]
  );

  useEffect(() => {
    if (phase === 2 && sortedMatched.length > 0) {
      updateFlow((p) => ({ ...p, selectedCard: sortedMatched[0] }));
    }
  }, [phase, sortedMatched, updateFlow]);

  if (phase === 2) {
    return (
      <motion.div
        key={`${columnKey}-phase2`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={ASCEND_TRANSITION}
        className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px] overflow-hidden mt-6"
      >
        {/* Columna izquierda: tarjetas Match/SuperMatch seleccionables */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-300">Match y SuperMatch</h3>
            <button
              type="button"
              onClick={() => {
                const snapshot: ColumnFlowState = {
                  ...flowState,
                  phase2StateBeforeReset: undefined,
                  phase1FromReset: undefined,
                };
                updateFlow((p) => ({
                  ...createInitialColumnFlowState(),
                  phase2StateBeforeReset: snapshot,
                  phase1FromReset: true,
                  deckResetKey: (p.deckResetKey ?? 0) + 1,
                }));
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Resetear
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {sortedMatched.length === 0 ? (
              <p className="text-xs text-gray-500">No hay tarjetas con match o SuperMatch.</p>
            ) : (
              sortedMatched.map((item) => {
                const thumbAxes = axesByCard[item.card.id] ?? [];
                // Intercambio Quién↔Qué: columnKey 'que' = UI Quién (Herramientas), columnKey 'quien' = UI Qué (Esencia)
                const thumbAxisOrder =
                  axisOrderByCard[item.card.id] ?? getFallbackAxisOrder(columnKey);
                const effectiveCharId =
                  columnKey === 'quien' && 'characterId' in item.card
                    ? getEffectiveCharacterId(
                        item.card as QuienTinderCardData,
                        thumbAxes,
                        thumbAxisOrder
                      )
                    : null;
                return (
                  <div key={item.card.id} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => updateFlow((p) => ({ ...p, selectedCard: item }))}
                      className={cn(
                        'relative w-full aspect-[3/4] max-h-[160px] rounded-xl overflow-hidden border-2 transition-all text-left',
                        selectedCard?.card.id === item.card.id
                          ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                          : 'border-gray-600/50 hover:border-gray-500'
                      )}
                    >
                      <TinderCardPreview
                        card={item.card}
                        axesState={thumbAxes}
                        axisOrder={thumbAxisOrder}
                        columnKey={columnKey}
                        hideLabels
                        fullSize
                        useDefaultBackgroundUnlessConfigured
                        className="absolute inset-0 w-full h-full"
                      />
                      <span
                        className={cn(
                          'absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold border',
                          item.direction === 'right'
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                            : 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                        )}
                      >
                        {item.direction === 'right' ? 'Match' : 'SuperMatch'}
                      </span>
                    </button>
                    {columnKey === 'quien' && effectiveCharId != null && (
                      <div className="shrink-0 flex justify-center pt-2">
                        <CharacterLabelFromEffectiveId
                          effectiveCharId={effectiveCharId}
                          compact
                          className="!mt-0"
                        />
                      </div>
                    )}
                    {columnKey === 'que' && 'silhouetteId' in item.card && (() => {
                      const effectiveSid = getEffectiveSilhouetteId(
                        item.card as QuienSilhouetteCardData,
                        thumbAxes,
                        thumbAxisOrder
                      );
                      const labels = renderSilhouetteLabels(effectiveSid, true, '!mt-0');
                      if (!labels) return null;
                      return (
                        <div className="shrink-0 flex justify-center pt-2">
                          {labels}
                        </div>
                      );
                    })()}
                    {columnKey === 'como' && 'estiloId' in item.card && (() => {
                      const effectiveEid = getEffectiveEstiloId(
                        item.card as ComoEstiloCardData,
                        thumbAxes,
                        thumbAxisOrder
                      );
                      const labels = renderEstiloLabels(effectiveEid, true, '!mt-0');
                      if (!labels) return null;
                      return (
                        <div className="shrink-0 flex justify-center pt-2">
                          {labels}
                        </div>
                      );
                    })()}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Columna central: vista previa de la tarjeta seleccionada con componentes customizables */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Ajustes</h3>
          {selectedCard ? (
            <>
              <div className="flex flex-col items-center mb-4 w-full min-w-0">
                <TinderCardPreview
                  card={selectedCard.card}
                  axesState={axesByCard[selectedCard.card.id] ?? getPhase1AxisState()}
                  axisOrder={
                    axisOrderByCard[selectedCard.card.id] ?? getFallbackAxisOrder(columnKey)
                  }
                  columnKey={columnKey}
                  className="w-full max-w-full"
                  hideLabels
                  useDefaultBackgroundUnlessConfigured
                />
                {columnKey === 'quien' && 'characterId' in selectedCard.card && (
                  <div className="shrink-0 flex justify-center pt-2 w-full">
                    <CharacterLabelFromEffectiveId
                      effectiveCharId={getEffectiveCharacterId(
                        selectedCard.card as QuienTinderCardData,
                        axesByCard[selectedCard.card.id] ?? getPhase1AxisState(),
                        axisOrderByCard[selectedCard.card.id] ?? getFallbackAxisOrder(columnKey)
                      )}
                    />
                  </div>
                )}
                {columnKey === 'que' && 'silhouetteId' in selectedCard.card && (() => {
                  const cardAxes = axesByCard[selectedCard.card.id] ?? getPhase1AxisState();
                  const cardAxisOrder =
                    axisOrderByCard[selectedCard.card.id] ?? getFallbackAxisOrder(columnKey);
                  const effectiveSid = getEffectiveSilhouetteId(
                    selectedCard.card as QuienSilhouetteCardData,
                    cardAxes,
                    cardAxisOrder
                  );
                  const labels = renderSilhouetteLabels(effectiveSid);
                  if (!labels) return null;
                  return (
                    <div className="shrink-0 flex justify-center pt-2 w-full">
                      {labels}
                    </div>
                  );
                })()}
                {columnKey === 'como' && 'estiloId' in selectedCard.card && (() => {
                  const cardAxes = axesByCard[selectedCard.card.id] ?? getPhase1AxisState();
                  const cardAxisOrder =
                    axisOrderByCard[selectedCard.card.id] ?? getFallbackAxisOrder(columnKey);
                  const effectiveEid = getEffectiveEstiloId(
                    selectedCard.card as ComoEstiloCardData,
                    cardAxes,
                    cardAxisOrder
                  );
                  const labels = renderEstiloLabels(effectiveEid);
                  if (!labels) return null;
                  return (
                    <div className="shrink-0 flex justify-center pt-2 w-full">
                      {labels}
                    </div>
                  );
                })()}
              </div>
              <div
                className={cn(
                  'mt-auto pt-4 mb-10 border-t border-gray-600/50 transition-opacity duration-300',
                  !isAxesPaletteActive && 'opacity-75'
                )}
              >
                <p className="text-xs text-gray-500 mb-2">
                  Paleta vinculada a los Arquetipos{!isAxesPaletteActive ? ' (inactiva)' : ''}
                </p>
                <div>
                  <PaletteBar
                    colors={axesPaletteColors.slice(0, 4)}
                    labels={axesPaletteLabels.slice(0, 4)}
                    className="h-10"
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500">Selecciona una tarjeta de la columna izquierda.</p>
          )}
        </div>

        {/* Columna derecha: ejes arquetipo */}
        <ArchetypeAxesColumn
          selectedCardId={selectedCard?.card.id ?? null}
          onBlendedColorsChange={onAxesPaletteChange}
          axesByCard={axesByCard}
          setAxesByCard={setAxesByCard}
          axisOrderByCard={axisOrderByCard}
          setAxisOrderByCard={setAxisOrderByCard}
          creatureOrderContext={creatureOrderContext}
          silhouetteOrderContext={silhouetteOrderContext}
          estiloOrderContext={estiloOrderContext}
          defaultAxisOrder={getFallbackAxisOrder(columnKey)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${columnKey}-tinder`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={ASCEND_TRANSITION_TINDER}
      className="flex-1 flex flex-col min-h-[400px] overflow-hidden mt-6"
    >
      <div className="flex-1 flex items-center justify-center min-h-[360px] px-4">
        <SwipeDeck
          cards={cards}
          dark
          maxVisible={3}
          onSwipeRight={onSwipeRight}
          onSwipeUp={onSwipeUp}
          onComplete={onSwipeComplete}
          onEmpty={
            allDiscarded
              ? () => (
                  <div className="text-center space-y-6 p-8 text-gray-400">
                    <p className="text-lg">
                      Parece que esta vez no congeniaste con ninguna {NO_MATCH_ITEM_LABEL[columnKey]}…
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        updateFlow((p) => ({ ...p, allDiscarded: false, deckResetKey: (p.deckResetKey ?? 0) + 1 }))
                      }
                      className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all"
                    >
                      Reiniciar la Baraja
                    </button>
                  </div>
                )
              : undefined
          }
          renderCard={renderCard}
        />
      </div>
    </motion.div>
  );
}

interface ArchetypesCreatorProps {
  onCreatePalette: (colors: string[], savedState?: ArchetypeSavedState) => void;
  onBack: () => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
  /** Estado restaurado al volver desde Refinar. */
  initialState?: ArchetypeSavedState | null;
}

export const ArchetypesCreator: React.FC<ArchetypesCreatorProps> = ({
  onCreatePalette,
  onBack,
  colorCount,
  onColorCountChange,
  initialState,
}) => {
  const [quienPalette, setQuienPalette] = useState<string[]>(() =>
    initialState?.quienPalette?.length
      ? initialState.quienPalette
      : DEFAULT_COLUMN_PALETTES.quien.slice(0, Math.max(colorCount, 4))
  );
  const [quePalette, setQuePalette] = useState<string[]>(() =>
    initialState?.quePalette?.length
      ? initialState.quePalette
      : DEFAULT_COLUMN_PALETTES.que.slice(0, Math.max(colorCount, 4))
  );
  const [comoPalette, setComoPalette] = useState<string[]>(() =>
    initialState?.comoPalette?.length
      ? initialState.comoPalette
      : DEFAULT_COLUMN_PALETTES.como.slice(0, Math.max(colorCount, 4))
  );
  const [quienPaletteLabels, setQuienPaletteLabels] = useState<string[]>(
    () => initialState?.quienPaletteLabels ?? ['—', '—', '—', '—']
  );
  const [quePaletteLabels, setQuePaletteLabels] = useState<string[]>(
    () => initialState?.quePaletteLabels ?? ['—', '—', '—', '—']
  );
  const [comoPaletteLabels, setComoPaletteLabels] = useState<string[]>(
    () => initialState?.comoPaletteLabels ?? ['—', '—', '—', '—']
  );
  const [combineMode, setCombineMode] = useState<CombineMode>(
    () => initialState?.combineMode ?? 'balanced'
  );
  const [hoveredMode, setHoveredMode] = useState<CombineMode | null>(null);
  const [activeColumnView, setActiveColumnView] = useState<ColumnKey | null>(
    () => initialState?.activeColumnView ?? null
  );
  const [columnFlowState, setColumnFlowState] = useState<Record<ColumnKey, ColumnFlowState>>(() =>
    initialState?.columnFlowState
      ? {
          quien: initialState.columnFlowState.quien ?? createInitialColumnFlowState(),
          que: initialState.columnFlowState.que ?? createInitialColumnFlowState(),
          como: initialState.columnFlowState.como ?? createInitialColumnFlowState(),
        }
      : {
          quien: createInitialColumnFlowState(),
          que: createInitialColumnFlowState(),
          como: createInitialColumnFlowState(),
        }
  );
  const [axesPaletteColors, setAxesPaletteColors] = useState<string[]>(() =>
    initialState?.axesPaletteColors?.length
      ? initialState.axesPaletteColors
      : NEUTRAL_PALETTE.slice(0, 4)
  );
  const [axesPaletteLabels, setAxesPaletteLabels] = useState<string[]>(
    () => initialState?.axesPaletteLabels ?? ['—', '—', '—', '—']
  );
  const [isAxesPaletteActive, setIsAxesPaletteActive] = useState(
    () => initialState?.isAxesPaletteActive ?? false
  );
  const [activatedColumns, setActivatedColumns] = useState<Record<ColumnKey, boolean>>(() =>
    initialState?.activatedColumns ?? { quien: false, que: false, como: false }
  );
  const [showPaletteHintPopup, setShowPaletteHintPopup] = useState(false);
  const [summaryModalColumn, setSummaryModalColumn] = useState<ColumnKey | null>(null);
  const [showGlobalSummary, setShowGlobalSummary] = useState(false);
  const [pendingSavedState, setPendingSavedState] = useState<ArchetypeSavedState | null>(null);
  const [pendingCombinedPalette, setPendingCombinedPalette] = useState<string[] | null>(null);

  const combinedPalette = useMemo(
    () =>
      combineColumnPalettes(quienPalette, quePalette, comoPalette, activatedColumns, colorCount, combineMode),
    [quienPalette, quePalette, comoPalette, activatedColumns, colorCount, combineMode]
  );

  const contentColumnKey = activeColumnView ? getContentColumnKey(activeColumnView) : null;
  const activeFlow = contentColumnKey ? columnFlowState[contentColumnKey] : null;

  const columnPalettes = useMemo(
    () => ({ quien: quienPalette, que: quePalette, como: comoPalette }),
    [quienPalette, quePalette, comoPalette]
  );

  const columnPaletteLabels = useMemo(
    () => ({
      quien: quienPaletteLabels,
      que: quePaletteLabels,
      como: comoPaletteLabels,
    }),
    [quienPaletteLabels, quePaletteLabels, comoPaletteLabels]
  );

  const contentColumnKeyByColumn: Record<ColumnKey, ColumnKey> = useMemo(
    () => ({
      quien: getContentColumnKey('quien'),
      que: getContentColumnKey('que'),
      como: getContentColumnKey('como'),
    }),
    []
  );

  const flowStateByColumn: Record<ColumnKey, ColumnFlowState> = useMemo(
    () => ({
      quien: columnFlowState[contentColumnKeyByColumn.quien] ?? createInitialColumnFlowState(),
      que: columnFlowState[contentColumnKeyByColumn.que] ?? createInitialColumnFlowState(),
      como: columnFlowState[contentColumnKeyByColumn.como] ?? createInitialColumnFlowState(),
    }),
    [columnFlowState, contentColumnKeyByColumn]
  );

  const handleEditarColumn = useCallback(
    (key: ColumnKey) => {
      const contentKey = getContentColumnKey(key);
      setActiveColumnView(key);
      setColumnFlowState((prev) => ({
        ...prev,
        [contentKey]: { ...prev[contentKey], phase: 2, phase2FromEditar: true },
      }));
      // Restaurar paleta guardada si la columna ya tiene una
      if (activatedColumns[key]) {
        const savedColors = columnPalettes[key];
        const savedLabels = columnPaletteLabels[key];
        if (savedColors.length >= 4) {
          setAxesPaletteColors(savedColors.slice(0, 4));
          setAxesPaletteLabels(savedLabels.slice(0, 4).map((l) => l ?? '—'));
          setIsAxesPaletteActive(true);
        }
      }
    },
    [activatedColumns, columnPalettes, columnPaletteLabels]
  );

  const handleColumnClick = useCallback(
    (key: ColumnKey) => {
      const contentKey = getContentColumnKey(key);
      const flow = columnFlowState[contentKey];
      const hasMatches = (flow?.matchedCards.length ?? 0) > 0;
      const isActivated = activatedColumns[key];

      if (isActivated || hasMatches) {
        // Modal de resumen como paso previo a fase 2. Sin matchedCards → ir directo a fase 2.
        if (hasMatches) {
          setSummaryModalColumn(key);
        } else {
          handleEditarColumn(key);
        }
      } else {
        setActiveColumnView(key);
        setColumnFlowState((prev) => ({ ...prev, [contentKey]: createInitialColumnFlowState() }));
        setAxesPaletteColors(NEUTRAL_PALETTE.slice(0, 4));
        setAxesPaletteLabels(['—', '—', '—', '—']);
        setIsAxesPaletteActive(false);
      }
    },
    [activatedColumns, columnFlowState, handleEditarColumn]
  );

  const handleAxesPaletteChange = useCallback(
    (colors: string[], labels: string[], isPaletteActive: boolean) => {
      setAxesPaletteColors(colors);
      setAxesPaletteLabels(labels ?? []);
      setIsAxesPaletteActive(isPaletteActive);
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ASCEND_TRANSITION}
      className="w-full flex flex-col flex-1 min-h-0 overflow-hidden"
    >
      {/* Banner superior (mismo diseño; título y Volver dinámicos según vista) */}
      <div className="shrink-0 bg-gray-700/60 rounded-2xl border border-gray-600/50 px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={
            activeColumnView && activeFlow?.phase === 2
              ? () => {
                  if (!isAxesPaletteActive && activeColumnView) {
                    setActivatedColumns((prev) => ({ ...prev, [activeColumnView]: false }));
                  }
                  setActiveColumnView(null);
                }
              : activeColumnView && contentColumnKey && activeFlow?.phase1FromReset && activeFlow?.phase2StateBeforeReset
                ? () => {
                    setColumnFlowState((prev) => ({
                      ...prev,
                      [contentColumnKey]: activeFlow!.phase2StateBeforeReset!,
                    }));
                  }
                : activeColumnView && contentColumnKey
                  ? () => {
                      setActiveColumnView(null);
                      setColumnFlowState((prev) => ({
                        ...prev,
                        [contentColumnKey]: createInitialColumnFlowState(),
                      }));
                    }
                  : onBack
          }
          type="button"
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all shrink-0 text-sm font-medium"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-3 min-w-0 flex-1 justify-center">
          <span className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border border-amber-500/30 ${ARCHETYPE_BUTTON_CONFIG.iconColor} [&_svg]:w-5 [&_svg]:h-5`} aria-hidden>
            {ARCHETYPE_BUTTON_CONFIG.icon}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">
              {activeColumnView ? COLUMN_BUTTON_CONFIG[activeColumnView].title : 'Explora Arquetipos'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeColumnView
                ? 'Desliza para descartar o hacer match con las tarjetas'
                : 'Desliza o selecciona conceptos que representen tu paleta'}
            </p>
          </div>
        </div>
        {activeColumnView && contentColumnKey && activeFlow?.phase === 1 ? (
          <button
            type="button"
            onClick={() => {
              if (activeFlow.matchedCards.length > 0) {
                setColumnFlowState((prev) => ({
                  ...prev,
                  [contentColumnKey]: {
                    ...prev[contentColumnKey],
                    phase: 2,
                    phase2FromEditar: false,
                    phase2StateBeforeReset: undefined,
                    phase1FromReset: false,
                  },
                }));
              }
            }}
            disabled={activeFlow.matchedCards.length === 0}
            className={`shrink-0 py-2 px-4 rounded-xl font-medium transition-all text-sm ${
              activeFlow.matchedCards.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50'
                : 'bg-gray-700/50 text-gray-500 border border-gray-600 cursor-not-allowed'
            }`}
          >
            Ver mis Match →
          </button>
        ) : activeColumnView && activeFlow?.phase === 2 ? (
          <span
            className="relative shrink-0 inline-block"
            onMouseEnter={() => {
              if (!isAxesPaletteActive || axesPaletteColors.length < 4) setShowPaletteHintPopup(true);
            }}
            onMouseLeave={() => setShowPaletteHintPopup(false)}
          >
            <button
              type="button"
              onClick={() => {
                if (!isAxesPaletteActive || axesPaletteColors.length < 4 || !activeColumnView) return;
                const colors = axesPaletteColors.slice(0, 4);
                const labels = axesPaletteLabels.slice(0, 4).map((l) => l ?? '—');
                if (activeColumnView === 'quien') {
                  setQuienPalette(colors);
                  setQuienPaletteLabels(labels);
                } else if (activeColumnView === 'que') {
                  setQuePalette(colors);
                  setQuePaletteLabels(labels);
                } else {
                  setComoPalette(colors);
                  setComoPaletteLabels(labels);
                }
                setActivatedColumns((prev) => ({ ...prev, [activeColumnView]: true }));
                setActiveColumnView(null);
              }}
              disabled={!isAxesPaletteActive || axesPaletteColors.length < 4}
              className={`py-2 px-4 rounded-xl font-medium transition-all text-sm ${
                isAxesPaletteActive && axesPaletteColors.length >= 4
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50'
                  : 'bg-gray-700/50 text-gray-500 border border-gray-600 cursor-not-allowed'
              }`}
            >
              Usar paleta →
            </button>
            {createPortal(
              <AnimatePresence>
                {showPaletteHintPopup && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.08 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4"
                  >
                    <div className="absolute inset-0 bg-black/25" aria-hidden />
                    <div
                      className={cn(
                        'relative z-10 pointer-events-none w-full max-w-md rounded-2xl border-2 shadow-2xl',
                        'bg-gray-800/95 backdrop-blur-xl border-amber-500/50',
                        'px-10 py-8 text-center'
                      )}
                    >
                      <div className="flex justify-center mb-4">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 text-amber-400 ring-2 ring-amber-500/30">
                          <Sparkles className="h-8 w-8" />
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        Arquetipos
                      </p>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                        Configura al menos un eje en la columna derecha para activar la paleta
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              const savedState: ArchetypeSavedState = {
                quienPalette: [...quienPalette],
                quePalette: [...quePalette],
                comoPalette: [...comoPalette],
                quienPaletteLabels: [...quienPaletteLabels],
                quePaletteLabels: [...quePaletteLabels],
                comoPaletteLabels: [...comoPaletteLabels],
                combineMode,
                activeColumnView,
                columnFlowState: JSON.parse(JSON.stringify(columnFlowState)),
                axesPaletteColors: [...axesPaletteColors],
                axesPaletteLabels: [...axesPaletteLabels],
                isAxesPaletteActive,
                activatedColumns: { ...activatedColumns },
              };
              setPendingSavedState(savedState);
              setPendingCombinedPalette([...combinedPalette]);
              setShowGlobalSummary(true);
            }}
            className="shrink-0 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 font-medium transition-all text-sm"
          >
            Usar paleta →
          </button>
        )}
      </div>

      {summaryModalColumn && (
        <ColumnSummaryModal
          columnKey={summaryModalColumn}
          contentColumnKey={getContentColumnKey(summaryModalColumn)}
          flowState={columnFlowState[getContentColumnKey(summaryModalColumn)] ?? createInitialColumnFlowState()}
          paletteColors={
            activatedColumns[summaryModalColumn]
              ? columnPalettes[summaryModalColumn].slice(0, 4)
              : NEUTRAL_PALETTE.slice(0, 4)
          }
          paletteLabels={
            activatedColumns[summaryModalColumn]
              ? columnPaletteLabels[summaryModalColumn].slice(0, 4).map((l) => l ?? '—')
              : ['—', '—', '—', '—']
          }
          isPaletteActive={activatedColumns[summaryModalColumn]}
          onClose={() => setSummaryModalColumn(null)}
          onEditar={() => {
            const key = summaryModalColumn;
            setSummaryModalColumn(null);
            handleEditarColumn(key);
          }}
        />
      )}

      {showGlobalSummary && pendingCombinedPalette && pendingSavedState && (
        <ArchetypesGlobalSummaryModal
          combinedPalette={pendingCombinedPalette}
          columnPalettes={columnPalettes}
          columnPaletteLabels={columnPaletteLabels}
          activatedColumns={activatedColumns}
          flowStateByColumn={flowStateByColumn}
          contentColumnKeyByColumn={contentColumnKeyByColumn}
          colorCount={colorCount}
          onClose={() => setShowGlobalSummary(false)}
          onConfirm={() => {
            setShowGlobalSummary(false);
            onCreatePalette(pendingCombinedPalette, pendingSavedState);
            setPendingCombinedPalette(null);
            setPendingSavedState(null);
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {activeColumnView && contentColumnKey ? (
          <QuienTinderErrorBoundary key={`${activeColumnView}-boundary`}>
            <ColumnTinderPhase
              key={`${activeColumnView}-flow-${activeFlow?.deckResetKey ?? 0}`}
              columnKey={contentColumnKey}
              flowState={columnFlowState[contentColumnKey] ?? createInitialColumnFlowState()}
              setFlowState={setColumnFlowState}
              axesPaletteColors={axesPaletteColors}
              axesPaletteLabels={axesPaletteLabels}
              isAxesPaletteActive={isAxesPaletteActive}
              onAxesPaletteChange={handleAxesPaletteChange}
            />
          </QuienTinderErrorBoundary>
        ) : (
          <motion.div
            key="main-columns"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={ASCEND_TRANSITION}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Tres columnas: Quién, Qué, Cómo (tamaño similar a Arquetipos/Formas) */}
            <div className="max-w-5xl mx-auto w-full mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COLUMN_KEYS.map((key) => (
                  <div key={key} className="flex flex-col gap-4">
                    <ArchetypeColumnCard
                      columnKey={key}
                      isActive={activatedColumns[key]}
                      hasPaletteCreated={
                        activatedColumns[key] ||
                        columnFlowState[getContentColumnKey(key)].matchedCards.length > 0
                      }
                      onClick={() => handleColumnClick(key)}
                    />
                    {/* Paleta individual fuera del botón, debajo (gris cuando inactiva) */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">
                          {activatedColumns[key] ? 'Paleta individual' : 'Paleta individual (inactiva)'}
                        </p>
                      </div>
                      <PaletteBar
                        colors={
                          activatedColumns[key]
                            ? columnPalettes[key].slice(0, colorCount)
                            : NEUTRAL_PALETTE.slice(0, colorCount)
                        }
                        labels={
                          activatedColumns[key]
                            ? Array.from({ length: colorCount }, (_, i) =>
                                columnPaletteLabels[key][i] ?? '—'
                              )
                            : undefined
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-[80px]" />

            {/* Paleta general: fija en la parte inferior */}
            <div className="shrink-0 mt-4 bg-gray-700/40 rounded-2xl border border-gray-600/50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <h3 className="text-sm font-medium text-gray-300">Paleta general</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 relative">
                    <span className="text-xs text-gray-500">Modo:</span>
                    <div
                      className="flex flex-wrap gap-1.5"
                      onMouseLeave={() => setHoveredMode(null)}
                    >
                      {COMBINE_MODES.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setCombineMode(m)}
                          onMouseEnter={() => setHoveredMode(m)}
                          onMouseLeave={() => setHoveredMode(null)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            combineMode === m
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                          }`}
                        >
                          {COMBINE_MODE_LABELS[m]}
                        </button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {hoveredMode && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="absolute left-0 bottom-full mb-2 z-50 pointer-events-none"
                        >
                          <div className="bg-gray-900/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl shadow-black/30 border border-indigo-500/20 max-w-[260px]">
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {COMBINE_MODE_TOOLTIPS[hoveredMode]}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Colores:</span>
                    <div className="flex gap-1">
                      {COLOR_COUNT_OPTIONS.map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => onColorCountChange(num)}
                          className={`w-7 h-7 rounded-lg text-sm font-medium transition-all ${
                            colorCount === num
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <PaletteBar colors={combinedPalette} className="h-14" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
