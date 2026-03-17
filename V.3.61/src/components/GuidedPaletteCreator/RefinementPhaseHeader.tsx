import { COPY } from './config/copy';
import type { ColorItem } from '../../types/guidedPalette';

interface RefinementPhaseHeaderProps {
  originalPalette: ColorItem[];
  historyIndex: number;
  historyLength: number;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
  onRestoreOriginal: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShuffle: () => void;
}

export function RefinementPhaseHeader({
  originalPalette,
  historyIndex,
  historyLength,
  canUndo,
  canRedo,
  onBack,
  onRestoreOriginal,
  onUndo,
  onRedo,
  onShuffle,
}: RefinementPhaseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        aria-label={COPY.refinement.backAria}
      >
        <span aria-hidden>←</span>
        <span>{COPY.refinement.back}</span>
      </button>
      <h2 className="text-xl font-semibold text-white">🔧 Refina tu paleta</h2>
      <div className="flex gap-2">
        {originalPalette.length > 0 && (
          <button
            type="button"
            onClick={onRestoreOriginal}
            className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg text-sm transition-colors flex items-center gap-1.5"
            title="Restaurar la paleta con la que empezaste"
            aria-label={COPY.refinement.restoreInitialAria}
          >
            <span aria-hidden>↩</span>
            <span className="hidden sm:inline">{COPY.refinement.restoreInitial}</span>
          </button>
        )}
        <div className="flex gap-1" role="group" aria-label="Historial de cambios">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg text-sm transition-colors ${
              canUndo
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Deshacer (Ctrl+Z)"
            aria-label={COPY.refinement.undo}
          >
            <span aria-hidden>↶</span>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg text-sm transition-colors ${
              canRedo
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Rehacer (Ctrl+Y)"
            aria-label={COPY.refinement.redo}
          >
            <span aria-hidden>↷</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onShuffle}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          aria-label={COPY.refinement.shuffle}
        >
          <span aria-hidden>🔀</span> {COPY.refinement.shuffleButton}
        </button>
      </div>
    </div>
  );
}
