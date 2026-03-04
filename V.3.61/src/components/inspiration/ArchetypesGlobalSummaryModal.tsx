import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PaletteBar } from './PaletteBar';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { NEUTRAL_PALETTE } from './archetypePaletteUtils';
import type { ColumnFlowState } from './ArchetypesCreator';
import { TinderCardPreview } from './TinderCardPreview';
import { QuienTinderErrorBoundary } from './QuienTinderErrorBoundary';
import { getFallbackAxisOrder } from './archetypeAxesConfig';
import type { ArchetypeAxisState } from './archetypeAxesTypes';
import { ColorTag, getSummaryTagsForColumn } from './ColumnSummaryModal';

const SUMMARY_COLUMNS: ColumnKey[] = ['quien', 'que', 'como'];

interface ArchetypesGlobalSummaryModalProps {
  combinedPalette: string[];
  columnPalettes: Record<ColumnKey, string[]>;
  columnPaletteLabels: Record<ColumnKey, string[]>;
  activatedColumns: Record<ColumnKey, boolean>;
  flowStateByColumn: Record<ColumnKey, ColumnFlowState>;
  contentColumnKeyByColumn: Record<ColumnKey, ColumnKey>;
  colorCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

type ActiveCardItem = {
  columnKey: ColumnKey;
  selectedCard: NonNullable<ColumnFlowState['selectedCard']>;
  flowState: ColumnFlowState;
  contentColumnKey: ColumnKey;
  axesForSelected: ArchetypeAxisState[];
  axisOrderForSelected: string[];
};

function sortMatchedCards(matched: ColumnFlowState['matchedCards']) {
  return [...matched].sort((a, b) =>
    a.direction === 'up' && b.direction === 'right'
      ? -1
      : a.direction === 'right' && b.direction === 'up'
        ? 1
        : a.card.id.localeCompare(b.card.id)
  );
}

export function ArchetypesGlobalSummaryModal({
  combinedPalette,
  columnPalettes,
  columnPaletteLabels,
  activatedColumns,
  flowStateByColumn,
  contentColumnKeyByColumn,
  colorCount,
  onConfirm,
  onClose,
}: ArchetypesGlobalSummaryModalProps) {
  const { activeCards, allTags } = useMemo(() => {
    const cards: ActiveCardItem[] = [];
    const tags: Array<{ label: string; color: string; size?: 'xs' | 'sm' }> = [];
    SUMMARY_COLUMNS.forEach((columnKey) => {
      const flowState = flowStateByColumn[columnKey];
      const contentColumnKey = contentColumnKeyByColumn[columnKey];
      const sortedMatched = sortMatchedCards(flowState.matchedCards);
      const selectedCard = flowState.selectedCard ?? sortedMatched[0];
      const fallbackAxisOrder = getFallbackAxisOrder(contentColumnKey);
      const palette = activatedColumns[columnKey]
        ? columnPalettes[columnKey].slice(0, colorCount)
        : NEUTRAL_PALETTE.slice(0, colorCount);
      if (selectedCard != null) {
        cards.push({
          columnKey,
          selectedCard,
          flowState,
          contentColumnKey,
          axesForSelected: flowState.axesByCard[selectedCard.card.id] ?? [],
          axisOrderForSelected:
            flowState.axisOrderByCard[selectedCard.card.id] ?? fallbackAxisOrder,
        });
        const tagResult = getSummaryTagsForColumn(
          flowState,
          contentColumnKey,
          selectedCard,
          fallbackAxisOrder,
          palette,
          columnPaletteLabels[columnKey]
        );
        tagResult.axisVariants.forEach((t) => tags.push({ ...t, size: 'xs' }));
        if (tagResult.paletteColorsSlice.length >= 4) {
          tagResult.paletteColorsSlice.forEach((color, i) =>
            tags.push({
              label: tagResult.paletteLabelsSlice[i] ?? '—',
              color,
              size: 'sm',
            })
          );
        }
      }
    });
    return { activeCards: cards, allTags: tags };
  }, [
    flowStateByColumn,
    contentColumnKeyByColumn,
    activatedColumns,
    columnPalettes,
    columnPaletteLabels,
    colorCount,
  ]);

  const renderCard = (item: ActiveCardItem, key: string) => (
    <div key={key} className="w-[11rem] shrink-0 aspect-[3/4]">
      <QuienTinderErrorBoundary fallback={null}>
        <TinderCardPreview
          card={item.selectedCard.card}
          axesState={item.axesForSelected}
          axisOrder={item.axisOrderForSelected}
          columnKey={item.contentColumnKey}
          fullSize
          hideLabels
          useDefaultBackgroundUnlessConfigured
          className="w-full h-full"
        />
      </QuienTinderErrorBoundary>
    </div>
  );

  const content = (
    <AnimatePresence>
      <motion.div
        key="archetypes-global-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-[1200px] h-[700px] overflow-hidden rounded-2xl border border-gray-600/60 bg-gradient-to-b from-gray-900 via-gray-900/98 to-gray-900 shadow-2xl shadow-black/50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archetypes-global-summary-title"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/70 bg-gray-900/80">
            <div>
              <h2 id="archetypes-global-summary-title" className="text-lg font-semibold text-white">
                Resumen de Arquetipos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Quién, Qué y Cómo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm text-white border border-indigo-500/50 font-medium transition-colors"
              >
                Usar esta paleta →
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Cerrar resumen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-row gap-4 p-4">
            <>
                  {/* Columna izquierda: tarjetas (1 centrada, 2 lado a lado, 3 pirámide invertida) */}
                  <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden">
                      <div className="flex flex-col items-center justify-center">
                        {activeCards.length === 1 && (
                          <div className="flex justify-center">
                            {renderCard(activeCards[0], activeCards[0].columnKey)}
                          </div>
                        )}
                        {activeCards.length === 2 && (
                          <div className="flex justify-center gap-3">
                            {renderCard(activeCards[0], activeCards[0].columnKey)}
                            {renderCard(activeCards[1], activeCards[1].columnKey)}
                          </div>
                        )}
                        {activeCards.length >= 3 && (
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex justify-center gap-3">
                              {renderCard(activeCards[0], activeCards[0].columnKey)}
                              {renderCard(activeCards[1], activeCards[1].columnKey)}
                            </div>
                            <div className="flex justify-center">
                              {renderCard(activeCards[2], activeCards[2].columnKey)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Territorio visual</p>
                    </footer>
                  </div>

                  {/* Columna central: todas las etiquetas entremezcladas (margen perimetral, organización más vertical) */}
                  <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 flex items-center justify-center p-6 overflow-auto">
                      <div className="flex flex-wrap justify-center content-center gap-2 w-full max-w-[58%]">
                        {allTags.map((t, i) => (
                          <ColorTag
                            key={`${t.label}-${i}`}
                            label={t.label}
                            color={t.color}
                            size={t.size ?? 'xs'}
                          />
                        ))}
                      </div>
                    </div>
                    <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Arquetipos</p>
                    </footer>
                  </div>

                  {/* Columna derecha: paletas individuales (con textos) + paleta general */}
                  <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-auto">
                      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[260px]">
                        <section className="w-full">
                          <p className="text-xs text-gray-500 mb-1.5 text-center">Paletas individuales</p>
                          <div className="flex flex-col gap-3">
                            {SUMMARY_COLUMNS.map((columnKey) => {
                              const isActive = activatedColumns[columnKey];
                              const palette = isActive
                                ? columnPalettes[columnKey].slice(0, colorCount)
                                : NEUTRAL_PALETTE.slice(0, colorCount);
                              const paletteLabels = isActive
                                ? Array.from({ length: palette.length }, (_, i) =>
                                    columnPaletteLabels[columnKey]?.[i] ?? '—'
                                  )
                                : Array.from({ length: palette.length }, () => '');
                              return (
                                <PaletteBar
                                  key={columnKey}
                                  colors={palette}
                                  labels={paletteLabels}
                                  className="h-8"
                                />
                              );
                            })}
                          </div>
                        </section>
                        <section className="w-full">
                          <p className="text-xs text-gray-500 mb-1.5 text-center">Paleta general</p>
                          <div className="rounded-2xl bg-gray-800/80 border border-gray-700/60 px-4 py-3">
                            <PaletteBar
                              colors={combinedPalette.slice(0, colorCount)}
                              className="h-10"
                            />
                          </div>
                        </section>
                      </div>
                    </div>
                    <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Paletas</p>
                    </footer>
                  </div>
            </>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

