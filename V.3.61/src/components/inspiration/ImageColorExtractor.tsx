import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';
import PosterExamples from '../PosterExamples';

interface ImageColorExtractorProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onComplete: (colors: string[], savedState?: ImageExtractorSavedState) => void;
  /** Al volver se puede pasar el estado actual para restaurarlo si el usuario vuelve a entrar. */
  onBack: (savedState?: ImageExtractorSavedState) => void;
  /** Estado restaurado al volver desde Refinar. */
  initialState?: ImageExtractorSavedState | null;
  /** Se llama cuando cambia la paleta extraída (para Refinar sin "Usar paleta"). */
  onGeneratedPaletteChange?: (hexColors: string[]) => void;
}

interface ColorTarget {
  id: number;
  x: number; // percentage
  y: number; // percentage
  color: string;
}

type ExtractionMode = 'manual' | 'dominant' | 'vibrant' | 'balanced' | 'pastel' | 'dark';

/** Estado serializable para restaurar al volver desde Refinar. */
export interface ImageExtractorSavedState {
  imageUrl: string;
  targets: ColorTarget[];
  extractionMode: ExtractionMode;
  saturationAdjust: number;
  lightnessAdjust: number;
}

const EXTRACTION_MODE_ICONS: Record<ExtractionMode, ReactNode> = {
  manual: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z" />
    </svg>
  ),
  dominant: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  vibrant: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  balanced: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-4 4m4-4l4 4M3 12h18" />
    </svg>
  ),
  pastel: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  dark: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
};

const extractionModes: { id: ExtractionMode; name: string; description: string }[] = [
  { id: 'manual', name: 'Manual', description: 'Coloca los puntos donde quieras' },
  { id: 'dominant', name: 'Dominantes', description: 'Colores más presentes' },
  { id: 'vibrant', name: 'Vibrantes', description: 'Colores más saturados' },
  { id: 'balanced', name: 'Equilibrado', description: 'Mix de tonos variados' },
  { id: 'pastel', name: 'Pasteles', description: 'Tonos suaves y claros' },
  { id: 'dark', name: 'Oscuros', description: 'Tonos profundos' },
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

/** Cuantiza RGB a N niveles para agrupar colores similares. */
function quantizeRgb(r: number, g: number, b: number, levels: number): string {
  const q = Math.floor(256 / levels);
  return `${Math.min(r, 255) - (Math.min(r, 255) % q)}-${Math.min(g, 255) - (Math.min(g, 255) % q)}-${Math.min(b, 255) - (Math.min(b, 255) % q)}`;
}

/** Distancia perceptual aproximada en HSL (h tiene más peso por ciclicidad). */
function colorDistance(a: { h: number; s: number; l: number }, b: { h: number; s: number; l: number }): number {
  const hDist = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h));
  return Math.sqrt(hDist * 0.5 + (a.s - b.s) ** 2 * 0.3 + (a.l - b.l) ** 2 * 0.5);
}

