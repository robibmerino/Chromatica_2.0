import { BarChart3 } from 'lucide-react';
import ChromaticaLogo from '../ChromaticaLogo';
import { FlowProgress } from './FlowProgress';
import { AuthMenu } from './AuthMenu';
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
  onOpenAuth: () => void;
  /** Si está definido, se muestra el enlace "Análisis investigación". */
  onOpenResearch?: () => void;
  /** Si está definido, se muestra el enlace a Cuenta (perfil y mis paletas). */
  onOpenAccount?: () => void;
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
  onOpenAuth,
  onOpenResearch,
  onOpenAccount,
}: GuidedPaletteCreatorHeaderProps) {
  return (
    <div className="relative h-full w-full px-4">
      <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <ChromaticaLogo size="sm" />
          <AuthMenu onOpenAuth={onOpenAuth} onOpenAccount={onOpenAccount} />
          {onOpenResearch && (
            <button
              type="button"
              onClick={onOpenResearch}
              className="flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
              title="Análisis de datos para investigación"
              aria-label="Análisis investigación"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex h-full items-center justify-center">
        <div className="w-full min-w-0">
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
  );
}
