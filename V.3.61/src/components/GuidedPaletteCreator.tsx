import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuidedPalette } from './GuidedPaletteCreator/hooks/useGuidedPalette';
import { SavePaletteModal } from './GuidedPaletteCreator/SavePaletteModal';
import { PaletteHistoryModal } from './GuidedPaletteCreator/PaletteHistoryModal';
import type { SavedFromSection } from '../types/guidedPalette';
import type { InspirationMode } from '../types/guidedPalette';
import type { OpenPaletteRequest } from './GuidedPaletteCreator/hooks/useGuidedPalette';
import { GuidedPaletteCreatorHeader } from './GuidedPaletteCreator/GuidedPaletteCreatorHeader';
import { InspirationMenuPhase } from './GuidedPaletteCreator/InspirationMenuPhase';
import { NotificationToast } from './GuidedPaletteCreator/NotificationToast';
import { PaletteBar } from './inspiration/PaletteBar';
import PosterExamples from './PosterExamples';
import { INSPIRATION_MODE_LABELS } from './GuidedPaletteCreator/config/phasesConfig';
import { blendColorsVibrant } from './inspiration/archetypePaletteUtils';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

const COMBINED_MODES_UI = [
  {
    id: 'balanced',
    label: 'Equilibrada',
    title: 'Equilibrada',
    description: 'Mezcla los flujos a partes iguales y reduce saturaciones muy altas.',
  },
  {
    id: 'flow-first',
    label: 'Priorizar orden de flujos',
    title: 'Priorizar orden de flujos',
    description: 'Recorre 1º color de cada flujo, luego el 2º, etc., respetando el orden de origen.',
  },
  {
    id: 'palette-first',
    label: 'Priorizar orden de paleta',
    title: 'Priorizar orden de paleta',
    description: 'Avanza dentro de cada paleta: 1º de la primera, 2º de la segunda, 3º de la tercera…',
  },
  {
    id: 'soft-gradient',
    label: 'Gradiente suave',
    title: 'Gradiente suave',
    description: 'Crea una transición continua entre todos los colores, con saltos muy suaves.',
  },
  {
    id: 'custom',
    label: 'Personalizado',
    title: 'Personalizado',
    description: 'Permite ajustar manualmente cada color con el gotero inferior.',
  },
] as const;

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

interface GuidedPaletteCreatorProps {
  onOpenAuth: () => void;
  /** Solo se pasa si el usuario está en la allowlist de investigación; muestra el enlace "Análisis investigación". */
  onOpenResearch?: () => void;
  /** Solo se pasa si hay usuario logueado; abre el panel de cuenta (perfil y mis paletas). */
  onOpenAccount?: () => void;
  /** Petición para abrir una paleta en Refinar o Guardar (desde Mis paletas). Se consume al aplicar. */
  initialPaletteRequest?: OpenPaletteRequest | null;
  /** Llamado cuando se ha aplicado la petición para que el padre limpie la referencia. */
  onConsumeOpenPalette?: () => void;
}

