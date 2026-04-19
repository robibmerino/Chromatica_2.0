import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ResearchProvider } from './contexts/ResearchContext';
import { ResearchGateOrMainView } from './components/ResearchGateOrMainView';
import { AuthPage } from './components/AuthPage';
import { SplashScreen } from './components/SplashScreen';
import { SetNewPasswordOverlay } from './components/SetNewPasswordOverlay';
import { SyncDemographics } from './components/SyncDemographics';
import { supabase } from './lib/supabase';

function getInitialShowSplash(): boolean {
  if (typeof window === 'undefined') return true;
  const hash = window.location.hash;
  if (hash.includes('access_token=') || hash.includes('refresh_token=')) return false;
  if (new URLSearchParams(window.location.search).get('share')?.trim()) return false;
  return true;
}

/** Origen del flujo de auth: primera entrada (splash) o desde la app. */
type AuthEntry = 'main' | 'first-access' | null;

export function App() {
  const [showSplash, setShowSplash] = useState(getInitialShowSplash);
  const [showAuthView, setShowAuthView] = useState(false);
  const [authEntry, setAuthEntry] = useState<AuthEntry>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = useCallback(async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('guidedPaletteWorkingState.v1');
    }
    setShowSplash(false);

    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthEntry(null);
        setShowAuthView(false);
        return;
      }
    }

    setAuthEntry('first-access');
    setShowAuthView(true);
  }, []);

  const openAuth = useCallback(() => {
    setAuthEntry('main');
    setShowAuthView(true);
  }, []);

  const closeAuth = useCallback(() => {
    setShowAuthView(false);
    if (authEntry === 'first-access') {
      setShowSplash(true);
    }
    setAuthEntry(null);
  }, [authEntry]);

  const finishAuthSuccess = useCallback(() => {
    setShowAuthView(false);
    setAuthEntry(null);
  }, []);

  const continueWithoutAuthFromEntry = useCallback(() => {
    setShowAuthView(false);
    setAuthEntry(null);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /** Misma ventana (lab + acceso) al entrar desde el splash o desde «Iniciar sesión» en la app. */
  const labEntryAside =
    authEntry === 'first-access' || authEntry === 'main'
      ? { onContinueWithoutAuth: continueWithoutAuthFromEntry }
      : undefined;

  return (
    <AuthProvider>
      <SyncDemographics />
      <ResearchProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onEnter={handleEnter} />
          ) : showAuthView ? (
            <AuthPage
              key="auth"
              onBack={closeAuth}
              onSuccess={finishAuthSuccess}
              labEntryAside={labEntryAside}
              backLabel={authEntry === 'first-access' ? 'Inicio' : 'Volver'}
            />
          ) : (
            <ResearchGateOrMainView key="app" onOpenAuth={openAuth} />
          )}
        </AnimatePresence>
      </ResearchProvider>
      <SetNewPasswordOverlay />
    </AuthProvider>
  );
}
