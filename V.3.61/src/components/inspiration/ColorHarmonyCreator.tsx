import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import PosterExamples from '../PosterExamples';
import { BaseColorPicker } from '../BaseColorPicker';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic' | 'square' | 'double-complementary';

/** Estado serializable para restaurar al volver desde Refinar. */
export interface HarmonySavedState {
  baseColor: string;
  harmonyType: HarmonyType;
  effectiveSat: number;
  effectiveLight: number;
}

interface ColorHarmonyCreatorProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onComplete: (colors: string[], savedState?: HarmonySavedState) => void;
  /** Al volver se pasa el estado actual para poder restaurarlo si el usuario vuelve a Armonía. */
  onBack: (savedState?: HarmonySavedState) => void;
  /** Estado restaurado al volver desde Refinar o al reentrar en Armonía tras haber dado Volver. */
  initialState?: HarmonySavedState | null;
  /** Se llama cuando cambia el estado (color base, tipo, sliders) para poder restaurarlo si el usuario vuelve al menú por el stepper. */
  onStateChange?: (state: HarmonySavedState) => void;
  /** Se llama cuando cambia la paleta generada (para que Refinar pueda mostrar esta paleta si el usuario entra sin "Usar paleta"). */
  onGeneratedPaletteChange?: (hexColors: string[]) => void;
}

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

/** Offset en grados del color en índice i respecto al color base (para arrastrar burbujas). */
function getHueOffset(index: number, type: HarmonyType, count: number): number {
  switch (type) {
    case 'monochromatic': return 0;
    case 'analogous': return (index - Math.floor(count / 2)) * 30;
    case 'complementary': return (index % 2) * 180;
    case 'triadic': return (index % 3) * 120;
    case 'split-complementary': return index === 0 ? 0 : index === 1 ? 150 : index === 2 ? 210 : 0;
    case 'tetradic': return (index % 4) * 60;
    case 'square': return (index % 4) * 90;
    case 'double-complementary': return (index * 30) % 360;
    default: return 0;
  }
}

/** Convierte posición (x,y) en viewBox 200x200 a matiz 0-360. 12h = 0° (igual que el dibujo del círculo). */
function xyToHue(x: number, y: number): number {
  const dx = x - 100;
  const dy = y - 100;
  const angleRad = Math.atan2(dx, -dy);
  return Math.round((angleRad * (180 / Math.PI) + 360) % 360);
}

const SAT_MIN = 10;
const SAT_MAX = 100;
const LIGHT_MIN = 15;
const LIGHT_MAX = 85;

/** Color base inicial al entrar en Armonía de color. */
const DEFAULT_BASE_COLOR = '#D363F2';

