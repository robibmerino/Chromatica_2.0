import { useState } from 'react';
import { Palette, Color } from '../types/palette';
import { cn } from '../utils/cn';

interface SavePanelProps {
  paletteName: string;
  onPaletteNameChange: (name: string) => void;
  onSave: () => void;
  savedPalettes: Palette[];
  onLoadPalette: (palette: Palette) => void;
  onDeletePalette: (id: string) => void;
  colors: Color[];
}

export function SavePanel({
  paletteName,
  onPaletteNameChange,
  onSave,
  savedPalettes,
  onLoadPalette,
  onDeletePalette,
  colors,
}: SavePanelProps) {
  const [showSaved, setShowSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopyCSS = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopySuccess('css');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCopyArray = () => {
    const arr = JSON.stringify(colors.map(c => c.hex));
    navigator.clipboard.writeText(arr);
    setCopySuccess('array');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCopyTailwind = () => {
    const tw = colors.map((c, i) => `'color-${i + 1}': '${c.hex}',`).join('\n  ');
    navigator.clipboard.writeText(`colors: {\n  ${tw}\n}`);
    setCopySuccess('tailwind');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Header with name input */}
      <div className="p-4 border-b border-slate-700/50">
        <label className="block text-slate-400 text-sm mb-2">Nombre de la paleta</label>
        <input
          type="text"
          value={paletteName}
          onChange={(e) => onPaletteNameChange(e.target.value)}
          placeholder="Mi paleta increíble"
          className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
        />
      </div>

      {/* Save Button */}
      <div className="p-4 border-b border-slate-700/50">
        <button
          onClick={onSave}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Guardar Paleta
        </button>
      </div>

      {/* Export Options */}
      <div className="p-4 border-b border-slate-700/50">
        <p className="text-slate-400 text-sm mb-3">Exportar como:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCopyCSS}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1",
              copySuccess === 'css' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {copySuccess === 'css' ? '¡Copiado!' : 'CSS'}
          </button>
          <button
            onClick={handleCopyArray}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1",
              copySuccess === 'array' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
            </svg>
            {copySuccess === 'array' ? '¡Copiado!' : 'Array'}
          </button>
          <button
            onClick={handleCopyTailwind}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1",
              copySuccess === 'tailwind' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" />
            </svg>
            {copySuccess === 'tailwind' ? '¡Copiado!' : 'Tailwind'}
          </button>
        </div>
      </div>

      {/* Saved Palettes */}
      <div className="p-4">
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="w-full flex items-center justify-between text-slate-300 hover:text-white transition-colors"
        >
          <span className="font-medium">Mis Paletas ({savedPalettes.length})</span>
          <svg 
            className={cn(
              "w-5 h-5 transition-transform",
              showSaved && "rotate-180"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSaved && (
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {savedPalettes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                No tienes paletas guardadas
              </p>
            ) : (
              savedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-slate-700/50 rounded-xl p-3 hover:bg-slate-700 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm truncate">
                      {palette.name}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onLoadPalette(palette)}
                        className="p-1.5 bg-violet-500/50 hover:bg-violet-500 rounded-lg transition-colors"
                        title="Cargar"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeletePalette(palette.id)}
                        className="p-1.5 bg-red-500/50 hover:bg-red-500 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex h-6 rounded-lg overflow-hidden">
                    {palette.colors.map((color) => (
                      <div
                        key={color.id}
                        className="flex-1"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
