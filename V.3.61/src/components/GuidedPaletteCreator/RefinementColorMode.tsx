import { useState, useRef, useEffect } from 'react';
import PosterExamples from '../PosterExamples';
import { hexToHsl, hslToHex, getContrastColor } from '../../utils/colorUtils';
import { REFINEMENT_QUICK_ADJUSTMENTS } from './config/refinementQuickAdjustmentsConfig';
import { COLOR_COUNT_MAX } from './config/refinementConstants';
import type { ColorItem } from '../../types/guidedPalette';
import type { QuickAdjustmentItem } from './config/refinementQuickAdjustmentsConfig';
import type { SupportPaletteRole, SupportPaletteVariant } from './hooks/useGuidedPalette';

interface SupportColorItem {
  role: SupportPaletteRole;
  label: string;
  initial: string;
  hex: string;
}

interface RefinementColorModeProps {
  colors: ColorItem[];
  selectedColorIndex: number | null;
  selectedColor: ColorItem | null;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  setSelectedColorIndex: (index: number | null) => void;
  saveToHistory: (colors: ColorItem[]) => void;
  showNotification: (msg: string) => void;
  updateColor: (id: string, hex: string) => void;
  addColor?: () => void;
  removeColorAt?: (index: number) => void;
  supportColorsList: SupportColorItem[];
  updateSupportColor: (role: SupportPaletteRole, hex: string) => void;
  resetSupportPalette: () => void;
  supportVariant: SupportPaletteVariant;
  setSupportVariant: (v: SupportPaletteVariant) => void;
  selectedSupportRole: SupportPaletteRole | null;
  setSelectedSupportRole: (role: SupportPaletteRole | null) => void;
  /** Si false, no se muestra el bloque de Ejemplos de aplicación (se usa en Refinar con 3 columnas). */
  showExamples?: boolean;
}

