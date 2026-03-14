import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ResearchProvider } from './contexts/ResearchContext';
import { MainView } from './components/MainView';
import { AuthPage } from './components/AuthPage';
import { SplashScreen } from './components/SplashScreen';
import { SetNewPasswordOverlay } from './components/SetNewPasswordOverlay';
import { SyncDemographics } from './components/SyncDemographics';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthView, setShowAuthView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const hasShare = new URLSearchParams(window.location.search).get('share')?.trim();
      const returningFromOAuth =
        typeof window !== 'undefined' &&
        (window.location.hash.includes('access_token=') || window.location.hash.includes('refresh_token='));
      if (hasShare || returningFromOAuth) setShowSplash(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = useCallback(() => {
    setShowSplash(false);
  }, []);

  const openAuth = useCallback(() => setShowAuthView(true), []);
  const closeAuth = useCallback(() => setShowAuthView(false), []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <SyncDemographics />
      <ResearchProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onEnter={handleEnter} />
          ) : showAuthView ? (
            <AuthPage key="auth" onBack={closeAuth} />
          ) : (
            <MainView key="app" onOpenAuth={openAuth} />
          )}
        </AnimatePresence>
      </ResearchProvider>
      <SetNewPasswordOverlay />
    </AuthProvider>
  );
}
