import { useState, useEffect } from 'react';
import { Color } from '../types/palette';
import { hslToHex, createColor } from '../utils/colorUtils';
import { cn } from '../utils/cn';

interface ColorEditorProps {
  color: Color | null;
  onUpdateColor: (id: string, hex: string) => void;
  onAdjustColor: (adjustment: { h?: number; s?: number; l?: number }) => void;
}

export function ColorEditor({ color, onUpdateColor, onAdjustColor }: ColorEditorProps) {
  const [hexInput, setHexInput] = useState(color?.hex || '#000000');
  const [activeTab, setActiveTab] = useState<'hsl' | 'rgb' | 'picker'>('hsl');

  useEffect(() => {
    if (color) {
      setHexInput(color.hex);
    }
  }, [color]);

  if (!color) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">Selecciona un color para editarlo</p>
        <p className="text-slate-500 text-sm mt-1">Haz clic en cualquier color de la paleta</p>
      </div>
    );
  }

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onUpdateColor(color.id, value);
    }
  };

  const handleSliderChange = (type: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...color.hsl, [type]: value };
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onUpdateColor(color.id, newHex);
  };

  const handleRgbChange = (type: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...color.rgb, [type]: Math.max(0, Math.min(255, value)) };
    const newColor = createColor(
      `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
    );
    onUpdateColor(color.id, newColor.hex);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Color Preview */}
      <div 
        className="h-24 relative"
        style={{ backgroundColor: color.hex }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
            className="bg-black/30 backdrop-blur-sm text-white font-mono font-bold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-white/50 w-28 text-center"
          />
          <input
            type="color"
            value={color.hex}
            onChange={(e) => onUpdateColor(color.id, e.target.value.toUpperCase())}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white/30 overflow-hidden"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {(['hsl', 'rgb', 'picker'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              activeTab === tab 
                ? 'text-white bg-slate-700/50' 
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'hsl' && (
          <>
            {/* Hue Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Tono (H)</span>
                <span className="text-white font-mono">{color.hsl.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={color.hsl.h}
                onChange={(e) => handleSliderChange('h', parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Saturación (S)</span>
                <span className="text-white font-mono">{color.hsl.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={color.hsl.s}
                onChange={(e) => handleSliderChange('s', parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${hslToHex(color.hsl.h, 0, color.hsl.l)}, ${hslToHex(color.hsl.h, 100, color.hsl.l)})`,
                }}
              />
            </div>

            {/* Lightness Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Luminosidad (L)</span>
                <span className="text-white font-mono">{color.hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={color.hsl.l}
                onChange={(e) => handleSliderChange('l', parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000, ${hslToHex(color.hsl.h, color.hsl.s, 50)}, #ffffff)`,
                }}
              />
            </div>
          </>
        )}

        {activeTab === 'rgb' && (
          <>
            {['r', 'g', 'b'].map((channel) => {
              const colors = {
                r: { label: 'Rojo', gradient: `linear-gradient(to right, rgb(0,${color.rgb.g},${color.rgb.b}), rgb(255,${color.rgb.g},${color.rgb.b}))` },
                g: { label: 'Verde', gradient: `linear-gradient(to right, rgb(${color.rgb.r},0,${color.rgb.b}), rgb(${color.rgb.r},255,${color.rgb.b}))` },
                b: { label: 'Azul', gradient: `linear-gradient(to right, rgb(${color.rgb.r},${color.rgb.g},0), rgb(${color.rgb.r},${color.rgb.g},255))` },
              };
              const key = channel as 'r' | 'g' | 'b';
              return (
                <div key={channel}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{colors[key].label} ({channel.toUpperCase()})</span>
                    <span className="text-white font-mono">{color.rgb[key]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.rgb[key]}
                    onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{ background: colors[key].gradient }}
                  />
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'picker' && (
          <div className="space-y-4">
            {/* Saturation/Lightness picker */}
            <div 
              className="relative h-40 rounded-xl cursor-crosshair overflow-hidden"
              style={{
                background: `
                  linear-gradient(to bottom, transparent, black),
                  linear-gradient(to right, white, hsl(${color.hsl.h}, 100%, 50%))
                `,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const s = Math.round(x * 100);
                const l = Math.round((1 - y) * 50 + (1 - x) * (1 - y) * 50);
                const newHex = hslToHex(color.hsl.h, s, l);
                onUpdateColor(color.id, newHex);
              }}
            >
              <div 
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg"
                style={{
                  left: `${color.hsl.s}%`,
                  top: `${100 - color.hsl.l * 2 + color.hsl.s * color.hsl.l / 100}%`,
                  backgroundColor: color.hex,
                }}
              />
            </div>

            {/* Quick adjust buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAdjustColor({ l: Math.min(100, color.hsl.l + 10) })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                + Claro
              </button>
              <button
                onClick={() => onAdjustColor({ s: Math.min(100, color.hsl.s + 15) })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                + Saturado
              </button>
              <button
                onClick={() => onAdjustColor({ h: (color.hsl.h + 30) % 360 })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                Rotar Tono
              </button>
              <button
                onClick={() => onAdjustColor({ l: Math.max(0, color.hsl.l - 10) })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                + Oscuro
              </button>
              <button
                onClick={() => onAdjustColor({ s: Math.max(0, color.hsl.s - 15) })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                + Apagado
              </button>
              <button
                onClick={() => onAdjustColor({ h: (color.hsl.h + 180) % 360 })}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
              >
                Complemento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