/** RNG simple sembrado para variaciones reproducibles al reanalizar. */
function createSeededRandom(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/** Fisher-Yates shuffle con RNG sembrado. */
function seededShuffle<T>(arr: T[], random: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function extractColorsAuto(canvas: HTMLCanvasElement, count: number, mode: ExtractionMode, variationSeed = 0): ColorTarget[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height).data;
  
  // Muestreo más denso para mejor cobertura (hasta ~25k píxeles)
  const totalPixels = width * height;
  const step = Math.max(1, Math.floor(totalPixels / 25000));
  
  const random = variationSeed > 0 ? createSeededRandom(variationSeed) : () => Math.random();
  // Con variación: offset inicial distinto en cada reanálisis para muestrear píxeles diferentes
  const startOffset = variationSeed > 0 ? Math.floor(random() * Math.min(step, totalPixels)) * 4 : 0;
  
  const samples: { r: number; g: number; b: number; x: number; y: number; h: number; s: number; l: number }[] = [];
  for (let i = startOffset; i < imageData.length; i += step * 4) {
    const pixelIndex = i / 4;
    const x = (pixelIndex % width) / width * 100;
    const y = Math.floor(pixelIndex / width) / height * 100;
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const hsl = rgbToHsl(r, g, b);
    samples.push({ r, g, b, x, y, ...hsl });
  }
  // Si hay offset, añadir también el inicio que se saltó (para no perder cobertura)
  if (startOffset > 0) {
    for (let i = 0; i < startOffset; i += step * 4) {
      const pixelIndex = i / 4;
      const x = (pixelIndex % width) / width * 100;
      const y = Math.floor(pixelIndex / width) / height * 100;
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const hsl = rgbToHsl(r, g, b);
      samples.push({ r, g, b, x, y, ...hsl });
    }
  }
  let candidates: typeof samples = [];
  
  switch (mode) {
    case 'vibrant':
      candidates = samples.filter(c => c.s > 35 && c.l > 20 && c.l < 80);
      candidates.sort((a, b) => b.s - a.s);
      if (variationSeed > 0) {
        // Mezclar candidatos con similar saturación para proponer variantes
        const topCount = Math.min(count * 8, candidates.length);
        const top = candidates.slice(0, topCount);
        const rest = candidates.slice(topCount);
        candidates = [...seededShuffle(top, random), ...rest];
      }
      break;
    case 'pastel':
      candidates = samples.filter(c => c.s > 15 && c.s < 65 && c.l > 55 && c.l < 92);
      candidates.sort((a, b) => b.l - a.l);
      if (variationSeed > 0) {
        const topCount = Math.min(count * 8, candidates.length);
        candidates = [...seededShuffle(candidates.slice(0, topCount), random), ...candidates.slice(topCount)];
      }
      break;
    case 'dark':
      candidates = samples.filter(c => c.l < 45);
      candidates.sort((a, b) => a.l - b.l);
      if (variationSeed > 0) {
        const topCount = Math.min(count * 8, candidates.length);
        candidates = [...seededShuffle(candidates.slice(0, topCount), random), ...candidates.slice(topCount)];
      }
      break;
    case 'balanced': {
      const hueBands = 12;
      const perBand = samples.reduce((acc, s) => {
        const band = Math.floor((s.h / 360) * hueBands) % hueBands;
        if (!acc[band]) acc[band] = [];
        acc[band].push(s);
        return acc;
      }, [] as typeof samples[]);
      candidates = perBand
        .filter(Boolean)
        .map(band => band[Math.floor(random() * band.length)])
        .concat(samples)
        .slice(0, 500);
      candidates.sort((a, b) => a.h - b.h);
      if (variationSeed > 0) candidates = seededShuffle(candidates, random);
      break;
    }
    case 'dominant': {
      const levels = 16;
      const buckets = new Map<string, { r: number; g: number; b: number; x: number; y: number; h: number; s: number; l: number; count: number }>();
      for (const s of samples) {
        const key = quantizeRgb(s.r, s.g, s.b, levels);
        const existing = buckets.get(key);
        if (existing) {
          const n = existing.count + 1;
          existing.r = (existing.r * existing.count + s.r) / n;
          existing.g = (existing.g * existing.count + s.g) / n;
          existing.b = (existing.b * existing.count + s.b) / n;
          existing.x = (existing.x * existing.count + s.x) / n;
          existing.y = (existing.y * existing.count + s.y) / n;
          existing.h = (existing.h * existing.count + s.h) / n;
          existing.s = (existing.s * existing.count + s.s) / n;
          existing.l = (existing.l * existing.count + s.l) / n;
          existing.count = n;
        } else {
          buckets.set(key, { ...s, count: 1 });
        }
      }
      let bucketList = Array.from(buckets.values())
        .sort((a, b) => b.count - a.count)
        .map(({ count, ...s }) => s);
      if (variationSeed > 0) {
        // Ampliar pool (top 6x) y mezclar para ofrecer variantes distintas
        const poolSize = Math.min(count * 6, bucketList.length);
        const pool = seededShuffle(bucketList.slice(0, poolSize), random);
        bucketList = [...pool, ...bucketList.slice(poolSize)];
      }
      candidates = bucketList;
      break;
    }
    default:
      candidates = [...samples];
      candidates.sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b));
  }
  
  // Selección diversa (con variación: umbral más bajo para más candidatos válidos y más variantes)
  const selected: typeof samples = [];
  const minDist = variationSeed > 0 ? 15 : 25;
  
  if (variationSeed > 0) {
    // Con variación: en cada paso elegir al azar entre todos los candidatos válidos (no solo el primero)
    const pool = [...candidates];
    while (selected.length < count && pool.length > 0) {
      const valid = pool.filter(c => !selected.some(s => colorDistance(s, c) < minDist));
      if (valid.length === 0) break;
      const chosen = valid[Math.floor(random() * valid.length)];
      selected.push(chosen);
      const idx = pool.indexOf(chosen);
      if (idx !== -1) pool.splice(idx, 1);
    }
  } else {
    for (const sample of candidates) {
      if (selected.length >= count) break;
      const tooClose = selected.some(s => colorDistance(s, sample) < minDist);
      if (!tooClose) selected.push(sample);
    }
  }
  
  while (selected.length < count && candidates.length > 0) {
    const candidatesWithDist = candidates
      .filter(c => !selected.some(s => s === c))
      .map(c => ({
        c,
        minD: selected.length === 0 ? 999 : Math.min(...selected.map(s => colorDistance(s, c))),
      }));
    if (candidatesWithDist.length === 0) break;
    const bestDist = Math.max(...candidatesWithDist.map(x => x.minD));
    const ties = candidatesWithDist.filter(x => x.minD >= bestDist - 0.1);
    const chosen = variationSeed > 0 && ties.length > 1
      ? ties[Math.floor(random() * ties.length)].c
      : ties[0].c;
    selected.push(chosen);
  }
  
  return selected.slice(0, count).map((s, i) => ({
    id: i,
    x: s.x,
    y: s.y,
    color: `#${Math.round(s.r).toString(16).padStart(2, '0')}${Math.round(s.g).toString(16).padStart(2, '0')}${Math.round(s.b).toString(16).padStart(2, '0')}`
  }));
}

