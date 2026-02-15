import { motion } from 'framer-motion';
import { COPY } from './config/copy';
import ColorHarmonyCreator from '../inspiration/ColorHarmonyCreator';
import ImageColorExtractor from '../inspiration/ImageColorExtractor';
import { ArchetypesCreator } from '../inspiration/ArchetypesCreator';
import ShapesCreator from '../inspiration/ShapesCreator';
import TrendingPalettes from '../inspiration/TrendingPalettes';
import { ArchetypeOrShapeButton } from './ArchetypeOrShapeButton';
import type { InspirationMode } from '../../types/guidedPalette';

interface InspirationDetailPhaseProps {
  inspirationMode: InspirationMode | null;
  colorCount: number;
  onColorCountChange: (n: number) => void;
  onComplete: (colors: string[]) => void;
  onBack: () => void;
  onSetInspirationMode: (mode: InspirationMode) => void;
}

export function InspirationDetailPhase({
  inspirationMode,
  colorCount,
  onColorCountChange,
  onComplete,
  onBack,
  onSetInspirationMode,
}: InspirationDetailPhaseProps) {
  return (
    <motion.div
      key="inspiration-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {inspirationMode === 'harmony' && (
        <ColorHarmonyCreator
          colorCount={colorCount}
          onColorCountChange={onColorCountChange}
          onComplete={onComplete}
          onBack={onBack}
        />
      )}
      {inspirationMode === 'image' && (
        <ImageColorExtractor
          colorCount={colorCount}
          onColorCountChange={onColorCountChange}
          onComplete={onComplete}
          onBack={onBack}
        />
      )}
      {inspirationMode === 'archetypes-menu' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">🎭 ¿Cómo quieres inspirarte?</h2>
            <p className="text-gray-400">Elige entre explorar conceptos o formas abstractas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ArchetypeOrShapeButton type="archetypes" onClick={() => onSetInspirationMode('archetypes')} />
            <ArchetypeOrShapeButton type="shapes" onClick={() => onSetInspirationMode('shapes')} />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl font-medium transition-colors"
              aria-label={COPY.inspiration.backToMenu}
            >
              ← {COPY.inspiration.backToMenu}
            </button>
          </div>
        </div>
      )}
      {inspirationMode === 'archetypes' && (
        <ArchetypesCreator
          colorCount={colorCount}
          onColorCountChange={onColorCountChange}
          onCreatePalette={onComplete}
          onBack={() => onSetInspirationMode('archetypes-menu')}
        />
      )}
      {inspirationMode === 'shapes' && (
        <ShapesCreator
          colorCount={colorCount}
          onColorCountChange={onColorCountChange}
          onComplete={onComplete}
          onBack={() => onSetInspirationMode('archetypes-menu')}
        />
      )}
      {inspirationMode === 'trending' && (
        <TrendingPalettes
          colorCount={colorCount}
          onColorCountChange={onColorCountChange}
          onSelectPalette={onComplete}
          onBack={onBack}
        />
      )}
    </motion.div>
  );
}
