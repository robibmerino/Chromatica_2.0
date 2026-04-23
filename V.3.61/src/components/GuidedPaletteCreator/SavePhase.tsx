import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportPanelPro } from '../export/ExportPanelPro';
import type { ExportPanelProPersistedState } from '../export/ExportPanelPro';
import { generateId } from '../../utils/colorUtils';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { SectionBanner, SECTION_ICON_ACCENTS } from './SectionBanner';
import type { ColorItem, Phase, SavedPalette } from '../../types/guidedPalette';

const SAVE_PHASE_ICON = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
  </svg>
);

interface SavePhaseProps {
  colors: ColorItem[];
  secondaryColors?: string[];
  paletteName: string;
  setPaletteName: (name: string) => void;
  savePalette: () => void;
  removePalette: (id: string) => void;
  savedPalettes: SavedPalette[];
  showMyPalettes: boolean;
  setShowMyPalettes: (v: boolean) => void;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  setPhase: (phase: Phase) => void;
  setSavedPalettes: (palettes: SavedPalette[] | ((prev: SavedPalette[]) => SavedPalette[])) => void;
  showNotification: (msg: string) => void;
  goBack: () => void;
  onStartNewPalette: () => void;
  undo: () => void;
  redo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onSavePalette?: () => void;
  onOpenHistory?: () => void;
  exportPanelState?: ExportPanelProPersistedState;
  onExportPanelStateChange?: (next: ExportPanelProPersistedState) => void;
}

