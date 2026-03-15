import { useState } from 'react';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';
import { REFINEMENT_QUICK_ADJUSTMENTS } from './config/refinementQuickAdjustmentsConfig';
import type { ColorItem } from '../../types/guidedPalette';

interface RefinementGeneralModeProps {
  colors: ColorItem[];
  sliderReference: ColorItem[];
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  setSliderReference: (colors: ColorItem[]) => void;
  saveToHistory: (colors: ColorItem[], changeDescription?: string) => void;
  adjustPaletteSaturation: (amount: number) => void;
  adjustPaletteLightness: (amount: number) => void;
  adjustPaletteHue: (amount: number) => void;
  /** Posiciones de los sliders (controladas desde el hook para persistir al cambiar de sección). */
  sliderTone: number;
  setSliderTone: (v: number) => void;
  sliderSat: number;
  setSliderSat: (v: number) => void;
  sliderLight: number;
  setSliderLight: (v: number) => void;
}

export function RefinementGeneralMode({
  colors,
  sliderReference,
  setColors,
  setSliderReference,
  saveToHistory,
  adjustPaletteSaturation: _adjustPaletteSaturation,
  adjustPaletteLightness: _adjustPaletteLightness,
  adjustPaletteHue,
  sliderTone,
  setSliderTone,
  sliderSat,
  setSliderSat,
  sliderLight,
  setSliderLight,
}: RefinementGeneralModeProps) {
  const [hoveredQuickItem, setHoveredQuickItem] = useState<
    (typeof REFINEMENT_QUICK_ADJUSTMENTS)[number]['type'] | null
  >(null);

  const baseHue = hexToHsl(colors[0]?.hex || '#6366f1').h;

  const formatDelta = (v: number, unit: '°' | '%') =>
    v === 0 ? `0${unit}` : `${v > 0 ? '+' : ''}${v}${unit}`;

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 mt-3">
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-400 flex justify-between mb-1">
            <span>Tono</span>
            <span>{formatDelta(sliderTone, '°')}</span>
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            value={sliderTone}
            onChange={(e) => {
              const rotation = parseInt(e.target.value);
              setSliderTone(rotation);
              const base = sliderReference.length ? sliderReference : colors;
              const newColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                return { ...c, hex: hslToHex((hsl.h + rotation + 360) % 360, hsl.s, hsl.l) };
              });
              setColors(newColors);
            }}
            onMouseDown={() => {
              setSliderReference([...colors]);
              setSliderTone(0);
            }}
            onMouseUp={() => {
              const rotation = sliderTone;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                return { ...c, hex: hslToHex((hsl.h + rotation + 360) % 360, hsl.s, hsl.l) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Tono');
              setSliderReference(finalColors);
            }}
            onTouchStart={() => {
              setSliderReference([...colors]);
              setSliderTone(0);
            }}
            onTouchEnd={() => {
              const rotation = sliderTone;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                return { ...c, hex: hslToHex((hsl.h + rotation + 360) % 360, hsl.s, hsl.l) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Tono');
              setSliderReference(finalColors);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(${(baseHue + 180) % 360}, 70%, 50%), hsl(${baseHue}, 70%, 50%), hsl(${(baseHue + 180) % 360}, 70%, 50%))`,
            }}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 flex justify-between mb-1">
            <span>Saturación</span>
            <span>{formatDelta(sliderSat, '%')}</span>
          </label>
          <input
            type="range"
            min="-40"
            max="40"
            value={sliderSat}
            onChange={(e) => {
              const adjustment = parseInt(e.target.value);
              setSliderSat(adjustment);
              const base = sliderReference.length ? sliderReference : colors;
              const newColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newS = Math.max(0, Math.min(100, hsl.s + adjustment));
                return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
              });
              setColors(newColors);
            }}
            onMouseDown={() => {
              setSliderReference([...colors]);
              setSliderSat(0);
            }}
            onMouseUp={() => {
              const adjustment = sliderSat;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newS = Math.max(0, Math.min(100, hsl.s + adjustment));
                return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Saturación');
              setSliderReference(finalColors);
            }}
            onTouchStart={() => {
              setSliderReference([...colors]);
              setSliderSat(0);
            }}
            onTouchEnd={() => {
              const adjustment = sliderSat;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newS = Math.max(0, Math.min(100, hsl.s + adjustment));
                return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Saturación');
              setSliderReference(finalColors);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #888, hsl(${baseHue}, 100%, 50%))`,
            }}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 flex justify-between mb-1">
            <span>Luminosidad</span>
            <span>{formatDelta(sliderLight, '%')}</span>
          </label>
          <input
            type="range"
            min="-40"
            max="40"
            value={sliderLight}
            onChange={(e) => {
              const adjustment = parseInt(e.target.value);
              setSliderLight(adjustment);
              const base = sliderReference.length ? sliderReference : colors;
              const newColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newL = Math.max(5, Math.min(95, hsl.l + adjustment));
                return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
              });
              setColors(newColors);
            }}
            onMouseDown={() => {
              setSliderReference([...colors]);
              setSliderLight(0);
            }}
            onMouseUp={() => {
              const adjustment = sliderLight;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newL = Math.max(5, Math.min(95, hsl.l + adjustment));
                return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Luminosidad');
              setSliderReference(finalColors);
            }}
            onTouchStart={() => {
              setSliderReference([...colors]);
              setSliderLight(0);
            }}
            onTouchEnd={() => {
              const adjustment = sliderLight;
              const base = sliderReference.length ? sliderReference : colors;
              const finalColors = base.map((c, i) => {
                if (colors[i]?.locked) return colors[i];
                const hsl = hexToHsl(c.hex);
                const newL = Math.max(5, Math.min(95, hsl.l + adjustment));
                return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
              });
              setColors(finalColors);
              saveToHistory(finalColors, 'Luminosidad');
              setSliderReference(finalColors);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #111, #888, #fff)' }}
          />
        </div>
      </div>

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
              type="button"
              onClick={() => adjustPaletteHue(item.degrees)}
              className="w-full py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
