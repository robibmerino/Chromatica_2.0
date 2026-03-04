/**
 * Formas: misma arquitectura que Quién/Qué/Cómo en Arquetipos.
 * - Fase 1: Tinder (swipe) para seleccionar formas.
 * - Fase 2: Tres columnas (Match y SuperMatch | Ajustes | Opciones).
 * El contenido concreto de cada fase se irá definiendo; aquí solo la estructura.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { SwipeDeck, type MatchedCard } from './SwipeDeck';
import { SHAPE_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeShapeButtonConfig';
import { NEUTRAL_PALETTE } from './archetypePaletteUtils';

/** Datos mínimos de una tarjeta en Formas (contenido por definir). */
interface ShapeCardData {
  id: string;
}

interface ShapesCreatorProps {
  onComplete: (colors: string[]) => void;
  onBack: () => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
}

/** Transiciones alineadas con Arquetipos. */
const ASCEND_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
const ASCEND_TRANSITION_TINDER = { ...ASCEND_TRANSITION, duration: 0.45 };

/** Estado del flujo Formas (análogo a ColumnFlowState en Arquetipos). */
export interface ShapesFlowState {
  phase: 1 | 2;
  matchedCards: MatchedCard<ShapeCardData>[];
  selectedCard: MatchedCard<ShapeCardData> | null;
  allDiscarded?: boolean;
  deckResetKey?: number;
  phase2StateBeforeReset?: ShapesFlowState;
  phase1FromReset?: boolean;
}

const createInitialShapesFlowState = (): ShapesFlowState => ({
  phase: 1,
  matchedCards: [],
  selectedCard: null,
  allDiscarded: false,
  deckResetKey: 0,
});

/** Fisher–Yates shuffle. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Tarjetas placeholder para Fase 1 (contenido por sustituir). */
const PLACEHOLDER_IDS = Array.from({ length: 8 }, (_, i) => `shape-${i + 1}`);

function createPlaceholderCards(): ShapeCardData[] {
  return shuffle([...PLACEHOLDER_IDS]).map((id) => ({ id }));
}

