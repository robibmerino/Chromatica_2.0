import { lazy, Suspense, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGuidedPalette } from './GuidedPaletteCreator/hooks/useGuidedPalette';
import { GuidedPaletteCreatorHeader } from './GuidedPaletteCreator/GuidedPaletteCreatorHeader';
import { InspirationMenuPhase } from './GuidedPaletteCreator/InspirationMenuPhase';
import { NotificationToast } from './GuidedPaletteCreator/NotificationToast';
import { INSPIRATION_MODE_LABELS } from './GuidedPaletteCreator/config/phasesConfig';

// Fases cargadas bajo demanda para reducir el bundle inicial
const InspirationDetailPhase = lazy(
  () => import('./GuidedPaletteCreator/InspirationDetailPhase').then((m) => ({ default: m.InspirationDetailPhase }))
);
const RefinementPhase = lazy(
  () => import('./GuidedPaletteCreator/RefinementPhase').then((m) => ({ default: m.RefinementPhase }))
);
const ApplicationPhase = lazy(
  () => import('./GuidedPaletteCreator/ApplicationPhase').then((m) => ({ default: m.ApplicationPhase }))
);
const AnalysisPhase = lazy(
  () => import('./GuidedPaletteCreator/AnalysisPhase').then((m) => ({ default: m.AnalysisPhase }))
);
const SavePhase = lazy(
  () => import('./GuidedPaletteCreator/SavePhase').then((m) => ({ default: m.SavePhase }))
);

