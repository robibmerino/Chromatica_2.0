import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import ColorHarmonyCreator from './inspiration/ColorHarmonyCreator';
import ImageColorExtractor from './inspiration/ImageColorExtractor';
import { ArchetypesCreator } from './inspiration/ArchetypesCreator';
import ShapesCreator from './inspiration/ShapesCreator';
import TrendingPalettes from './inspiration/TrendingPalettes';
import PosterExamples from './PosterExamples';
import PaletteAnalysis from './PaletteAnalysis';
import ScientificAnalysis from './ScientificAnalysis';
import ApplicationShowcase from './ApplicationShowcase';
import { ExportPanelPro } from './export/ExportPanelPro';
import ChromaticaLogo from './ChromaticaLogo';
import ButtonParticles from './ButtonParticles';

// Types
interface ColorItem {
  id: string;
  hex: string;
  locked: boolean;
}

type Phase = 'inspiration-menu' | 'inspiration-detail' | 'refinement' | 'application' | 'analysis' | 'save';
type InspirationMode = 'harmony' | 'image' | 'archetypes' | 'shapes' | 'trending' | 'archetypes-menu';

interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: Date;
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
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

function getContrastColor(hex: string): string {
  const { l } = hexToHsl(hex);
  return l > 55 ? '#1a1a2e' : '#ffffff';
}

// generateRandomColor removed - was used in old Creation phase

