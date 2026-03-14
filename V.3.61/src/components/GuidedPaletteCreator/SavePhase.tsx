import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportPanelPro } from '../export/ExportPanelPro';
import { getContrastColor, generateId } from '../../utils/colorUtils';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import type { ColorItem, Phase, SavedPalette } from '../../types/guidedPalette';

interface SavePhaseProps {
  colors: ColorItem[];
  paletteName: string;
  setPaletteName: (name: string) => void;
  savePalette: () => void;
  removePalette: (id: string) => void;
  savedPalettes: SavedPalette[];
  showMyPalettes: boolean;
  setShowMyPalettes: (v: boolean) => void;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  setPhase: (phase: Phase) => void;
  setSavedPalettes: (palettes: SavedPalette[] | ((prev: SavedPalette[]) => SavedPalette[])) => void;
  showNotification: (msg: string) => void;
  goBack: () => void;
  onStartNewPalette: () => void;
}

function SavePhaseInner({
  colors,
  paletteName,
  setPaletteName,
  savePalette,
  removePalette,
  savedPalettes,
  showMyPalettes,
  setShowMyPalettes,
  setColors,
  setPhase,
  setSavedPalettes,
  showNotification,
  goBack,
  onStartNewPalette,
}: SavePhaseProps) {
  return (
    <PhaseLayout
      phaseKey="save"
      title="🎉 ¡Tu paleta está lista!"
      onBack={goBack}
      className="flex flex-col gap-8 min-h-0 max-h-[calc(100vh-10rem)]"
    >
      <div className="flex-1 min-h-0 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-2xl p-6 border border-green-500/30 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Guardar en Mis Paletas</h3>
                <p className="text-green-300/70 text-sm">Accede más tarde desde tu colección</p>
              </div>
            </div>

            <div className="h-20 rounded-xl overflow-hidden flex mb-5 shadow-lg ring-1 ring-white/10">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1 flex items-end justify-center pb-2 relative group"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      color: getContrastColor(color.hex),
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {color.hex.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300 font-medium">Nombre de la paleta</label>
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Mi paleta increíble"
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
              <button
                onClick={savePalette}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                {COPY.nav.savePalette}
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-green-500/20">
              <button
                type="button"
                onClick={() => setShowMyPalettes(!showMyPalettes)}
                className="w-full flex items-center justify-between text-left"
                aria-expanded={showMyPalettes}
                aria-controls="save-my-palettes-list"
              >
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span className="text-green-300 font-medium">Mis Paletas</span>
                  {savedPalettes.length > 0 && (
                    <span className="text-xs bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full">
                      {savedPalettes.length}
                    </span>
                  )}
                </div>
                <motion.span
                  animate={{ rotate: showMyPalettes ? 180 : 0 }}
                  className="text-green-400 text-sm"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {showMyPalettes && (
                  <motion.div
                    id="save-my-palettes-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {savedPalettes.length === 0 ? (
                        <div className="text-center py-6 text-green-300/50">
                          <span className="text-2xl block mb-2">📭</span>
                          <p className="text-sm">Aún no tienes paletas guardadas</p>
                        </div>
                      ) : (
                        savedPalettes.map((palette) => (
                          <div
                            key={palette.id}
                            className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-green-500/30 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white text-sm font-medium truncate">
                                  {palette.name}
                                </h4>
                                <p className="text-gray-500 text-xs">
                                  {new Date(palette.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setColors(
                                      palette.colors.map((hex) => ({
                                        id: generateId(),
                                        hex,
                                        locked: false,
                                      }))
                                    );
                                    setPaletteName(palette.name);
                                    setPhase('refinement');
                                    showNotification(COPY.notifications.loaded(palette.name));
                                  }}
                                  className="p-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg text-xs transition-colors"
                                  title="Editar paleta"
                                  aria-label="Editar paleta"
                                >
                                  <span aria-hidden>✏️</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setColors(
                                      palette.colors.map((hex) => ({
                                        id: generateId(),
                                        hex,
                                        locked: false,
                                      }))
                                    );
                                    setPaletteName(palette.name);
                                    showNotification(COPY.notifications.loadedForExport(palette.name));
                                  }}
                                  className="p-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-xs transition-colors"
                                  title="Cargar para exportar"
                                  aria-label="Cargar para exportar"
                                >
                                  <span aria-hidden>📤</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`¿Eliminar "${palette.name}"?`)) {
                                      removePalette(palette.id);
                                    }
                                  }}
                                  className="p-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-xs transition-colors"
                                  title="Eliminar paleta"
                                  aria-label="Eliminar paleta"
                                >
                                  <span aria-hidden>🗑️</span>
                                </button>
                              </div>
                            </div>
                            <div className="h-8 rounded-lg overflow-hidden flex">
                              {palette.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="flex-1"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 p-3 bg-green-500/10 rounded-xl">
              <p className="text-xs text-green-300/70">
                💡 Desde &quot;Mis Paletas&quot; puedes editar o exportar cualquier paleta guardada.
              </p>
            </div>
          </div>
        </div>

          <div className="xl:col-span-2">
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Exportar Paleta</h3>
                <p className="text-purple-300/70 text-sm">
                  Descarga en imagen o copia el código para tu proyecto
                </p>
              </div>
            </div>

            <ExportPanelPro
              colors={colors.map((c) => c.hex)}
              paletteName={paletteName || 'Mi Paleta'}
            />
          </div>
        </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-700/50">
        <p className="text-gray-400 text-sm">¿Listo para crear más?</p>
        <button
          onClick={onStartNewPalette}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-white rounded-xl font-medium transition-all border border-indigo-500/30 flex items-center gap-2"
        >
          <span>✨</span>
          Crear nueva paleta
          <span>→</span>
        </button>
        </div>
      </div>
    </PhaseLayout>
  );
}

export const SavePhase = React.memo(SavePhaseInner);
