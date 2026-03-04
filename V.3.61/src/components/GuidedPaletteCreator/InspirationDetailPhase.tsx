import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { SectionBanner, SECTION_ICON_ACCENTS } from './SectionBanner';
import { ArchetypeOrShapeButton } from './ArchetypeOrShapeButton';
import type { InspirationMode } from '../../types/guidedPalette';
import type { InspirationDetailSavedState } from './hooks/useGuidedPalette';
import type { ArchetypeSavedState } from '../inspiration/ArchetypesCreator';
import type { HarmonySavedState } from '../inspiration/ColorHarmonyCreator';
import type { ImageExtractorSavedState } from '../inspiration/ImageColorExtractor';

// Carga bajo demanda por modo para reducir el chunk inicial de inspiración
const ColorHarmonyCreator = lazy(() => import('../inspiration/ColorHarmonyCreator').then((m) => ({ default: m.default })));
const ImageColorExtractor = lazy(() => import('../inspiration/ImageColorExtractor').then((m) => ({ default: m.default })));
const ArchetypesCreator = lazy(() => import('../inspiration/ArchetypesCreator').then((m) => ({ default: m.ArchetypesCreator })));
const TrendingPalettes = lazy(() => import('../inspiration/TrendingPalettes').then((m) => ({ default: m.default })));

const ModeFallback = () => (
  <div className="flex items-center justify-center min-h-[280px]">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

/** Icono de inspiración (Arquetipos/Formas) para el banner de la sección intermedia. */
const ARCHETYPES_MENU_ICON = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

interface InspirationDetailPhaseProps {
  inspirationMode: InspirationMode | null;
  colorCount: number;
  onColorCountChange: (n: number) => void;
  onComplete: (colors: string[], savedState?: unknown) => void;
  /** Al volver se puede pasar el estado actual para restaurarlo si el usuario vuelve a entrar. */
  onBack: (savedState?: unknown) => void;
  onSetInspirationMode: (mode: InspirationMode) => void;
  inspirationDetailSavedState?: InspirationDetailSavedState;
  /** Se llama cuando cambia el estado del modo actual (ej. Armonía) para poder restaurarlo si el usuario vuelve al menú por el stepper. */
  onStateChange?: (mode: InspirationMode, state: unknown) => void;
  /** Se llama cuando cambia la paleta generada en el modo actual (para Refinar sin "Usar paleta"). */
  onGeneratedPaletteChange?: (mode: InspirationMode, hexColors: string[]) => void;
}

export function InspirationDetailPhase({
  inspirationMode,
  colorCount,
  onColorCountChange,
  onComplete,
  onBack,
  onSetInspirationMode,
  inspirationDetailSavedState = {},
  onStateChange,
  onGeneratedPaletteChange,
}: InspirationDetailPhaseProps) {
  const [showShapesComingSoon, setShowShapesComingSoon] = useState(false);

  return (
    <motion.div
      key="inspiration-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col min-h-0 overflow-hidden"
    >
      {inspirationMode === 'harmony' && (
        <Suspense fallback={<ModeFallback />}>
          <ColorHarmonyCreator
            colorCount={colorCount}
            onColorCountChange={onColorCountChange}
            onComplete={onComplete}
            onBack={onBack}
            initialState={inspirationDetailSavedState.harmony as HarmonySavedState | undefined}
            onStateChange={onStateChange ? (s) => onStateChange('harmony', s) : undefined}
            onGeneratedPaletteChange={onGeneratedPaletteChange ? (hex) => onGeneratedPaletteChange('harmony', hex) : undefined}
          />
        </Suspense>
      )}
      {inspirationMode === 'image' && (
        <Suspense fallback={<ModeFallback />}>
          <ImageColorExtractor
            colorCount={colorCount}
            onColorCountChange={onColorCountChange}
            onComplete={onComplete}
            onBack={onBack}
            initialState={inspirationDetailSavedState.image as ImageExtractorSavedState | undefined}
            onGeneratedPaletteChange={onGeneratedPaletteChange ? (hex) => onGeneratedPaletteChange('image', hex) : undefined}
          />
        </Suspense>
      )}
      {inspirationMode === 'archetypes-menu' && (
        <PhaseLayout
          phaseKey="archetypes-menu"
          className="flex flex-col gap-6 min-h-0 max-w-2xl mx-auto w-full"
          header={
            <SectionBanner
              onBack={onBack}
              title={COPY.inspiration.archetypesMenuTitle}
              subtitle={COPY.inspiration.archetypesMenuSubtitle}
              icon={ARCHETYPES_MENU_ICON}
              iconBoxClassName={SECTION_ICON_ACCENTS.fuchsia}
            />
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArchetypeOrShapeButton type="archetypes" onClick={() => onSetInspirationMode('archetypes')} />
            <ArchetypeOrShapeButton type="shapes" onClick={() => setShowShapesComingSoon(true)} />
          </div>
        </PhaseLayout>
      )}
      {inspirationMode === 'archetypes' && (
        <Suspense fallback={<ModeFallback />}>
          <ArchetypesCreator
            colorCount={colorCount}
            onColorCountChange={onColorCountChange}
            onCreatePalette={onComplete}
            onBack={() => onSetInspirationMode('archetypes-menu')}
            initialState={inspirationDetailSavedState.archetypes as ArchetypeSavedState | undefined}
          />
        </Suspense>
      )}
      {inspirationMode === 'trending' && (
        <Suspense fallback={<ModeFallback />}>
          <TrendingPalettes
            colorCount={colorCount}
            onColorCountChange={onColorCountChange}
            onSelectPalette={onComplete}
            onBack={onBack}
          />
        </Suspense>
      )}

      <AnimatePresence>
        {showShapesComingSoon && (
          <motion.div
            key="shapes-coming-soon"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-2xl border border-fuchsia-500/40 bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 shadow-2xl shadow-black/60 px-6 py-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="shapes-coming-soon-title"
            >
              <button
                type="button"
                onClick={() => setShowShapesComingSoon(false)}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                aria-label="Cerrar aviso"
              >
                ×
              </button>

              <div className="flex flex-col items-center text-center gap-4 pt-1">
                <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/40 shadow-[0_0_40px_rgba(217,70,239,0.45)]">
                  <svg
                    className="w-9 h-9 text-fuchsia-300"
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <circle cx="13" cy="14" r="5.5" />
                    <rect x="22" y="8" width="10" height="10" rx="2.5" />
                    <path d="M8 28.5 L16 22.5 L24 28.5 L16 34.5 Z" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h2
                    id="shapes-coming-soon-title"
                    className="text-lg font-semibold text-white"
                  >
                    Formas llegará muy pronto
                  </h2>
                  <p className="text-sm text-slate-300/90">
                    Estamos diseñando esta sección para que puedas crear paletas a partir de formas
                    abstractas y composiciones visuales.{" "}
                    <span className="text-fuchsia-300 font-medium">Próximamente</span>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShapesComingSoon(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium px-5 py-2.5 shadow-md shadow-fuchsia-900/40 transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
