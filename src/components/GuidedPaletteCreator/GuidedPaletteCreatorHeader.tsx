import ChromaticaLogo from '../ChromaticaLogo';
import { FlowProgress } from './FlowProgress';
import type { Phase } from '../../types/guidedPalette';

interface GuidedPaletteCreatorHeaderProps {
  phase: Phase;
  colorsLength: number;
  currentPhaseIndex: number;
  onPhaseClick: (targetPhase: Phase) => void;
  onLogoClick: () => void;
}

export function GuidedPaletteCreatorHeader({
  phase,
  colorsLength,
  currentPhaseIndex,
  onPhaseClick,
  onLogoClick,
}: GuidedPaletteCreatorHeaderProps) {
  return (
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <ChromaticaLogo size="sm" onClick={onLogoClick} />

          <div className="mr-10 flex justify-end">
            <FlowProgress
              currentPhaseIndex={currentPhaseIndex}
              phase={phase}
              colorsLength={colorsLength}
              onPhaseClick={onPhaseClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
