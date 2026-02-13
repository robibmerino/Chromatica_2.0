import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PosterExamples from '../PosterExamples';

interface ColorHarmonyCreatorProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onComplete: (colors: string[]) => void;
  onBack: () => void;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic' | 'square' | 'double-complementary';

const harmonyTypes: { id: HarmonyType; name: string; description: string; icon: string }[] = [
  { id: 'monochromatic', name: 'Monocromático', description: 'Variaciones de un solo tono', icon: '▤' },
  { id: 'analogous', name: 'Análogo', description: 'Colores adyacentes armónicos', icon: '◔' },
  { id: 'complementary', name: 'Complementario', description: 'Colores opuestos en la rueda', icon: '◐' },
  { id: 'double-complementary', name: 'Doble complementario', description: 'Dos pares complementarios', icon: '⊞' },
  { id: 'split-complementary', name: 'Complementario dividido', description: 'Un color y los adyacentes a su opuesto', icon: '⋈' },
  { id: 'triadic', name: 'Triádico', description: 'Tres colores equidistantes', icon: '△' },
  { id: 'tetradic', name: 'Tetrádico', description: 'Cuatro colores en rectángulo', icon: '▭' },
  { id: 'square', name: 'Cuadrado', description: 'Cuatro colores equidistantes', icon: '□' },
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 50, l: 50 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generateHarmony(baseHue: number, baseSat: number, baseLight: number, type: HarmonyType, count: number): string[] {
  const colors: string[] = [];
  
  switch (type) {
    case 'complementary': {
      colors.push(hslToHex(baseHue, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 180) % 360, baseSat, baseLight));
      for (let i = 2; i < count; i++) {
        const variation = i % 2 === 0 ? baseHue : (baseHue + 180) % 360;
        colors.push(hslToHex(variation, baseSat, Math.max(20, Math.min(80, baseLight + (i - 2) * 15 - 15))));
      }
      break;
    }
    case 'analogous': {
      const spread = 30;
      for (let i = 0; i < count; i++) {
        const offset = (i - Math.floor(count / 2)) * spread;
        colors.push(hslToHex((baseHue + offset + 360) % 360, baseSat, baseLight + (i % 2 === 0 ? 0 : 10)));
      }
      break;
    }
    case 'triadic': {
      colors.push(hslToHex(baseHue, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 120) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 240) % 360, baseSat, baseLight));
      for (let i = 3; i < count; i++) {
        const baseColor = i % 3;
        const hue = (baseHue + baseColor * 120) % 360;
        colors.push(hslToHex(hue, baseSat - 20, baseLight + 15));
      }
      break;
    }
    case 'split-complementary': {
      colors.push(hslToHex(baseHue, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 150) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 210) % 360, baseSat, baseLight));
      for (let i = 3; i < count; i++) {
        colors.push(hslToHex(baseHue, baseSat, baseLight + (i - 2) * 15));
      }
      break;
    }
    case 'tetradic': {
      // Rectangular: dos pares complementarios con distancia de 60° entre ellos
      colors.push(hslToHex(baseHue, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 60) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 180) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 240) % 360, baseSat, baseLight));
      for (let i = 4; i < count; i++) {
        const hues = [baseHue, (baseHue + 60) % 360, (baseHue + 180) % 360, (baseHue + 240) % 360];
        const hue = hues[i % 4];
        colors.push(hslToHex(hue, baseSat - 15, baseLight + 20));
      }
      break;
    }
    case 'square': {
      for (let i = 0; i < Math.min(4, count); i++) {
        colors.push(hslToHex((baseHue + i * 90) % 360, baseSat, baseLight));
      }
      for (let i = 4; i < count; i++) {
        colors.push(hslToHex((baseHue + (i % 4) * 90) % 360, baseSat - 20, baseLight + 15));
      }
      break;
    }
    case 'monochromatic': {
      for (let i = 0; i < count; i++) {
        const lightness = 20 + (60 / (count - 1)) * i;
        const saturation = baseSat - (i * 5);
        colors.push(hslToHex(baseHue, Math.max(20, saturation), lightness));
      }
      break;
    }
    case 'double-complementary': {
      colors.push(hslToHex(baseHue, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 30) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 180) % 360, baseSat, baseLight));
      colors.push(hslToHex((baseHue + 210) % 360, baseSat, baseLight));
      for (let i = 4; i < count; i++) {
        colors.push(hslToHex((baseHue + (i * 30)) % 360, baseSat - 20, baseLight + 15));
      }
      break;
    }
  }
  
  return colors.slice(0, count);
}

