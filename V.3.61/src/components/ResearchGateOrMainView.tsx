import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { MainView } from './MainView';
import { ResearchConsentGate } from './ResearchConsentGate';

/**
 * Si el usuario está logueado (p. ej. por OAuth) y aún no ha aceptado ni rechazado la investigación,
 * muestra la pantalla de consentimiento. En caso contrario muestra MainView.
 * No se muestra MainView hasta que auth haya terminado de cargar, para no saltarse el gate.
 */
export function ResearchGateOrMainView({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { user, loading: authLoading } = useAuth();
  const { consentGiven, consentDeclined, isConfigured } = useResearch();

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showGate =
    Boolean(user) && isConfigured && !consentGiven && !consentDeclined;

  if (showGate) {
    return <ResearchConsentGate />;
  }

  return <MainView onOpenAuth={onOpenAuth} />;
}
