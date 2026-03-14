import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePalettesRealtime } from '../hooks/usePalettesRealtime';
import { getSharedPalette } from '../lib/supabaseShare';
import { isSupabaseConfigured } from '../lib/supabase';
import { isResearchAdmin } from '../lib/researchAdmin';
import GuidedPaletteCreator from './GuidedPaletteCreator';
import { ResearchAnalysisPage } from './ResearchAnalysisPage';
import { AccountPanel } from './AccountPanel';
import type { SavedPalette } from '../types/guidedPalette';

interface MainViewProps {
  onOpenAuth: () => void;
}

type ViewMode = 'app' | 'research' | 'account';

/**
 * Envuelve la app, la vista de investigación y el panel de cuenta.
 */
export function MainView({ onOpenAuth }: MainViewProps) {
  const { user } = useAuth();
  usePalettesRealtime(user?.id);
  const [view, setView] = useState<ViewMode>('app');
  const [openPaletteRequest, setOpenPaletteRequest] = useState<
    { palette: SavedPalette; openInPhase: 'refinement' | 'save' } | null
  >(null);
  const hasShareParam =
    typeof window !== 'undefined' && !!new URLSearchParams(window.location.search).get('share')?.trim();
  const [shareLoadState, setShareLoadState] = useState<'idle' | 'loading' | 'done' | 'error'>(
    hasShareParam && isSupabaseConfigured() ? 'loading' : 'idle'
  );
  const shareTokenProcessed = useRef(false);

  useEffect(() => {
    if (shareTokenProcessed.current || !isSupabaseConfigured()) return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share')?.trim();
    if (!token) return;
    shareTokenProcessed.current = true;
    setShareLoadState('loading');
    getSharedPalette(token).then(({ palette, error }) => {
      if (error || !palette) {
        setShareLoadState('error');
        return;
      }
      setOpenPaletteRequest({ palette, openInPhase: 'refinement' });
      setShareLoadState('done');
      setView('app');
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    });
  }, []);

  const openResearch = useCallback(() => setView('research'), []);
  const openAccount = useCallback(() => setView('account'), []);
  const backToApp = useCallback(() => setView('app'), []);

  const handleEditPalette = useCallback((palette: SavedPalette) => {
    setOpenPaletteRequest({ palette, openInPhase: 'refinement' });
    setView('app');
  }, []);

  const handleExportPalette = useCallback((palette: SavedPalette) => {
    setOpenPaletteRequest({ palette, openInPhase: 'save' });
    setView('app');
  }, []);

  const canOpenResearch = isResearchAdmin(user?.email ?? undefined);

  if (view === 'research') {
    return <ResearchAnalysisPage key="research" onBack={backToApp} />;
  }
  if (view === 'account') {
    return (
      <AccountPanel
        key="account"
        onBack={backToApp}
        onEditPalette={handleEditPalette}
        onExportPalette={handleExportPalette}
      />
    );
  }

  if (shareLoadState === 'loading') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-gray-300">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Cargando paleta compartida...</p>
      </div>
    );
  }
  if (shareLoadState === 'error') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-gray-300 p-4">
        <p className="text-center">Enlace no válido o expirado.</p>
        <button
          type="button"
          onClick={() => {
            setShareLoadState('idle');
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
          }}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <GuidedPaletteCreator
      key="app"
      onOpenAuth={onOpenAuth}
      onOpenResearch={canOpenResearch ? openResearch : undefined}
      onOpenAccount={user ? openAccount : undefined}
      initialPaletteRequest={openPaletteRequest}
      onConsumeOpenPalette={() => setOpenPaletteRequest(null)}
    />
  );
}