export default function ColorHarmonyCreator({ colorCount, onColorCountChange, onComplete, onBack, initialState, onStateChange, onGeneratedPaletteChange }: ColorHarmonyCreatorProps) {
  const [baseColor, setBaseColor] = useState(() => initialState?.baseColor ?? DEFAULT_BASE_COLOR);
  const [harmonyType, setHarmonyType] = useState<HarmonyType>(() => initialState?.harmonyType ?? 'analogous');
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const baseHsl = hexToHsl(baseColor);
  const [effectiveSat, setEffectiveSat] = useState(() =>
    initialState?.effectiveSat ?? Math.max(SAT_MIN, Math.min(SAT_MAX, baseHsl.s))
  );
  const [effectiveLight, setEffectiveLight] = useState(() =>
    initialState?.effectiveLight ?? Math.max(LIGHT_MIN, Math.min(LIGHT_MAX, baseHsl.l))
  );

  const hasRestoredRef = useRef(!!initialState);
  const latestStateRef = useRef<HarmonySavedState>({
    baseColor,
    harmonyType,
    effectiveSat,
    effectiveLight,
  });
  latestStateRef.current = { baseColor, harmonyType, effectiveSat, effectiveLight };

  useEffect(() => {
    if (hasRestoredRef.current) {
      hasRestoredRef.current = false;
      return;
    }
    const s = Math.max(SAT_MIN, Math.min(SAT_MAX, baseHsl.s));
    const l = Math.max(LIGHT_MIN, Math.min(LIGHT_MAX, baseHsl.l));
    setEffectiveSat(s);
    setEffectiveLight(l);
  }, [baseColor, baseHsl.s, baseHsl.l]);

  useEffect(() => {
    onStateChange?.(latestStateRef.current);
    return () => {
      onStateChange?.(latestStateRef.current);
    };
  }, [baseColor, harmonyType, effectiveSat, effectiveLight, onStateChange]);

  const [showExamplesMobile, setShowExamplesMobile] = useState(false);
  const [isLg, setIsLg] = useState(true);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)');
    setIsLg(m.matches);
    const handler = () => setIsLg(m.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const colors = generateHarmony(baseHsl.h, effectiveSat, effectiveLight, harmonyType, colorCount);
    setGeneratedColors(colors);
    onGeneratedPaletteChange?.(colors);
  }, [baseColor, harmonyType, colorCount, effectiveSat, effectiveLight, baseHsl.h, onGeneratedPaletteChange]);

  const wheelColors = generatedColors.map(color => {
    const hsl = hexToHsl(color);
    return { color, hue: hsl.h, sat: hsl.s, light: hsl.l };
  });

  const [draggingBubble, setDraggingBubble] = useState<number | null>(null);
  const wheelSvgRef = useRef<SVGSVGElement | null>(null);

  const effectiveSatRef = useRef(effectiveSat);
  const effectiveLightRef = useRef(effectiveLight);
  effectiveSatRef.current = effectiveSat;
  effectiveLightRef.current = effectiveLight;

  useEffect(() => {
    if (draggingBubble === null) return;
    const svg = wheelSvgRef.current;
    const onMove = (e: PointerEvent) => {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 200;
      const y = ((e.clientY - rect.top) / rect.height) * 200;
      const dx = x - 100, dy = y - 100;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < 25 || r > 95) return;
      const hue = xyToHue(x, y);
      const offset = getHueOffset(draggingBubble, harmonyType, colorCount);
      const newBaseHue = (hue - offset + 360) % 360;
      setBaseColor(hslToHex(newBaseHue, effectiveSatRef.current, effectiveLightRef.current));
    };
    const onUp = () => setDraggingBubble(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [draggingBubble, harmonyType, colorCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-0 h-full"
    >
      {/* Banner integrado con el mismo estilo que las columnas */}
      <div className="shrink-0 bg-gray-700/60 rounded-2xl border border-gray-600/50 px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            const savedState: HarmonySavedState = {
              baseColor,
              harmonyType,
              effectiveSat,
              effectiveLight,
            };
            onBack(savedState);
          }}
          type="button"
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all shrink-0 text-sm font-medium"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-3 min-w-0 flex-1 justify-center">
          <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border border-emerald-500/30 text-emerald-400" aria-hidden>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9l6.5 3.75" />
              <path d="M12 12L5.5 15.75" />
              <path d="M12 12V21" />
            </svg>
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">Armonía de Color</h2>
            <p className="text-xs text-gray-400 mt-0.5">Elige un color base y un tipo de armonía</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const savedState: HarmonySavedState = {
              baseColor,
              harmonyType,
              effectiveSat,
              effectiveLight,
            };
            onComplete(generatedColors, savedState);
          }}
          className="shrink-0 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 font-medium transition-all text-sm"
        >
          Usar paleta →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left: Color base + Aleatorio, adjustments and wheel */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
          <div className="flex items-center gap-3 mb-5">
            <BaseColorPicker
              value={baseColor}
              onChange={setBaseColor}
              label="Color base"
              size="md"
              className="flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={() => {
                const colors = generateHarmony(
                  Math.random() * 360,
                  effectiveSat,
                  effectiveLight,
                  harmonyType,
                  colorCount
                );
                setBaseColor(colors[0]);
              }}
              className="shrink-0 mt-7 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors text-sm whitespace-nowrap"
              title="Color base aleatorio"
            >
              🎲 Aleatorio
            </button>
          </div>

          {/* Saturación y luminosidad para la armonía (rango completo alcanzable) */}
          <div className="mb-5 space-y-4">
            <div>
              <label className="text-sm text-gray-400 flex justify-between mb-2" id="saturation-label">
                <span>Saturación</span>
                <span>{effectiveSat}%</span>
              </label>
              <input
                type="range"
                min={SAT_MIN}
                max={SAT_MAX}
                value={effectiveSat}
                onChange={(e) => setEffectiveSat(parseInt(e.target.value))}
                aria-labelledby="saturation-label"
                aria-valuetext={`${effectiveSat}%`}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${baseHsl.h}, ${SAT_MIN}%, 50%),
                    hsl(${baseHsl.h}, ${SAT_MAX}%, 50%))`
                }}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 flex justify-between mb-2" id="lightness-label">
                <span>Luminosidad</span>
                <span>{effectiveLight}%</span>
              </label>
              <input
                type="range"
                min={LIGHT_MIN}
                max={LIGHT_MAX}
                value={effectiveLight}
                onChange={(e) => setEffectiveLight(parseInt(e.target.value))}
                aria-labelledby="lightness-label"
                aria-valuetext={`${effectiveLight}%`}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${baseHsl.h}, 70%, ${LIGHT_MIN}%),
                    hsl(${baseHsl.h}, 70%, ${LIGHT_MAX}%))`
                }}
              />
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-300 mb-3">Círculo Cromático</h3>
          <p className="text-[10px] text-gray-500 mb-2">Clic en la rueda o arrastra una burbuja para cambiar el matiz</p>
          
          {/* Color Wheel - clic en rueda o arrastrar burbuja */}
          <div className="relative w-44 h-44 mx-auto cursor-crosshair">
            <svg
              ref={wheelSvgRef}
              viewBox="0 0 200 200"
              className="w-full h-full select-none touch-none"
              onClick={(e) => {
                const target = e.target as SVGElement;
                if (target.closest('[data-bubble]')) return;
                const svg = e.currentTarget;
                const rect = svg.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 200;
                const y = ((e.clientY - rect.top) / rect.height) * 200;
                const dx = x - 100, dy = y - 100;
                const radius = Math.sqrt(dx * dx + dy * dy);
                if (radius < 40 || radius > 90) return;
                setBaseColor(hslToHex(xyToHue(x, y), effectiveSat, effectiveLight));
              }}
              role="img"
              aria-label="Rueda de color: clic o arrastra una burbuja para cambiar el matiz"
            >
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
                  <g
                    key={i}
                    data-bubble
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
                      setDraggingBubble(i);
                    }}
                    onPointerUp={() => setDraggingBubble(null)}
                    onPointerCancel={() => setDraggingBubble(null)}
                    style={{ cursor: draggingBubble !== null ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={x} cy={y} r="16" fill="transparent" stroke="none" />
                    <circle cx={x} cy={y} r="12" fill={c.color} stroke="white" strokeWidth="3" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Center: Harmony Types */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
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
                type="button"
                onClick={() => setHarmonyType(harmony.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={harmonyType === harmony.id}
                aria-label={`${harmony.name}: ${harmony.description}`}
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

          {/* Color swatches - grid adaptable según número de colores */}
          <div className="mt-4">
            <div
              className="grid gap-2 mb-3"
              style={{
                gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, generatedColors.length))}, minmax(0, 1fr))`,
              }}
            >
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

        </div>

        {/* Right: Poster Examples - colapsable en móvil */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Ejemplos de aplicación</h3>
            {!isLg && (
              <button
                type="button"
                onClick={() => setShowExamplesMobile((v) => !v)}
                className="lg:hidden text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {showExamplesMobile ? 'Ocultar' : 'Ver ejemplos'}
              </button>
            )}
          </div>
          {(isLg || showExamplesMobile) && (
            <PosterExamples colors={generatedColors} compact layout="preview-first" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
