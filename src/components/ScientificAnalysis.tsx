import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScientificAnalysisProps {
  colors: string[];
  paletteName?: string;
  onUpdateColors: (colors: string[]) => void;
  onApplyFix?: (colors: string[]) => void;
}

// Roles de los colores
const getColorRole = (index: number): string => {
  switch (index) {
    case 0: return 'Principal';
    case 1: return 'Secundario';
    case 2: return 'Acento';
    case 3: return 'Acento';
    default: return 'Detalle';
  }
};

// Sub-secciones de análisis con etiquetas amigables
const ANALYSIS_SECTIONS = [
  {
    id: 'readability',
    name: '¿Se lee bien?',
    icon: '👁️',
    description: 'Contraste y legibilidad',
    color: '#6366f1'
  },
  {
    id: 'emotions',
    name: '¿Qué transmite?',
    icon: '💭',
    description: 'Psicología del color',
    color: '#ec4899'
  },
  {
    id: 'accessibility',
    name: '¿Es para todos?',
    icon: '♿',
    description: 'Accesibilidad visual',
    color: '#14b8a6'
  },
  {
    id: 'harmony',
    name: '¿Funciona en conjunto?',
    icon: '🎨',
    description: 'Armonía y equilibrio',
    color: '#f59e0b'
  },
  {
    id: 'attention',
    name: '¿Guía la mirada?',
    icon: '🎯',
    description: 'Jerarquía visual',
    color: '#8b5cf6'
  },
  {
    id: 'cultural',
    name: '¿Comunica bien?',
    icon: '🌍',
    description: 'Significados culturales',
    color: '#10b981'
  },
  {
    id: 'memory',
    name: '¿Se recuerda?',
    icon: '🧠',
    description: 'Memorabilidad',
    color: '#f97316'
  },
  {
    id: 'trends',
    name: '¿Está actualizada?',
    icon: '✨',
    description: 'Tendencias actuales',
    color: '#06b6d4'
  }
];

interface CaseConfig {
  id: string;
  name: string;
  background: string;
  circleL: string;
  circleS: string;
  lineThick: string;
  lineThin: string;
  textMain: string;
  textSub: string;
  textBoubba: string;
  textKiki: string;
  btnBoubba: string;
  btnKiki: string;
}

interface AnalysisIssue {
  caseId: string;
  caseName: string;
  type: 'critical' | 'warning' | 'glare' | 'optimal' | 'info';
  element: string;
  ratio?: number;
  fg?: string;
  bg?: string;
  message: string;
  importance: string;
  technical: string;
  citation: string;
  solutions: { label: string; action: () => string[] }[];
}

const BLACK = '#0A0A0B';
const WHITE = '#FFFFFF';

