import { useMemo, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { X, Download } from 'lucide-react';
import { PaletteBar } from './PaletteBar';
import type { ColumnKey } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { NEUTRAL_PALETTE } from './archetypePaletteUtils';
import type { ColumnFlowState } from './ArchetypesCreator';
import { TinderCardPreview } from './TinderCardPreview';
import { QuienTinderErrorBoundary } from './QuienTinderErrorBoundary';
import { getFallbackAxisOrder } from './archetypeAxesConfig';
import type { ArchetypeAxisState } from './archetypeAxesTypes';
import { ColorTag, getSummaryTagsForColumn } from './ColumnSummaryModal';
import {
  ARCHETYPES_GLOBAL_PNG_CAPTURE_ID,
  injectArchetypeSummaryPngExportStyles,
  sanitizeHtml2CanvasCaptureSubtree,
} from './archetypeSummaryPngExport';

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
            rootId: ARCHETYPES_GLOBAL_PNG_CAPTURE_ID,
            styleElementId: 'archetypes-export-snapshot-css',
          });
          sanitizeHtml2CanvasCaptureSubtree(clonedDoc, ARCHETYPES_GLOBAL_PNG_CAPTURE_ID);
        },
      });

      if (canvas.width < 2 || canvas.height < 2) {
        throw new Error('Captura vacía');
      }

      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const fileName = `chromatica-resumen-arquetipos-${stamp}.png`;

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
      console.error('Export PNG resumen arquetipos:', e);
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
  }, []);

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
          className="relative z-10 w-[1200px] max-w-[min(1200px,calc(100vw-2rem))] h-[700px] max-h-[min(700px,calc(100vh-3rem))] flex flex-col shadow-2xl shadow-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archetypes-global-summary-title"
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
          <div
            id={ARCHETYPES_GLOBAL_PNG_CAPTURE_ID}
            ref={captureRef}
            className="flex flex-col flex-1 min-h-0 w-full h-full overflow-hidden rounded-2xl border border-gray-600/60 bg-gradient-to-b from-gray-900 via-gray-900/98 to-gray-900"
          >
          <div className="archetypes-png-header flex items-center justify-between px-6 py-4 border-b border-gray-700/70 bg-gray-900/80">
            <div className="min-w-0 pr-4 archetypes-png-header-title">
              <h2 id="archetypes-global-summary-title" className="text-lg font-semibold text-white">
                Resumen de Arquetipos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Quién, Qué y Cómo
              </p>
            </div>
            <div className="flex items-center gap-2" data-export-skip="true">
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
                      <div className="archetypes-png-tag-wrap flex flex-wrap justify-center content-center gap-2 w-full max-w-[58%]">
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
                                <div key={columnKey} className="palette-bar-png-export w-full">
                                  <PaletteBar colors={palette} labels={paletteLabels} className="h-8" />
                                </div>
                              );
                            })}
                          </div>
                        </section>
                        <section className="w-full">
                          <p className="text-xs text-gray-500 mb-1.5 text-center">Paleta general</p>
                          <div className="rounded-2xl bg-gray-800/80 border border-gray-700/60 px-4 py-3">
                            <div className="palette-bar-png-export w-full">
                              <PaletteBar colors={combinedPalette.slice(0, colorCount)} className="h-10" />
                            </div>
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

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

