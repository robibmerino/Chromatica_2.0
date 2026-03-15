import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { MainView } from './MainView';
import { ResearchConsentGate } from './ResearchConsentGate';

/**
 * Si el usuario está logueado (p. ej. por OAuth) y aún no ha aceptado ni rechazado la investigación,
 * muestra la pantalla de consentimiento. En caso contrario muestra MainView.
 */
export function ResearchGateOrMainView({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { user } = useAuth();
  const { consentGiven, consentDeclined, isConfigured } = useResearch();

  const showGate =
    Boolean(user) && isConfigured && !consentGiven && !consentDeclined;

  if (showGate) {
    return <ResearchConsentGate />;
  }

  return <MainView onOpenAuth={onOpenAuth} />;
}