export default function GuidedPaletteCreator({
  onOpenAuth,
  onOpenResearch,
  onOpenAccount,
  initialPaletteRequest,
  onConsumeOpenPalette,
}: GuidedPaletteCreatorProps) {
  const { user } = useAuth();
  const state = useGuidedPalette({ initialPaletteRequest, onConsumeOpenPalette });

  const [showSavePaletteModal, setShowSavePaletteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [combinedPaletteModalColors, setCombinedPaletteModalColors] = useState<string[] | null>(null);
  const [showCombinedPaletteModal, setShowCombinedPaletteModal] = useState(false);
  const [combinedPaletteModalIndividuals, setCombinedPaletteModalIndividuals] = useState<
    { mode: InspirationMode; colors: string[] }[]
  >([]);
  const [combinedMode, setCombinedMode] = useState<
    'balanced' | 'flow-first' | 'palette-first' | 'soft-gradient' | 'custom'
  >('balanced');
  const [combinedColorCount, setCombinedColorCount] = useState<number>(4);

  const handleSavePaletteClick = useCallback(() => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setShowSavePaletteModal(true);
  }, [user, onOpenAuth]);

  useEffect(() => {
    if (!showHistoryModal) return;
    if (state.phase === 'refinement' || state.phase === 'application' || state.phase === 'analysis') {
      return;
    }
    setShowHistoryModal(false);
  }, [showHistoryModal, state.phase]);

  const saveModalSection: SavedFromSection | null =
    state.phase === 'refinement'
      ? 'refinement'
      : state.phase === 'application'
        ? 'application'
        : state.phase === 'analysis'
          ? 'analysis'
          : null;
  const saveModalSuggestions =
    saveModalSection != null ? state.getSaveSuggestions(saveModalSection) : { suggestedName: '', nextVersion: 1 };

  useEffect(() => {
    if (!showCombinedPaletteModal) return;
    if (!combinedPaletteModalIndividuals.length && !combinedPaletteModalColors) return;
    recomputeCombinedPaletteForModal();
  }, [
    combinedMode,
    combinedColorCount,
    combinedPaletteModalIndividuals,
    showCombinedPaletteModal,
  ]);

  // Si estamos en el flujo "Paleta combinada" y el usuario pulsa ese paso en la cadena,
  // la fase pasa a inspiration-detail (sin pantalla asociada). En ese caso,
  // redirigimos de vuelta al menú de inspiración y abrimos el modal de paleta combinada.
  useEffect(() => {
    if (
      !showCombinedPaletteModal &&
      state.phase === 'inspiration-detail' &&
      state.inspirationMode === 'multi-origin'
    ) {
      const currentHexes =
        Array.isArray(state.colors) && state.colors.length && 'hex' in state.colors[0]
          ? (state.colors as { hex: string }[]).map((c) => c.hex)
          : (state.colors as unknown as string[]);
      handleOpenCombinedPaletteModal(currentHexes);
      state.setPhase('inspiration-menu');
    }
  }, [state.phase, state.inspirationMode, showCombinedPaletteModal]);

  const handleOpenCombinedPaletteModal = (colors: string[]) => {
    const individuals: { mode: InspirationMode; colors: string[] }[] = [];
    const byMode = state.flowActivePaletteByMode ?? {};
    (Object.entries(byMode) as [InspirationMode, string[] | undefined][]).forEach(
      ([mode, palette]) => {
        if (mode === 'multi-origin') return;
        if (!palette || palette.length === 0) return;
        individuals.push({ mode, colors: palette });
      }
    );
    setCombinedPaletteModalIndividuals(individuals);
    setShowCombinedPaletteModal(true);
    // Usar los ajustes actuales para proponer la paleta combinada inicial en el modal
    recomputeCombinedPaletteForModal(individuals, colors);
  };

  const recomputeCombinedPaletteForModal = (
    sourceIndividuals?: { mode: InspirationMode; colors: string[] }[],
    fallbackColors?: string[]
  ) => {
    const individuals = sourceIndividuals ?? combinedPaletteModalIndividuals;
    if (!individuals.length && !fallbackColors) return;
    const palettes = (individuals.length ? individuals : [{ colors: fallbackColors ?? [] }]).map(
      (item) => (item.colors && item.colors.length ? item.colors : [])
    );
    if (palettes.length === 0 || palettes.every((p) => p.length === 0)) return;
    const count = combinedColorCount;
    const getPaletteColor = (palette: string[], index: number) =>
      palette[index % palette.length] ?? palette[palette.length - 1] ?? '#666666';

    let result: string[] = [];
    const MAX_SAT = 72;

    if (combinedMode === 'balanced') {
      const raw = Array.from({ length: count }, (_, i) =>
        blendColorsVibrant(palettes.map((pal) => getPaletteColor(pal, i)))
      );
      // Ajuste final: evitar saturaciones extremas en la paleta combinada
      result = raw.map((hex) => {
        const hsl = hexToHsl(hex);
        if (hsl.s <= MAX_SAT) return hex;
        const newS = MAX_SAT;
        return hslToHex(hsl.h, newS, hsl.l);
      });
    } else if (combinedMode === 'flow-first') {
      // Recorre primero el primer color de cada paleta, luego el segundo, etc.
      let round = 0;
      while (result.length < count) {
        for (const pal of palettes) {
          if (!pal.length) continue;
          result.push(getPaletteColor(pal, round));
          if (result.length >= count) break;
        }
        round += 1;
      }
    } else if (combinedMode === 'palette-first') {
      // Coge el 1er color de la 1ª paleta, 2º de la 2ª, 3º de la 3ª, etc.;
      // después 2º de la 1ª, 3º de la 2ª, etc.
      const n = palettes.length;
      if (n === 0) return;
      let cycle = 0;
      while (result.length < count) {
        for (let pIdx = 0; pIdx < n && result.length < count; pIdx++) {
          const pal = palettes[pIdx];
          if (!pal.length) continue;
          const colorIndex = pIdx + cycle;
          result.push(getPaletteColor(pal, colorIndex));
        }
        cycle += 1;
      }
    } else {
      // soft-gradient: muestrea sobre la concatenación de todas las paletas
      const flattened: string[] = [];
      palettes.forEach((pal) => {
        pal.forEach((hex) => flattened.push(hex));
      });
      if (!flattened.length) return;
      const len = flattened.length;
      const raw = Array.from({ length: count }, (_, i) => {
        if (count === 1) return flattened[0];
        const t = i / (count - 1);
        const idxFloat = t * (len - 1);
        const idx0 = Math.floor(idxFloat);
        const idx1 = Math.min(len - 1, idx0 + 1);
        const c0 = flattened[idx0];
        const c1 = flattened[idx1];
        if (c0 === c1) return c0;
        return blendColorsVibrant([c0, c1]);
      });
      // Mismo límite de saturación que en el modo equilibrado
      result = raw.map((hex) => {
        const hsl = hexToHsl(hex);
        if (hsl.s <= MAX_SAT) return hex;
        const newS = MAX_SAT;
        return hslToHex(hsl.h, newS, hsl.l);
      });
    }

    setCombinedPaletteModalColors(result);
  };

  const refinementProps = useMemo(
    () => ({
      inspirationMode: state.inspirationMode,
      colors: state.colors,
      selectedColorIndex: state.selectedColorIndex,
      originalPalette: state.originalPalette,
      historyIndex: state.historyIndex,
      historyLength: state.historyLength,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
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
      onSavePalette: handleSavePaletteClick,
      lockPinned: state.sectionLocked.refinement,
      onLockToggle: () => state.toggleSectionLock('refinement'),
      onOpenHistory: () => setShowHistoryModal(true),
    }),
    [
      state.inspirationMode,
      state.colors,
      state.selectedColorIndex,
      state.originalPalette,
      state.historyIndex,
      state.historyLength,
      state.canUndo,
      state.canRedo,
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
      handleSavePaletteClick,
      state.sectionLocked.refinement,
      state.toggleSectionLock,
      setShowHistoryModal,
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
      resetSupportPalette: state.resetSupportPalette,
      undo: state.undo,
      redo: state.redo,
      undoDisabled: !state.canUndo,
      redoDisabled: !state.canRedo,
      hasApplicationSnapshot: state.hasApplicationSnapshot,
      onConfirmRestore: state.resetApplicationToSnapshot,
      onSavePalette: handleSavePaletteClick,
      lockPinned: state.sectionLocked.application,
      onLockToggle: () => state.toggleSectionLock('application'),
      onOpenHistory: () => setShowHistoryModal(true),
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
      state.resetSupportPalette,
      state.undo,
      state.redo,
      state.resetApplicationToSnapshot,
      handleSavePaletteClick,
      state.sectionLocked.application,
      state.toggleSectionLock,
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
        onOpenAuth={onOpenAuth}
        onOpenResearch={onOpenResearch}
        onOpenAccount={onOpenAccount}
      />

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col max-w-7xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {state.phase === 'inspiration-menu' && (
            <div className="flex-1 min-h-0 overflow-auto">
              <InspirationMenuPhase
                onSelectOption={state.handleInspirationSelectFromMenu ?? state.handleInspirationSelect}
                activePalettesByMode={state.flowActivePaletteByMode}
                onOpenCombinedPalette={handleOpenCombinedPaletteModal}
              />
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
                  undo={state.undo}
                  redo={state.redo}
                  undoDisabled={!state.canUndo}
                  redoDisabled={!state.canRedo}
                  onSavePalette={handleSavePaletteClick}
                  lockPinned={state.sectionLocked.analysis}
                  onLockToggle={() => state.toggleSectionLock('analysis')}
                  onOpenHistory={() => setShowHistoryModal(true)}
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
              removePalette={state.removePalette}
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

      {showSavePaletteModal && saveModalSection != null && (
        <SavePaletteModal
          open={showSavePaletteModal}
          onClose={() => setShowSavePaletteModal(false)}
          onSave={(params) => {
            state.savePaletteFromSection(params);
            setShowSavePaletteModal(false);
          }}
          section={saveModalSection}
          suggestedName={saveModalSuggestions.suggestedName}
          nextVersion={saveModalSuggestions.nextVersion}
          getNextVersionForName={state.getNextVersionForName}
          hasExactDuplicateColors={state.hasExactDuplicateColors}
        />
      )}

      <PaletteHistoryModal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        entries={state.stateHistory ?? []}
        currentIndex={state.historyIndex}
        onSelectIndex={(i) => state.goToHistoryIndex(i)}
        minSelectableIndex={state.historyMinIndex}
        onRemoveEntry={state.removeHistoryEntry}
      />

      {showCombinedPaletteModal && combinedPaletteModalColors && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="combined-palette-dialog-title"
        >
          <div className="relative w-[1200px] max-w-full h-[640px] overflow-hidden rounded-2xl border border-gray-600/60 bg-gradient-to-b from-gray-900 via-gray-900/98 to-gray-900 shadow-2xl shadow-black/50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/70 bg-gray-900/80">
              <div>
                <h2
                  id="combined-palette-dialog-title"
                  className="text-lg font-semibold text-white"
                >
                  Paleta combinada
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Generada a partir de las paletas activas de los orígenes seleccionados.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {state.hasMultiOriginFlow && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCombinedPaletteModal(false);
                      state.setInspirationMode('multi-origin');
                      state.setPhase('inspiration-detail');
                      state.goToPhase('refinement');
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-gray-100 border border-gray-600 font-medium transition-colors"
                  >
                    Ver/editar paleta anterior
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    state.handleUseCombinedPalette(combinedPaletteModalColors);
                    setShowCombinedPaletteModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-sm text-white border border-sky-400/60 font-medium transition-colors"
                >
                  Usar esta nueva paleta →
                </button>
                <button
                  type="button"
                  onClick={() => setShowCombinedPaletteModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  aria-label="Cerrar resumen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-row gap-4 p-4">
              {/* Columna izquierda: ejemplos de aplicación (usando la paleta combinada) */}
              <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 flex flex-col p-4">
                  <div className="flex-1 min-h-0 origin-top scale-[0.78]">
                    <PosterExamples
                      colors={combinedPaletteModalColors}
                      layout="preview-first"
                    />
                  </div>
                </div>
                <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Aplicación
                  </p>
                </footer>
              </div>

              {/* Columna central: ajustes de combinación */}
              <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 flex flex-col p-4 gap-6">
                  {/* Selector número de colores */}
                  <section className="space-y-2 flex flex-col items-center">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                      Número de colores
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {[4, 5, 6, 7, 8].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setCombinedColorCount(count)}
                          className={`w-8 py-1 rounded-lg text-xs font-medium transition-all ${
                            combinedColorCount === count
                              ? 'bg-sky-600 text-white border border-sky-400/70'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200 border border-gray-700/70'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Modos + descripciones: filas botón + texto alineadas */}
                  <section className="flex-1 min-h-0 flex items-center justify-center">
                    <div className="w-full max-w-xl flex flex-col gap-2.5">
                      {COMBINED_MODES_UI.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center gap-3 min-h-[48px]"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setCombinedMode(
                                opt.id as
                                  | 'balanced'
                                  | 'flow-first'
                                  | 'palette-first'
                                  | 'soft-gradient'
                                  | 'custom'
                              )
                            }
                            className={`w-40 h-11 px-3 rounded-lg text-xs font-medium text-left transition-all flex-shrink-0 ${
                              combinedMode === opt.id
                                ? 'bg-sky-600 text-white border border-sky-400/70'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700/80 hover:text-gray-50 border border-gray-700/70'
                            }`}
                          >
                            {opt.label}
                          </button>
                          <div className="w-px bg-gray-700/60 self-stretch" />
                          <p
                            className="flex-1 text-xs leading-snug text-gray-400"
                          >
                            <span
                              className={`font-semibold ${
                                combinedMode === opt.id ? 'text-sky-300' : 'text-gray-300'
                              }`}
                            >
                              {opt.title}
                            </span>{' '}
                            {opt.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ajustes
                  </p>
                </footer>
              </div>

              {/* Columna derecha: paletas individuales + paleta combinada */}
              <div className="flex-1 min-w-0 rounded-xl bg-gray-800/40 border border-gray-700/50 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-auto">
                  <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[260px]">
                    {combinedPaletteModalIndividuals.length > 0 && (
                      <section className="w-full">
                        <p className="text-xs text-gray-500 mb-1.5 text-center">
                          Paletas individuales
                        </p>
                        <div className="flex flex-col gap-4">
                          {combinedPaletteModalIndividuals.map(({ mode, colors }) => {
                            const palette = colors.slice(0, 8);
                            const label =
                              INSPIRATION_MODE_LABELS[mode] ?? (mode as string);
                            const titleColor = palette[0] ?? '#e5e7eb';
                            return (
                              <div key={mode} className="flex flex-col gap-1.5">
                                <p
                                  className="text-xs font-medium text-center truncate"
                                  style={{ color: titleColor }}
                                  title={label}
                                >
                                  {label}
                                </p>
                                <PaletteBar
                                  colors={palette}
                                  className="h-8"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                    <section className="w-full">
                      <p className="text-xs text-gray-500 mb-1.5 text-center">
                        Paleta combinada
                      </p>
                      <div className="rounded-2xl bg-gray-900/80 border border-gray-700/60 px-4 py-3">
                        <PaletteBar
                          colors={combinedPaletteModalColors.slice(0, 8)}
                          className="h-8"
                        />
                      </div>
                      {combinedMode === 'custom' && (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {combinedPaletteModalColors.slice(0, 8).map((hex, index) => (
                            <label
                              key={`${hex}-${index}`}
                              className="relative w-7 h-7 rounded-full overflow-hidden cursor-pointer border border-gray-600/70"
                              style={{ backgroundColor: hex }}
                            >
                              <input
                                type="color"
                                value={hex}
                                onChange={(e) => {
                                  const newHex = e.target.value;
                                  setCombinedPaletteModalColors((prev) => {
                                    if (!prev) return prev;
                                    const next = [...prev];
                                    next[index] = newHex;
                                    return next;
                                  });
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
                <footer className="shrink-0 border-t border-gray-700/50 py-2.5 px-3 text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Paleta
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}

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