function SavePhaseInner({
  colors,
  secondaryColors = [],
  paletteName,
  setPaletteName,
  savePalette,
  removePalette,
  savedPalettes,
  showMyPalettes,
  setShowMyPalettes,
  setColors,
  setPhase,
  setSavedPalettes: _setSavedPalettes,
  showNotification,
  goBack,
  onStartNewPalette,
  undo,
  redo,
  undoDisabled,
  redoDisabled,
  onSavePalette,
  onOpenHistory,
  exportPanelState,
  onExportPanelStateChange,
}: SavePhaseProps) {
  return (
    <PhaseLayout
      phaseKey="save"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(var(--app-vh)-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title={COPY.savePhase.bannerTitle}
          subtitle={COPY.savePhase.bannerSubtitle}
          icon={SAVE_PHASE_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS.emerald}
          primaryLabel={COPY.savePhase.primaryNewPalette}
          onPrimaryClick={onStartNewPalette}
          primaryDisabled={colors.length === 0}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={undoDisabled}
          redoDisabled={redoDisabled}
          savePaletteLabel={COPY.nav.savePalette}
          onSavePalette={onSavePalette}
          lockTooltipSectionName="Guardar"
          onOpenHistory={onOpenHistory}
        />
      }
      footer={null}
    >
      <div className="flex-1 min-h-0 overflow-hidden w-full flex">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(228px,276px)_minmax(0,1fr)_280px] gap-4 flex-1 items-stretch min-h-[520px] md:min-h-[580px] lg:min-h-[640px]">
          <ExportPanelPro
            colors={colors.map((c) => c.hex)}
            secondaryColors={secondaryColors}
            paletteName={paletteName || 'Mi Paleta'}
            layout="split"
            persistedState={exportPanelState}
            onPersistedStateChange={onExportPanelStateChange}
            renderSplit={({ renderControls, renderPreview, renderStickyDownload }) => (
              <>
                <aside className="order-2 min-w-0 flex flex-col rounded-2xl border border-gray-700/30 bg-gray-800/35 backdrop-blur-sm px-3 pt-3 pb-3 h-full min-h-0 max-h-[min(72vh,720px)] lg:order-none lg:max-h-none">
                  <div className="sticky top-0 z-20 shrink-0 -mx-1 mb-2 rounded-t-lg border-b border-gray-700/50 bg-gray-800/95 px-1 pb-2 backdrop-blur-md">
                    {renderStickyDownload()}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">{renderControls({ compact: true })}</div>
                </aside>
                <main className="order-1 min-w-0 rounded-2xl border border-gray-700/30 overflow-hidden h-full min-h-0 flex flex-col bg-[#1a1a2e] lg:order-none">
                  <div className="flex-1 min-h-0 overflow-hidden px-4 py-4">{renderPreview()}</div>
                </main>
              </>
            )}
          />

          <aside className="order-3 flex flex-col rounded-2xl bg-gray-800/45 backdrop-blur-sm border border-gray-700/50 px-3.5 py-3 gap-3 overflow-hidden h-full min-h-0 lg:order-none">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
              <div className="rounded-xl bg-gray-800/55 border border-gray-700/60 px-3 py-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg border border-emerald-500/35 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-tight">{COPY.savePhase.rightTitle}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{COPY.savePhase.rightSubtitle}</p>
                  </div>
                </div>

                <div className="h-14 rounded-lg overflow-hidden flex mt-3 ring-1 ring-white/10">
                  {colors.map((color) => (
                    <div key={color.id} className="flex-1" style={{ backgroundColor: color.hex }} title={color.hex} />
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  <label htmlFor="save-palette-name" className="text-[11px] text-gray-400 font-medium">
                    {COPY.savePhase.nameLabel}
                  </label>
                  <input
                    id="save-palette-name"
                    type="text"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    placeholder={COPY.savePhase.namePlaceholder}
                    className="w-full bg-gray-900/80 text-white text-sm px-3 py-2.5 rounded-xl border border-gray-600/60 focus:border-emerald-500/45 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={savePalette}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium border border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {COPY.nav.savePalette}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-gray-800/55 border border-gray-700/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowMyPalettes(!showMyPalettes)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-gray-700/30 transition-colors"
                  aria-expanded={showMyPalettes}
                  aria-controls="save-my-palettes-list"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-400 shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-100 truncate">{COPY.savePhase.myPalettes}</span>
                    {savedPalettes.length > 0 && (
                      <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                        {savedPalettes.length}
                      </span>
                    )}
                  </div>
                  <motion.span
                    animate={{ rotate: showMyPalettes ? 180 : 0 }}
                    className="text-gray-500 shrink-0"
                    aria-hidden
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showMyPalettes && (
                    <motion.div
                      id="save-my-palettes-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-700/50"
                    >
                      <div className="max-h-[min(280px,40vh)] overflow-y-auto px-2 py-2 space-y-2">
                        {savedPalettes.length === 0 ? (
                          <div className="text-center py-5 px-2">
                            <div className="mx-auto w-10 h-10 rounded-full bg-gray-900/80 border border-gray-700/60 flex items-center justify-center text-gray-500 mb-2">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium text-gray-300">{COPY.savePhase.emptyPalettesTitle}</p>
                            <p className="text-[11px] text-gray-500 mt-1">{COPY.savePhase.emptyPalettesBody}</p>
                          </div>
                        ) : (
                          savedPalettes.map((palette) => (
                            <div
                              key={palette.id}
                              className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/50 hover:border-gray-600 transition-colors group"
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white text-xs font-medium truncate">{palette.name}</h4>
                                  <p className="text-gray-500 text-[10px]">
                                    {new Date(palette.createdAt).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setColors(
                                        palette.colors.map((hex) => ({
                                          id: generateId(),
                                          hex,
                                          locked: false,
                                        }))
                                      );
                                      setPaletteName(palette.name);
                                      setPhase('refinement');
                                      showNotification(COPY.notifications.loaded(palette.name));
                                    }}
                                    className="p-1.5 rounded-md bg-gray-700/80 hover:bg-emerald-600/30 text-gray-300 hover:text-emerald-200 border border-gray-600/60"
                                    title="Editar paleta"
                                    aria-label="Editar paleta"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setColors(
                                        palette.colors.map((hex) => ({
                                          id: generateId(),
                                          hex,
                                          locked: false,
                                        }))
                                      );
                                      setPaletteName(palette.name);
                                      showNotification(COPY.notifications.loadedForExport(palette.name));
                                    }}
                                    className="p-1.5 rounded-md bg-gray-700/80 hover:bg-indigo-600/30 text-gray-300 hover:text-indigo-200 border border-gray-600/60"
                                    title="Cargar para exportar"
                                    aria-label="Cargar para exportar"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`¿Eliminar "${palette.name}"?`)) {
                                        removePalette(palette.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-md bg-gray-700/80 hover:bg-rose-600/30 text-gray-300 hover:text-rose-200 border border-gray-600/60"
                                    title="Eliminar paleta"
                                    aria-label="Eliminar paleta"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="h-6 rounded-md overflow-hidden flex">
                                {palette.colors.map((c, i) => (
                                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2.5 flex gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-[11px] text-emerald-100/80 leading-snug">{COPY.savePhase.tipMyPalettes}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PhaseLayout>
  );
}

export const SavePhase = React.memo(SavePhaseInner);
