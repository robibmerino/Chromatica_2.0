/**
 * Fase Refinar: tres columnas (ajustar un color | ajustar la paleta | ejemplos).
 * - Izquierda: paleta central (8 slots), paleta de apoyo (claro/oscuro), editor (sliders + Complementario/Triádico/Cuadrado).
 * - Centro: barra de reordenar colores, sliders de tono/saturación/luminosidad sobre toda la paleta, mismos botones de armonía.
 * - Derecha: PosterExamples (vista previa y leyendas).
 */
import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { getContrastColor } from '../../utils/colorUtils';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { SectionBanner, SECTION_ICON_ACCENTS, type SectionIconAccent } from './SectionBanner';
import { RefinementColorMode } from './RefinementColorMode';
import { RefinementGeneralMode } from './RefinementGeneralMode';
import PosterExamples from '../PosterExamples';
import type { ColorItem } from '../../types/guidedPalette';
import type { InspirationMode } from '../../types/guidedPalette';
import type { SupportPaletteRole, SupportPaletteVariant } from './hooks/useGuidedPalette';

/** Margen superior del bloque de sliders en columna central para alinearlo con la izquierda. */
const REFINEMENT_SLIDERS_BLOCK_MARGIN = 'mt-48';

function getRefinementIconAccent(mode: InspirationMode | null): SectionIconAccent {
  if (!mode) return 'emerald';
  if (mode === 'harmony') return 'emerald';
  if (mode === 'image') return 'blue';
  if (mode === 'archetypes-menu' || mode === 'archetypes' || mode === 'shapes') return 'fuchsia';
  if (mode === 'trending') return 'orange';
  return 'emerald';
}

const REFINAR_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
);

interface RefinementPhaseProps {
  inspirationMode: InspirationMode | null;
  colors: ColorItem[];
  selectedColorIndex: number | null;
  originalPalette: ColorItem[];
  historyIndex: number;
  historyLength: number;
  sliderReference: ColorItem[];
  selectedColor: ColorItem | null;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  setSelectedColorIndex: (index: number | null) => void;
  setSliderReference: (colors: ColorItem[]) => void;
  saveToHistory: (colors: ColorItem[]) => void;
  showNotification: (msg: string) => void;
  undo: () => void;
  redo: () => void;
  updateColor: (id: string, hex: string) => void;
  addColor: () => void;
  removeColorAt: (index: number) => void;
  adjustPaletteSaturation: (amount: number) => void;
  adjustPaletteLightness: (amount: number) => void;
  adjustPaletteHue: (amount: number) => void;
  supportColorsList: { role: SupportPaletteRole; label: string; initial: string; hex: string }[];
  updateSupportColor: (role: SupportPaletteRole, hex: string) => void;
  resetSupportPalette: () => void;
  /** Reinicia todas las overrides de paleta de apoyo (al confirmar Reiniciar general). */
  resetAllSupportOverrides: () => void;
  supportVariant: SupportPaletteVariant;
  setSupportVariant: (v: SupportPaletteVariant) => void;
  selectedSupportRole: SupportPaletteRole | null;
  setSelectedSupportRole: (role: SupportPaletteRole | null) => void;
  /** Overrides de paleta de apoyo por variante (claro/oscuro) para que la vista previa los refleje. */
  supportOverridesByVariant: Record<SupportPaletteVariant, Partial<Record<SupportPaletteRole, string>>>;
  goBack: () => void;
  goNext: () => void;
}

