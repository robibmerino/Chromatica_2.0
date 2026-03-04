import ChromaticaLogo from '../ChromaticaLogo';
import { FlowProgress } from './FlowProgress';
import type { Phase, InspirationMode } from '../../types/guidedPalette';

import type { FlowSectionEdited } from './hooks/useGuidedPalette';

interface GuidedPaletteCreatorHeaderProps {
  phase: Phase;
  colorsLength: number;
  currentStepperIndex: number;
  totalStepperSteps: number;
  inspirationMode: InspirationMode | null;
  hasCompletedCurrentFlow: boolean;
  hasPersonalizedFlow: boolean;
  flowSectionEdited: FlowSectionEdited;
  onPhaseClick: (targetPhase: Phase) => void;
  onLogoClick: () => void;
}

export function GuidedPaletteCreatorHeader({
  phase,
  colorsLength,
  currentStepperIndex,
  totalStepperSteps,
  inspirationMode,
  hasCompletedCurrentFlow,
  hasPersonalizedFlow,
  flowSectionEdited,
  onPhaseClick,
  onLogoClick,
}: GuidedPaletteCreatorHeaderProps) {
  return (
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between gap-6">
          <ChromaticaLogo size="sm" onClick={onLogoClick} />

          <div className="mr-[4.75rem] flex justify-end">
            <FlowProgress
              currentStepperIndex={currentStepperIndex}
              totalStepperSteps={totalStepperSteps}
              phase={phase}
              inspirationMode={inspirationMode}
              colorsLength={colorsLength}
              hasCompletedCurrentFlow={hasCompletedCurrentFlow}
              hasPersonalizedFlow={hasPersonalizedFlow}
              flowSectionEdited={flowSectionEdited}
              onPhaseClick={onPhaseClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
