import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGuidedPalette } from './GuidedPaletteCreator/hooks/useGuidedPalette';
import { GuidedPaletteCreatorHeader } from './GuidedPaletteCreator/GuidedPaletteCreatorHeader';
import { InspirationMenuPhase } from './GuidedPaletteCreator/InspirationMenuPhase';
import { NotificationToast } from './GuidedPaletteCreator/NotificationToast';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GuidedPaletteCreatorHeader
        phase={state.phase}
        colorsLength={state.colors.length}
        currentPhaseIndex={state.currentPhaseIndex}
        onPhaseClick={state.goToPhase}
        onLogoClick={state.handleLogoClick}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {state.phase === 'inspiration-menu' && (
            <InspirationMenuPhase onSelectOption={state.handleInspirationSelect} />
          )}

          {state.phase === 'inspiration-detail' && (
            <Suspense fallback={<PhaseFallback />}>
              <InspirationDetailPhase
                inspirationMode={state.inspirationMode}
                colorCount={state.colorCount}
                onColorCountChange={state.setColorCount}
                onComplete={state.handleInspirationComplete}
                onBack={state.goBack}
                onSetInspirationMode={state.setInspirationMode}
              />
            </Suspense>
          )}

          {state.phase === 'refinement' && (
            <Suspense fallback={<PhaseFallback />}>
              <RefinementPhase
              inspirationMode={state.inspirationMode}
              colors={state.colors}
              selectedColorIndex={state.selectedColorIndex}
              originalPalette={state.originalPalette}
              historyIndex={state.historyIndex}
              historyLength={state.historyLength}
              sliderReference={state.sliderReference}
              selectedColor={state.selectedColor}
              setColors={state.setColors}
              setSelectedColorIndex={state.setSelectedColorIndex}
              setSliderReference={state.setSliderReference}
              saveToHistory={state.saveToHistory}
              showNotification={state.showNotification}
              undo={state.undo}
              redo={state.redo}
              updateColor={state.updateColor}
              addColor={state.addColor}
              removeColorAt={state.removeColorAt}
              adjustPaletteSaturation={state.adjustPaletteSaturation}
              adjustPaletteLightness={state.adjustPaletteLightness}
              adjustPaletteHue={state.adjustPaletteHue}
              supportColorsList={state.supportColorsList}
              updateSupportColor={state.updateSupportColor}
              resetSupportPalette={state.resetSupportPalette}
              resetAllSupportOverrides={state.resetAllSupportOverrides}
              supportVariant={state.supportVariant}
              setSupportVariant={state.setSupportVariant}
              selectedSupportRole={state.selectedSupportRole}
              setSelectedSupportRole={state.setSelectedSupportRole}
              supportOverridesByVariant={state.supportOverridesByVariant}
              goBack={state.goBack}
              goNext={state.goNext}
            />
            </Suspense>
          )}

          {state.phase === 'application' && (
            <Suspense fallback={<PhaseFallback />}>
              <ApplicationPhase
              colors={state.colors}
              inspirationMode={state.inspirationMode}
              updateColorsWithHistory={state.updateColorsWithHistory}
              goBack={state.goBack}
              goNext={state.goNext}
              supportColorsList={state.supportColorsList}
              supportVariant={state.supportVariant}
              setSupportVariant={state.setSupportVariant}
              updateSupportColor={state.updateSupportColor}
              undo={state.undo}
              redo={state.redo}
              undoDisabled={state.historyIndex <= 0}
              redoDisabled={state.historyIndex >= state.historyLength - 1}
              hasApplicationSnapshot={state.hasApplicationSnapshot}
              onConfirmRestore={state.resetApplicationToSnapshot}
            />
            </Suspense>
          )}

          {state.phase === 'analysis' && (
            <Suspense fallback={<PhaseFallback />}>
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
            </Suspense>
          )}

          {state.phase === 'save' && (
            <Suspense fallback={<PhaseFallback />}>
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
            </Suspense>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {state.notification && <NotificationToast message={state.notification} />}
      </AnimatePresence>
    </div>
  );
}
