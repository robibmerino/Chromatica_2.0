import React from 'react';
import ApplicationShowcase from '../ApplicationShowcase';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { SectionBanner, SECTION_ICON_ACCENTS, type SectionIconAccent } from './SectionBanner';
import type { ColorItem } from '../../types/guidedPalette';
import type { InspirationMode } from '../../types/guidedPalette';
import type { SupportPaletteRole, SupportPaletteVariant } from './hooks/useGuidedPalette';

function getApplicationIconAccent(mode: InspirationMode | null): SectionIconAccent {
  if (!mode) return 'emerald';
  if (mode === 'harmony') return 'emerald';
  if (mode === 'image') return 'blue';
  if (mode === 'archetypes-menu' || mode === 'archetypes') return 'rose';
  if (mode === 'shapes') return 'fuchsia';
  if (mode === 'aquarium') return 'amber';
  if (mode === 'design') return 'teal';
  if (mode === 'trending') return 'orange';
  if (mode === 'multi-origin') return 'blue';
  return 'emerald';
}

const APPLICATION_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ApplicationPhaseProps {
  colors: ColorItem[];
  inspirationMode: InspirationMode | null;
  updateColorsWithHistory: (colors: ColorItem[]) => void;
  goBack: () => void;
  goNext: () => void;
  supportColorsList: { role: SupportPaletteRole; label: string; initial: string; hex: string }[];
  supportVariant: SupportPaletteVariant;
  setSupportVariant: (v: SupportPaletteVariant) => void;
  updateSupportColor: (role: SupportPaletteRole, hex: string) => void;
  resetSupportPalette: () => void;
  undo: () => void;
  redo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  hasApplicationSnapshot: boolean;
  onConfirmRestore: () => void;
  onSavePalette?: () => void;
  lockPinned?: boolean;
  onLockToggle?: () => void;
  onOpenHistory?: () => void;
}

function ApplicationPhaseInner({
  colors,
  inspirationMode,
  updateColorsWithHistory,
  goBack,
  goNext,
  supportColorsList,
  supportVariant,
  setSupportVariant,
  updateSupportColor,
  resetSupportPalette,
  undo,
  redo,
  undoDisabled,
  redoDisabled,
  hasApplicationSnapshot,
  onConfirmRestore,
  onSavePalette,
  lockPinned = false,
  onLockToggle,
  onOpenHistory,
}: ApplicationPhaseProps) {
  const [showRestoreConfirm, setShowRestoreConfirm] = React.useState(false);
  const iconAccent = getApplicationIconAccent(inspirationMode);

  const handleRestore = () => {
    onConfirmRestore();
    setShowRestoreConfirm(false);
  };

  return (
    <PhaseLayout
      phaseKey="application"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(var(--app-vh)-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title={COPY.application.title}
          subtitle={COPY.application.subtitle}
          icon={APPLICATION_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS[iconAccent]}
          primaryLabel={COPY.application.primaryAction}
          onPrimaryClick={goNext}
          primaryDisabled={colors.length === 0}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={undoDisabled}
          redoDisabled={redoDisabled}
          savePaletteLabel={COPY.nav.savePalette}
          onSavePalette={onSavePalette}
          lockPinned={lockPinned}
          onLockToggle={onLockToggle}
          lockTooltipSectionName="Aplicar"
          onOpenHistory={onOpenHistory}
        />
      }
      footer={null}
    >
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="application-restore-dialog-title">
          <div className="bg-gray-800 rounded-2xl border border-gray-600 shadow-xl max-w-sm w-full p-6">
            <h3 id="application-restore-dialog-title" className="text-lg font-semibold text-white mb-2">
              {COPY.application.restoreConfirmTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {COPY.application.restoreConfirmMessage}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 text-sm font-medium"
              >
                {COPY.application.restoreConfirmCancel}
              </button>
              <button
                type="button"
                onClick={handleRestore}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium"
              >
                {COPY.application.restoreConfirmOk}
              </button>
            </div>
          </div>
        </div>
      )}
      <ApplicationShowcase
        colors={colors.map((c) => c.hex)}
        onUpdateColors={(newColors, changeDescription) => {
          const updatedColors = newColors.map((hex, i) => ({
            id: colors[i]?.id || `color-${i}`,
            hex,
            locked: colors[i]?.locked ?? false,
          }));
          updateColorsWithHistory(updatedColors, changeDescription);
        }}
        supportColorsList={supportColorsList}
        supportVariant={supportVariant}
        setSupportVariant={setSupportVariant}
        updateSupportColor={updateSupportColor as (role: string, hex: string) => void}
        resetSupportPalette={resetSupportPalette}
      />
    </PhaseLayout>
  );
}

export const ApplicationPhase = React.memo(ApplicationPhaseInner);