function PhaseFallback() {
  return (
    <div className="flex items-center justify-center min-h-[320px]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function GuidedPaletteCreator() {
  const state = useGuidedPalette();

  const refinementProps = useMemo(
    () => ({
      inspirationMode: state.inspirationMode,
      colors: state.colors,
      selectedColorIndex: state.selectedColorIndex,
      originalPalette: state.originalPalette,
      historyIndex: state.historyIndex,
      historyLength: state.historyLength,
      sliderReference: state.sliderReference,
      selectedColor: state.selectedColor,
      setColors: state.setColors,
      setSelectedColorIndex: state.setSelectedColorIndex,
      setSliderReference: state.setSliderReference,
      saveToHistory: state.saveToHistory,
      showNotification: state.showNotification,
      undo: state.undo,
      redo: state.redo,
      updateColor: state.updateColor,
      addColor: state.addColor,
      removeColorAt: state.removeColorAt,
      adjustPaletteSaturation: state.adjustPaletteSaturation,
      adjustPaletteLightness: state.adjustPaletteLightness,
      adjustPaletteHue: state.adjustPaletteHue,
      supportColorsList: state.supportColorsList,
      updateSupportColor: state.updateSupportColor,
      resetSupportPalette: state.resetSupportPalette,
      resetAllSupportOverrides: state.resetAllSupportOverrides,
      supportVariant: state.supportVariant,
      setSupportVariant: state.setSupportVariant,
      selectedSupportRole: state.selectedSupportRole,
      setSelectedSupportRole: state.setSelectedSupportRole,
      supportOverridesByVariant: state.supportOverridesByVariant,
      refinementGeneralSliders: state.refinementGeneralSliders,
      setRefinementGeneralSliders: state.setRefinementGeneralSliders,
      goBack: state.goBack,
      goNext: state.goNext,
    }),
    [
      state.inspirationMode,
      state.colors,
      state.selectedColorIndex,
      state.originalPalette,
      state.historyIndex,
      state.historyLength,
      state.sliderReference,
      state.selectedColor,
      state.supportColorsList,
      state.supportVariant,
      state.selectedSupportRole,
      state.supportOverridesByVariant,
      state.refinementGeneralSliders,
      state.setColors,
      state.setSelectedColorIndex,
      state.setSliderReference,
      state.setRefinementGeneralSliders,
      state.saveToHistory,
      state.showNotification,
      state.undo,
      state.redo,
      state.updateColor,
      state.addColor,
      state.removeColorAt,
      state.adjustPaletteSaturation,
      state.adjustPaletteLightness,
      state.adjustPaletteHue,
      state.updateSupportColor,
      state.resetSupportPalette,
      state.resetAllSupportOverrides,
      state.setSupportVariant,
      state.setSelectedSupportRole,
      state.goBack,
      state.goNext,
    ]
  );

  const applicationProps = useMemo(
    () => ({
      colors: state.colors,
      inspirationMode: state.inspirationMode,
      updateColorsWithHistory: state.updateColorsWithHistory,
      goBack: state.goBack,
      goNext: state.goNext,
      supportColorsList: state.supportColorsList,
      supportVariant: state.supportVariant,
      setSupportVariant: state.setSupportVariant,
      updateSupportColor: state.updateSupportColor,
      undo: state.undo,
      redo: state.redo,
      undoDisabled: state.historyIndex <= 0,
      redoDisabled: state.historyIndex >= state.historyLength - 1,
      hasApplicationSnapshot: state.hasApplicationSnapshot,
      onConfirmRestore: state.resetApplicationToSnapshot,
    }),
    [
      state.colors,
      state.inspirationMode,
      state.historyIndex,
      state.historyLength,
      state.supportColorsList,
      state.supportVariant,
      state.hasApplicationSnapshot,
      state.updateColorsWithHistory,
      state.goBack,
      state.goNext,
      state.setSupportVariant,
      state.updateSupportColor,
      state.undo,
      state.redo,
      state.resetApplicationToSnapshot,
    ]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GuidedPaletteCreatorHeader
        phase={state.phase}
        colorsLength={state.colors.length}
        currentStepperIndex={state.currentStepperIndex}
        totalStepperSteps={state.totalStepperSteps}
        inspirationMode={state.inspirationMode}
        hasCompletedCurrentFlow={state.hasCompletedCurrentFlow}
        hasPersonalizedFlow={state.hasPersonalizedCurrentFlow}
        flowSectionEdited={state.flowSectionEdited}
        onPhaseClick={state.goToPhase}
        onLogoClick={state.handleLogoClick}
      />

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col max-w-7xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {state.phase === 'inspiration-menu' && (
            <div className="flex-1 min-h-0 overflow-auto">
              <InspirationMenuPhase onSelectOption={state.handleInspirationSelect} />
            </div>
          )}

          {state.phase === 'inspiration-detail' && (
            <Suspense fallback={<PhaseFallback />}>
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <InspirationDetailPhase
                inspirationMode={state.inspirationMode}
                colorCount={state.colorCount}
                onColorCountChange={state.setColorCount}
                onComplete={state.requestInspirationComplete}
                onBack={state.goBackFromInspirationDetail}
                onSetInspirationMode={state.setInspirationMode}
                inspirationDetailSavedState={state.inspirationDetailSavedState}
                onStateChange={state.reportInspirationDetailState}
                onGeneratedPaletteChange={state.reportInspirationGeneratedPalette}
              />
              </div>
            </Suspense>
          )}

          {state.phase === 'refinement' && (
            <Suspense fallback={<PhaseFallback />}>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <RefinementPhase {...refinementProps} />
              </div>
            </Suspense>
          )}

          {state.phase === 'application' && (
            <Suspense fallback={<PhaseFallback />}>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ApplicationPhase {...applicationProps} />
              </div>
            </Suspense>
          )}

          {state.phase === 'analysis' && (
            <Suspense fallback={<PhaseFallback />}>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <AnalysisPhase
              colors={state.colors}
              analysisType={state.analysisType}
              setAnalysisType={state.setAnalysisType}
              updateColorsWithHistory={state.updateColorsWithHistory}
              setColors={state.setColors}
              showNotification={state.showNotification}
              goBack={state.goBack}
              goNext={state.goNext}
            />
              </div>
            </Suspense>
          )}

          {state.phase === 'save' && (
            <Suspense fallback={<PhaseFallback />}>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <SavePhase
              colors={state.colors}
              paletteName={state.paletteName}
              setPaletteName={state.setPaletteName}
              savePalette={state.savePalette}
              savedPalettes={state.savedPalettes}
              showMyPalettes={state.showMyPalettes}
              setShowMyPalettes={state.setShowMyPalettes}
              setColors={state.setColors}
              setPhase={state.setPhase}
              setSavedPalettes={state.setSavedPalettes}
              showNotification={state.showNotification}
              goBack={state.goBack}
              onStartNewPalette={state.handleStartNewPalette}
            />
              </div>
            </Suspense>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {state.notification && <NotificationToast message={state.notification} />}
      </AnimatePresence>

      {state.pendingInspirationComplete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspiration-overwrite-dialog-title"
        >
          <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 id="inspiration-overwrite-dialog-title" className="text-lg font-semibold text-white mb-2">
              ¿Usar esta paleta?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              En la cadena &quot;{INSPIRATION_MODE_LABELS[state.pendingInspirationComplete.inspirationMode]}&quot; ya
              has visitado Refinar, Aplicar, Análisis o Guardar. Al usar esta paleta se borrarán los cambios realizados
              en esas secciones para este flujo.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={state.cancelInspirationComplete}
                className="px-4 py-2 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={state.confirmInspirationComplete}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                Sí, usar paleta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
