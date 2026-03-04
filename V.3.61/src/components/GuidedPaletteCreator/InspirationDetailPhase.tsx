import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
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
const ShapesCreator = lazy(() => import('../inspiration/ShapesCreator').then((m) => ({ default: m.default })));
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
            <ArchetypeOrShapeButton type="shapes" onClick={() => onSetInspirationMode('shapes')} />
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
      {inspirationMode === 'shapes' && (
        <Suspense fallback={<ModeFallback />}>
          <ShapesCreator
            colorCount={colorCount}
            onColorCountChange={onColorCountChange}
            onComplete={onComplete}
            onBack={() => onSetInspirationMode('archetypes-menu')}
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
    </motion.div>
  );
}
