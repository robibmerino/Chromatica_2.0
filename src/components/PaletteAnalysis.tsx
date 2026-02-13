import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaletteAnalysisProps {
  colors: string[];
  onApplyFix: (newColors: string[]) => void;
}

interface Issue {
  id: string;
  type: 'contrast' | 'accessibility' | 'harmony' | 'balance' | 'similarity';
  severity: 'warning' | 'error' | 'suggestion';
  title: string;
  description: string;
  affectedColors: number[];
  visualExample: React.ReactNode;
  fixes: {
    label: string;
    description: string;
    preview: string[];
    apply: () => string[];
  }[];
}

// Utilidades de color
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
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

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1: string, color2: string): number => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const colorDistance = (c1: string, c2: string): number => {
  const hsl1 = hexToHsl(c1);
  const hsl2 = hexToHsl(c2);
  const hueDiff = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h));
  const satDiff = Math.abs(hsl1.s - hsl2.s);
  const lumDiff = Math.abs(hsl1.l - hsl2.l);
  return Math.sqrt(hueDiff * hueDiff + satDiff * satDiff + lumDiff * lumDiff);
};

export const PaletteAnalysis: React.FC<PaletteAnalysisProps> = ({ colors, onApplyFix }) => {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Sistema de paleta temporal
  const [tempColors, setTempColors] = useState<string[]>([...colors]);
  const [hasChanges, setHasChanges] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<{label: string, description: string}[]>([]);
  
  // Sincronizar cuando cambian los colores originales
  useEffect(() => {
    if (!hasChanges) {
      setTempColors([...colors]);
    }
  }, [colors, hasChanges]);

  // Función para aplicar un fix a la paleta temporal
  const applyFixToTemp = (newColors: string[], fixLabel: string, fixDescription: string) => {
    setTempColors(newColors);
    setHasChanges(true);
    setAppliedFixes(prev => [...prev, { label: fixLabel, description: fixDescription }]);
  };

  // Función para implementar los cambios en la paleta principal
  const implementChanges = () => {
    onApplyFix(tempColors);
    setHasChanges(false);
    setAppliedFixes([]);
  };

  // Función para descartar los cambios
  const discardChanges = () => {
    setTempColors([...colors]);
    setHasChanges(false);
    setAppliedFixes([]);
  };

  // Función para deshacer el último cambio
  const undoLastChange = () => {
    if (appliedFixes.length === 0) return;
    
    // Recreamos desde el principio sin el último fix
    const newAppliedFixes = appliedFixes.slice(0, -1);
    
    if (newAppliedFixes.length === 0) {
      discardChanges();
    } else {
      setAppliedFixes(newAppliedFixes);
      // Para un undo completo necesitaríamos guardar el historial de colores
      // Por ahora, simplemente recargamos
      setTempColors([...colors]);
      setHasChanges(newAppliedFixes.length > 0);
    }
  };

  // Usamos tempColors para el análisis
  const analysisColors = tempColors;
  
  const issues = useMemo(() => {
    const detectedIssues: Issue[] = [];
    const colorsHsl = analysisColors.map(hexToHsl);

    // 1. Análisis de contraste entre colores adyacentes
    for (let i = 0; i < analysisColors.length - 1; i++) {
      const contrast = getContrastRatio(analysisColors[i], analysisColors[i + 1]);
      if (contrast < 1.5) {
        const hsl1 = colorsHsl[i];
        const hsl2 = colorsHsl[i + 1];
        
        detectedIssues.push({
          id: `contrast-${i}`,
          type: 'contrast',
          severity: 'warning',
          title: 'Bajo contraste entre colores adyacentes',
          description: `Los colores ${i + 1} y ${i + 2} tienen un contraste muy bajo (${contrast.toFixed(2)}:1). Esto puede hacer difícil distinguirlos.`,
          affectedColors: [i, i + 1],
          visualExample: (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">Problema:</p>
                <div className="flex h-16 rounded-lg overflow-hidden">
                  <div className="flex-1 flex items-center justify-center text-white text-sm font-medium" 
                       style={{ backgroundColor: analysisColors[i] }}>
                    Color {i + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-center text-white text-sm font-medium" 
                       style={{ backgroundColor: analysisColors[i + 1] }}>
                    Color {i + 2}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">Contraste: {contrast.toFixed(2)}:1</p>
              </div>
            </div>
          ),
          fixes: [
            {
              label: 'Oscurecer segundo color',
              description: 'Reduce la luminosidad del segundo color para mayor contraste',
              preview: (() => {
                const newColors = [...analysisColors];
                newColors[i + 1] = hslToHex(hsl2.h, hsl2.s, Math.max(10, hsl2.l - 20));
                return newColors;
              })(),
              apply: () => {
                const newColors = [...analysisColors];
                newColors[i + 1] = hslToHex(hsl2.h, hsl2.s, Math.max(10, hsl2.l - 20));
                return newColors;
              }
            },
            {
              label: 'Aclarar primer color',
              description: 'Aumenta la luminosidad del primer color',
              preview: (() => {
                const newColors = [...analysisColors];
                newColors[i] = hslToHex(hsl1.h, hsl1.s, Math.min(90, hsl1.l + 20));
                return newColors;
              })(),
              apply: () => {
                const newColors = [...analysisColors];
                newColors[i] = hslToHex(hsl1.h, hsl1.s, Math.min(90, hsl1.l + 20));
                return newColors;
              }
            },
            {
              label: 'Cambiar tono del segundo',
              description: 'Rota el tono 30° para diferenciarlo',
              preview: (() => {
                const newColors = [...analysisColors];
                newColors[i + 1] = hslToHex((hsl2.h + 30) % 360, hsl2.s, hsl2.l);
                return newColors;
              })(),
              apply: () => {
                const newColors = [...analysisColors];
                newColors[i + 1] = hslToHex((hsl2.h + 30) % 360, hsl2.s, hsl2.l);
                return newColors;
              }
            }
          ]
        });
      }
    }

    // 2. Análisis de accesibilidad (texto sobre fondo)
    const lightestIdx = colorsHsl.reduce((a, c, i) => c.l > colorsHsl[a].l ? i : a, 0);
    const darkestIdx = colorsHsl.reduce((a, c, i) => c.l < colorsHsl[a].l ? i : a, 0);
    
    const textContrast = getContrastRatio(analysisColors[darkestIdx], analysisColors[lightestIdx]);
    if (textContrast < 4.5) {
      detectedIssues.push({
        id: 'accessibility-text',
        type: 'accessibility',
        severity: 'error',
        title: 'Problemas de accesibilidad WCAG',
        description: `El contraste entre el color más oscuro y más claro es ${textContrast.toFixed(2)}:1. WCAG AA requiere al menos 4.5:1 para texto normal.`,
        affectedColors: [darkestIdx, lightestIdx],
        visualExample: (
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">Problema actual:</p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: analysisColors[lightestIdx] }}>
                  <p className="text-lg font-bold" style={{ color: analysisColors[darkestIdx] }}>
                    Texto de ejemplo
                  </p>
                  <p className="text-sm" style={{ color: analysisColors[darkestIdx] }}>
                    Este texto puede ser difícil de leer
                  </p>
                </div>
                <p className="text-xs text-red-400 mt-1">❌ {textContrast.toFixed(2)}:1 (mínimo 4.5:1)</p>
              </div>
            </div>
          </div>
        ),
        fixes: [
          {
            label: 'Oscurecer texto',
            description: 'Hacer el color oscuro más oscuro aún',
            preview: (() => {
              const newColors = [...analysisColors];
              const hsl = colorsHsl[darkestIdx];
              newColors[darkestIdx] = hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 15));
              return newColors;
            })(),
            apply: () => {
              const newColors = [...analysisColors];
              const hsl = colorsHsl[darkestIdx];
              newColors[darkestIdx] = hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 15));
              return newColors;
            }
          },
          {
            label: 'Aclarar fondo',
            description: 'Hacer el color claro más claro',
            preview: (() => {
              const newColors = [...analysisColors];
              const hsl = colorsHsl[lightestIdx];
              newColors[lightestIdx] = hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(95, hsl.l + 10));
              return newColors;
            })(),
            apply: () => {
              const newColors = [...analysisColors];
              const hsl = colorsHsl[lightestIdx];
              newColors[lightestIdx] = hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(95, hsl.l + 10));
              return newColors;
            }
          }
        ]
      });
    }

    // 3. Análisis de colores muy similares
    for (let i = 0; i < analysisColors.length; i++) {
      for (let j = i + 1; j < analysisColors.length; j++) {
        const distance = colorDistance(analysisColors[i], analysisColors[j]);
        if (distance < 15 && Math.abs(i - j) > 1) {
          const hsl2 = colorsHsl[j];
          detectedIssues.push({
            id: `similarity-${i}-${j}`,
            type: 'similarity',
            severity: 'suggestion',
            title: 'Colores muy similares',
            description: `Los colores ${i + 1} y ${j + 1} son muy parecidos. Considera diferenciarlos o eliminar uno.`,
            affectedColors: [i, j],
            visualExample: (
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-lg shadow-inner" style={{ backgroundColor: analysisColors[i] }} />
                  <div className="flex items-center text-gray-400">≈</div>
                  <div className="w-12 h-12 rounded-lg shadow-inner" style={{ backgroundColor: analysisColors[j] }} />
                </div>
                <p className="text-sm text-gray-400">Diferencia: {distance.toFixed(0)}% (muy baja)</p>
              </div>
            ),
            fixes: [
              {
                label: 'Diferenciar tonos',
                description: 'Rotar el tono del segundo color',
                preview: (() => {
                  const newColors = [...analysisColors];
                  newColors[j] = hslToHex((hsl2.h + 40) % 360, hsl2.s, hsl2.l);
                  return newColors;
                })(),
                apply: () => {
                  const newColors = [...analysisColors];
                  newColors[j] = hslToHex((hsl2.h + 40) % 360, hsl2.s, hsl2.l);
                  return newColors;
                }
              },
              {
                label: 'Variar luminosidad',
                description: 'Crear más contraste entre ambos',
                preview: (() => {
                  const newColors = [...analysisColors];
                  newColors[j] = hslToHex(hsl2.h, hsl2.s, hsl2.l > 50 ? hsl2.l - 25 : hsl2.l + 25);
                  return newColors;
                })(),
                apply: () => {
                  const newColors = [...analysisColors];
                  newColors[j] = hslToHex(hsl2.h, hsl2.s, hsl2.l > 50 ? hsl2.l - 25 : hsl2.l + 25);
                  return newColors;
                }
              }
            ]
          });
        }
      }
    }

    // 4. Análisis de equilibrio de saturación
    const avgSaturation = colorsHsl.reduce((a, c) => a + c.s, 0) / colorsHsl.length;
    const saturationVariance = colorsHsl.reduce((a, c) => a + Math.pow(c.s - avgSaturation, 2), 0) / colorsHsl.length;
    
    if (saturationVariance > 800) {
      const lowSatIdx = colorsHsl.reduce((a, c, i) => c.s < colorsHsl[a].s ? i : a, 0);
      const highSatIdx = colorsHsl.reduce((a, c, i) => c.s > colorsHsl[a].s ? i : a, 0);
      
      detectedIssues.push({
        id: 'balance-saturation',
        type: 'balance',
        severity: 'suggestion',
        title: 'Saturación desbalanceada',
        description: 'Hay mucha diferencia de saturación entre los colores. Esto puede crear una sensación de desorden visual.',
        affectedColors: [lowSatIdx, highSatIdx],
        visualExample: (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {analysisColors.map((color, idx) => {
                const hsl = colorsHsl[idx];
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500 mt-1">{Math.round(hsl.s)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="h-2 rounded-full bg-gray-700 overflow-hidden flex">
              {analysisColors.map((_, idx) => (
                <div 
                  key={idx}
                  className="h-full"
                  style={{ 
                    width: `${100 / analysisColors.length}%`,
                    backgroundColor: `hsl(0, ${colorsHsl[idx].s}%, 50%)`
                  }}
                />
              ))}
            </div>
          </div>
        ),
        fixes: [
          {
            label: 'Equilibrar saturación',
            description: 'Ajustar todos los colores a una saturación similar',
            preview: (() => {
              return analysisColors.map((_, idx) => {
                const hsl = colorsHsl[idx];
                return hslToHex(hsl.h, avgSaturation, hsl.l);
              });
            })(),
            apply: () => {
              return analysisColors.map((_, idx) => {
                const hsl = colorsHsl[idx];
                return hslToHex(hsl.h, avgSaturation, hsl.l);
              });
            }
          },
          {
            label: 'Suavizar extremos',
            description: 'Acercar los valores extremos al promedio',
            preview: (() => {
              return analysisColors.map((_, idx) => {
                const hsl = colorsHsl[idx];
                const newSat = hsl.s + (avgSaturation - hsl.s) * 0.5;
                return hslToHex(hsl.h, newSat, hsl.l);
              });
            })(),
            apply: () => {
              return analysisColors.map((_, idx) => {
                const hsl = colorsHsl[idx];
                const newSat = hsl.s + (avgSaturation - hsl.s) * 0.5;
                return hslToHex(hsl.h, newSat, hsl.l);
              });
            }
          }
        ]
      });
    }

    // 5. Análisis de armonía
    const hues = colorsHsl.map(c => c.h);
    const hueSpread = Math.max(...hues) - Math.min(...hues);
    
    // Detectar si es casi monocromático pero con un color fuera
    const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
    const outlierIdx = hues.reduce((a, c, i) => {
      const diff = Math.min(Math.abs(c - avgHue), 360 - Math.abs(c - avgHue));
      const currentDiff = Math.min(Math.abs(hues[a] - avgHue), 360 - Math.abs(hues[a] - avgHue));
      return diff > currentDiff ? i : a;
    }, 0);
    
    const outlierDiff = Math.min(Math.abs(hues[outlierIdx] - avgHue), 360 - Math.abs(hues[outlierIdx] - avgHue));
    
    if (outlierDiff > 60 && hueSpread < 180) {
      const hslOutlier = colorsHsl[outlierIdx];
      detectedIssues.push({
        id: 'harmony-outlier',
        type: 'harmony',
        severity: 'suggestion',
        title: 'Color fuera de la armonía',
        description: `El color ${outlierIdx + 1} tiene un tono muy diferente al resto. Podrías ajustarlo para mejor armonía.`,
        affectedColors: [outlierIdx],
        visualExample: (
          <div className="space-y-3">
            <div className="relative w-32 h-32 mx-auto">
              {/* Rueda de color simplificada */}
              <div className="absolute inset-0 rounded-full" 
                   style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
              <div className="absolute inset-4 rounded-full bg-gray-800" />
              {/* Puntos de colores */}
              {analysisColors.map((color, idx) => {
                const angle = (colorsHsl[idx].h - 90) * (Math.PI / 180);
                const radius = 45;
                const x = 64 + Math.cos(angle) * radius;
                const y = 64 + Math.sin(angle) * radius;
                return (
                  <div
                    key={idx}
                    className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 ${idx === outlierIdx ? 'border-red-400 ring-2 ring-red-400' : 'border-white'}`}
                    style={{ left: x, top: y, backgroundColor: color }}
                  />
                );
              })}
            </div>
            <p className="text-xs text-center text-gray-400">El punto marcado está alejado del grupo</p>
          </div>
        ),
        fixes: [
          {
            label: 'Integrar a la armonía',
            description: 'Mover el tono hacia el promedio del grupo',
            preview: (() => {
              const newColors = [...analysisColors];
              newColors[outlierIdx] = hslToHex(avgHue, hslOutlier.s, hslOutlier.l);
              return newColors;
            })(),
            apply: () => {
              const newColors = [...analysisColors];
              newColors[outlierIdx] = hslToHex(avgHue, hslOutlier.s, hslOutlier.l);
              return newColors;
            }
          },
          {
            label: 'Hacerlo complementario',
            description: 'Convertirlo en un acento complementario intencionado',
            preview: (() => {
              const newColors = [...analysisColors];
              newColors[outlierIdx] = hslToHex((avgHue + 180) % 360, hslOutlier.s, hslOutlier.l);
              return newColors;
            })(),
            apply: () => {
              const newColors = [...analysisColors];
              newColors[outlierIdx] = hslToHex((avgHue + 180) % 360, hslOutlier.s, hslOutlier.l);
              return newColors;
            }
          }
        ]
      });
    }

    return detectedIssues;
  }, [analysisColors]);

  // Calcular puntuación general
  const overallScore = useMemo(() => {
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'error') score -= 25;
      else if (issue.severity === 'warning') score -= 15;
      else score -= 5;
    });
    return Math.max(0, score);
  }, [issues]);

  // Calcular puntuación original (para comparar)
  const originalScore = useMemo(() => {
    if (!hasChanges) return overallScore;
    
    const originalColorsHsl = colors.map(hexToHsl);
    let score = 100;
    
    // Simplificación del cálculo para comparar
    for (let i = 0; i < colors.length - 1; i++) {
      const contrast = getContrastRatio(colors[i], colors[i + 1]);
      if (contrast < 1.5) score -= 15;
    }
    
    const lightestIdx = originalColorsHsl.reduce((a, c, i) => c.l > originalColorsHsl[a].l ? i : a, 0);
    const darkestIdx = originalColorsHsl.reduce((a, c, i) => c.l < originalColorsHsl[a].l ? i : a, 0);
    const textContrast = getContrastRatio(colors[darkestIdx], colors[lightestIdx]);
    if (textContrast < 4.5) score -= 25;
    
    return Math.max(0, score);
  }, [colors, hasChanges, overallScore]);

  const categories = [
    { id: 'all', label: 'Todos', icon: '📋' },
    { id: 'contrast', label: 'Contraste', icon: '🔲' },
    { id: 'accessibility', label: 'Accesibilidad', icon: '♿' },
    { id: 'harmony', label: 'Armonía', icon: '🎨' },
    { id: 'balance', label: 'Equilibrio', icon: '⚖️' },
    { id: 'similarity', label: 'Similitud', icon: '👯' },
  ];

  const filteredIssues = activeCategory === 'all' 
    ? issues 
    : issues.filter(i => i.type === activeCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel de cambios pendientes */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-500/30 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Cambios en borrador
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Has aplicado {appliedFixes.length} corrección{appliedFixes.length !== 1 ? 'es' : ''}. 
                  Revisa la comparación y decide si implementarlas.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center px-3 py-1 bg-gray-800/50 rounded-lg">
                  <div className="text-xs text-gray-400">Mejora</div>
                  <div className={`text-lg font-bold ${overallScore > originalScore ? 'text-green-400' : 'text-gray-400'}`}>
                    {overallScore > originalScore ? '+' : ''}{overallScore - originalScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparación visual */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Original</span>
                  <span className={`text-sm font-medium ${originalScore >= 80 ? 'text-green-400' : originalScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {originalScore}/100
                  </span>
                </div>
                <div className="flex gap-1">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-10 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 ring-2 ring-purple-500/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-300 font-medium">Con correcciones</span>
                  <span className={`text-sm font-medium ${overallScore >= 80 ? 'text-green-400' : overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {overallScore}/100
                  </span>
                </div>
                <div className="flex gap-1">
                  {tempColors.map((color, idx) => (
                    <motion.div
                      key={idx}
                      className={`flex-1 h-10 rounded-lg first:rounded-l-xl last:rounded-r-xl ${color !== colors[idx] ? 'ring-2 ring-green-400' : ''}`}
                      style={{ backgroundColor: color }}
                      initial={{ scale: 1 }}
                      animate={{ scale: color !== colors[idx] ? [1, 1.05, 1] : 1 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de cambios aplicados */}
            <div className="bg-gray-900/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-400 mb-2">Correcciones aplicadas:</p>
              <div className="flex flex-wrap gap-2">
                {appliedFixes.map((fix, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                  >
                    {fix.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <button
                onClick={implementChanges}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>✅</span>
                Implementar cambios
              </button>
              <button
                onClick={undoLastChange}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                title="Deshacer último"
              >
                ↩️
              </button>
              <button
                onClick={discardChanges}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium rounded-xl transition-colors"
              >
                Descartar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header con puntuación */}
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Análisis de tu paleta</h3>
            <p className="text-gray-400 text-sm">
              {hasChanges 
                ? 'Analizando paleta con correcciones' 
                : 'Revisa posibles mejoras antes de guardar'}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${
              overallScore >= 80 ? 'text-green-400' : 
              overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {overallScore}
            </div>
            <p className="text-xs text-gray-400">Puntuación</p>
          </div>
        </div>

        {/* Barra de puntuación visual */}
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${
              overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
              overallScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 
              'bg-gradient-to-r from-red-500 to-orange-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Resumen rápido */}
        <div className="flex gap-4 mt-4">
          {issues.filter(i => i.severity === 'error').length > 0 && (
            <span className="text-sm text-red-400">
              🚨 {issues.filter(i => i.severity === 'error').length} problema{issues.filter(i => i.severity === 'error').length > 1 ? 's' : ''}
            </span>
          )}
          {issues.filter(i => i.severity === 'warning').length > 0 && (
            <span className="text-sm text-yellow-400">
              ⚠️ {issues.filter(i => i.severity === 'warning').length} advertencia{issues.filter(i => i.severity === 'warning').length > 1 ? 's' : ''}
            </span>
          )}
          {issues.filter(i => i.severity === 'suggestion').length > 0 && (
            <span className="text-sm text-blue-400">
              💡 {issues.filter(i => i.severity === 'suggestion').length} sugerencia{issues.filter(i => i.severity === 'suggestion').length > 1 ? 's' : ''}
            </span>
          )}
          {issues.length === 0 && (
            <span className="text-sm text-green-400">✨ ¡Tu paleta se ve genial!</span>
          )}
        </div>
      </div>

      {/* Vista previa de la paleta */}
      <div className="flex gap-2">
        {tempColors.map((color, idx) => (
          <motion.div
            key={idx}
            className={`flex-1 h-16 rounded-xl relative ${
              issues.some(i => i.affectedColors.includes(idx)) 
                ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' 
                : ''
            } ${hasChanges && color !== colors[idx] ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900' : ''}`}
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.05 }}
          >
            {hasChanges && color !== colors[idx] && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {issues.length > 0 && (
        <>
          {/* Filtros por categoría */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => {
              const count = cat.id === 'all' ? issues.length : issues.filter(i => i.type === cat.id).length;
              if (count === 0 && cat.id !== 'all') return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat.icon} {cat.label} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Lista de problemas */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredIssues.map((issue) => (
                <motion.div
                  key={issue.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`border rounded-xl overflow-hidden ${getSeverityColor(issue.severity)}`}
                >
                  {/* Header del problema */}
                  <button
                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSeverityIcon(issue.severity)}</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-white">{issue.title}</h4>
                        <p className="text-sm opacity-80">{issue.description}</p>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedIssue === issue.id ? 180 : 0 }}
                      className="text-xl"
                    >
                      ▼
                    </motion.span>
                  </button>

                  {/* Contenido expandido */}
                  <AnimatePresence>
                    {expandedIssue === issue.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-current/20"
                      >
                        <div className="p-4 space-y-4">
                          {/* Ejemplo visual del problema */}
                          <div className="bg-gray-900/50 rounded-xl p-4">
                            {issue.visualExample}
                          </div>

                          {/* Soluciones propuestas */}
                          <div>
                            <p className="text-sm font-medium text-white mb-3">
                              Soluciones sugeridas:
                            </p>
                            <div className="grid gap-3">
                              {issue.fixes.map((fix, fixIdx) => (
                                <div
                                  key={fixIdx}
                                  className="p-4 rounded-xl border-2 transition-all border-gray-600 hover:border-gray-500 bg-gray-800/50"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-white">{fix.label}</h5>
                                      <p className="text-sm text-gray-400">{fix.description}</p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        applyFixToTemp(fix.apply(), fix.label, fix.description);
                                      }}
                                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors shrink-0 flex items-center gap-2"
                                    >
                                      <span>Probar</span>
                                      <span className="text-purple-200">→</span>
                                    </button>
                                  </div>
                                  
                                  {/* Preview de la corrección */}
                                  <div className="mt-3 flex gap-1">
                                    <div className="flex gap-1 flex-1">
                                      <p className="text-xs text-gray-500 mr-2">Antes:</p>
                                      {tempColors.map((c, i) => (
                                        <div
                                          key={i}
                                          className={`flex-1 h-6 rounded ${issue.affectedColors.includes(i) ? 'ring-1 ring-red-400' : ''}`}
                                          style={{ backgroundColor: c }}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-gray-500 px-2">→</span>
                                    <div className="flex gap-1 flex-1">
                                      <p className="text-xs text-gray-500 mr-2">Después:</p>
                                      {fix.preview.map((c, i) => (
                                        <div
                                          key={i}
                                          className={`flex-1 h-6 rounded ${issue.affectedColors.includes(i) ? 'ring-1 ring-green-400' : ''}`}
                                          style={{ backgroundColor: c }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Mensaje de éxito */}
      {issues.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">¡Paleta perfecta!</h3>
          <p className="text-gray-300">
            No se han detectado problemas. Tu paleta tiene buen contraste, es accesible y está bien equilibrada.
          </p>
        </motion.div>
      )}

      {/* Nota informativa cuando hay cambios */}
      {hasChanges && (
        <div className="text-center text-sm text-gray-400">
          💡 Los cambios se guardan en borrador hasta que pulses "Implementar cambios"
        </div>
      )}
    </div>
  );
};

export default PaletteAnalysis;
