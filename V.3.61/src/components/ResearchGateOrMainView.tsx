import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { MainView } from './MainView';
import { ResearchConsentGate } from './ResearchConsentGate';

/**
 * Gate de investigación: solo se muestra si el usuario está logueado y aún no tiene
 * consentimiento ni rechazo registrado para su user id.
 *
 * - Cuentas existentes en Supabase que ya aceptaron o rechazaron (por userId o legacy '1')
 *   nunca ven la confirmación: consentGiven o consentDeclined es true.
 * - Si la cuenta se eliminó y el usuario se vuelve a registrar (nuevo user id), sí verá
 *   el gate de nuevo porque no hay consent/decline para ese id.
 *
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