export default function ImageColorExtractor({ colorCount, onColorCountChange, onComplete, onBack, initialState, onGeneratedPaletteChange }: ImageColorExtractorProps) {
  const [imageUrl, setImageUrl] = useState<string>(() => initialState?.imageUrl ?? '');
  const [targets, setTargets] = useState<ColorTarget[]>(() => initialState?.targets ?? []);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>(() => initialState?.extractionMode ?? 'manual');
  const [draggingTarget, setDraggingTarget] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [saturationAdjust, setSaturationAdjust] = useState(() => initialState?.saturationAdjust ?? 0);
  const [lightnessAdjust, setLightnessAdjust] = useState(() => initialState?.lightnessAdjust ?? 0);
  const [hoveredMode, setHoveredMode] = useState<ExtractionMode | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reanalyzeSeedRef = useRef(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!initialState?.imageUrl || imageLoaded) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setImageLoaded(true);
        }
      }
    };
    img.onerror = () => setImageLoaded(false);
    img.src = initialState.imageUrl;
  }, [initialState?.imageUrl, imageLoaded]);

  // Apply adjustments to colors
  const adjustedColors = targets.map(t => {
    if (saturationAdjust === 0 && lightnessAdjust === 0) return t.color;
    const hsl = hexToHsl(t.color);
    const newS = Math.max(0, Math.min(100, hsl.s + saturationAdjust));
    const newL = Math.max(5, Math.min(95, hsl.l + lightnessAdjust));
    return hslToHex(hsl.h, newS, newL);
  });

  useEffect(() => {
    if (targets.length === 0) return;
    const hexes = targets.map(t => {
      if (saturationAdjust === 0 && lightnessAdjust === 0) return t.color;
      const hsl = hexToHsl(t.color);
      const newS = Math.max(0, Math.min(100, hsl.s + saturationAdjust));
      const newL = Math.max(5, Math.min(95, hsl.l + lightnessAdjust));
      return hslToHex(hsl.h, newS, newL);
    });
    onGeneratedPaletteChange?.(hexes);
  }, [targets, saturationAdjust, lightnessAdjust, onGeneratedPaletteChange]);

  const updateColorsFromCanvas = useCallback((currentTargets: ColorTarget[]) => {
    if (!canvasRef.current) return;
    
    const updated = currentTargets.map(target => ({
      ...target,
      color: getColorFromCanvas(canvasRef.current!, target.x, target.y)
    }));
    setTargets(updated);
  }, []);

  const autoExtract = useCallback((useVariation = false) => {
    if (!canvasRef.current || extractionMode === 'manual') return;
    
    if (useVariation) reanalyzeSeedRef.current += 1;
    const seed = useVariation ? reanalyzeSeedRef.current : 0;
    
    const extracted = extractColorsAuto(canvasRef.current, colorCount, extractionMode, seed);
    setTargets(extracted);
  }, [colorCount, extractionMode]);

  // Reset semilla de reanálisis al cambiar modo o imagen
  useEffect(() => {
    reanalyzeSeedRef.current = 0;
  }, [extractionMode, imageUrl]);

  // Initialize targets when color count changes (omitir si restauramos desde initialState)
  useEffect(() => {
    if (!imageLoaded) return;
    if (initialState?.targets?.length && targets.length > 0) return;
    
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
  }, [colorCount, imageLoaded, extractionMode, autoExtract, updateColorsFromCanvas]);

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
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    // Mover el punto más cercano al clic (siempre, para mayor precisión)
    let nearestId = 0;
    let nearestDist = Infinity;
    targets.forEach(t => {
      const dist = Math.sqrt((t.x - x) ** 2 + (t.y - y) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = t.id;
      }
    });
    
    setTargets(prev => prev.map(t =>
      t.id === nearestId
        ? { ...t, x, y, color: canvasRef.current ? getColorFromCanvas(canvasRef.current, x, y) : t.color }
        : t
    ));
  };

  const handleCopyHex = useCallback((hex: string, index: number) => {
    navigator.clipboard?.writeText(hex).then(() => {
      if (copyFeedbackTimeoutRef.current) clearTimeout(copyFeedbackTimeoutRef.current);
      setCopiedIndex(index);
      copyFeedbackTimeoutRef.current = setTimeout(() => {
        setCopiedIndex(null);
        copyFeedbackTimeoutRef.current = null;
      }, 1500);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) clearTimeout(copyFeedbackTimeoutRef.current);
    };
  }, []);

  const handleComplete = () => {
    const savedState: ImageExtractorSavedState = {
      imageUrl,
      targets: JSON.parse(JSON.stringify(targets)),
      extractionMode,
      saturationAdjust,
      lightnessAdjust,
    };
    onComplete(adjustedColors, savedState);
  };

  const IMAGE_ICON = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-0 max-h-[calc(100vh-10rem)]"
    >
      {/* Banner integrado con el mismo estilo que Armonía de Color */}
      <div className="shrink-0 bg-gray-700/60 rounded-2xl border border-gray-600/50 px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            const savedState: ImageExtractorSavedState = {
              imageUrl,
              targets: JSON.parse(JSON.stringify(targets)),
              extractionMode,
              saturationAdjust,
              lightnessAdjust,
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
          <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border border-blue-500/30 text-blue-400" aria-hidden>
            {IMAGE_ICON}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">Extraer de Imagen</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sube una imagen o elige de ejemplo para extraer colores</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleComplete}
          disabled={targets.length === 0}
          className="shrink-0 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white border border-indigo-500/50 font-medium transition-all text-sm"
        >
          Usar paleta →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden mt-6">
        {/* Left: Image area */}
        <div className="bg-gray-800/50 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden">
          {!imageUrl ? (
            <>
              <label className="flex-1 min-h-0 flex flex-col border-2 border-dashed border-gray-600 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <div className="flex-1 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl mb-2">📤</div>
                  <p className="text-white font-medium text-sm mb-1">Arrastra o haz clic para subir</p>
                  <p className="text-gray-500 text-xs">JPG, PNG, WebP</p>
                </div>
              </label>
              <p className="text-gray-400 text-xs mt-3 mb-2">O prueba con ejemplo:</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleImageLoad(img.url)}
                    className="aspect-square rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition-all"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {extractionModes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    type="button"
                    onClick={() => setExtractionMode(mode.id)}
                    onMouseEnter={() => setHoveredMode(mode.id)}
                    onMouseLeave={() => setHoveredMode(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={extractionMode === mode.id}
                    aria-label={`${mode.name}: ${mode.description}`}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all min-w-0 ${
                      extractionMode === mode.id
                        ? 'bg-indigo-600 ring-2 ring-indigo-400 text-white'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    <span className={`flex shrink-0 items-center justify-center w-7 h-7 rounded-lg ${
                      extractionMode === mode.id ? 'bg-white/20' : 'bg-gray-600/50'
                    }`}>
                      {EXTRACTION_MODE_ICONS[mode.id]}
                    </span>
                    <span className="text-xs font-medium truncate">{mode.name}</span>
                  </motion.button>
                ))}
              </div>
              {/* Zona fija de descripción: parte superior de la imagen */}
              <div className="shrink-0 h-8 flex items-center justify-center px-3 rounded-t-xl bg-gray-800/80 border-b border-gray-700/50">
                <span className={`text-xs whitespace-nowrap truncate max-w-full transition-opacity duration-150 ${hoveredMode ? 'text-gray-200 opacity-100' : 'text-gray-500 opacity-60'}`}>
                  {hoveredMode ? extractionModes.find((m) => m.id === hoveredMode)?.description ?? '' : 'Pasa el ratón sobre un modo'}
                </span>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center rounded-b-xl bg-gray-900">
                <div
                  ref={containerRef}
                  className="relative max-w-full max-h-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                  onClick={handleImageClick}
                >
                  <img src={imageUrl} alt="Source" className="block w-full h-auto max-h-full" />
                <canvas ref={canvasRef} className="hidden" />
                {imageLoaded && targets.map((target) => (
                  <motion.div
                    key={target.id}
                    className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 cursor-grab active:cursor-grabbing ${draggingTarget === target.id ? 'z-20' : 'z-10'}`}
                    style={{ left: `${target.x}%`, top: `${target.y}%` }}
                    onMouseDown={(e) => handleTargetDrag(e, target.id)}
                    onTouchStart={(e) => handleTargetDrag(e, target.id)}
                    animate={{ scale: draggingTarget === target.id ? 1.2 : 1 }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: target.color }} />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                      {target.id + 1}
                    </div>
                  </motion.div>
                ))}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <label className="flex-1 min-w-0">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-xl text-sm font-medium cursor-pointer transition-colors border border-gray-600/50">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Cambiar imagen</span>
                  </div>
                </label>
                {extractionMode !== 'manual' && (
                  <button
                    type="button"
                    onClick={() => autoExtract(true)}
                    className="flex items-center justify-center gap-2 shrink-0 py-2.5 px-4 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-xl text-sm font-medium transition-colors border border-gray-600/50"
                  >
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12c0-1.232.046-2.453.138-3.662a4.006 4.006 0 013.7-3.7 48.678 48.678 0 017.324 0 4.006 4.006 0 013.7 3.7c.017.22.032.441.046.662M4.5 12l-3-3m3 3l3-3m12 3c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 01-3.7 3.7 48.657 48.657 0 01-7.324 0 4.006 4.006 0 01-3.7-3.7c-.017-.22-.032-.441-.046-.662M19.5 12l-3 3m3-3l-3 3" />
                    </svg>
                    <span>Reanalizar</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Center: Paleta extraída + controles */}
        <div className="bg-gray-800/50 rounded-2xl p-4 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Paleta extraída</h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Nº colores</span>
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onColorCountChange(num)}
                  className={`w-7 h-7 rounded-lg text-sm font-medium transition-all ${
                    colorCount === num ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, targets.length))}, minmax(0, 1fr))` }}>
            {targets.map((target, idx) => {
              const hex = (adjustedColors[idx] || target.color).toUpperCase();
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => handleCopyHex(hex, idx)}
                  title={`${hex} — clic para copiar`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-700/60 hover:bg-gray-700 border border-transparent hover:border-gray-600/50 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg flex-shrink-0 ring-1 ring-black/10" style={{ backgroundColor: hex }} />
                  <span className="text-white text-xs font-mono truncate flex-1 min-w-0">{hex}</span>
                  {copiedIndex === idx ? (
                    <span className="text-[10px] font-medium text-emerald-400 shrink-0">Copiado</span>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m2 4v6a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {targets.length > 0 && (
            <div className="h-9 rounded-xl overflow-hidden flex mb-4 ring-1 ring-black/10">
              {adjustedColors.map((color, idx) => (
                <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}

          <div className="pt-3 mt-1 border-t border-gray-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Ajustes globales</span>
              {(saturationAdjust !== 0 || lightnessAdjust !== 0) && (
                <button
                  type="button"
                  onClick={() => { setSaturationAdjust(0); setLightnessAdjust(0); }}
                  className="text-[10px] text-gray-400 hover:text-gray-300 font-medium"
                >
                  Restablecer
                </button>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1.5">
                <span>Saturación</span>
                <span>{saturationAdjust > 0 ? '+' : ''}{saturationAdjust}%</span>
              </label>
              <input
                type="range"
                min="-40"
                max="40"
                value={saturationAdjust}
                onChange={(e) => setSaturationAdjust(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-gray-700/50"
                style={{
                  background: `linear-gradient(to right, hsl(270, 0%, 50%), hsl(270, 50%, 50%), hsl(270, 100%, 50%))`,
                }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1.5">
                <span>Luminosidad</span>
                <span>{lightnessAdjust > 0 ? '+' : ''}{lightnessAdjust}%</span>
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                value={lightnessAdjust}
                onChange={(e) => setLightnessAdjust(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-gray-700/50"
                style={{
                  background: `linear-gradient(to right, hsl(270, 70%, 15%), hsl(270, 70%, 50%), hsl(270, 70%, 85%))`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Poster Examples (sin scroll: el contenido cabe en la ventana) */}
        <div className="bg-gray-800/50 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Ejemplos de aplicación</h3>
          <div className="origin-top scale-[0.96]">
            <PosterExamples colors={adjustedColors.length > 0 ? adjustedColors : targets.map((t) => t.color)} compact layout="preview-first" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