// InspirationButton Component - Extracted to avoid hooks in map
interface InspirationButtonProps {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  particleColor: string;
  glowColor: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function InspirationButton({
  title,
  description,
  bgColor,
  borderColor,
  hoverBorder,
  iconBg,
  iconColor,
  particleColor,
  glowColor,
  icon,
  onClick,
}: InspirationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01, x: 5 }}
      whileTap={{ scale: 0.99 }}
      className={`relative overflow-hidden rounded-2xl p-5 text-left ${bgColor} border ${borderColor} ${hoverBorder} backdrop-blur-sm group transition-all duration-300`}
    >
      {/* Particle effect */}
      <ButtonParticles isHovered={isHovered} color={particleColor} count={15} intensity="light" />
      
      {/* Subtle glow on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div 
          className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-0.5">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        </div>
        <motion.svg 
          className="w-5 h-5 text-gray-500 flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
          animate={{
            x: isHovered ? 4 : 0,
            color: isHovered ? '#ffffff' : '#6b7280'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </motion.svg>
      </div>
    </motion.button>
  );
}

// ArchetypeOrShapeButton Component
function ArchetypeOrShapeButton({ 
  type, 
  onClick 
}: { 
  type: 'archetypes' | 'shapes'; 
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isArchetypes = type === 'archetypes';
  const config = isArchetypes ? {
    bgGradient: 'from-amber-900/40 to-orange-900/30',
    borderColor: 'border-amber-500/30 hover:border-amber-400/50',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    particleColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.2)',
    title: 'Arquetipos',
    description: 'Explora conceptos, emociones y significados para crear paletas con intención',
    tags: ['Emocionales', 'Estilos', 'Culturales'],
    tagBg: 'bg-amber-500/20',
    tagColor: 'text-amber-300',
    textColor: 'text-amber-200/70',
    rotate: -5,
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  } : {
    bgGradient: 'from-violet-900/40 to-purple-900/30',
    borderColor: 'border-violet-500/30 hover:border-violet-400/50',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    particleColor: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.2)',
    title: 'Formas',
    description: 'Inspírate en formas abstractas basadas en el efecto Bouba-Kiki',
    tags: ['Orgánicas', 'Angulares', 'Patrones'],
    tagBg: 'bg-violet-500/20',
    tagColor: 'text-violet-300',
    textColor: 'text-violet-200/70',
    rotate: 5,
    icon: (
      <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-left bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} group transition-all`}
    >
      {/* Particles */}
      <ButtonParticles isHovered={isHovered} color={config.particleColor} count={20} intensity="medium" />
      
      {/* Glow */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${config.glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
          className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mb-4`}
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? config.rotate : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {config.icon}
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
        <p className={`${config.textColor} text-sm`}>
          {config.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {config.tags.map(tag => (
            <span key={tag} className={`text-xs px-2 py-1 ${config.tagBg} ${config.tagColor} rounded-full`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

// Main Component
export default function GuidedPaletteCreator() {
  const [phase, setPhase] = useState<Phase>('inspiration-menu');
  const [inspirationMode, setInspirationMode] = useState<InspirationMode | null>(null);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [colorCount, setColorCount] = useState(4);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [paletteName, setPaletteName] = useState('');
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMyPalettes, setShowMyPalettes] = useState(false);
  const [analysisType, setAnalysisType] = useState<'basic' | 'scientific'>('basic');
  
  // Refinement mode: 'color' (per color) or 'general' (whole palette)
  const [refinementMode, setRefinementMode] = useState<'color' | 'general'>('color');
  
  // Undo/Redo history for refinement
  const [history, setHistory] = useState<ColorItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Store original palette when entering refinement
  const [originalPalette, setOriginalPalette] = useState<ColorItem[]>([]);
  
  // Reference palette for sliders (to calculate relative changes)
  const [sliderReference, setSliderReference] = useState<ColorItem[]>([]);
  
  // Save to history when colors change
  const saveToHistory = useCallback((newColors: ColorItem[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...newColors]); // Deep copy
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);
  
  // Update colors AND save to history
  const updateColorsWithHistory = useCallback((newColors: ColorItem[]) => {
    setColors(newColors);
    saveToHistory(newColors);
  }, [saveToHistory]);
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setColors(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setColors(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);
  
  // General palette adjustments
  const adjustPaletteSaturation = useCallback((amount: number) => {
    const newColors = colors.map(c => {
      if (c.locked) return c;
      const hsl = hexToHsl(c.hex);
      const newS = Math.max(0, Math.min(100, hsl.s + amount));
      return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
    });
    setColors(newColors);
    saveToHistory(newColors);
  }, [colors, saveToHistory]);
  
  const adjustPaletteLightness = useCallback((amount: number) => {
    const newColors = colors.map(c => {
      if (c.locked) return c;
      const hsl = hexToHsl(c.hex);
      const newL = Math.max(5, Math.min(95, hsl.l + amount));
      return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
    });
    setColors(newColors);
    saveToHistory(newColors);
  }, [colors, saveToHistory]);
  
  const adjustPaletteHue = useCallback((amount: number) => {
    const newColors = colors.map(c => {
      if (c.locked) return c;
      const hsl = hexToHsl(c.hex);
      const newH = (hsl.h + amount + 360) % 360;
      return { ...c, hex: hslToHex(newH, hsl.s, hsl.l) };
    });
    setColors(newColors);
    saveToHistory(newColors);
  }, [colors, saveToHistory]);

  // Load saved palettes
  useEffect(() => {
    const saved = localStorage.getItem('colorPalettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);
  
  // Reset history and save original palette when entering refinement
  useEffect(() => {
    if (phase === 'refinement' && colors.length > 0) {
      // Save the original palette
      setOriginalPalette([...colors]);
      setSliderReference([...colors]);
      // Reset history with current state
      setHistory([[...colors]]);
      setHistoryIndex(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Handle inspiration completion
  const handleInspirationComplete = useCallback((newColors: string[]) => {
    setColors(newColors.map(hex => ({
      id: generateId(),
      hex,
      locked: false
    })));
    setPhase('refinement');
  }, []);

  // Color manipulation functions are handled in refinement phase

  const updateColor = useCallback((id: string, hex: string) => {
    setColors(prev => prev.map(c => 
      c.id === id ? { ...c, hex } : c
    ));
  }, []);

  const shuffleColors = useCallback(() => {
    setColors(prev => {
      const unlocked = prev.filter(c => !c.locked);
      
      for (let i = unlocked.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unlocked[i], unlocked[j]] = [unlocked[j], unlocked[i]];
      }
      
      const result: ColorItem[] = [];
      let unlockedIndex = 0;
      
      prev.forEach((c) => {
        if (c.locked) {
          result.push(c);
        } else {
          result.push(unlocked[unlockedIndex++]);
        }
      });
      
      return result;
    });
    showNotification('🔀 Colores mezclados');
  }, [showNotification]);

  // regenerateUnlocked removed - was used in old Creation phase

  // Save palette
  const savePalette = useCallback(() => {
    if (!paletteName.trim()) {
      showNotification('⚠️ Añade un nombre a tu paleta');
      return;
    }
    
    const newPalette: SavedPalette = {
      id: generateId(),
      name: paletteName,
      colors: colors.map(c => c.hex),
      createdAt: new Date()
    };
    
    const updated = [...savedPalettes, newPalette];
    setSavedPalettes(updated);
    localStorage.setItem('colorPalettes', JSON.stringify(updated));
    showNotification('✅ ¡Paleta guardada!');
  }, [paletteName, colors, savedPalettes, showNotification]);

  // Selected color for refinement
  const selectedColor = selectedColorIndex !== null ? colors[selectedColorIndex] : null;

  // Phase navigation
  const phases: { id: Phase; name: string; icon: string }[] = [
    { id: 'inspiration-menu', name: 'Inspiración', icon: '✨' },
    { id: 'refinement', name: 'Refinamiento', icon: '🔧' },
    { id: 'application', name: 'Aplicación', icon: '👁️' },
    { id: 'analysis', name: 'Análisis', icon: '🔍' },
    { id: 'save', name: 'Guardar', icon: '💾' },
  ];

  const currentPhaseIndex = phases.findIndex(p => 
    p.id === phase || (phase === 'inspiration-detail' && p.id === 'inspiration-menu')
  );

  const goToPhase = (targetPhase: Phase) => {
    if (targetPhase === 'inspiration-menu') {
      setInspirationMode(null);
    }
    setPhase(targetPhase);
  };

  const goBack = () => {
    switch (phase) {
      case 'inspiration-detail':
        setPhase('inspiration-menu');
        setInspirationMode(null);
        break;
      case 'refinement':
        setPhase('inspiration-detail');
        break;
      case 'application':
        setPhase('refinement');
        break;
      case 'analysis':
        setPhase('application');
        break;
      case 'save':
        setPhase('analysis');
        break;
    }
  };

  const goNext = () => {
    switch (phase) {
      case 'refinement':
        setPhase('application');
        break;
      case 'application':
        setPhase('analysis');
        break;
      case 'analysis':
        setPhase('save');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ChromaticaLogo 
              size="sm" 
              onClick={() => {
                setColors([]);
                setPaletteName('');
                setPhase('inspiration-menu');
                setInspirationMode(null);
              }}
            />
            
            {/* Progress bar */}
            <div className="hidden md:flex items-center gap-2">
              {phases.map((p, index) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (index <= currentPhaseIndex || colors.length > 0) {
                      goToPhase(p.id);
                    }
                  }}
                  disabled={index > currentPhaseIndex && colors.length === 0}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (p.id === phase || (phase === 'inspiration-detail' && p.id === 'inspiration-menu'))
                      ? 'bg-indigo-600 text-white'
                      : index < currentPhaseIndex
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className="hidden lg:inline">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* PHASE: Inspiration Menu */}
          {phase === 'inspiration-menu' && (
            <motion.div
              key="inspiration-menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  ✨ ¿Cómo quieres empezar a crear tu paleta?
                </h2>
                <p className="text-gray-400">
                  Elige tu punto de partida para una paleta única
                </p>
              </div>

              <div className="grid gap-4">
                {/* Harmony button */}
                <InspirationButton
                  id="harmony"
                  title="Armonía de color"
                  description="Basada en teoría del color: complementarios, análogos, triádicos..."
                  bgColor="bg-indigo-950/40"
                  borderColor="border-indigo-500/30"
                  hoverBorder="hover:border-indigo-400/60"
                  iconBg="bg-indigo-500/20"
                  iconColor="text-indigo-400"
                  particleColor="#818cf8"
                  glowColor="rgba(99, 102, 241, 0.15)"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 3v9l6.5 3.75" />
                      <path d="M12 12L5.5 15.75" />
                      <path d="M12 12V21" />
                    </svg>
                  }
                  onClick={() => {
                    setInspirationMode('harmony');
                    setPhase('inspiration-detail');
                  }}
                />
                
                {/* Image button */}
                <InspirationButton
                  id="image"
                  title="Desde imagen"
                  description="Extrae colores de una foto o imagen que te inspire"
                  bgColor="bg-rose-950/40"
                  borderColor="border-rose-500/30"
                  hoverBorder="hover:border-rose-400/60"
                  iconBg="bg-rose-500/20"
                  iconColor="text-rose-400"
                  particleColor="#fb7185"
                  glowColor="rgba(244, 63, 94, 0.15)"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  }
                  onClick={() => {
                    setInspirationMode('image');
                    setPhase('inspiration-detail');
                  }}
                />
                
                {/* Archetypes button */}
                <InspirationButton
                  id="archetypes-menu"
                  title="Arquetipos o Formas"
                  description="Empieza desde conceptos, emociones o formas abstractas"
                  bgColor="bg-amber-950/40"
                  borderColor="border-amber-500/30"
                  hoverBorder="hover:border-amber-400/60"
                  iconBg="bg-amber-500/20"
                  iconColor="text-amber-400"
                  particleColor="#fbbf24"
                  glowColor="rgba(251, 191, 36, 0.15)"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  }
                  onClick={() => {
                    setInspirationMode('archetypes-menu');
                    setPhase('inspiration-detail');
                  }}
                />
              </div>

              {/* Secondary option: Trending Palettes */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <motion.button
                  onClick={() => {
                    setInspirationMode('trending');
                    setPhase('inspiration-detail');
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full relative overflow-hidden rounded-xl p-4 text-left bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 backdrop-blur-sm group transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-lg">
                      🔥
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-gray-200">
                          Paletas en tendencia
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full font-medium">
                          +60 paletas
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Paletas curadas inspiradas en las tendencias actuales del diseño
                      </p>
                    </div>
                    <svg 
                      className="w-4 h-4 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {/* Mini preview of trending palettes */}
                  <div className="flex gap-2 mt-3 pl-14">
                    {[
                      ['#FFBE98', '#FF9B7D', '#E8D5B7', '#4A3728'],
                      ['#635BFF', '#00D4FF', '#0A2540', '#F6F9FC'],
                      ['#2D5A27', '#4A7C47', '#8FB573', '#D4E6C3'],
                      ['#FF6AD5', '#C774E8', '#AD8CFF', '#2B1055'],
                    ].map((colors, idx) => (
                      <div key={idx} className="flex rounded-md overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                        {colors.map((color, i) => (
                          <div key={i} className="w-4 h-6" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    ))}
                    <span className="text-gray-600 text-xs self-center ml-1">...</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Inspiration Detail */}
          {phase === 'inspiration-detail' && (
            <motion.div
              key="inspiration-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {inspirationMode === 'harmony' && (
                <ColorHarmonyCreator
                  colorCount={colorCount}
                  onColorCountChange={setColorCount}
                  onComplete={handleInspirationComplete}
                  onBack={goBack}
                />
              )}
              {inspirationMode === 'image' && (
                <ImageColorExtractor
                  colorCount={colorCount}
                  onColorCountChange={setColorCount}
                  onComplete={handleInspirationComplete}
                  onBack={goBack}
                />
              )}
              {inspirationMode === 'archetypes-menu' && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      🎭 ¿Cómo quieres inspirarte?
                    </h2>
                    <p className="text-gray-400">
                      Elige entre explorar conceptos o formas abstractas
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Arquetipos option */}
                    <ArchetypeOrShapeButton
                      type="archetypes"
                      onClick={() => setInspirationMode('archetypes')}
                    />

                    {/* Formas option */}
                    <ArchetypeOrShapeButton
                      type="shapes"
                      onClick={() => setInspirationMode('shapes')}
                    />
                  </div>

                  {/* Back button */}
                  <div className="flex justify-center">
                    <button
                      onClick={goBack}
                      className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl font-medium transition-colors"
                    >
                      ← Volver al menú
                    </button>
                  </div>
                </div>
              )}
              {inspirationMode === 'archetypes' && (
                <ArchetypesCreator
                  colorCount={colorCount}
                  onColorCountChange={setColorCount}
                  onCreatePalette={handleInspirationComplete}
                  onBack={() => setInspirationMode('archetypes-menu')}
                />
              )}
              {inspirationMode === 'shapes' && (
                <ShapesCreator
                  colorCount={colorCount}
                  onColorCountChange={setColorCount}
                  onComplete={handleInspirationComplete}
                  onBack={() => setInspirationMode('archetypes-menu')}
                />
              )}
              {inspirationMode === 'trending' && (
                <TrendingPalettes
                  colorCount={colorCount}
                  onColorCountChange={setColorCount}
                  onSelectPalette={handleInspirationComplete}
                  onBack={goBack}
                />
              )}
            </motion.div>
          )}

          {/* PHASE: Refinement */}
          {phase === 'refinement' && (
            <motion.div
              key="refinement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header with undo/redo */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-semibold text-white">🔧 Refina tu paleta</h2>
                <div className="flex gap-2">
                  {/* Original palette button */}
                  {originalPalette.length > 0 && (
                    <button
                      onClick={() => {
                        setColors([...originalPalette]);
                        saveToHistory([...originalPalette]);
                        showNotification('↩ Paleta inicial restaurada');
                      }}
                      className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                      title="Restaurar la paleta con la que empezaste"
                    >
                      <span>↩</span>
                      <span className="hidden sm:inline">Paleta inicial</span>
                    </button>
                  )}
                  {/* Undo/Redo buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        historyIndex > 0
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      }`}
                      title="Deshacer (Ctrl+Z)"
                    >
                      ↶
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        historyIndex < history.length - 1
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      }`}
                      title="Rehacer (Ctrl+Y)"
                    >
                      ↷
                    </button>
                  </div>
                  <button
                    onClick={shuffleColors}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    🔀 Mezclar
                  </button>
                </div>
              </div>

              {/* Mode tabs: Por color / General */}
              <div className="flex gap-2 bg-gray-800/50 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setRefinementMode('color')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    refinementMode === 'color'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>🎨</span>
                  Por color
                </button>
                <button
                  onClick={() => setRefinementMode('general')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    refinementMode === 'general'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>⚙️</span>
                  General
                </button>
              </div>

              {/* Tip for reordering */}
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-3 flex items-center gap-3">
                <span className="text-lg">💡</span>
                <p className="text-purple-200 text-sm">
                  {refinementMode === 'color' 
                    ? 'Arrastra los colores de la barra para cambiar su orden. Selecciona uno para editarlo.'
                    : 'Ajusta la saturación, luminosidad y tono de toda la paleta a la vez.'
                  }
                </p>
              </div>

              {/* Reorderable palette bar */}
              <Reorder.Group
                axis="x"
                values={colors}
                onReorder={(newOrder) => {
                  setColors(newOrder);
                  // Save to history after a small delay to batch changes
                  setTimeout(() => saveToHistory(newOrder), 100);
                }}
                className="h-16 rounded-2xl overflow-hidden flex shadow-lg"
              >
                {colors.map((color, index) => (
                  <Reorder.Item
                    key={color.id}
                    value={color}
                    className="flex-1 cursor-grab active:cursor-grabbing relative group"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColorIndex(index)}
                  >
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                      selectedColorIndex === index ? 'ring-4 ring-white ring-inset' : ''
                    }`}>
                      <span 
                        className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/30"
                        style={{ color: getContrastColor(color.hex) }}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {refinementMode === 'color' ? (
                  <>
                    {/* Color selector */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Selecciona un color</h3>
                        <div className="flex items-center gap-1">
                          {/* Add color button */}
                          {colors.length < 8 && (
                            <button
                              onClick={() => {
                                const lastColor = colors[colors.length - 1];
                                const hsl = hexToHsl(lastColor.hex);
                                const newHue = (hsl.h + 30) % 360;
                                const newColor = {
                                  id: generateId(),
                                  hex: hslToHex(newHue, hsl.s, hsl.l),
                                  locked: false
                                };
                                const newColors = [...colors, newColor];
                                setColors(newColors);
                                saveToHistory(newColors);
                                setSelectedColorIndex(colors.length);
                                showNotification('➕ Color añadido');
                              }}
                              className="p-1.5 bg-gray-700/50 hover:bg-green-600/30 text-gray-400 hover:text-green-400 rounded-lg transition-colors group"
                              title="Añadir color"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          )}
                          {/* Remove selected color button */}
                          {colors.length > 2 && selectedColorIndex !== null && (
                            <button
                              onClick={() => {
                                const colorToRemove = colors[selectedColorIndex];
                                const newColors = colors.filter(c => c.id !== colorToRemove.id);
                                setColors(newColors);
                                saveToHistory(newColors);
                                setSelectedColorIndex(Math.min(selectedColorIndex, newColors.length - 1));
                                showNotification('➖ Color eliminado');
                              }}
                              className="p-1.5 bg-gray-700/50 hover:bg-red-600/30 text-gray-400 hover:text-red-400 rounded-lg transition-colors group"
                              title="Eliminar color seleccionado"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {colors.map((color, index) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColorIndex(index)}
                            className={`aspect-square rounded-xl transition-all ${
                              selectedColorIndex === index
                                ? 'ring-4 ring-white scale-110'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="text-xs font-bold" style={{ color: getContrastColor(color.hex) }}>
                              {index + 1}
                            </span>
                          </button>
                        ))}
                        
                        {/* Empty slot hint when less than 8 colors */}
                        {colors.length < 8 && (
                          <button
                            onClick={() => {
                              const lastColor = colors[colors.length - 1];
                              const hsl = hexToHsl(lastColor.hex);
                              const newHue = (hsl.h + 30) % 360;
                              const newColor = {
                                id: generateId(),
                                hex: hslToHex(newHue, hsl.s, hsl.l),
                                locked: false
                              };
                              const newColors = [...colors, newColor];
                              setColors(newColors);
                              saveToHistory(newColors);
                              setSelectedColorIndex(colors.length);
                              showNotification('➕ Color añadido');
                            }}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-600/50 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-gray-400 transition-colors"
                            title="Añadir nuevo color"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {/* Counter */}
                      <p className="text-xs text-gray-500 text-center">{colors.length} de 8 colores</p>
                    </div>

                    {/* Color editor */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                  {selectedColor ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-16 h-16 rounded-xl"
                          style={{ backgroundColor: selectedColor.hex }}
                        />
                        <div>
                          <h3 className="text-white font-medium">Color {selectedColorIndex! + 1}</h3>
                          <input
                            type="text"
                            value={selectedColor.hex.toUpperCase()}
                            onChange={(e) => {
                              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                updateColor(selectedColor.id, e.target.value);
                              }
                            }}
                            className="bg-gray-700 text-white font-mono text-sm px-3 py-1 rounded mt-1"
                          />
                        </div>
                        <input
                          type="color"
                          value={selectedColor.hex}
                          onChange={(e) => updateColor(selectedColor.id, e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer ml-auto"
                        />
                      </div>

                      {/* HSL Sliders */}
                      {(() => {
                        const hsl = hexToHsl(selectedColor.hex);
                        return (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400 flex justify-between mb-2">
                                <span>Tono</span>
                                <span>{hsl.h}°</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={hsl.h}
                                onChange={(e) => updateColor(selectedColor.id, hslToHex(parseInt(e.target.value), hsl.s, hsl.l))}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, 
                                    hsl(0, ${hsl.s}%, ${hsl.l}%),
                                    hsl(60, ${hsl.s}%, ${hsl.l}%),
                                    hsl(120, ${hsl.s}%, ${hsl.l}%),
                                    hsl(180, ${hsl.s}%, ${hsl.l}%),
                                    hsl(240, ${hsl.s}%, ${hsl.l}%),
                                    hsl(300, ${hsl.s}%, ${hsl.l}%),
                                    hsl(360, ${hsl.s}%, ${hsl.l}%))`
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 flex justify-between mb-2">
                                <span>Saturación</span>
                                <span>{hsl.s}%</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={hsl.s}
                                onChange={(e) => updateColor(selectedColor.id, hslToHex(hsl.h, parseInt(e.target.value), hsl.l))}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, 
                                    hsl(${hsl.h}, 0%, ${hsl.l}%),
                                    hsl(${hsl.h}, 100%, ${hsl.l}%))`
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 flex justify-between mb-2">
                                <span>Luminosidad</span>
                                <span>{hsl.l}%</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={hsl.l}
                                onChange={(e) => updateColor(selectedColor.id, hslToHex(hsl.h, hsl.s, parseInt(e.target.value)))}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, 
                                    hsl(${hsl.h}, ${hsl.s}%, 0%),
                                    hsl(${hsl.h}, ${hsl.s}%, 50%),
                                    hsl(${hsl.h}, ${hsl.s}%, 100%))`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Quick adjustments */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                          { label: '+Claro', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 10)));
                          }},
                          { label: '+Oscuro', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 10)));
                          }},
                          { label: '+Saturado', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex(hsl.h, Math.min(100, hsl.s + 15), hsl.l));
                          }},
                          { label: '+Apagado', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex(hsl.h, Math.max(0, hsl.s - 15), hsl.l));
                          }},
                          { label: 'Rotar tono', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
                          }},
                          { label: 'Complemento', action: () => {
                            const hsl = hexToHsl(selectedColor.hex);
                            updateColor(selectedColor.id, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                          }},
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={btn.action}
                            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Selecciona un color para editarlo
                    </div>
                  )}
                </div>

                {/* Application examples - Real-time preview */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-4">Ejemplos de aplicación</h3>
                      <PosterExamples colors={colors.map(c => c.hex)} compact />
                    </div>
                  </>
                ) : (
                  /* GENERAL MODE - Adjust whole palette */
                  <>
                    {/* Saturation adjustment with slider */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Saturación general</h3>
                      <p className="text-xs text-gray-500 mb-4">Ajusta la intensidad de todos los colores</p>
                      
                      {/* Slider */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          defaultValue="0"
                          onChange={(e) => {
                            const adjustment = parseInt(e.target.value);
                            const newColors = sliderReference.map((c, i) => {
                              if (colors[i]?.locked) return colors[i];
                              const hsl = hexToHsl(c.hex);
                              const newS = Math.max(0, Math.min(100, hsl.s + adjustment));
                              return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
                            });
                            setColors(newColors);
                          }}
                          onMouseDown={() => setSliderReference([...colors])}
                          onMouseUp={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          onTouchStart={() => setSliderReference([...colors])}
                          onTouchEnd={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          className="w-full h-3 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #888, hsl(${hexToHsl(colors[0]?.hex || '#ff0000').h}, 100%, 50%))`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>-40%</span>
                          <span>0</span>
                          <span>+40%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => adjustPaletteSaturation(-10)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-10%</button>
                        <button onClick={() => adjustPaletteSaturation(-5)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-5%</button>
                        <button onClick={() => adjustPaletteSaturation(5)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+5%</button>
                        <button onClick={() => adjustPaletteSaturation(10)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+10%</button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            const newColors = colors.map(c => {
                              const hsl = hexToHsl(c.hex);
                              return { ...c, hex: hslToHex(hsl.h, 80, hsl.l) };
                            });
                            updateColorsWithHistory(newColors);
                          }}
                          className="flex-1 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg text-sm transition-colors"
                        >
                          🌈 Vibrante
                        </button>
                        <button
                          onClick={() => {
                            const newColors = colors.map(c => {
                              const hsl = hexToHsl(c.hex);
                              return { ...c, hex: hslToHex(hsl.h, 30, hsl.l) };
                            });
                            updateColorsWithHistory(newColors);
                          }}
                          className="flex-1 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          ☁️ Apagado
                        </button>
                      </div>
                    </div>

                    {/* Lightness adjustment with slider */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Luminosidad general</h3>
                      <p className="text-xs text-gray-500 mb-4">Aclara u oscurece toda la paleta</p>
                      
                      {/* Slider */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          defaultValue="0"
                          onChange={(e) => {
                            const adjustment = parseInt(e.target.value);
                            const newColors = sliderReference.map((c, i) => {
                              if (colors[i]?.locked) return colors[i];
                              const hsl = hexToHsl(c.hex);
                              const newL = Math.max(5, Math.min(95, hsl.l + adjustment));
                              return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
                            });
                            setColors(newColors);
                          }}
                          onMouseDown={() => setSliderReference([...colors])}
                          onMouseUp={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          onTouchStart={() => setSliderReference([...colors])}
                          onTouchEnd={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          className="w-full h-3 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #111, #888, #fff)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>-40%</span>
                          <span>0</span>
                          <span>+40%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => adjustPaletteLightness(-10)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-10%</button>
                        <button onClick={() => adjustPaletteLightness(-5)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-5%</button>
                        <button onClick={() => adjustPaletteLightness(5)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+5%</button>
                        <button onClick={() => adjustPaletteLightness(10)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+10%</button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            const newColors = colors.map(c => {
                              const hsl = hexToHsl(c.hex);
                              return { ...c, hex: hslToHex(hsl.h, hsl.s, 75) };
                            });
                            updateColorsWithHistory(newColors);
                          }}
                          className="flex-1 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg text-sm transition-colors"
                        >
                          🍂 Pastel
                        </button>
                        <button
                          onClick={() => {
                            const newColors = colors.map(c => {
                              const hsl = hexToHsl(c.hex);
                              return { ...c, hex: hslToHex(hsl.h, hsl.s, 30) };
                            });
                            updateColorsWithHistory(newColors);
                          }}
                          className="flex-1 py-2 bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          🌑 Oscuro
                        </button>
                      </div>
                    </div>

                    {/* Hue adjustment with slider */}
                    <div className="bg-gray-800/50 rounded-2xl p-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Rotar tonos</h3>
                      <p className="text-xs text-gray-500 mb-4">Desplaza todos los colores en la rueda cromática</p>
                      
                      {/* Slider */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          defaultValue="0"
                          onChange={(e) => {
                            const rotation = parseInt(e.target.value);
                            // Calculate from reference colors (saved when slider starts)
                            const newColors = sliderReference.map((c, i) => {
                              if (colors[i]?.locked) return colors[i];
                              const hsl = hexToHsl(c.hex);
                              return { ...c, hex: hslToHex((hsl.h + rotation + 360) % 360, hsl.s, hsl.l) };
                            });
                            setColors(newColors);
                          }}
                          onMouseDown={() => setSliderReference([...colors])}
                          onMouseUp={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          onTouchStart={() => setSliderReference([...colors])}
                          onTouchEnd={(e) => {
                            saveToHistory(colors);
                            (e.target as HTMLInputElement).value = '0';
                            setSliderReference([...colors]);
                          }}
                          className="w-full h-3 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, hsl(180, 70%, 50%), hsl(270, 70%, 50%), hsl(0, 70%, 50%), hsl(90, 70%, 50%), hsl(180, 70%, 50%))`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>-180°</span>
                          <span>0°</span>
                          <span>+180°</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => adjustPaletteHue(-30)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-30°</button>
                        <button onClick={() => adjustPaletteHue(-15)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">-15°</button>
                        <button onClick={() => adjustPaletteHue(15)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+15°</button>
                        <button onClick={() => adjustPaletteHue(30)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">+30°</button>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => adjustPaletteHue(180)}
                          className="w-full py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm transition-colors"
                        >
                          🔄 Invertir colores (180°)
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={goNext}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  Siguiente: Aplicación
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Application */}
          {phase === 'application' && (
            <motion.div
              key="application"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-semibold text-white">👁️ Aplicación de tu paleta</h2>
                <div className="w-20" />
              </div>

              {/* Tip */}
              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-xl">💡</span>
                <p className="text-indigo-200 text-sm">
                  Explora cómo se ve tu paleta en diferentes contextos. Usa las pestañas para navegar entre categorías y variantes.
                </p>
              </div>

              {/* Application Showcase */}
              <ApplicationShowcase 
                colors={colors.map(c => c.hex)} 
                onUpdateColors={(newColors) => {
                  const updatedColors = newColors.map((hex, i) => ({
                    id: colors[i]?.id || `color-${i}`,
                    hex,
                    locked: colors[i]?.locked || false
                  }));
                  updateColorsWithHistory(updatedColors);
                }}
              />

              {/* Advanced design section */}
              <div className="bg-gray-800/30 rounded-2xl">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚙️</span>
                    <div className="text-left">
                      <h3 className="text-white font-medium">Diseño avanzado de jerarquía</h3>
                      <p className="text-gray-500 text-sm">Reglas de distribución y ejemplos compositivos</p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-center text-gray-500">
                        {/* Simplified advanced design placeholder */}
                        <p className="py-8">
                          Próximamente: Jerarquía de colores con reglas 60-30-10, proporción áurea, y más ejemplos interactivos.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={goNext}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  Siguiente: Análisis
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Analysis */}
          {phase === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-semibold text-white">🔍 Análisis de la paleta</h2>
                <div className="w-20" />
              </div>

              {/* Analysis Type Tabs */}
              <div className="flex gap-2 bg-gray-800/50 p-1.5 rounded-xl w-fit mx-auto">
                <button
                  onClick={() => setAnalysisType('basic')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    analysisType === 'basic'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>📋</span>
                  Análisis Básico
                </button>
                <button
                  onClick={() => setAnalysisType('scientific')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    analysisType === 'scientific'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>🔬</span>
                  Evidencia Científica
                </button>
              </div>

              {/* Note: Palette editing is now handled within each analysis component */}

              {/* Analysis Content */}
              <AnimatePresence mode="wait">
                {analysisType === 'basic' ? (
                  <motion.div
                    key="basic-analysis"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <PaletteAnalysis
                      colors={colors.map(c => c.hex)}
                      onApplyFix={(newColors) => {
                        const updated = colors.map((c, i) => ({
                          ...c,
                          hex: newColors[i] || c.hex
                        }));
                        updateColorsWithHistory(updated);
                        showNotification('✅ Corrección aplicada');
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="scientific-analysis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ScientificAnalysis
                      colors={colors.map(c => c.hex)}
                      onUpdateColors={(newColors: string[]) => {
                        setColors(prev => prev.map((c, i) => ({
                          ...c,
                          hex: newColors[i] || c.hex
                        })));
                        showNotification('✅ Cambios aplicados');
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  ← Volver a Aplicación
                </button>
                <button
                  onClick={goNext}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <span>💾</span>
                  Guardar paleta
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Save */}
          {phase === 'save' && (
            <motion.div
              key="save"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-semibold text-white">🎉 ¡Tu paleta está lista!</h2>
                <div className="w-20" />
              </div>

              {/* Two columns layout for Save and Export */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* SECTION 1: Save to My Palettes */}
                <div className="xl:col-span-1">
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-2xl p-6 border border-green-500/30 h-full">
                    {/* Section header with icon */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Guardar en Mis Paletas</h3>
                        <p className="text-green-300/70 text-sm">Accede más tarde desde tu colección</p>
                      </div>
                    </div>

                    {/* Palette preview */}
                    <div className="h-20 rounded-xl overflow-hidden flex mb-5 shadow-lg ring-1 ring-white/10">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex-1 flex items-end justify-center pb-2 relative group"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span
                            className="text-xs font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: getContrastColor(color.hex), backgroundColor: 'rgba(0,0,0,0.3)' }}
                          >
                            {color.hex.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Name input */}
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
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Guardar paleta
                      </button>
                    </div>

                    {/* My Palettes Section */}
                    <div className="mt-5 pt-5 border-t border-green-500/20">
                      <button
                        onClick={() => setShowMyPalettes(!showMyPalettes)}
                        className="w-full flex items-center justify-between text-left"
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
                                        <h4 className="text-white text-sm font-medium truncate">{palette.name}</h4>
                                        <p className="text-gray-500 text-xs">
                                          {new Date(palette.createdAt).toLocaleDateString('es-ES', { 
                                            day: 'numeric', 
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => {
                                            setColors(palette.colors.map(hex => ({
                                              id: generateId(),
                                              hex,
                                              locked: false
                                            })));
                                            setPaletteName(palette.name);
                                            setPhase('refinement');
                                            showNotification(`📂 Cargada: ${palette.name}`);
                                          }}
                                          className="p-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg text-xs transition-colors"
                                          title="Editar paleta"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => {
                                            setColors(palette.colors.map(hex => ({
                                              id: generateId(),
                                              hex,
                                              locked: false
                                            })));
                                            setPaletteName(palette.name);
                                            showNotification(`📂 Cargada para exportar: ${palette.name}`);
                                          }}
                                          className="p-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-xs transition-colors"
                                          title="Cargar para exportar"
                                        >
                                          📤
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm(`¿Eliminar "${palette.name}"?`)) {
                                              const updated = savedPalettes.filter(p => p.id !== palette.id);
                                              setSavedPalettes(updated);
                                              localStorage.setItem('colorPalettes', JSON.stringify(updated));
                                              showNotification(`🗑️ Eliminada: ${palette.name}`);
                                            }
                                          }}
                                          className="p-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-xs transition-colors"
                                          title="Eliminar paleta"
                                        >
                                          🗑️
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

                    {/* Quick tip */}
                    <div className="mt-4 p-3 bg-green-500/10 rounded-xl">
                      <p className="text-xs text-green-300/70">
                        💡 Desde "Mis Paletas" puedes editar o exportar cualquier paleta guardada.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Export */}
                <div className="xl:col-span-2">
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 rounded-2xl p-6 border border-purple-500/30">
                    {/* Section header with icon */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Exportar Paleta</h3>
                        <p className="text-purple-300/70 text-sm">Descarga en imagen o copia el código para tu proyecto</p>
                      </div>
                    </div>

                    {/* Export Panel Pro */}
                    <ExportPanelPro 
                      colors={colors.map(c => c.hex)} 
                      paletteName={paletteName || 'Mi Paleta'} 
                    />
                  </div>
                </div>
              </div>

              {/* Create another - Bottom CTA */}
              <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-700/50">
                <p className="text-gray-400 text-sm">¿Listo para crear más?</p>
                <button
                  onClick={() => {
                    setColors([]);
                    setPaletteName('');
                    setPhase('inspiration-menu');
                    setInspirationMode(null);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-white rounded-xl font-medium transition-all border border-indigo-500/30 flex items-center gap-2"
                >
                  <span>✨</span>
                  Crear nueva paleta
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
