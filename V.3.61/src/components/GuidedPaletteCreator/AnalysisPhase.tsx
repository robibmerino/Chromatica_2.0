import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaletteAnalysis from '../PaletteAnalysis';
import { ANALYSIS_TYPE_TABS } from './config/analysisTypeTabsConfig';
import { SectionBanner, SECTION_ICON_ACCENTS } from './SectionBanner';
import { PaletteBar } from '../inspiration/PaletteBar';

const ScientificAnalysis = lazy(() => import('../ScientificAnalysis').then((m) => ({ default: m.default })));
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { PhaseNav } from './PhaseNav';
import type { AnalysisTypeId } from './config/analysisTypeTabsConfig';
import type { ColorItem } from '../../types/guidedPalette';

interface AnalysisPhaseProps {
  colors: ColorItem[];
  analysisType: AnalysisTypeId;
  setAnalysisType: (t: AnalysisTypeId) => void;
  updateColorsWithHistory: (colors: ColorItem[]) => void;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  showNotification: (msg: string) => void;
  goBack: () => void;
  goNext: () => void;
  undo: () => void;
  redo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onSavePalette?: () => void;
  lockPinned?: boolean;
  onLockToggle?: () => void;
  onOpenHistory?: () => void;
}

const ANALYSIS_ICON = (
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
    <circle cx="11" cy="11" r="6" />
    <line x1="16" y1="16" x2="21" y2="21" />
  </svg>
);

function AnalysisPhaseInner({
  colors,
  analysisType,
  setAnalysisType,
  updateColorsWithHistory,
  setColors,
  showNotification,
  goBack,
  goNext,
  undo,
  redo,
  undoDisabled,
  redoDisabled,
  onSavePalette,
  lockPinned = false,
  onLockToggle,
  onOpenHistory,
}: AnalysisPhaseProps) {
  return (
    <PhaseLayout
      phaseKey="analysis"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(100vh-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title="Análisis de la paleta"
          subtitle="Detecta problemas de contraste, equilibrio y accesibilidad y aplica correcciones guiadas."
          icon={ANALYSIS_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS.blue}
          primaryLabel="Guardar / Exportar →"
          onPrimaryClick={goNext}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={undoDisabled}
          redoDisabled={redoDisabled}
          savePaletteLabel={COPY.nav.savePalette}
          onSavePalette={onSavePalette}
          lockPinned={lockPinned}
          onLockToggle={onLockToggle}
          lockTooltipSectionName="Análisis"
          onOpenHistory={onOpenHistory}
        />
      }
      footer={null}
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden w-full">
        <section className="rounded-2xl bg-gray-800/60 border border-gray-700/70 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Izquierda: tabs Guiado/Avanzado */}
          <div className="flex justify-start">
            <div
              className="flex gap-2 bg-gray-900/70 p-1.5 rounded-xl border border-gray-700/80"
              role="tablist"
              aria-label="Tipo de análisis"
            >
              {ANALYSIS_TYPE_TABS.map((tab) => {
                const isActive = analysisType === tab.id;
            const activeClasses =
              'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/70';
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setAnalysisType(tab.id)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      isActive
                        ? activeClasses
                        : 'text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 hover:text-white border border-gray-700/80'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.14em]">
                      {tab.id === 'basic' ? 'GUIADO' : 'AVANZADO'}
                    </span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Derecha: paleta */}
          <div className="w-full max-w-md md:ml-auto">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-1 text-right">
              Paleta actual
            </p>
            <PaletteBar colors={colors.map((c) => c.hex)} className="h-6" />
          </div>
        </section>

        <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-gray-700/70 bg-gray-900/60">
          <AnimatePresence mode="wait">
            {analysisType === 'basic' ? (
              <motion.div
                key="basic-analysis"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full min-h-0 overflow-y-auto p-4 md:p-6 analysis-scroll-area"
              >
                <PaletteAnalysis
                  colors={colors.map((c) => c.hex)}
                  onApplyFix={(newColors) => {
                    const updated = colors.map((c, i) => ({
                      ...c,
                      hex: newColors[i] || c.hex,
                    }));
                    updateColorsWithHistory(updated);
                    showNotification(COPY.notifications.correctionApplied);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="scientific-analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full min-h-0 overflow-y-auto p-4 md:p-6 analysis-scroll-area"
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[320px]">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <ScientificAnalysis
                    colors={colors.map((c) => c.hex)}
                    onUpdateColors={(newColors: string[]) => {
                      setColors((prev) =>
                        prev.map((c, i) => ({
                          ...c,
                          hex: newColors[i] || c.hex,
                        }))
                      );
                      showNotification(COPY.notifications.changesApplied);
                    }}
                  />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PhaseLayout>
  );
}

export const AnalysisPhase = React.memo(AnalysisPhaseInner);
