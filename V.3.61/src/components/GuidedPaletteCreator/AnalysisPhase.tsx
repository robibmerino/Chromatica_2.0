import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaletteAnalysis from '../PaletteAnalysis';
import { ANALYSIS_TYPE_TABS } from './config/analysisTypeTabsConfig';

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
}

function AnalysisPhaseInner({
  colors,
  analysisType,
  setAnalysisType,
  updateColorsWithHistory,
  setColors,
  showNotification,
  goBack,
  goNext,
}: AnalysisPhaseProps) {
  return (
    <PhaseLayout
      phaseKey="analysis"
      title="🔍 Análisis de la paleta"
      onBack={goBack}
      backLabel={COPY.nav.back}
      className="max-w-5xl mx-auto space-y-6"
      footer={
        <PhaseNav
          onBack={goBack}
          onNext={goNext}
          backLabel={COPY.nav.backToApplication}
          nextLabel={COPY.nav.savePalette}
          nextVariant="green"
          nextIcon="💾"
          className="pt-4"
        />
      }
    >
      <div
        className="flex gap-2 bg-gray-800/50 p-1.5 rounded-xl w-fit mx-auto"
        role="tablist"
        aria-label="Tipo de análisis"
      >
        {ANALYSIS_TYPE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={analysisType === tab.id}
            onClick={() => setAnalysisType(tab.id)}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              analysisType === tab.id
                ? tab.id === 'basic'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span aria-hidden>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {analysisType === 'basic' ? (
          <motion.div
            key="basic-analysis"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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
    </PhaseLayout>
  );
}

export const AnalysisPhase = React.memo(AnalysisPhaseInner);
