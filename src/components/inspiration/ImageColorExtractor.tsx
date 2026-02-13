import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ImageColorExtractorProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onComplete: (colors: string[]) => void;
  onBack: () => void;
}

interface ColorTarget {
  id: number;
  x: number; // percentage
  y: number; // percentage
  color: string;
}

type ExtractionMode = 'manual' | 'dominant' | 'vibrant' | 'balanced' | 'pastel' | 'dark';

const extractionModes: { id: ExtractionMode; name: string; description: string; icon: string }[] = [
  { id: 'manual', name: 'Manual', description: 'Coloca los puntos donde quieras', icon: '👆' },
  { id: 'dominant', name: 'Dominantes', description: 'Colores más presentes', icon: '🎯' },
  { id: 'vibrant', name: 'Vibrantes', description: 'Colores más saturados', icon: '✨' },
  { id: 'balanced', name: 'Equilibrado', description: 'Mix de tonos variados', icon: '⚖️' },
  { id: 'pastel', name: 'Pasteles', description: 'Tonos suaves y claros', icon: '🌸' },
  { id: 'dark', name: 'Oscuros', description: 'Tonos profundos', icon: '🌙' },
];

const sampleImages = [
  // Abstractos - Fluidos y orgánicos
  { url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=300&fit=crop', name: 'Fluido' },
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop', name: 'Ondas' },
  // Abstractos - Gradientes y colores
  { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop', name: 'Gradiente' },
  { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop', name: 'Aurora' },
  // Abstractos - Texturas y patrones
  { url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&h=300&fit=crop', name: 'Mármol' },
  { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop', name: 'Pintura' },
];

function getColorFromCanvas(canvas: HTMLCanvasElement, x: number, y: number): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#808080';
  
  const pixelX = Math.floor((x / 100) * canvas.width);
  const pixelY = Math.floor((y / 100) * canvas.height);
  
  // Get average color from a small area
  const size = 5;
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let dx = -size; dx <= size; dx++) {
    for (let dy = -size; dy <= size; dy++) {
      const px = Math.max(0, Math.min(canvas.width - 1, pixelX + dx));
      const py = Math.max(0, Math.min(canvas.height - 1, pixelY + dy));
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      r += pixel[0];
      g += pixel[1];
      b += pixel[2];
      count++;
    }
  }
  
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
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
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function extractColorsAuto(canvas: HTMLCanvasElement, count: number, mode: ExtractionMode): ColorTarget[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height).data;
  
  // Sample colors from the image
  const samples: { r: number; g: number; b: number; x: number; y: number; h: number; s: number; l: number }[] = [];
  const step = Math.max(1, Math.floor(width * height / 10000));
  
  for (let i = 0; i < imageData.length; i += step * 4) {
    const pixelIndex = i / 4;
    const x = (pixelIndex % width) / width * 100;
    const y = Math.floor(pixelIndex / width) / height * 100;
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const hsl = rgbToHsl(r, g, b);
    samples.push({ r, g, b, x, y, ...hsl });
  }
  
  let filtered = samples;
  
  switch (mode) {
    case 'vibrant':
      filtered = samples.filter(c => c.s > 40 && c.l > 25 && c.l < 75);
      filtered.sort((a, b) => b.s - a.s);
      break;
    case 'pastel':
      filtered = samples.filter(c => c.s > 20 && c.s < 60 && c.l > 60 && c.l < 90);
      filtered.sort((a, b) => b.l - a.l);
      break;
    case 'dark':
      filtered = samples.filter(c => c.l < 40);
      filtered.sort((a, b) => a.l - b.l);
      break;
    case 'balanced':
      // Sort by hue to get variety
      filtered.sort((a, b) => a.h - b.h);
      break;
    default:
      // Dominant - cluster by color similarity (simplified)
      filtered.sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b));
  }
  
  // Select diverse colors
  const selected: typeof samples = [];
  const minDistance = 30;
  
  for (const sample of filtered) {
    if (selected.length >= count) break;
    
    const isTooClose = selected.some(s => {
      const hDist = Math.min(Math.abs(s.h - sample.h), 360 - Math.abs(s.h - sample.h));
      const sDist = Math.abs(s.s - sample.s);
      const lDist = Math.abs(s.l - sample.l);
      return hDist < minDistance && sDist < 20 && lDist < 20;
    });
    
    if (!isTooClose) {
      selected.push(sample);
    }
  }
  
  // Fill remaining with random samples if needed
  while (selected.length < count && filtered.length > 0) {
    const randomSample = filtered[Math.floor(Math.random() * filtered.length)];
    selected.push(randomSample);
  }
  
  return selected.slice(0, count).map((s, i) => ({
    id: i,
    x: s.x,
    y: s.y,
    color: `#${s.r.toString(16).padStart(2, '0')}${s.g.toString(16).padStart(2, '0')}${s.b.toString(16).padStart(2, '0')}`
  }));
}

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

export default function ImageColorExtractor({ colorCount, onColorCountChange, onComplete, onBack }: ImageColorExtractorProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [targets, setTargets] = useState<ColorTarget[]>([]);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>('manual');
  const [draggingTarget, setDraggingTarget] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [saturationAdjust, setSaturationAdjust] = useState(0);
  const [lightnessAdjust, setLightnessAdjust] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Apply adjustments to colors
  const adjustedColors = targets.map(t => {
    if (saturationAdjust === 0 && lightnessAdjust === 0) return t.color;
    const hsl = hexToHsl(t.color);
    const newS = Math.max(0, Math.min(100, hsl.s + saturationAdjust));
    const newL = Math.max(5, Math.min(95, hsl.l + lightnessAdjust));
    return hslToHex(hsl.h, newS, newL);
  });

  // Initialize targets when color count changes
  useEffect(() => {
    if (!imageLoaded) return;
    
    if (extractionMode === 'manual') {
      // Create evenly distributed targets
      const newTargets: ColorTarget[] = [];
      const cols = Math.ceil(Math.sqrt(colorCount));
      const rows = Math.ceil(colorCount / cols);
      
      for (let i = 0; i < colorCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        newTargets.push({
          id: i,
          x: 15 + (col / cols) * 70,
          y: 15 + (row / rows) * 70,
          color: '#808080'
        });
      }
      setTargets(newTargets);
      
      // Update colors after a small delay
      setTimeout(() => updateColorsFromCanvas(newTargets), 100);
    } else {
      // Auto extract
      autoExtract();
    }
  }, [colorCount, imageLoaded, extractionMode]);

  const updateColorsFromCanvas = useCallback((currentTargets: ColorTarget[]) => {
    if (!canvasRef.current) return;
    
    const updated = currentTargets.map(target => ({
      ...target,
      color: getColorFromCanvas(canvasRef.current!, target.x, target.y)
    }));
    setTargets(updated);
  }, []);

  const autoExtract = useCallback(() => {
    if (!canvasRef.current || extractionMode === 'manual') return;
    
    const extracted = extractColorsAuto(canvasRef.current, colorCount, extractionMode);
    setTargets(extracted);
  }, [colorCount, extractionMode]);

  const handleImageLoad = useCallback((url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setImageLoaded(true);
      }
    };
    img.src = url;
    setImageUrl(url);
    setImageLoaded(false);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleImageLoad(url);
    }
  };

  const handleTargetDrag = (e: React.MouseEvent | React.TouchEvent, targetId: number) => {
    e.preventDefault();
    setDraggingTarget(targetId);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (draggingTarget === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    
    setTargets(prev => {
      const updated = prev.map(t => 
        t.id === draggingTarget 
          ? { ...t, x, y, color: canvasRef.current ? getColorFromCanvas(canvasRef.current, x, y) : t.color }
          : t
      );
      return updated;
    });
  }, [draggingTarget]);

  const handleMouseUp = () => {
    setDraggingTarget(null);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (extractionMode !== 'manual' || !containerRef.current || draggingTarget !== null) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Find nearest target and move it
    let nearestId = 0;
    let nearestDist = Infinity;
    
    targets.forEach(t => {
      const dist = Math.sqrt((t.x - x) ** 2 + (t.y - y) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = t.id;
      }
    });
    
    if (nearestDist > 10) {
      // Move nearest target to click position
      setTargets(prev => prev.map(t => 
        t.id === nearestId 
          ? { ...t, x, y, color: canvasRef.current ? getColorFromCanvas(canvasRef.current, x, y) : t.color }
          : t
      ));
    }
  };

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
        <h2 className="text-xl font-semibold text-white">🖼️ Extraer de Imagen</h2>
        <div className="w-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Image area */}
        <div className="lg:col-span-3">
          {!imageUrl ? (
            <div className="bg-gray-800/50 rounded-2xl p-8">
              {/* Upload area */}
              <label className="block border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="text-4xl mb-3">📤</div>
                <p className="text-white font-medium mb-1">Arrastra una imagen o haz clic para subir</p>
                <p className="text-gray-500 text-sm">JPG, PNG, WebP hasta 10MB</p>
              </label>

              {/* Sample images */}
              <div className="mt-6">
                <p className="text-gray-400 text-sm mb-3">O prueba con una imagen de ejemplo:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {sampleImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => handleImageLoad(img.url)}
                      className="aspect-square rounded-xl overflow-hidden hover:ring-2 ring-indigo-500 transition-all"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-2xl p-4">
              {/* Extraction modes */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {extractionModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setExtractionMode(mode.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      extractionMode === mode.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>{mode.icon}</span>
                    <span className="text-sm font-medium">{mode.name}</span>
                  </button>
                ))}
              </div>

              {/* Image with targets */}
              <div
                ref={containerRef}
                className="relative rounded-xl overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onClick={handleImageClick}
              >
                <img
                  src={imageUrl}
                  alt="Source"
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Color targets */}
                {imageLoaded && targets.map((target) => (
                  <motion.div
                    key={target.id}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 cursor-grab active:cursor-grabbing ${
                      draggingTarget === target.id ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                    }}
                    onMouseDown={(e) => handleTargetDrag(e, target.id)}
                    onTouchStart={(e) => handleTargetDrag(e, target.id)}
                    animate={{
                      scale: draggingTarget === target.id ? 1.2 : 1,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: target.color }}
                    />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded">
                      {target.id + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Change image button */}
              <div className="mt-4 flex gap-3">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-full py-2 text-center bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium cursor-pointer transition-colors">
                    📤 Cambiar imagen
                  </div>
                </label>
                {extractionMode !== 'manual' && (
                  <button
                    onClick={autoExtract}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                  >
                    🔄 Reanalizar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Paleta extraída</h3>
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => onColorCountChange(num)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-all ${
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

          {/* Extracted colors */}
          <div className="flex-1 space-y-2 max-h-48 overflow-y-auto pr-1">
            {targets.map((target, idx) => (
              <div
                key={target.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-gray-700/50"
              >
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: adjustedColors[idx] || target.color }}
                />
                <div className="flex-1">
                  <span className="text-white text-xs font-mono">{(adjustedColors[idx] || target.color).toUpperCase()}</span>
                </div>
                <span className="text-gray-500 text-xs">#{target.id + 1}</span>
              </div>
            ))}
          </div>

          {/* Palette bar */}
          {targets.length > 0 && (
            <div className="mt-3 h-8 rounded-xl overflow-hidden flex">
              {adjustedColors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Saturation & Lightness sliders */}
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1">
                <span>Saturación</span>
                <span>{saturationAdjust > 0 ? '+' : ''}{saturationAdjust}%</span>
              </label>
              <input
                type="range"
                min="-40"
                max="40"
                value={saturationAdjust}
                onChange={(e) => setSaturationAdjust(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(270, 0%, 50%),
                    hsl(270, 50%, 50%),
                    hsl(270, 100%, 50%))`
                }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1">
                <span>Luminosidad</span>
                <span>{lightnessAdjust > 0 ? '+' : ''}{lightnessAdjust}%</span>
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                value={lightnessAdjust}
                onChange={(e) => setLightnessAdjust(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(270, 70%, 15%),
                    hsl(270, 70%, 50%),
                    hsl(270, 70%, 85%))`
                }}
              />
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => onComplete(adjustedColors)}
            disabled={targets.length === 0}
            className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors"
          >
            {targets.length > 0 ? 'Usar paleta →' : 'Sube una imagen'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