export default function ColorHarmonyCreator({ colorCount, onColorCountChange, onComplete, onBack }: ColorHarmonyCreatorProps) {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const [saturationAdjust, setSaturationAdjust] = useState(0);
  const [lightnessAdjust, setLightnessAdjust] = useState(0);
  
  const baseHsl = hexToHsl(baseColor);

  useEffect(() => {
    const colors = generateHarmony(
      baseHsl.h,
      Math.max(10, Math.min(100, baseHsl.s + saturationAdjust)),
      Math.max(15, Math.min(85, baseHsl.l + lightnessAdjust)),
      harmonyType,
      colorCount
    );
    setGeneratedColors(colors);
  }, [baseColor, harmonyType, colorCount, saturationAdjust, lightnessAdjust, baseHsl.h, baseHsl.s, baseHsl.l]);

  // Generate color wheel points
  const wheelColors = generatedColors.map(color => {
    const hsl = hexToHsl(color);
    return { color, hue: hsl.h, sat: hsl.s, light: hsl.l };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
        <h2 className="text-xl font-semibold text-white">🎨 Armonía de Color</h2>
        <div className="w-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Color base, adjustments and wheel */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col">
          {/* Base color picker */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 block mb-2">Color base</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-600"
              />
              <input
                type="text"
                value={baseColor.toUpperCase()}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    setBaseColor(e.target.value);
                  }
                }}
                className="flex-1 bg-gray-700 rounded-lg px-3 text-white font-mono text-sm"
              />
            </div>
          </div>

          {/* Adjustments - Moved here */}
          <div className="mb-5 space-y-4">
            <div>
              <label className="text-sm text-gray-400 flex justify-between mb-2">
                <span>Saturación</span>
                <span>{saturationAdjust > 0 ? '+' : ''}{saturationAdjust}%</span>
              </label>
              <input
                type="range"
                min="-40"
                max="40"
                value={saturationAdjust}
                onChange={(e) => setSaturationAdjust(parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${baseHsl.h}, 0%, 50%),
                    hsl(${baseHsl.h}, 50%, 50%),
                    hsl(${baseHsl.h}, 100%, 50%))`
                }}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 flex justify-between mb-2">
                <span>Luminosidad</span>
                <span>{lightnessAdjust > 0 ? '+' : ''}{lightnessAdjust}%</span>
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                value={lightnessAdjust}
                onChange={(e) => setLightnessAdjust(parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${baseHsl.h}, 70%, 15%),
                    hsl(${baseHsl.h}, 70%, 50%),
                    hsl(${baseHsl.h}, 70%, 85%))`
                }}
              />
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-300 mb-3">Círculo Cromático</h3>
          
          {/* Color Wheel - Smaller */}
          <div className="relative w-44 h-44 mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {Array.from({ length: 360 }, (_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 90 * Math.cos((i - 90) * Math.PI / 180)}
                  y2={100 + 90 * Math.sin((i - 90) * Math.PI / 180)}
                  stroke={hslToHex(i, 70, 50)}
                  strokeWidth="3"
                />
              ))}
              <circle cx="100" cy="100" r="40" fill="#1f2937" />
              {wheelColors.length > 1 && (
                <polygon
                  points={wheelColors.map(c => {
                    const angle = (c.hue - 90) * Math.PI / 180;
                    const radius = 30 + (c.sat / 100) * 35;
                    return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                />
              )}
              {wheelColors.map((c, i) => {
                const angle = (c.hue - 90) * Math.PI / 180;
                const radius = 30 + (c.sat / 100) * 35;
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="12" fill={c.color} stroke="white" strokeWidth="3" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Center: Harmony Types */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Tipo de Armonía</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Colores:</span>
              <div className="flex gap-1">
                {[3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => onColorCountChange(num)}
                    className={`w-7 h-7 rounded-lg text-sm font-medium transition-all ${
                      colorCount === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {harmonyTypes.map((harmony) => (
              <motion.button
                key={harmony.id}
                onClick={() => setHarmonyType(harmony.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2.5 rounded-xl text-left transition-all ${
                  harmonyType === harmony.id
                    ? 'bg-indigo-600 ring-2 ring-indigo-400'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl block mb-0.5">{harmony.icon}</span>
                <span className="text-xs font-medium text-white block">{harmony.name}</span>
                <span className="text-[10px] text-gray-400 line-clamp-1">{harmony.description}</span>
              </motion.button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {generatedColors.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-lg relative group"
                  style={{ backgroundColor: color }}
                >
                  <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-white/80 bg-black/30 rounded-full w-4 h-4 flex items-center justify-center">
                    {index + 1}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="h-10 rounded-xl overflow-hidden flex">
              {generatedColors.map((color, index) => (
                <div key={index} className="flex-1 transition-all" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                const colors = generateHarmony(
                  Math.random() * 360,
                  Math.max(10, Math.min(100, 60 + saturationAdjust)),
                  Math.max(15, Math.min(85, 50 + lightnessAdjust)),
                  harmonyType,
                  colorCount
                );
                setBaseColor(colors[0]);
              }}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors text-sm"
            >
              🎲 Aleatorio
            </button>
            <button
              onClick={() => onComplete(generatedColors)}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors text-sm"
            >
              Usar paleta →
            </button>
          </div>
        </div>

        {/* Right: Poster Examples */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Ejemplos de aplicación</h3>
          <PosterExamples colors={generatedColors} compact />
        </div>
      </div>
    </motion.div>
  );
}