function RefinementPhaseInner({
  inspirationMode,
  colors,
  selectedColorIndex,
  originalPalette,
  historyIndex,
  historyLength,
  sliderReference,
  selectedColor,
  setColors,
  setSelectedColorIndex,
  setSliderReference,
  saveToHistory,
  showNotification,
  undo,
  redo,
  updateColor,
  addColor,
  removeColorAt,
  adjustPaletteSaturation,
  adjustPaletteLightness,
  adjustPaletteHue,
  supportColorsList,
  updateSupportColor,
  resetSupportPalette,
  resetAllSupportOverrides,
  supportVariant,
  setSupportVariant,
  selectedSupportRole,
  setSelectedSupportRole,
  supportOverridesByVariant,
  goBack,
  goNext,
}: RefinementPhaseProps) {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoreKey, setRestoreKey] = useState(0);
  const iconAccent = getRefinementIconAccent(inspirationMode);
  const handleRestore = () => {
    setColors([...originalPalette]);
    saveToHistory([...originalPalette]);
    resetAllSupportOverrides();
    setRestoreKey((k) => k + 1);
    showNotification(COPY.notifications.paletteRestored);
    setShowRestoreConfirm(false);
  };

  return (
    <PhaseLayout
      phaseKey="refinement"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(100vh-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title={COPY.refinement.title}
          subtitle={COPY.refinement.subtitle}
          icon={REFINAR_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS[iconAccent]}
          primaryLabel={COPY.refinement.primaryAction}
          onPrimaryClick={goNext}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={historyIndex <= 0}
          redoDisabled={historyIndex >= historyLength - 1}
          restoreLabel={COPY.refinement.restoreLabel}
          onRestore={originalPalette.length > 0 ? () => setShowRestoreConfirm(true) : undefined}
        />
      }
      footer={null}
    >
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="restore-dialog-title">
          <div className="bg-gray-800 rounded-2xl border border-gray-600 shadow-xl max-w-sm w-full p-6">
            <h3 id="restore-dialog-title" className="text-lg font-semibold text-white mb-2">
              {COPY.refinement.restoreConfirmTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {COPY.refinement.restoreConfirmMessage}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 text-sm font-medium"
              >
                {COPY.refinement.restoreConfirmCancel}
              </button>
              <button
                type="button"
                onClick={handleRestore}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium"
              >
                {COPY.refinement.restoreConfirmOk}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1 overflow-hidden">
        {/* Columna izquierda: ajustar un color, editarlo, añadir/quitar */}
        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Ajusta un color</h3>
          <RefinementColorMode
            colors={colors}
            selectedColorIndex={selectedColorIndex}
            selectedColor={selectedColor}
            setColors={setColors}
            setSelectedColorIndex={setSelectedColorIndex}
            saveToHistory={saveToHistory}
            showNotification={showNotification}
            updateColor={updateColor}
            addColor={addColor}
            removeColorAt={removeColorAt}
            supportColorsList={supportColorsList}
            updateSupportColor={updateSupportColor}
            resetSupportPalette={resetSupportPalette}
            supportVariant={supportVariant}
            setSupportVariant={setSupportVariant}
            selectedSupportRole={selectedSupportRole}
            setSelectedSupportRole={setSelectedSupportRole}
            showExamples={false}
          />
        </div>

        {/* Columna central: reordenar + ajustes sobre toda la paleta */}
        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Ajusta la paleta</h3>
          <div className="mt-14">
            <p className="text-xs text-gray-500 text-center mb-0">
              Cambio de orden de colores
            </p>
            <div className="bg-gray-800/50 rounded-2xl p-4 -mt-1">
              <Reorder.Group
              axis="x"
              values={colors}
              onReorder={(newOrder) => {
                setColors(newOrder);
                setTimeout(() => saveToHistory(newOrder), 100);
              }}
              className="h-12 rounded-xl overflow-hidden flex shadow-lg"
            >
              {colors.map((color, index) => (
                <Reorder.Item
                  key={color.id}
                  value={color}
                  className="flex-1 cursor-grab active:cursor-grabbing relative group min-w-0"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColorIndex(index)}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all ${
                      selectedColorIndex === index ? 'ring-4 ring-white ring-inset' : ''
                    }`}
                  >
                    <span
                      className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/30"
                      style={{ color: getContrastColor(color.hex) }}
                      aria-hidden
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            </div>
          </div>
          <div className={REFINEMENT_SLIDERS_BLOCK_MARGIN}>
            <RefinementGeneralMode
            colors={colors}
            sliderReference={sliderReference}
            setColors={setColors}
            setSliderReference={setSliderReference}
            saveToHistory={saveToHistory}
            adjustPaletteSaturation={adjustPaletteSaturation}
            adjustPaletteLightness={adjustPaletteLightness}
            adjustPaletteHue={adjustPaletteHue}
            restoreKey={restoreKey}
            />
          </div>
        </div>

        {/* Columna derecha: mismos ejemplos de aplicación que en Armonía de color */}
        <div className="flex flex-col min-h-0">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Ejemplos de aplicación</h3>
          <PosterExamples
            colors={colors.map((c) => c.hex)}
            layout="preview-first"
            supportOverridesByVariant={supportOverridesByVariant}
          />
        </div>
      </div>
    </PhaseLayout>
  );
}

export const RefinementPhase = React.memo(RefinementPhaseInner);