function getQuickAdjustmentAction(
  item: QuickAdjustmentItem,
  selectedColor: ColorItem,
  updateColor: (id: string, hex: string) => void
): () => void {
  const hsl = hexToHsl(selectedColor.hex);
  switch (item.type) {
    case 'complement':
      return () =>
        updateColor(selectedColor.id, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
    case 'triadic':
      return () =>
        updateColor(selectedColor.id, hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
    case 'square':
      return () =>
        updateColor(selectedColor.id, hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
    default:
      return () => {};
  }
}

/** Inicial y nombre completo por posición en la paleta (leyenda: P=Principal, S=Secundario, A=Acento, etc.). */
const PALETTE_ROLE_LABELS: { initial: string; label: string }[] = [
  { initial: 'P', label: 'Principal' },
  { initial: 'S', label: 'Secundario' },
  { initial: 'A', label: 'Acento' },
  { initial: 'A2', label: 'Acento 2' },
  { initial: 'P2', label: 'Principal 2' },
  { initial: 'S2', label: 'Secundario 2' },
  { initial: 'A3', label: 'Acento 3' },
  { initial: 'A4', label: 'Acento 4' },
];

function getRoleForIndex(index: number): { initial: string; label: string } {
  return PALETTE_ROLE_LABELS[index] ?? { initial: String(index + 1), label: `Color ${index + 1}` };
}

export function RefinementColorMode({
  colors,
  selectedColorIndex,
  selectedColor,
  setColors: _setColors,
  setSelectedColorIndex,
  saveToHistory: _saveToHistory,
  showNotification: _showNotification,
  updateColor,
  addColor: addColorProp,
  removeColorAt,
  supportColorsList,
  updateSupportColor,
  resetSupportPalette,
  supportVariant,
  setSupportVariant,
  selectedSupportRole,
  setSelectedSupportRole,
  showExamples = true,
}: RefinementColorModeProps) {
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null);
  const [hoveredSupportIndex, setHoveredSupportIndex] = useState<number | null>(null);
  const [hoveredQuickItem, setHoveredQuickItem] = useState<QuickAdjustmentItem['type'] | null>(null);
  const lastKnownHueRef = useRef(0);
  const lastKnownSatRef = useRef(50);
  const canAdd = colors.length < COLOR_COUNT_MAX && addColorProp;
  const canRemove = colors.length > 2 && selectedColorIndex !== null && removeColorAt;
  const selectedSupportItem = selectedSupportRole ? supportColorsList.find((s) => s.role === selectedSupportRole) : null;

  // Preservar matiz y saturación cuando no están definidos (s=0, o l=0 / l=100)
  const editingColorHex = selectedSupportItem?.hex ?? selectedColor?.hex;
  useEffect(() => {
    if (editingColorHex) {
      const { h, s, l } = hexToHsl(editingColorHex);
      if (l > 0 && l < 100) {
        lastKnownSatRef.current = s;
        if (s > 0) lastKnownHueRef.current = h;
      }
    }
  }, [editingColorHex]);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-gray-800/50 rounded-2xl p-4">
        <div className="flex items-center justify-end gap-1 mb-2">
          {canAdd && (
            <button
              onClick={addColorProp}
              className="p-1.5 bg-gray-700/50 hover:bg-green-600/30 text-gray-400 hover:text-green-400 rounded-lg transition-colors"
              title="Añadir color"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          {canRemove && (
            <button
              onClick={() => removeColorAt(selectedColorIndex!)}
              className="p-1.5 bg-gray-700/50 hover:bg-red-600/30 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
              title="Eliminar color seleccionado"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center mb-3">
          Paleta central
        </p>
        {/* Paleta principal: siempre 8 slots del mismo tamaño; uno puede ser el botón añadir */}
        <div className="grid grid-cols-8 gap-1.5 mb-3">
          {Array.from({ length: COLOR_COUNT_MAX }, (_, index) => {
            const color = colors[index];
            if (color) {
              const role = getRoleForIndex(index);
              return (
                <div
                  key={color.id}
                  className="relative flex flex-col items-center min-w-0"
                  onMouseEnter={() => setHoveredColorIndex(index)}
                  onMouseLeave={() => setHoveredColorIndex(null)}
                >
                  {hoveredColorIndex === index && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-gray-700 text-gray-200 shadow-lg">
                      {role.label}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedSupportRole(null);
                    }}
                    className={`w-full aspect-square rounded-xl transition-all min-h-0 ${
                      selectedColorIndex === index ? 'ring-4 ring-white scale-105' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={role.label}
                  >
                    <span className="text-[10px] font-bold sm:text-xs" style={{ color: getContrastColor(color.hex) }}>
                      {role.initial}
                    </span>
                  </button>
                </div>
              );
            }
            if (canAdd && index === colors.length) {
              return (
                <button
                  key="add"
                  onClick={addColorProp}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-600/50 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-gray-400 transition-colors min-h-0 w-full"
                  title="Añadir nuevo color"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              );
            }
            return <div key={`empty-${index}`} className="aspect-square rounded-xl bg-gray-700/30 min-h-0" aria-hidden />;
          })}
        </div>
        {/* Paleta de apoyo: título, controles arriba a la derecha, luego swatches */}
        {supportColorsList.length > 0 && (
          <>
            <p className="text-xs text-gray-500 text-center mt-12 mb-3">
              Paleta de apoyo {supportVariant === 'claro' ? 'claro' : 'oscuro'}
            </p>
            <div className="flex justify-between items-center gap-2 mb-2">
              <div className="flex rounded-lg border border-gray-600/50 p-0.5 bg-gray-700/30">
                <button
                  type="button"
                  onClick={() => setSupportVariant('claro')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    supportVariant === 'claro' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setSupportVariant('oscuro')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    supportVariant === 'oscuro' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Oscuro
                </button>
              </div>
              <button
                type="button"
                onClick={resetSupportPalette}
                className="p-2 rounded-lg bg-gray-700/80 hover:bg-gray-600 text-gray-400 hover:text-gray-300 border border-gray-600 transition-colors"
                title="Restaurar paleta de apoyo al ajuste predeterminado (Automático)"
                aria-label="Restaurar paleta de apoyo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {supportColorsList.map((item, index) => (
                <div
                  key={item.role}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredSupportIndex(index)}
                  onMouseLeave={() => setHoveredSupportIndex(null)}
                >
                  {hoveredSupportIndex === index && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-gray-700 text-gray-200 shadow-lg">
                      {item.label}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSupportRole(item.role);
                      setSelectedColorIndex(null);
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all flex items-center justify-center flex-shrink-0 ${
                      selectedSupportRole === item.role ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.label}
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold" style={{ color: getContrastColor(item.hex) }}>
                      {item.initial}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-4">
        {(selectedColor || selectedSupportItem) ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <label
                className="relative w-12 h-12 rounded-lg cursor-pointer flex-shrink-0 block overflow-hidden group"
                style={{ backgroundColor: (selectedSupportItem ?? selectedColor)!.hex }}
                title="Abrir selector de color"
              >
                <input
                  type="color"
                  value={(selectedSupportItem ?? selectedColor)!.hex}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (selectedSupportItem) updateSupportColor(selectedSupportItem.role, hex);
                    else updateColor(selectedColor!.id, hex);
                  }}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  aria-hidden
                >
                  <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                  </svg>
                </span>
              </label>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-medium text-sm">
                  {selectedSupportItem ? selectedSupportItem.label : selectedColorIndex !== null ? getRoleForIndex(selectedColorIndex).label : 'Color'}
                </h3>
                <input
                  type="text"
                  value={(selectedSupportItem ?? selectedColor)!.hex.toUpperCase()}
                  onChange={(e) => {
                    if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) return;
                    const hex = e.target.value;
                    if (selectedSupportItem) updateSupportColor(selectedSupportItem.role, hex);
                    else updateColor(selectedColor!.id, hex);
                  }}
                  className="bg-gray-700 text-white font-mono text-xs px-2 py-0.5 rounded mt-0.5 w-full max-w-[7rem]"
                />
              </div>
            </div>

            {(() => {
              const editingHex = (selectedSupportItem ?? selectedColor)!.hex;
              const hsl = hexToHsl(editingHex);
              const hasMeaningfulHue = hsl.s > 0 && hsl.l > 0 && hsl.l < 100;
              const hasMeaningfulSat = hsl.l > 0 && hsl.l < 100;
              const effectiveHue = hasMeaningfulHue ? hsl.h : lastKnownHueRef.current;
              const effectiveSat = hasMeaningfulSat ? hsl.s : lastKnownSatRef.current;
              return (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400 flex justify-between mb-1">
                      <span>Tono</span>
                      <span>{effectiveHue}°</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={effectiveHue}
                      onChange={(e) => {
                        const newH = parseInt(e.target.value);
                        lastKnownHueRef.current = newH;
                        const newHex = hslToHex(newH, effectiveSat, hsl.l);
                        if (selectedSupportItem) updateSupportColor(selectedSupportItem.role, newHex);
                        else updateColor(selectedColor!.id, newHex);
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(0, ${effectiveSat}%, ${hsl.l}%), hsl(60, ${effectiveSat}%, ${hsl.l}%), hsl(120, ${effectiveSat}%, ${hsl.l}%), hsl(180, ${effectiveSat}%, ${hsl.l}%), hsl(240, ${effectiveSat}%, ${hsl.l}%), hsl(300, ${effectiveSat}%, ${hsl.l}%), hsl(360, ${effectiveSat}%, ${hsl.l}%))`,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 flex justify-between mb-1">
                      <span>Saturación</span>
                      <span>{effectiveSat}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={effectiveSat}
                      onChange={(e) => {
                        const newS = parseInt(e.target.value);
                        lastKnownSatRef.current = newS;
                        const newHex = hslToHex(effectiveHue, newS, hsl.l);
                        if (selectedSupportItem) updateSupportColor(selectedSupportItem.role, newHex);
                        else updateColor(selectedColor!.id, newHex);
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(${effectiveHue}, 0%, ${hsl.l}%), hsl(${effectiveHue}, 100%, ${hsl.l}%))`,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 flex justify-between mb-1">
                      <span>Luminosidad</span>
                      <span>{hsl.l}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) => {
                        const newL = parseInt(e.target.value);
                        const newHex = hslToHex(effectiveHue, effectiveSat, newL);
                        if (selectedSupportItem) updateSupportColor(selectedSupportItem.role, newHex);
                        else updateColor(selectedColor!.id, newHex);
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(${effectiveHue}, ${effectiveSat}%, 0%), hsl(${effectiveHue}, ${effectiveSat}%, 50%), hsl(${effectiveHue}, ${effectiveSat}%, 100%))`,
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {REFINEMENT_QUICK_ADJUSTMENTS.map((item) => (
                <div
                  key={item.type}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredQuickItem(item.type)}
                  onMouseLeave={() => setHoveredQuickItem(null)}
                >
                  {hoveredQuickItem === item.type && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-gray-700 text-gray-200 shadow-lg">
                      {item.degrees}°
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (selectedSupportItem) {
                        const { h, s, l } = hexToHsl(selectedSupportItem.hex);
                        const deg = item.type === 'complement' ? 180 : item.type === 'triadic' ? 120 : 90;
                        updateSupportColor(selectedSupportItem.role, hslToHex((h + deg) % 360, s, l));
                      } else {
                        getQuickAdjustmentAction(item, selectedColor!, updateColor)();
                      }
                    }}
                    className="w-full py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">Selecciona un color de la paleta principal o de apoyo para editarlo</div>
        )}
      </div>

      {showExamples && (
        <div className="bg-gray-800/50 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Ejemplos de aplicación</h3>
          <PosterExamples colors={colors.map((c) => c.hex)} compact />
        </div>
      )}
    </div>
  );
}
