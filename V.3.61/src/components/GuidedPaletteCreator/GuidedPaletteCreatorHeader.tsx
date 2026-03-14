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
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
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