export const ScientificAnalysis: React.FC<ScientificAnalysisProps> = ({
  colors,
  onUpdateColors,
}) => {
  const [activeSection, setActiveSection] = useState('readability');
  const [localColors, setLocalColors] = useState<string[]>(colors);
  const [history, setHistory] = useState<string[][]>([colors]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [tempColors, setTempColors] = useState<string[] | null>(null);
  const [tempHistory, setTempHistory] = useState<string[][]>([]);
  const [tempHistoryIndex, setTempHistoryIndex] = useState(-1);
  const [selectedIssue, setSelectedIssue] = useState<AnalysisIssue | null>(null);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  // Helper to get color safely
  const getColor = useCallback((index: number, fallback: string = BLACK): string => {
    const cols = tempColors || localColors;
    return cols[index] || cols[index - 1] || cols[0] || fallback;
  }, [localColors, tempColors]);

  // Generate case configurations based on current colors
  const caseConfigs = useMemo((): CaseConfig[] => {
    return [
      {
        id: 'case1',
        name: 'Fondo Oscuro',
        background: BLACK,
        circleL: getColor(0),
        circleS: getColor(1),
        lineThick: getColor(0),
        lineThin: getColor(1),
        textMain: getColor(0),
        textSub: getColor(3, getColor(2, getColor(1))),
        textBoubba: getColor(1),
        textKiki: BLACK,
        btnBoubba: WHITE,
        btnKiki: getColor(0),
      },
      {
        id: 'case2',
        name: 'Primario Base',
        background: getColor(0),
        circleL: getColor(1),
        circleS: BLACK,
        lineThick: getColor(3, getColor(2)),
        lineThin: BLACK,
        textMain: getColor(1),
        textSub: BLACK,
        textBoubba: WHITE,
        textKiki: getColor(2, getColor(1)),
        btnBoubba: getColor(1),
        btnKiki: BLACK,
      },
      {
        id: 'case3',
        name: 'Contraste Alto',
        background: getColor(0),
        circleL: BLACK,
        circleS: getColor(3, getColor(2)),
        lineThick: WHITE,
        lineThin: getColor(2, getColor(1)),
        textMain: BLACK,
        textSub: BLACK,
        textBoubba: getColor(0),
        textKiki: WHITE,
        btnBoubba: BLACK,
        btnKiki: getColor(1),
      },
      {
        id: 'case4',
        name: 'Secundario Base',
        background: getColor(1),
        circleL: BLACK,
        circleS: getColor(0),
        lineThick: getColor(0),
        lineThin: getColor(3, getColor(2)),
        textMain: WHITE,
        textSub: getColor(0),
        textBoubba: getColor(2, getColor(0)),
        textKiki: BLACK,
        btnBoubba: WHITE,
        btnKiki: getColor(0),
      }
    ];
  }, [getColor]);

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
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
  };

  // Calculate relative luminance (sRGB with gamma correction)
  const getLuminance = (hex: string): number => {
    const { r, g, b } = hexToRgb(hex);
    const toLinear = (c: number) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  // Calculate contrast ratio
  const getContrastRatio = (fg: string, bg: string): number => {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Simulate color blindness
  const simulateColorBlindness = (hex: string, type: 'deuteranopia' | 'protanopia' | 'tritanopia'): string => {
    const { r, g, b } = hexToRgb(hex);
    let newR = r, newG = g, newB = b;
    
    switch (type) {
      case 'deuteranopia': // Green-blind
        newR = Math.round(0.625 * r + 0.375 * g);
        newG = Math.round(0.7 * g + 0.3 * r);
        newB = b;
        break;
      case 'protanopia': // Red-blind
        newR = Math.round(0.567 * r + 0.433 * g);
        newG = Math.round(0.558 * g + 0.442 * r);
        newB = b;
        break;
      case 'tritanopia': // Blue-blind
        newR = r;
        newG = Math.round(0.95 * g + 0.05 * b);
        newB = Math.round(0.433 * b + 0.567 * g);
        break;
    }
    
    return `#${Math.min(255, Math.max(0, newR)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, newG)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, newB)).toString(16).padStart(2, '0')}`;
  };

  // Adjust color to meet target contrast
  const adjustColorForContrast = (fg: string, bg: string, targetRatio: number, lighten: boolean): string => {
    const { r, g, b } = hexToRgb(fg);
    const bgLum = getLuminance(bg);
    const step = lighten ? 5 : -5;
    let newR = r, newG = g, newB = b;
    
    for (let i = 0; i < 50; i++) {
      newR = Math.max(0, Math.min(255, newR + step));
      newG = Math.max(0, Math.min(255, newG + step));
      newB = Math.max(0, Math.min(255, newB + step));
      
      const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
      const newLum = getLuminance(newHex);
      const lighter = Math.max(newLum, bgLum);
      const darker = Math.min(newLum, bgLum);
      const ratio = (lighter + 0.05) / (darker + 0.05);
      
      if (ratio >= targetRatio) return newHex;
    }
    
    return lighten ? WHITE : BLACK;
  };

  // Helper: HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // ============= ANALYSIS FUNCTIONS BY SECTION =============

  // 1. READABILITY ANALYSIS (Contrast)
  const readabilityIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    
    caseConfigs.forEach(cfg => {
      const contrasts = [
        { element: 'Texto principal', fg: cfg.textMain, bg: cfg.background },
        { element: 'Texto secundario', fg: cfg.textSub, bg: cfg.background },
        { element: 'Botón Boubba', fg: cfg.textBoubba, bg: cfg.btnBoubba },
        { element: 'Botón Kiki', fg: cfg.textKiki, bg: cfg.btnKiki },
      ];
      
      contrasts.forEach(({ element, fg, bg }) => {
        const ratio = getContrastRatio(fg, bg);
        const bgIsLight = getLuminance(bg) > 0.5;
        
        let type: AnalysisIssue['type'] = 'optimal';
        let message = '';
        
        if (ratio < 4.5) {
          type = 'critical';
          message = `Contraste insuficiente (${ratio.toFixed(1)}:1). El texto será difícil de leer.`;
        } else if (ratio < 7) {
          type = 'warning';
          message = `Contraste mínimo (${ratio.toFixed(1)}:1). Funcional pero mejorable.`;
        } else if (ratio > 18 && bgIsLight) {
          type = 'glare';
          message = `Alto contraste (${ratio.toFixed(1)}:1). Puede causar fatiga visual.`;
        } else {
          message = `Contraste óptimo (${ratio.toFixed(1)}:1). Lectura fluida y cómoda.`;
        }
        
        const solutions: AnalysisIssue['solutions'] = [];
        if (type === 'critical' || type === 'warning') {
          if (fg !== BLACK && fg !== WHITE) {
            solutions.push({
              label: bgIsLight ? 'Oscurecer texto' : 'Aclarar texto',
              action: () => {
                const newColor = adjustColorForContrast(fg, bg, 7, !bgIsLight);
                const cols = tempColors || localColors;
                const idx = cols.findIndex(c => c.toLowerCase() === fg.toLowerCase());
                if (idx >= 0) {
                  const newColors = [...cols];
                  newColors[idx] = newColor;
                  return newColors;
                }
                return cols;
              }
            });
          }
        }
        
        if (type === 'glare') {
          solutions.push({
            label: 'Suavizar contraste',
            action: () => {
              const cols = tempColors || localColors;
              const idx = cols.findIndex(c => c.toLowerCase() === (bgIsLight ? fg : bg).toLowerCase());
              if (idx >= 0) {
                const newColors = [...cols];
                const { r, g, b } = hexToRgb(cols[idx]);
                const adjust = bgIsLight ? 30 : -30;
                newColors[idx] = `#${Math.max(0, Math.min(255, r + adjust)).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, g + adjust)).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, b + adjust)).toString(16).padStart(2, '0')}`;
                return newColors;
              }
              return cols;
            }
          });
        }
        
        issues.push({
          caseId: cfg.id,
          caseName: cfg.name,
          type,
          element,
          ratio,
          fg,
          bg,
          message,
          importance: type === 'critical' 
            ? 'El cerebro procesa la luminancia (forma y posición) antes que el color. Sin contraste suficiente, aumenta la carga cognitiva y el usuario se cansará rápidamente.'
            : type === 'warning'
            ? 'Un contraste mejorado facilita la lectura prolongada y reduce la fatiga visual, especialmente en dispositivos móviles.'
            : type === 'glare'
            ? 'Un contraste excesivo sobre fondos muy claros puede sobreestimular los fotorreceptores, causando fatiga.'
            : 'Este nivel de contraste permite una lectura fluida sin esfuerzo visual.',
          technical: type === 'critical'
            ? 'La diferencia de luminancia relativa es insuficiente para activar eficientemente las células ganglionares en el canal magnocelular de la retina.'
            : type === 'warning'
            ? 'El ratio cumple el mínimo WCAG AA pero está por debajo del nivel AAA.'
            : type === 'glare'
            ? 'El alto contraste de luminancia puede saturar temporalmente los fotorreceptores.'
            : 'El ratio de 7:1 a 12:1 optimiza la activación del sistema visual sin sobreestimulación.',
          citation: 'Peli, E. (1990). Contrast in complex images. Journal of the Optical Society of America A, 7(10), 2032-2040.',
          solutions
        });
      });
    });
    
    return issues;
  }, [caseConfigs, localColors, tempColors]);

  // 2. EMOTIONS ANALYSIS (Color Psychology)
  const emotionIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    // Analyze color temperature
    const temperatures = cols.map(c => {
      const { r, g, b } = hexToRgb(c);
      return (r - b) / 255;
    });
    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const tempVariance = temperatures.reduce((acc, t) => acc + Math.pow(t - avgTemp, 2), 0) / temperatures.length;
    
    if (tempVariance > 0.3) {
      issues.push({
        caseId: 'global',
        caseName: 'Paleta completa',
        type: 'warning',
        element: 'Temperatura de color',
        message: 'Mezcla de tonos muy cálidos y muy fríos. Puede crear tensión visual.',
        importance: 'Los colores cálidos y fríos activan respuestas emocionales diferentes. Una mezcla sin armonía puede confundir el mensaje.',
        technical: 'La temperatura de color afecta la activación del sistema nervioso autónomo: tonos cálidos incrementan el arousal, tonos fríos lo reducen.',
        citation: 'Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. Journal of Experimental Psychology: General, 123(4), 394-409.',
        solutions: [{
          label: 'Armonizar temperaturas',
          action: () => cols
        }]
      });
    } else {
      issues.push({
        caseId: 'global',
        caseName: 'Paleta completa',
        type: 'optimal',
        element: 'Temperatura de color',
        message: avgTemp > 0.1 ? 'Paleta cálida: transmite energía, cercanía y optimismo.' : avgTemp < -0.1 ? 'Paleta fría: transmite calma, profesionalismo y confianza.' : 'Paleta neutra: equilibrada y versátil.',
        importance: 'Una temperatura de color coherente ayuda a transmitir un mensaje emocional claro.',
        technical: 'La coherencia térmica facilita el procesamiento visual y reduce la disonancia perceptual.',
        citation: 'Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. Journal of Experimental Psychology: General, 123(4), 394-409.',
        solutions: []
      });
    }

    // Analyze saturation levels
    const saturations = cols.map(c => {
      const rgb = hexToRgb(c);
      const { s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return s;
    });
    const avgSat = saturations.reduce((a, b) => a + b, 0) / saturations.length;
    
    if (avgSat > 80) {
      issues.push({
        caseId: 'global',
        caseName: 'Paleta completa',
        type: 'warning',
        element: 'Saturación alta',
        message: 'Colores muy saturados. Pueden resultar agresivos o fatigantes.',
        importance: 'Los colores muy saturados captan atención pero en exceso pueden causar fatiga visual y estrés.',
        technical: 'La alta saturación estimula intensamente los conos de la retina, aumentando la carga cognitiva del procesamiento visual.',
        citation: 'Elliot, A. J., & Maier, M. A. (2014). Color psychology: Effects of perceiving color on psychological functioning. Annual Review of Psychology, 65, 95-120.',
        solutions: [{
          label: 'Reducir saturación',
          action: () => {
            return cols.map(clr => {
              const rgbVal = hexToRgb(clr);
              const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
              const newS = Math.max(0, hslVal.s - 20);
              return hslToHex(hslVal.h, newS, hslVal.l);
            });
          }
        }]
      });
    } else if (avgSat < 20) {
      issues.push({
        caseId: 'global',
        caseName: 'Paleta completa',
        type: 'info',
        element: 'Saturación baja',
        message: 'Paleta muy desaturada. Transmite calma pero puede parecer apagada.',
        importance: 'Los colores desaturados transmiten sofisticación y calma, pero pueden carecer de energía.',
        technical: 'La baja saturación reduce la activación emocional, apropiado para contextos que requieren concentración.',
        citation: 'Elliot, A. J., & Maier, M. A. (2014). Color psychology: Effects of perceiving color on psychological functioning. Annual Review of Psychology, 65, 95-120.',
        solutions: []
      });
    } else {
      issues.push({
        caseId: 'global',
        caseName: 'Paleta completa',
        type: 'optimal',
        element: 'Equilibrio de saturación',
        message: 'La saturación está equilibrada. Transmite energía sin fatiga.',
        importance: 'Una saturación equilibrada permite transmitir energía sin fatiga visual.',
        technical: 'La saturación moderada optimiza la respuesta emocional sin sobreestimular el sistema visual.',
        citation: 'Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. Journal of Experimental Psychology: General, 123(4), 394-409.',
        solutions: []
      });
    }
    
    return issues;
  }, [localColors, tempColors]);

  // 3. ACCESSIBILITY ANALYSIS
  const accessibilityIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    // Check for color blindness issues
    const colorBlindTypes: Array<{ type: 'deuteranopia' | 'protanopia' | 'tritanopia'; name: string; prevalence: string }> = [
      { type: 'deuteranopia', name: 'Deuteranopía (verde)', prevalence: '6% hombres' },
      { type: 'protanopia', name: 'Protanopía (rojo)', prevalence: '2% hombres' },
      { type: 'tritanopia', name: 'Tritanopía (azul)', prevalence: '0.01% población' }
    ];
    
    colorBlindTypes.forEach(({ type, name, prevalence }) => {
      const simulatedColors = cols.map(clr => simulateColorBlindness(clr, type));
      
      // Check if any colors become too similar
      let hasConfusion = false;
      for (let i = 0; i < simulatedColors.length; i++) {
        for (let j = i + 1; j < simulatedColors.length; j++) {
          const rgb1 = hexToRgb(simulatedColors[i]);
          const rgb2 = hexToRgb(simulatedColors[j]);
          const diff = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
          if (diff < 60) hasConfusion = true;
        }
      }
      
      if (hasConfusion) {
        issues.push({
          caseId: 'global',
          caseName: 'Accesibilidad',
          type: 'warning',
          element: name,
          message: `Algunos colores pueden confundirse (${prevalence}).`,
          importance: `Las personas con ${name.toLowerCase()} pueden tener dificultad para distinguir ciertos colores de tu paleta.`,
          technical: 'La diferencia cromática percibida es insuficiente cuando se simula esta forma de daltonismo.',
          citation: 'Birch, J. (2012). Worldwide prevalence of red-green color deficiency. Journal of the Optical Society of America A, 29(3), 313-320.',
          solutions: [{
            label: 'Aumentar diferencia de luminosidad',
            action: () => {
              return cols.map((clr, i) => {
                if (i % 2 === 0) {
                  const rgbVal = hexToRgb(clr);
                  return `#${Math.min(255, rgbVal.r + 40).toString(16).padStart(2, '0')}${Math.min(255, rgbVal.g + 40).toString(16).padStart(2, '0')}${Math.min(255, rgbVal.b + 40).toString(16).padStart(2, '0')}`;
                }
                return clr;
              });
            }
          }]
        });
      } else {
        issues.push({
          caseId: 'global',
          caseName: 'Accesibilidad',
          type: 'optimal',
          element: name,
          message: `Paleta distinguible para personas con ${name.toLowerCase()}.`,
          importance: 'Una buena distinción de colores beneficia a todos los usuarios.',
          technical: 'Los colores mantienen suficiente diferencia perceptual bajo esta simulación.',
          citation: 'Birch, J. (2012). Worldwide prevalence of red-green color deficiency. Journal of the Optical Society of America A, 29(3), 313-320.',
          solutions: []
        });
      }
    });
    
    return issues;
  }, [localColors, tempColors]);

  // 4. HARMONY ANALYSIS
  const harmonyIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    const hues = cols.map(c => {
      const { r, g, b } = hexToRgb(c);
      return rgbToHsl(r, g, b).h;
    });
    
    const hueDistances = hues.map((h, i) => {
      return hues.filter((_, j) => j !== i).map(h2 => {
        let diff = Math.abs(h - h2);
        if (diff > 180) diff = 360 - diff;
        return diff;
      });
    }).flat();
    
    const avgHueDistance = hueDistances.length > 0 ? hueDistances.reduce((a, b) => a + b, 0) / hueDistances.length : 0;
    
    const hasComplementary = hueDistances.some(d => d > 150 && d < 180);
    const hasAnalogous = hueDistances.some(d => d < 40);
    const hasTriadic = hueDistances.some(d => d > 110 && d < 130);
    
    if (hasComplementary) {
      issues.push({
        caseId: 'global',
        caseName: 'Armonía',
        type: 'optimal',
        element: 'Armonía complementaria',
        message: 'Colores complementarios detectados. Alto contraste y dinamismo.',
        importance: 'Los colores complementarios crean máximo contraste cromático, ideal para destacar elementos.',
        technical: 'Los colores opuestos en el círculo cromático activan diferentes tipos de conos, maximizando la distinción perceptual.',
        citation: 'Itten, J. (1961). The Art of Color: The subjective experience and objective rationale of color. Wiley.',
        solutions: []
      });
    }
    
    if (hasAnalogous) {
      issues.push({
        caseId: 'global',
        caseName: 'Armonía',
        type: 'optimal',
        element: 'Armonía análoga',
        message: 'Colores análogos detectados. Cohesión y suavidad.',
        importance: 'Los colores análogos generan sensación de continuidad y son naturalmente armónicos.',
        technical: 'Los tonos cercanos en el espectro estimulan conos similares, reduciendo el esfuerzo de procesamiento visual.',
        citation: 'Itten, J. (1961). The Art of Color: The subjective experience and objective rationale of color. Wiley.',
        solutions: []
      });
    }
    
    if (hasTriadic) {
      issues.push({
        caseId: 'global',
        caseName: 'Armonía',
        type: 'optimal',
        element: 'Armonía triádica',
        message: 'Relación triádica detectada. Equilibrio con variedad.',
        importance: 'Las tríadas ofrecen variedad manteniendo el equilibrio, ideal para interfaces ricas.',
        technical: 'La distribución equidistante en el círculo cromático proporciona balance perceptual.',
        citation: 'Itten, J. (1961). The Art of Color: The subjective experience and objective rationale of color. Wiley.',
        solutions: []
      });
    }
    
    if (!hasComplementary && !hasAnalogous && !hasTriadic && avgHueDistance > 60) {
      issues.push({
        caseId: 'global',
        caseName: 'Armonía',
        type: 'warning',
        element: 'Sin armonía clara',
        message: 'Los colores no siguen una relación armónica reconocible.',
        importance: 'Las paletas con relaciones armónicas claras son percibidas como más profesionales.',
        technical: 'La falta de relación cromática estructurada puede aumentar la disonancia visual.',
        citation: 'Ou, L. C., & Luo, M. R. (2006). A colour harmony model for two-colour combinations. Color Research & Application, 31(3), 191-204.',
        solutions: []
      });
    }
    
    return issues;
  }, [localColors, tempColors]);

  // 5. ATTENTION/HIERARCHY ANALYSIS
  const attentionIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    const weights = cols.map(c => {
      const { r, g, b } = hexToRgb(c);
      const { s, l } = rgbToHsl(r, g, b);
      const lumWeight = 1 - Math.abs(l - 50) / 50;
      return (s / 100) * 0.6 + lumWeight * 0.4;
    });
    
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);
    const weightRange = maxWeight - minWeight;
    const focalIndex = weights.indexOf(maxWeight);
    
    if (weightRange < 0.2) {
      issues.push({
        caseId: 'global',
        caseName: 'Jerarquía',
        type: 'warning',
        element: 'Peso visual uniforme',
        message: 'Todos los colores tienen peso visual similar. Falta un punto focal claro.',
        importance: 'Sin jerarquía visual clara, el usuario no sabe dónde mirar primero.',
        technical: 'La atención visual se guía por diferencias de saturación y contraste de luminosidad.',
        citation: 'Ware, C. (2012). Information Visualization: Perception for Design. Morgan Kaufmann.',
        solutions: [{
          label: 'Crear punto focal',
          action: () => {
            const newColors = [...cols];
            const rgb = hexToRgb(newColors[2] || newColors[0]);
            const { h } = rgbToHsl(rgb.r, rgb.g, rgb.b);
            newColors[2] = hslToHex(h, 85, 50);
            return newColors;
          }
        }]
      });
    } else {
      // Verificar que el color focal esté en posición 3 o 4 (índice 2 o 3)
      const isAccentFocal = focalIndex === 2 || focalIndex === 3;
      
      if (isAccentFocal) {
        issues.push({
          caseId: 'global',
          caseName: 'Jerarquía',
          type: 'optimal',
          element: 'Jerarquía visual correcta',
          message: `El color de Acento (posición ${focalIndex + 1}) guía la mirada. Jerarquía óptima.`,
          importance: 'El color de acento debe ser el punto focal para guiar la atención hacia acciones importantes.',
          technical: 'La diferencia de peso visual permite un escaneo eficiente de la información.',
          citation: 'Ware, C. (2012). Information Visualization: Perception for Design. Morgan Kaufmann.',
          solutions: []
        });
      } else {
        issues.push({
          caseId: 'global',
          caseName: 'Jerarquía',
          type: 'warning',
          element: 'Punto focal en posición incorrecta',
          message: `El color ${getColorRole(focalIndex)} (posición ${focalIndex + 1}) es el más llamativo, pero debería serlo el Acento.`,
          importance: 'El color de acento (posición 3 o 4) debería ser el punto focal para guiar acciones.',
          technical: 'Reubicar el peso visual hacia el acento mejora la jerarquía de la interfaz.',
          citation: 'Ware, C. (2012). Information Visualization: Perception for Design. Morgan Kaufmann.',
          solutions: [{
            label: 'Hacer el Acento más llamativo',
            action: () => {
              const newColors = [...cols];
              const accentIdx = cols.length >= 3 ? 2 : 0;
              const rgb = hexToRgb(newColors[accentIdx]);
              const { h } = rgbToHsl(rgb.r, rgb.g, rgb.b);
              newColors[accentIdx] = hslToHex(h, 90, 55);
              return newColors;
            }
          }]
        });
      }
    }
    
    return issues;
  }, [localColors, tempColors]);

  // 6. CULTURAL ANALYSIS
  const culturalIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    // Analyze dominant hue for cultural associations
    const hues = cols.map(c => {
      const rgb = hexToRgb(c);
      return rgbToHsl(rgb.r, rgb.g, rgb.b).h;
    });
    
    const dominantHue = hues[0];
    
    let culturalMessage = '';
    let culturalImportance = '';
    
    if (dominantHue >= 0 && dominantHue < 30) {
      culturalMessage = 'Dominante rojo: energía, pasión, urgencia. En China simboliza suerte.';
      culturalImportance = 'El rojo acelera el ritmo cardíaco y crea sensación de urgencia.';
    } else if (dominantHue >= 30 && dominantHue < 60) {
      culturalMessage = 'Dominante naranja: creatividad, entusiasmo, juventud.';
      culturalImportance = 'El naranja combina la energía del rojo con la alegría del amarillo.';
    } else if (dominantHue >= 60 && dominantHue < 90) {
      culturalMessage = 'Dominante amarillo: optimismo, claridad, advertencia.';
      culturalImportance = 'El amarillo es el color más visible y capta rápidamente la atención.';
    } else if (dominantHue >= 90 && dominantHue < 150) {
      culturalMessage = 'Dominante verde: naturaleza, crecimiento, salud.';
      culturalImportance = 'El verde se asocia universalmente con la naturaleza y lo ecológico.';
    } else if (dominantHue >= 150 && dominantHue < 210) {
      culturalMessage = 'Dominante cian: frescura, tecnología, innovación.';
      culturalImportance = 'Los tonos cian transmiten modernidad y profesionalismo.';
    } else if (dominantHue >= 210 && dominantHue < 270) {
      culturalMessage = 'Dominante azul: confianza, calma, profesionalismo.';
      culturalImportance = 'El azul es el color más utilizado en branding corporativo.';
    } else if (dominantHue >= 270 && dominantHue < 330) {
      culturalMessage = 'Dominante púrpura: lujo, creatividad, espiritualidad.';
      culturalImportance = 'El púrpura se asocia históricamente con la realeza y el lujo.';
    } else {
      culturalMessage = 'Dominante magenta: innovación, originalidad, feminidad.';
      culturalImportance = 'El magenta transmite modernidad y ruptura con lo convencional.';
    }
    
    issues.push({
      caseId: 'global',
      caseName: 'Cultural',
      type: 'info',
      element: 'Significado cultural',
      message: culturalMessage,
      importance: culturalImportance,
      technical: 'Las asociaciones culturales del color varían según la región geográfica y el contexto.',
      citation: 'Adams, F. M., & Osgood, C. E. (1973). A cross-cultural study of the affective meanings of color. Journal of Cross-Cultural Psychology, 4(2), 135-156.',
      solutions: []
    });
    
    return issues;
  }, [localColors, tempColors]);

  // 7. MEMORY ANALYSIS
  const memoryIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    // Check uniqueness and distinctiveness
    const saturations = cols.map(c => {
      const rgb = hexToRgb(c);
      return rgbToHsl(rgb.r, rgb.g, rgb.b).s;
    });
    const avgSat = saturations.reduce((a, b) => a + b, 0) / saturations.length;
    
    const hues = cols.map(c => {
      const rgb = hexToRgb(c);
      return rgbToHsl(rgb.r, rgb.g, rgb.b).h;
    });
    const hueRange = Math.max(...hues) - Math.min(...hues);
    
    if (avgSat > 50 && hueRange > 60) {
      issues.push({
        caseId: 'global',
        caseName: 'Memoria',
        type: 'optimal',
        element: 'Distintividad',
        message: 'Paleta distintiva y memorable. Los colores son únicos y diferenciados.',
        importance: 'Las paletas distintivas se recuerdan mejor y ayudan al reconocimiento de marca.',
        technical: 'La combinación de alta saturación y variedad de tono aumenta la codificación en memoria.',
        citation: 'Spence, I., & Wong, P. (1997). The effect of color on apparent size. Memory & Cognition, 25(3), 292-301.',
        solutions: []
      });
    } else if (avgSat < 30) {
      issues.push({
        caseId: 'global',
        caseName: 'Memoria',
        type: 'warning',
        element: 'Baja distintividad',
        message: 'Paleta poco distintiva. Los colores desaturados son menos memorables.',
        importance: 'Los colores poco saturados pueden pasar desapercibidos y ser olvidados.',
        technical: 'La baja saturación reduce la activación de la memoria visual a largo plazo.',
        citation: 'Spence, I., & Wong, P. (1997). The effect of color on apparent size. Memory & Cognition, 25(3), 292-301.',
        solutions: [{
          label: 'Aumentar distintividad',
          action: () => cols.map(clr => {
            const rgbVal = hexToRgb(clr);
            const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
            return hslToHex(hslVal.h, Math.min(100, hslVal.s + 25), hslVal.l);
          })
        }]
      });
    } else {
      issues.push({
        caseId: 'global',
        caseName: 'Memoria',
        type: 'optimal',
        element: 'Memorabilidad',
        message: 'Paleta con buena memorabilidad. Balance entre distinción y cohesión.',
        importance: 'Una paleta equilibrada facilita el reconocimiento sin resultar agresiva.',
        technical: 'El equilibrio entre variedad y coherencia optimiza la codificación en memoria.',
        citation: 'Spence, I., & Wong, P. (1997). The effect of color on apparent size. Memory & Cognition, 25(3), 292-301.',
        solutions: []
      });
    }
    
    return issues;
  }, [localColors, tempColors]);

  // 8. TRENDS ANALYSIS
  const trendsIssues = useMemo((): AnalysisIssue[] => {
    const issues: AnalysisIssue[] = [];
    const cols = tempColors || localColors;
    
    // Check alignment with current trends
    const trendColors2024 = ['#FFBE98', '#E0B589', '#6F7E6C', '#D6C5C9', '#2E4A67'];
    
    const hasTrendAlignment = cols.some(c => {
      return trendColors2024.some(t => {
        const rgb1 = hexToRgb(c);
        const rgb2 = hexToRgb(t);
        const diff = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
        return diff < 100;
      });
    });
    
    // Check for pastels (trending)
    const saturations = cols.map(c => {
      const rgb = hexToRgb(c);
      return rgbToHsl(rgb.r, rgb.g, rgb.b).s;
    });
    const lightnesses = cols.map(c => {
      const rgb = hexToRgb(c);
      return rgbToHsl(rgb.r, rgb.g, rgb.b).l;
    });
    const isPastel = saturations.every(s => s < 60) && lightnesses.every(l => l > 60);
    
    if (hasTrendAlignment) {
      issues.push({
        caseId: 'global',
        caseName: 'Tendencias',
        type: 'optimal',
        element: 'Alineación 2024-2025',
        message: 'La paleta incluye tonos en tendencia actual (earth tones, soft pastels).',
        importance: 'Estar alineado con tendencias mejora la percepción de modernidad.',
        technical: 'Los tonos terrosos y pasteles suaves dominan las tendencias actuales.',
        citation: 'Pantone Color Institute (2024). Color Trend Forecast.',
        solutions: []
      });
    }
    
    if (isPastel) {
      issues.push({
        caseId: 'global',
        caseName: 'Tendencias',
        type: 'optimal',
        element: 'Estética pastel',
        message: 'Paleta pastel: muy actual y versátil para marcas contemporáneas.',
        importance: 'Los pasteles transmiten suavidad y modernidad, muy populares en 2024.',
        technical: 'La combinación de baja saturación y alta luminosidad crea la estética pastel.',
        citation: 'WGSN Color Forecast (2024). Future Consumer.',
        solutions: []
      });
    }
    
    if (!hasTrendAlignment && !isPastel) {
      issues.push({
        caseId: 'global',
        caseName: 'Tendencias',
        type: 'info',
        element: 'Estilo atemporal',
        message: 'Paleta con estilo propio, independiente de tendencias actuales.',
        importance: 'No seguir tendencias puede ser una fortaleza si buscas atemporalidad.',
        technical: 'Los estilos atemporales priorizan principios clásicos sobre modas pasajeras.',
        citation: 'Heller, E. (2004). Psicología del color. Gustavo Gili.',
        solutions: []
      });
    }
    
    return issues;
  }, [localColors, tempColors]);

  // Get issues for current section
  const currentIssues = useMemo(() => {
    switch (activeSection) {
      case 'readability': return readabilityIssues;
      case 'emotions': return emotionIssues;
      case 'accessibility': return accessibilityIssues;
      case 'harmony': return harmonyIssues;
      case 'attention': return attentionIssues;
      case 'cultural': return culturalIssues;
      case 'memory': return memoryIssues;
      case 'trends': return trendsIssues;
      default: return readabilityIssues;
    }
  }, [activeSection, readabilityIssues, emotionIssues, accessibilityIssues, harmonyIssues, attentionIssues, culturalIssues, memoryIssues, trendsIssues]);

  // Group readability issues by case
  const issuesByCase = useMemo(() => {
    const grouped: Record<string, AnalysisIssue[]> = {};
    readabilityIssues.forEach(issue => {
      if (!grouped[issue.caseId]) grouped[issue.caseId] = [];
      grouped[issue.caseId].push(issue);
    });
    return grouped;
  }, [readabilityIssues]);

  // History management
  const pushHistory = (newColors: string[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setLocalColors(newColors);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLocalColors(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLocalColors(history[historyIndex + 1]);
    }
  };

  // Temp history management
  const pushTempHistory = (newColors: string[]) => {
    const newHistory = tempHistory.slice(0, tempHistoryIndex + 1);
    newHistory.push(newColors);
    setTempHistory(newHistory);
    setTempHistoryIndex(newHistory.length - 1);
    setTempColors(newColors);
  };

  const undoTemp = () => {
    if (tempHistoryIndex > 0) {
      setTempHistoryIndex(tempHistoryIndex - 1);
      setTempColors(tempHistory[tempHistoryIndex - 1]);
    } else {
      setTempColors(null);
      setTempHistory([]);
      setTempHistoryIndex(-1);
    }
  };

  const redoTemp = () => {
    if (tempHistoryIndex < tempHistory.length - 1) {
      setTempHistoryIndex(tempHistoryIndex + 1);
      setTempColors(tempHistory[tempHistoryIndex + 1]);
    }
  };

  const applySolution = (solution: AnalysisIssue['solutions'][0]) => {
    const newColors = solution.action();
    pushTempHistory(newColors);
  };

  const applyTempColors = () => {
    if (tempColors) {
      pushHistory(tempColors);
      setTempColors(null);
      setTempHistory([]);
      setTempHistoryIndex(-1);
    }
  };

  const discardTempColors = () => {
    setTempColors(null);
    setTempHistory([]);
    setTempHistoryIndex(-1);
  };

  const saveAllChanges = () => {
    onUpdateColors(localColors);
  };

  // Color editing
  const updateColor = (index: number, newColor: string) => {
    const newColors = [...localColors];
    newColors[index] = newColor;
    pushHistory(newColors);
    setEditingColorIndex(null);
  };

  // Drag and drop
  const handleDragStart = (index: number) => setDraggedIndex(index);
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newColors = [...localColors];
      const [dragged] = newColors.splice(draggedIndex, 1);
      newColors.splice(index, 0, dragged);
      setLocalColors(newColors);
      setDraggedIndex(index);
    }
  };
  
  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      pushHistory(localColors);
      setDraggedIndex(null);
    }
  };

  // Render case preview
  const renderCasePreview = (cfg: CaseConfig, size: 'small' | 'medium' | 'large' = 'small') => {
    const scale = size === 'large' ? 1.8 : size === 'medium' ? 1.3 : 1;
    
    return (
      <div
        className="relative overflow-hidden rounded-lg shadow-inner"
        style={{
          backgroundColor: cfg.background,
          aspectRatio: '4/3',
          width: '100%'
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 28 * scale,
            height: 28 * scale,
            backgroundColor: cfg.circleL,
            top: 6 * scale,
            right: 6 * scale
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 14 * scale,
            height: 14 * scale,
            backgroundColor: cfg.circleS,
            top: 3 * scale,
            right: 3 * scale
          }}
        />
        
        <div
          className="absolute origin-bottom-right"
          style={{
            width: 40 * scale,
            height: 3 * scale,
            backgroundColor: cfg.lineThick,
            bottom: 14 * scale,
            right: -8 * scale,
            transform: 'rotate(-45deg)'
          }}
        />
        <div
          className="absolute origin-bottom-right"
          style={{
            width: 32 * scale,
            height: 1.5 * scale,
            backgroundColor: cfg.lineThin,
            bottom: 10 * scale,
            right: -4 * scale,
            transform: 'rotate(-45deg)'
          }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black tracking-tight"
            style={{ color: cfg.textMain, fontSize: 12 * scale }}
          >
            Chromatica
          </span>
          <span
            className="font-light tracking-widest uppercase"
            style={{ color: cfg.textSub, fontSize: 5 * scale }}
          >
            Palette Studio
          </span>
          
          <div className="flex gap-1.5 mt-2" style={{ transform: `scale(${scale * 0.75})` }}>
            <div
              className="px-2.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: cfg.btnBoubba, color: cfg.textBoubba }}
            >
              BOUBBA
            </div>
            <div
              className="px-2.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: cfg.btnKiki, color: cfg.textKiki }}
            >
              KIKI
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get section summary
  const getSectionSummary = () => {
    const critical = currentIssues.filter(i => i.type === 'critical').length;
    const warning = currentIssues.filter(i => i.type === 'warning').length;
    const optimal = currentIssues.filter(i => i.type === 'optimal').length;
    return { critical, warning, optimal };
  };

  const currentSection = ANALYSIS_SECTIONS.find(s => s.id === activeSection)!;
  const summary = getSectionSummary();
  const cols = tempColors || localColors;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Section Tabs - Multiple rows with wrap */}
      <div className="flex flex-wrap gap-2">
        {ANALYSIS_SECTIONS.map(section => {
          const sectionIssues = section.id === 'readability' ? readabilityIssues :
                               section.id === 'emotions' ? emotionIssues :
                               section.id === 'accessibility' ? accessibilityIssues :
                               section.id === 'harmony' ? harmonyIssues :
                               section.id === 'attention' ? attentionIssues :
                               section.id === 'cultural' ? culturalIssues :
                               section.id === 'memory' ? memoryIssues :
                               trendsIssues;
          const hasCritical = sectionIssues.some(i => i.type === 'critical');
          const hasWarning = sectionIssues.some(i => i.type === 'warning');
          const allOptimal = sectionIssues.every(i => i.type === 'optimal' || i.type === 'info');
          
          return (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveSection(section.id);
                setSelectedIssue(null);
                setExpandedCase(null);
              }}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                activeSection === section.id
                  ? 'border-white/30 bg-white/10'
                  : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50'
              }`}
              style={{
                borderColor: activeSection === section.id ? section.color : undefined
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{section.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{section.name}</div>
                  <div className="text-[10px] text-gray-400">{section.description}</div>
                </div>
                <div className="ml-1">
                  {hasCritical && <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />}
                  {!hasCritical && hasWarning && <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" />}
                  {allOptimal && <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Column - Fixed */}
        <div className="w-96 flex-shrink-0 space-y-4 overflow-y-auto sticky top-0">
          {/* Case Previews - Only for readability section */}
          {activeSection === 'readability' && (
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 rounded-xl p-4 border border-gray-600/50">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-lg">👁️</span> Casos de Aplicación
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {caseConfigs.map((cfg, idx) => {
                  const caseIssues = issuesByCase[cfg.id] || [];
                  const hasCritical = caseIssues.some(i => i.type === 'critical');
                  const hasWarning = caseIssues.some(i => i.type === 'warning');
                  
                  return (
                    <motion.div
                      key={cfg.id}
                      whileHover={{ scale: 1.03 }}
                      className={`rounded-xl border-2 cursor-pointer transition-all bg-gray-900/50 overflow-hidden ${
                        hasCritical ? 'border-red-500' :
                        hasWarning ? 'border-yellow-500' :
                        'border-green-500'
                      }`}
                      onClick={() => setExpandedCase(expandedCase === cfg.id ? null : cfg.id)}
                    >
                      <div className="p-1.5">
                        {renderCasePreview(cfg, 'medium')}
                      </div>
                      <div className="px-2 py-1.5 bg-gray-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-gray-300">
                          {idx + 1}. {cfg.name}
                        </span>
                        <span className="text-[10px]">
                          {hasCritical ? '🚨' : hasWarning ? '⚠️' : '✓'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accessibility - Color blindness simulation */}
          {activeSection === 'accessibility' && (
            <div className="bg-gradient-to-br from-teal-900/30 to-gray-800/40 rounded-xl p-4 border border-teal-500/30">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-lg">👁️</span> Simulación de daltonismo
              </h3>
              <div className="space-y-3">
                {/* Normal vision */}
                <div>
                  <span className="text-[10px] text-gray-400 mb-1 block">Visión normal</span>
                  <div className="flex gap-1">
                    {cols.map((c, i) => (
                      <div key={i} className="flex-1 h-8 rounded" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                {/* Deuteranopia */}
                <div>
                  <span className="text-[10px] text-gray-400 mb-1 block">Deuteranopía (verde) - 6%</span>
                  <div className="flex gap-1">
                    {cols.map((c, i) => (
                      <div key={i} className="flex-1 h-8 rounded" style={{ backgroundColor: simulateColorBlindness(c, 'deuteranopia') }} />
                    ))}
                  </div>
                </div>
                {/* Protanopia */}
                <div>
                  <span className="text-[10px] text-gray-400 mb-1 block">Protanopía (rojo) - 2%</span>
                  <div className="flex gap-1">
                    {cols.map((c, i) => (
                      <div key={i} className="flex-1 h-8 rounded" style={{ backgroundColor: simulateColorBlindness(c, 'protanopia') }} />
                    ))}
                  </div>
                </div>
                {/* Tritanopia */}
                <div>
                  <span className="text-[10px] text-gray-400 mb-1 block">Tritanopía (azul) - 0.01%</span>
                  <div className="flex gap-1">
                    {cols.map((c, i) => (
                      <div key={i} className="flex-1 h-8 rounded" style={{ backgroundColor: simulateColorBlindness(c, 'tritanopia') }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tu Paleta */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 rounded-xl p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-lg">🎨</span> Tu Paleta
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                  {localColors.length} colores
                </span>
              </h3>
              <div className="flex gap-1 bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded disabled:opacity-30 text-sm"
                  title="Deshacer"
                >
                  ↶
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded disabled:opacity-30 text-sm"
                  title="Rehacer"
                >
                  ↷
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-400 bg-gray-700/30 rounded-lg px-2 py-1.5">
              <span>💡</span>
              <span>Clic para editar • Arrastra para reordenar</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {localColors.map((color, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className={`aspect-square rounded-xl cursor-pointer shadow-lg border-2 ${
                      editingColorIndex === idx 
                        ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900 border-purple-400' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditingColorIndex(editingColorIndex === idx ? null : idx)}
                  >
                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-300">
                      {idx + 1}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                        <span className="text-white text-xs">✎</span>
                      </div>
                    </div>
                  </motion.div>
                  {/* Role instead of HEX */}
                  <div className="text-center mt-1">
                    <span className="text-[9px] text-gray-400 font-medium">{getColorRole(idx)}</span>
                  </div>
                  
                  {/* Color Editor */}
                  <AnimatePresence>
                    {editingColorIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-gray-900 rounded-xl p-4 border border-gray-600 shadow-2xl min-w-[200px]"
                        onClick={e => e.stopPropagation()}
                        onMouseDown={e => e.stopPropagation()}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 border-l border-t border-gray-600 rotate-45" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400">{getColorRole(idx)}</span>
                            <button
                              onClick={() => setEditingColorIndex(null)}
                              className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={color}
                                onChange={e => {
                                  const newColors = [...localColors];
                                  newColors[idx] = e.target.value;
                                  setLocalColors(newColors);
                                }}
                                onBlur={() => pushHistory(localColors)}
                                className="w-14 h-14 cursor-pointer rounded-lg border-2 border-gray-600"
                              />
                              <div className="flex-1">
                                <label className="text-[10px] text-gray-500 block mb-1">HEX</label>
                                <input
                                  type="text"
                                  value={color.toUpperCase()}
                                  onChange={e => {
                                    const val = e.target.value;
                                    if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                                      const hex = val.startsWith('#') ? val : '#' + val;
                                      if (hex.length === 7) {
                                        updateColor(idx, hex);
                                      }
                                    }
                                  }}
                                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-center font-mono"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => {
                                  const { r, g, b } = hexToRgb(color);
                                  const lighter = `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`;
                                  updateColor(idx, lighter);
                                }}
                                className="py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300"
                              >
                                +Claro
                              </button>
                              <button
                                onClick={() => {
                                  const { r, g, b } = hexToRgb(color);
                                  const darker = `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`;
                                  updateColor(idx, darker);
                                }}
                                className="py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300"
                              >
                                +Oscuro
                              </button>
                              <button
                                onClick={() => setEditingColorIndex(null)}
                                className="py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-[10px] text-white"
                              >
                                ✓
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          
          {/* Paleta Corregida */}
          {tempColors && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-900/30 rounded-xl p-3 border border-purple-500/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                  <span>✨</span> Paleta Corregida
                </h3>
                <div className="flex gap-1">
                  <button onClick={undoTemp} disabled={tempHistoryIndex <= 0} className="p-1 text-purple-400 hover:text-white disabled:opacity-30">↶</button>
                  <button onClick={redoTemp} disabled={tempHistoryIndex >= tempHistory.length - 1} className="p-1 text-purple-400 hover:text-white disabled:opacity-30">↷</button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {tempColors.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-lg border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: color !== localColors[idx] ? '#22c55e' : 'rgba(255,255,255,0.2)'
                      }}
                    />
                    <span className="text-[8px] text-gray-500 mt-0.5">{getColorRole(idx)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={applyTempColors} className="flex-1 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium">✓ Aplicar</button>
                <button onClick={discardTempColors} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium">✕ Descartar</button>
              </div>
            </motion.div>
          )}
          
          {/* Save Button */}
          {historyIndex > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={saveAllChanges}
              className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-sm font-medium"
            >
              💾 Guardar cambios
            </motion.button>
          )}
        </div>
        
        {/* Center Column - Scrollable */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-2">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>{currentSection.icon}</span> {currentSection.name}
                </h2>
                <p className="text-sm text-gray-400">{currentSection.description}</p>
              </div>
              <div className="flex gap-2">
                {summary.critical > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
                    {summary.critical} crítico
                  </span>
                )}
                {summary.warning > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">
                    {summary.warning} aviso
                  </span>
                )}
                {summary.optimal > 0 && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                    {summary.optimal} óptimo
                  </span>
                )}
              </div>
            </div>
            
            {/* Readability Section - Show by case */}
            {activeSection === 'readability' ? (
              <div className="space-y-4">
                {caseConfigs.map(cfg => {
                  const caseIssues = issuesByCase[cfg.id] || [];
                  const isExpanded = expandedCase === cfg.id;
                  
                  return (
                    <div key={cfg.id} className="bg-gray-700/20 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedCase(isExpanded ? null : cfg.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded overflow-hidden">
                            {renderCasePreview(cfg, 'small')}
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-medium text-white">{cfg.name}</span>
                            <div className="flex gap-1 mt-0.5">
                              {caseIssues.filter(i => i.type === 'critical').length > 0 && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                                  {caseIssues.filter(i => i.type === 'critical').length} crítico
                                </span>
                              )}
                              {caseIssues.filter(i => i.type === 'warning').length > 0 && (
                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                                  {caseIssues.filter(i => i.type === 'warning').length} aviso
                                </span>
                              )}
                              {caseIssues.every(i => i.type === 'optimal') && (
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                                  ✓ Óptimo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-700/50"
                          >
                            <div className="p-3 space-y-2">
                              {caseIssues.map((issue, i) => (
                                <motion.button
                                  key={i}
                                  whileHover={{ scale: 1.01 }}
                                  onClick={() => setSelectedIssue(issue)}
                                  className={`w-full text-left p-3 rounded-lg transition-all ${
                                    selectedIssue === issue 
                                      ? 'bg-purple-600/30 border border-purple-500/50' 
                                      : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-lg flex-shrink-0">
                                      {issue.type === 'critical' ? '🚨' : 
                                       issue.type === 'warning' ? '⚠️' : 
                                       issue.type === 'glare' ? '💡' : '✓'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm font-medium ${
                                        issue.type === 'critical' ? 'text-red-400' :
                                        issue.type === 'warning' ? 'text-yellow-400' :
                                        issue.type === 'glare' ? 'text-orange-400' :
                                        'text-green-400'
                                      }`}>
                                        {issue.element}
                                      </span>
                                      <p className="text-xs text-gray-400 mt-1">{issue.message}</p>
                                    </div>
                                    {issue.ratio && (
                                      <span className="text-xs text-gray-400">
                                        {issue.ratio.toFixed(1)}:1
                                      </span>
                                    )}
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Other sections - Show all issues */
              <div className="space-y-2">
                {currentIssues.map((issue, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedIssue(issue)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedIssue === issue 
                        ? 'bg-purple-600/30 border border-purple-500/50' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">
                        {issue.type === 'critical' ? '🚨' : 
                         issue.type === 'warning' ? '⚠️' : 
                         issue.type === 'glare' ? '💡' :
                         issue.type === 'info' ? 'ℹ️' : '✓'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium ${
                          issue.type === 'critical' ? 'text-red-400' :
                          issue.type === 'warning' ? 'text-yellow-400' :
                          issue.type === 'glare' ? 'text-orange-400' :
                          issue.type === 'info' ? 'text-blue-400' :
                          'text-green-400'
                        }`}>
                          {issue.element}
                        </span>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedIssue ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 flex-shrink-0"
            >
              <div className={`rounded-xl border overflow-hidden ${
                selectedIssue.type === 'critical' ? 'bg-red-900/20 border-red-500/50' :
                selectedIssue.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/50' :
                selectedIssue.type === 'glare' ? 'bg-orange-900/20 border-orange-500/50' :
                selectedIssue.type === 'info' ? 'bg-blue-900/20 border-blue-500/50' :
                'bg-green-900/20 border-green-500/50'
              }`}>
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {selectedIssue.type === 'critical' ? '🚨' : 
                       selectedIssue.type === 'warning' ? '⚠️' : 
                       selectedIssue.type === 'glare' ? '💡' :
                       selectedIssue.type === 'info' ? 'ℹ️' : '✓'}
                    </span>
                    <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-white p-1">✕</button>
                  </div>
                  <h3 className="font-semibold text-white">{selectedIssue.element}</h3>
                  {selectedIssue.ratio && selectedIssue.fg && selectedIssue.bg && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded border border-white/30" style={{ backgroundColor: selectedIssue.fg }} />
                      <span className="text-gray-400">sobre</span>
                      <div className="w-8 h-8 rounded border border-white/30" style={{ backgroundColor: selectedIssue.bg }} />
                      <span className={`ml-2 text-lg font-bold ${
                        selectedIssue.type === 'critical' ? 'text-red-400' :
                        selectedIssue.type === 'warning' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {selectedIssue.ratio.toFixed(1)}:1
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Message */}
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm text-gray-200">{selectedIssue.message}</p>
                </div>
                
                {/* Solutions */}
                {selectedIssue.solutions.length > 0 && (
                  <div className="p-4 border-b border-white/10">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">💡 Soluciones</h4>
                    <div className="space-y-2">
                      {selectedIssue.solutions.map((sol, i) => (
                        <button
                          key={i}
                          onClick={() => applySolution(sol)}
                          className="w-full p-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 rounded-lg text-left text-sm"
                        >
                          {sol.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Importance */}
                <div className="p-4 border-b border-white/10">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">🧠 ¿Por qué es importante?</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{selectedIssue.importance}</p>
                </div>
                
                {/* Technical */}
                <div className="p-4 border-b border-white/10">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">🔬 Detalle técnico</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedIssue.technical}</p>
                </div>
                
                {/* Citation */}
                <div className="p-4 bg-gray-800/50">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">📚 Referencia científica</h4>
                  <p className="text-[10px] text-gray-500 italic">{selectedIssue.citation}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-80 flex-shrink-0">
              <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-6 text-center">
                <span className="text-4xl mb-3 block">👆</span>
                <p className="text-sm text-gray-400">
                  Selecciona un elemento del análisis para ver detalles y soluciones
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScientificAnalysis;
