import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GuidedPaletteCreator from './components/GuidedPaletteCreator';
import { SplashScreen } from './components/SplashScreen';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading / check if assets are ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setShowSplash(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onEnter={handleEnter} />
      ) : (
        <GuidedPaletteCreator key="app" />
      )}
    </AnimatePresence>
  );
}