export const ShapesCreator: React.FC<ShapesCreatorProps> = ({
  onComplete,
  onBack,
  colorCount,
  onColorCountChange: _onColorCountChange,
}) => {
  const [flowState, setFlowState] = useState<ShapesFlowState>(createInitialShapesFlowState);
  const [cards] = useState<ShapeCardData[]>(() => createPlaceholderCards());

  const { phase, matchedCards, selectedCard, allDiscarded, deckResetKey } = flowState;
  const sortedMatched = useMemo(
    () =>
      [...matchedCards].sort((a, b) =>
        a.card.id.localeCompare(b.card.id)
      ),
    [matchedCards]
  );

  const updateFlow = useCallback((updater: (prev: ShapesFlowState) => ShapesFlowState) => {
    setFlowState(updater);
  }, []);

  const onSwipeRight = useCallback(
    (card: ShapeCardData) => {
      updateFlow((p) => ({
        ...p,
        matchedCards: [...p.matchedCards, { card, direction: 'right' }],
      }));
    },
    [updateFlow]
  );

  const onSwipeUp = useCallback(
    (card: ShapeCardData) => {
      updateFlow((p) => ({
        ...p,
        matchedCards: [...p.matchedCards, { card, direction: 'up' }],
      }));
    },
    [updateFlow]
  );

  const onSwipeComplete = useCallback(() => {
    updateFlow((p) =>
      p.matchedCards.length > 0 ? { ...p, phase: 2 } : { ...p, allDiscarded: true }
    );
  }, [updateFlow]);

  const renderCard = useCallback(
    (card: ShapeCardData) => ({
      card: (
        <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gray-800/80 border border-gray-600/50 text-gray-400">
          <span className="text-sm font-medium">Forma {card.id.replace('shape-', '')}</span>
        </div>
      ),
      labels: null,
    }),
    []
  );

  // Fase 2: tres columnas (misma estructura que Arquetipos)
  if (phase === 2) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header: mismo patrón que Arquetipos (Volver | Título + subtítulo | Usar paleta) */}
        <div className="flex items-center justify-between gap-4 px-1 py-3 border-b border-gray-700/60 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all shrink-0 text-sm font-medium"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-center">
            <span
              className={cn(
                'flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border',
                SHAPE_BUTTON_CONFIG.tagBg,
                SHAPE_BUTTON_CONFIG.tagColor,
                '[&_svg]:w-5 [&_svg]:h-5'
              )}
              aria-hidden
            >
              {SHAPE_BUTTON_CONFIG.icon}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white leading-tight">{SHAPE_BUTTON_CONFIG.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Desliza para descartar o hacer match con las tarjetas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onComplete(NEUTRAL_PALETTE.slice(0, Math.max(colorCount, 4)))}
            className="shrink-0 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 font-medium transition-all text-sm"
          >
            Usar paleta →
          </button>
        </div>

        <motion.div
          key="shapes-phase2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={ASCEND_TRANSITION}
          className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px] overflow-hidden mt-6"
        >
          {/* Columna izquierda: Match y SuperMatch */}
          <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-sm font-medium text-gray-300">Match y SuperMatch</h3>
              <button
                type="button"
                onClick={() => {
                  const snapshot: ShapesFlowState = {
                    ...flowState,
                    phase2StateBeforeReset: undefined,
                    phase1FromReset: undefined,
                  };
                  updateFlow(() => ({
                    ...createInitialShapesFlowState(),
                    phase2StateBeforeReset: snapshot,
                    phase1FromReset: true,
                    deckResetKey: (flowState.deckResetKey ?? 0) + 1,
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
                sortedMatched.map((item) => (
                  <button
                    key={item.card.id}
                    type="button"
                    onClick={() => updateFlow((p) => ({ ...p, selectedCard: item }))}
                    className={cn(
                      'relative w-full aspect-[3/4] max-h-[160px] rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-800/80',
                      selectedCard?.card.id === item.card.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                        : 'border-gray-600/50 hover:border-gray-500'
                    )}
                  >
                    <span className="text-xs text-gray-400">Forma {item.card.id.replace('shape-', '')}</span>
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
                ))
              )}
            </div>
          </div>

          {/* Columna central: Ajustes */}
          <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Ajustes</h3>
            {selectedCard ? (
              <div className="flex flex-col items-center w-full min-w-0">
                <div className="w-full aspect-[3/4] max-h-[280px] rounded-xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center text-gray-500 text-sm">
                  Vista previa: {selectedCard.card.id}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Selecciona una tarjeta de la columna izquierda.</p>
            )}
          </div>

          {/* Columna derecha: Opciones (placeholder) */}
          <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Opciones</h3>
            <p className="text-xs text-gray-500">Contenido por definir.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Fase 1: Tinder
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-1 py-3 border-b border-gray-700/60 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all shrink-0 text-sm font-medium"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-3 min-w-0 flex-1 justify-center">
          <span
            className={cn(
              'flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border',
              SHAPE_BUTTON_CONFIG.tagBg,
              SHAPE_BUTTON_CONFIG.tagColor,
              '[&_svg]:w-5 [&_svg]:h-5'
            )}
            aria-hidden
          >
            {SHAPE_BUTTON_CONFIG.icon}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">{SHAPE_BUTTON_CONFIG.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Desliza para descartar o hacer match con las tarjetas</p>
          </div>
        </div>
        {matchedCards.length > 0 ? (
          <button
            type="button"
            onClick={() => updateFlow((p) => ({ ...p, phase: 2 }))}
            className="shrink-0 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 font-medium transition-all text-sm"
          >
            Ver mis Match →
          </button>
        ) : (
          <div className="w-28 shrink-0" />
        )}
      </div>

      <motion.div
        key="shapes-tinder"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={ASCEND_TRANSITION_TINDER}
        className="flex-1 flex flex-col min-h-[400px] overflow-hidden mt-6"
      >
        <div className="flex-1 flex items-center justify-center min-h-[360px] px-4">
          <SwipeDeck<ShapeCardData>
            key={deckResetKey ?? 0}
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
                      <p className="text-lg">Parece que esta vez no congeniaste con ninguna forma…</p>
                      <button
                        type="button"
                        onClick={() =>
                          updateFlow((p) => ({
                            ...createInitialShapesFlowState(),
                            allDiscarded: false,
                            deckResetKey: (p.deckResetKey ?? 0) + 1,
                          }))
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
    </div>
  );
};

export default ShapesCreator;
