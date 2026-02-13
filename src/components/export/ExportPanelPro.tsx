import React, { useState, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import ButtonParticles from '../ButtonParticles';

interface ExportPanelProProps {
  colors: string[];
  paletteName: string;
}

type ExportFormat = 'png' | 'svg' | 'pdf';
type CodeFormat = 'css' | 'scss' | 'json' | 'tailwind' | 'swift' | 'kotlin';

interface ExportElement {
  id: string;
  category: 'basic' | 'info' | 'visual' | 'poster' | 'distribution';
  name: string;
  icon: string;
  enabled: boolean;
}

const getColorName = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  
  if (max - min < 20) {
    if (l > 0.8) return 'Blanco';
    if (l < 0.2) return 'Negro';
    return 'Gris';
  }
  
  if (r >= g && r >= b) {
    if (r - g < 30 && g > b) return l > 0.6 ? 'Amarillo claro' : 'Amarillo';
    if (r - b < 30 && b > g) return l > 0.6 ? 'Rosa' : 'Magenta';
    return l > 0.6 ? 'Coral' : 'Rojo';
  }
  if (g >= r && g >= b) {
    if (g - r < 30) return l > 0.6 ? 'Lima' : 'Verde lima';
    if (g - b < 30) return l > 0.6 ? 'Turquesa' : 'Cian';
    return l > 0.6 ? 'Verde claro' : 'Verde';
  }
  if (b - r < 30) return l > 0.6 ? 'Lavanda' : 'Púrpura';
  return l > 0.6 ? 'Celeste' : 'Azul';
};

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const hexToHsl = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hexToCmyk = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round((1 - rNorm - k) / (1 - k) * 100);
  const m = Math.round((1 - gNorm - k) / (1 - k) * 100);
  const y = Math.round((1 - bNorm - k) / (1 - k) * 100);
  return { c, m, y, k: Math.round(k * 100) };
};

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

export const ExportPanelPro: React.FC<ExportPanelProProps> = ({ colors, paletteName }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [codeFormat, setCodeFormat] = useState<CodeFormat>('css');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'basic' | 'posters' | 'distribution'>('basic');
  
  // Configuración visual - fondo oscuro por defecto
  const [background, setBackground] = useState<'white' | 'dark' | 'gradient' | 'custom'>('dark');
  const [customBg, setCustomBg] = useState('#1a1a2e');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [borderRadius, setBorderRadius] = useState<'none' | 'small' | 'medium' | 'large'>('medium');
  const [exportSize, setExportSize] = useState<'1x' | '2x' | '3x'>('2x');
  const [showCodesUnderPalette, setShowCodesUnderPalette] = useState(true);
  const [showAdvancedCodes, setShowAdvancedCodes] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0 });
  
  // Poster variants - MULTICHECK
  const [selectedRefinementPosters, setSelectedRefinementPosters] = useState<Set<string>>(new Set());
  const [selectedApplicationPosters, setSelectedApplicationPosters] = useState<Set<string>>(new Set());
  const [distributionRule, setDistributionRule] = useState<'60-30-10' | 'golden' | '50-30-20' | 'equal'>('60-30-10');
  
  // Elementos - SIN Mockup, Tarjetas y Logo en básicos
  const [elements, setElements] = useState<ExportElement[]>([
    { id: 'title', category: 'basic', name: 'Título de paleta', icon: '📝', enabled: true },
    { id: 'palette-strip', category: 'basic', name: 'Paleta horizontal', icon: '🎨', enabled: true },
    { id: 'color-codes', category: 'info', name: 'Códigos de color', icon: '🔢', enabled: false },
    { id: 'color-wheel', category: 'visual', name: 'Rueda cromática', icon: '🌈', enabled: false },
    { id: 'gradient', category: 'visual', name: 'Vista gradiente', icon: '🌅', enabled: false },
    { id: 'refinement-poster', category: 'poster', name: 'Póster (Estilo)', icon: '🖼️', enabled: false },
    { id: 'application-poster', category: 'poster', name: 'Póster (Aplicación)', icon: '🎭', enabled: false },
    { id: 'distribution', category: 'distribution', name: 'Distribución', icon: '📊', enabled: false },
    { id: 'contrast-matrix', category: 'info', name: 'Matriz contraste', icon: '⬛', enabled: false },
    { id: 'harmony-info', category: 'info', name: 'Info armonía', icon: '✨', enabled: false },
    { id: 'footer', category: 'basic', name: 'Pie de página', icon: '📋', enabled: false },
  ]);

  const toggleElement = (id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, enabled: !el.enabled } : el
    ));
  };

  const toggleRefinementPoster = (style: string) => {
    setSelectedRefinementPosters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(style)) {
        newSet.delete(style);
      } else {
        newSet.add(style);
      }
      return newSet;
    });
  };

  const toggleApplicationPoster = (style: string) => {
    setSelectedApplicationPosters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(style)) {
        newSet.delete(style);
      } else {
        newSet.add(style);
      }
      return newSet;
    });
  };

  // Funciones para marcar/desmarcar todos
  const toggleAllBasic = (enable: boolean) => {
    setElements(prev => prev.map(el => 
      (el.category === 'basic' || el.category === 'info' || el.category === 'visual') 
        ? { ...el, enabled: enable } 
        : el
    ));
  };

  const toggleAllPosters = (enable: boolean) => {
    const posterEl = elements.find(e => e.id === 'refinement-poster');
    const appPosterEl = elements.find(e => e.id === 'application-poster');
    if (posterEl) toggleElement('refinement-poster');
    if (appPosterEl) toggleElement('application-poster');
    
    if (enable) {
      setSelectedRefinementPosters(new Set(['bold', 'minimal', 'elegant', 'geometric', 'editorial', 'swiss']));
      setSelectedApplicationPosters(new Set(['evento', 'producto', 'artistico', 'tipografico', 'geometrico']));
      setElements(prev => prev.map(el => 
        (el.id === 'refinement-poster' || el.id === 'application-poster') 
          ? { ...el, enabled: true } 
          : el
      ));
    } else {
      setSelectedRefinementPosters(new Set());
      setSelectedApplicationPosters(new Set());
      setElements(prev => prev.map(el => 
        (el.id === 'refinement-poster' || el.id === 'application-poster') 
          ? { ...el, enabled: false } 
          : el
      ));
    }
  };

  const toggleAllDistribution = (enable: boolean) => {
    setElements(prev => prev.map(el => 
      el.category === 'distribution' ? { ...el, enabled: enable } : el
    ));
  };

  const enabledElements = elements.filter(el => el.enabled);

  // Presets de descarga rápida
  const quickDownloadPresets = [
    {
      id: 'basic',
      name: 'Básico',
      icon: '📋',
      description: 'Paleta, códigos y gradiente',
      color: '#818cf8',
      elements: ['palette-strip', 'color-codes', 'gradient'],
      posters: { refinement: [], application: [] },
      distribution: false
    },
    {
      id: 'basic-advanced',
      name: 'Básico+',
      icon: '📊',
      description: 'Básico + rueda e info',
      color: '#a78bfa',
      elements: ['title', 'palette-strip', 'color-codes', 'gradient', 'color-wheel', 'harmony-info', 'footer'],
      posters: { refinement: [], application: [] },
      distribution: false
    },
    {
      id: 'basic-complete',
      name: 'Básico completo',
      icon: '✨',
      description: 'Todos los elementos básicos',
      color: '#c084fc',
      elements: ['title', 'palette-strip', 'color-codes', 'color-wheel', 'gradient', 'contrast-matrix', 'harmony-info', 'footer'],
      posters: { refinement: [], application: [] },
      distribution: false
    },
    {
      id: 'posters',
      name: 'Pósters',
      icon: '🖼️',
      description: 'Todos los estilos de póster',
      color: '#f472b6',
      elements: ['title', 'palette-strip', 'refinement-poster', 'application-poster', 'footer'],
      posters: { 
        refinement: ['bold', 'minimal', 'elegant', 'geometric', 'editorial', 'swiss'], 
        application: ['evento', 'producto', 'artistico', 'tipografico', 'geometrico'] 
      },
      distribution: false
    },
    {
      id: 'distribution',
      name: 'Distribución',
      icon: '📐',
      description: 'Reglas de distribución',
      color: '#fb923c',
      elements: ['title', 'palette-strip', 'distribution', 'footer'],
      posters: { refinement: [], application: [] },
      distribution: true
    },
    {
      id: 'complete',
      name: 'Completo',
      icon: '🎁',
      description: 'Todo incluido',
      color: '#4ade80',
      elements: ['title', 'palette-strip', 'color-codes', 'color-wheel', 'gradient', 'refinement-poster', 'application-poster', 'distribution', 'contrast-matrix', 'harmony-info', 'footer'],
      posters: { 
        refinement: ['bold', 'minimal', 'elegant', 'geometric', 'editorial', 'swiss'], 
        application: ['evento', 'producto', 'artistico', 'tipografico', 'geometrico'] 
      },
      distribution: true
    },
  ];

  const applyPreset = (presetId: string) => {
    const preset = quickDownloadPresets.find(p => p.id === presetId);
    if (!preset) return;

    setElements(prev => prev.map(el => ({
      ...el,
      enabled: preset.elements.includes(el.id)
    })));

    setSelectedRefinementPosters(new Set(preset.posters.refinement));
    setSelectedApplicationPosters(new Set(preset.posters.application));

    if (preset.distribution) {
      setDistributionRule('60-30-10');
    }
  };

  const handleQuickDownload = async (presetId: string) => {
    applyPreset(presetId);
    await new Promise(resolve => setTimeout(resolve, 100));
    handleExport();
  };

  // Función para exportar todos los elementos individuales en ZIP
  const handleExportAllZip = async () => {
    if (!previewRef.current) {
      showErrorNotification('Error: No se encontró el elemento de vista previa');
      return;
    }

    setIsExportingZip(true);
    
    try {
      const zip = new JSZip();
      
      // Definir todos los elementos individuales a exportar
      const allExportItems: { 
        folder: string; 
        name: string; 
        config: {
          elements: string[];
          refinementPosters?: string[];
          applicationPosters?: string[];
          distributionRule?: string;
        }
      }[] = [
        // Básicos
        { folder: 'Basicos', name: 'Titulo', config: { elements: ['title'] } },
        { folder: 'Basicos', name: 'Paleta-horizontal', config: { elements: ['palette-strip'] } },
        { folder: 'Basicos', name: 'Codigos-color', config: { elements: ['color-codes'] } },
        { folder: 'Basicos', name: 'Codigos-color-avanzado', config: { elements: ['color-codes'] } }, // Marcaremos showAdvancedCodes
        { folder: 'Basicos', name: 'Rueda-cromatica', config: { elements: ['color-wheel'] } },
        { folder: 'Basicos', name: 'Gradiente', config: { elements: ['gradient'] } },
        { folder: 'Basicos', name: 'Matriz-contraste', config: { elements: ['contrast-matrix'] } },
        { folder: 'Basicos', name: 'Info-armonia', config: { elements: ['harmony-info'] } },
        { folder: 'Basicos', name: 'Pie-pagina', config: { elements: ['footer'] } },
        
        // Pósters Estilo
        { folder: 'Posters-Estilo', name: 'Bold', config: { elements: ['refinement-poster'], refinementPosters: ['bold'] } },
        { folder: 'Posters-Estilo', name: 'Minimal', config: { elements: ['refinement-poster'], refinementPosters: ['minimal'] } },
        { folder: 'Posters-Estilo', name: 'Elegant', config: { elements: ['refinement-poster'], refinementPosters: ['elegant'] } },
        { folder: 'Posters-Estilo', name: 'Geometric', config: { elements: ['refinement-poster'], refinementPosters: ['geometric'] } },
        { folder: 'Posters-Estilo', name: 'Editorial', config: { elements: ['refinement-poster'], refinementPosters: ['editorial'] } },
        { folder: 'Posters-Estilo', name: 'Swiss', config: { elements: ['refinement-poster'], refinementPosters: ['swiss'] } },
        
        // Pósters Aplicación
        { folder: 'Posters-Aplicacion', name: 'Evento', config: { elements: ['application-poster'], applicationPosters: ['evento'] } },
        { folder: 'Posters-Aplicacion', name: 'Producto', config: { elements: ['application-poster'], applicationPosters: ['producto'] } },
        { folder: 'Posters-Aplicacion', name: 'Artistico', config: { elements: ['application-poster'], applicationPosters: ['artistico'] } },
        { folder: 'Posters-Aplicacion', name: 'Tipografico', config: { elements: ['application-poster'], applicationPosters: ['tipografico'] } },
        { folder: 'Posters-Aplicacion', name: 'Geometrico', config: { elements: ['application-poster'], applicationPosters: ['geometrico'] } },
        
        // Distribución
        { folder: 'Distribucion', name: 'Regla-60-30-10', config: { elements: ['distribution'], distributionRule: '60-30-10' } },
        { folder: 'Distribucion', name: 'Proporcion-Aurea', config: { elements: ['distribution'], distributionRule: 'golden' } },
        { folder: 'Distribucion', name: 'Regla-50-30-20', config: { elements: ['distribution'], distributionRule: '50-30-20' } },
        { folder: 'Distribucion', name: 'Distribucion-igual', config: { elements: ['distribution'], distributionRule: 'equal' } },
      ];
      
      const total = allExportItems.length;
      setZipProgress({ current: 0, total });

      // Crear carpetas en el ZIP
      const basicosFolder = zip.folder('Basicos');
      const postersEstiloFolder = zip.folder('Posters-Estilo');
      const postersAplicacionFolder = zip.folder('Posters-Aplicacion');
      const distribucionFolder = zip.folder('Distribucion');

      for (let i = 0; i < allExportItems.length; i++) {
        const item = allExportItems[i];
        setZipProgress({ current: i + 1, total });

        // Configurar el estado para este elemento específico
        setElements(prev => prev.map(el => ({
          ...el,
          enabled: item.config.elements.includes(el.id)
        })));
        
        // Configurar pósters
        if (item.config.refinementPosters) {
          setSelectedRefinementPosters(new Set(item.config.refinementPosters));
        } else {
          setSelectedRefinementPosters(new Set());
        }
        
        if (item.config.applicationPosters) {
          setSelectedApplicationPosters(new Set(item.config.applicationPosters));
        } else {
          setSelectedApplicationPosters(new Set());
        }
        
        // Configurar distribución
        if (item.config.distributionRule) {
          setDistributionRule(item.config.distributionRule as typeof distributionRule);
        }
        
        // Configurar códigos avanzados
        if (item.name === 'Codigos-color-avanzado') {
          setShowAdvancedCodes(true);
        } else if (item.name === 'Codigos-color') {
          setShowAdvancedCodes(false);
        }

        // Esperar a que React re-renderice
        await new Promise(resolve => setTimeout(resolve, 200));

        // Capturar imagen
        try {
          const canvas = await html2canvas(previewRef.current!, {
            scale: 2,
            backgroundColor: getBgColorSolid(),
            useCORS: true,
            allowTaint: true,
            logging: false,
            onclone: (clonedDoc) => {
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach((element) => {
                if (!(element instanceof HTMLElement)) return;
                const computed = window.getComputedStyle(element);
                const colorProps = ['color', 'background-color', 'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'outline-color', 'text-decoration-color'];
                colorProps.forEach(prop => {
                  const value = computed.getPropertyValue(prop);
                  if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('lab(') || value.includes('lch('))) {
                    const converted = convertColorToRgb(value);
                    element.style.setProperty(prop, converted, 'important');
                  }
                });
              });
            }
          });

          // Convertir a blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/png');
          });

          // Añadir al ZIP en la carpeta correspondiente
          const fileName = `${item.name}.png`;
          
          switch (item.folder) {
            case 'Basicos':
              basicosFolder?.file(fileName, blob);
              break;
            case 'Posters-Estilo':
              postersEstiloFolder?.file(fileName, blob);
              break;
            case 'Posters-Aplicacion':
              postersAplicacionFolder?.file(fileName, blob);
              break;
            case 'Distribucion':
              distribucionFolder?.file(fileName, blob);
              break;
          }

        } catch (captureError) {
          console.error(`Error capturando ${item.name}:`, captureError);
        }
      }

      // Generar y descargar ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${paletteName?.replace(/\s+/g, '-') || 'paleta'}-todos-elementos.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccessNotification(`${paletteName || 'Paleta'}-todos-elementos.zip (${total} archivos)`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorNotification(`Error ZIP: ${errorMessage}`);
    } finally {
      setIsExportingZip(false);
      setZipProgress({ current: 0, total: 0 });
    }
  };

  const getBgColor = () => {
    switch (background) {
      case 'white': return '#ffffff';
      case 'dark': return '#0f0f1a';
      case 'gradient': return `linear-gradient(135deg, ${colors[0]}22, ${colors[colors.length - 1]}22)`;
      case 'custom': return customBg;
    }
  };

  const getBgColorSolid = () => {
    switch (background) {
      case 'white': return '#ffffff';
      case 'dark': return '#0f0f1a';
      case 'gradient': return '#ffffff';
      case 'custom': return customBg;
    }
  };

  const getTextColor = () => background === 'dark' || (background === 'custom' && hexToHsl(customBg).l < 50) ? '#ffffff' : '#1a1a2e';
  const getSubtextColor = () => background === 'dark' || (background === 'custom' && hexToHsl(customBg).l < 50) ? '#a0a0b0' : '#666680';

  const getBorderRadiusValue = () => {
    switch (borderRadius) {
      case 'none': return '0';
      case 'small': return '8px';
      case 'medium': return '16px';
      case 'large': return '24px';
    }
  };

  const generateCode = () => {
    switch (codeFormat) {
      case 'css':
        return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n  \n  /* RGB */\n${colors.map((c, i) => {
          const rgb = hexToRgb(c);
          return `  --color-${i + 1}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
        }).join('\n')}\n}`;
      case 'scss':
        return `// ${paletteName}\n${colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n')}\n\n$palette: (\n${colors.map((c, i) => `  "${i + 1}": ${c}`).join(',\n')}\n);`;
      case 'json':
        return JSON.stringify({
          name: paletteName,
          colors: colors.map((c) => ({
            hex: c,
            rgb: hexToRgb(c),
            hsl: hexToHsl(c),
            cmyk: hexToCmyk(c),
            name: getColorName(c)
          }))
        }, null, 2);
      case 'tailwind':
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${colors.map((c, i) => `          '${(i + 1) * 100}': '${c}'`).join(',\n')}\n        }\n      }\n    }\n  }\n}`;
      case 'swift':
        return `// Swift / SwiftUI\nimport SwiftUI\n\nextension Color {\n${colors.map((c, i) => {
          const rgb = hexToRgb(c);
          return `    static let palette${i + 1} = Color(red: ${(rgb.r/255).toFixed(3)}, green: ${(rgb.g/255).toFixed(3)}, blue: ${(rgb.b/255).toFixed(3)})`;
        }).join('\n')}\n}`;
      case 'kotlin':
        return `// Kotlin / Jetpack Compose\nimport androidx.compose.ui.graphics.Color\n\nobject Palette {\n${colors.map((c, i) => `    val color${i + 1} = Color(0xFF${c.slice(1).toUpperCase()})`).join('\n')}\n}`;
    }
  };

  const convertColorToRgb = (colorValue: string): string => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'none' || colorValue === 'rgba(0, 0, 0, 0)') {
      return colorValue;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return colorValue;
      
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorValue;
      ctx.fillRect(0, 0, 1, 1);
      
      const data = ctx.getImageData(0, 0, 1, 1).data;
      
      if (data[3] === 0) return 'transparent';
      if (data[3] < 255) {
        return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3] / 255).toFixed(3)})`;
      }
      return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    } catch {
      return colorValue;
    }
  };

  const handleExport = async () => {
    if (!previewRef.current) {
      showErrorNotification('Error: No se encontró el elemento de vista previa');
      return;
    }
    
    if (enabledElements.length === 0) {
      showErrorNotification('Error: No hay elementos seleccionados para exportar');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const scale = exportSize === '1x' ? 1 : exportSize === '2x' ? 2 : 3;
      const bgColor = getBgColorSolid();
      
      if (format === 'svg') {
        try {
          const svgContent = generateSVG();
          const blob = new Blob([svgContent], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${paletteName?.replace(/\s+/g, '-') || 'paleta'}.svg`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showSuccessNotification(`${paletteName || 'Paleta'}.svg`);
        } catch (svgError) {
          showErrorNotification(`Error SVG: ${svgError instanceof Error ? svgError.message : String(svgError)}`);
        }
        setIsExporting(false);
        return;
      }
      
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(previewRef.current, {
          scale: scale,
          backgroundColor: bgColor,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc) => {
            const allElements = clonedDoc.querySelectorAll('*');
            
            allElements.forEach((element) => {
              if (!(element instanceof HTMLElement)) return;
              
              const computed = window.getComputedStyle(element);
              
              const colorProps = [
                'color', 'background-color', 'border-color',
                'border-top-color', 'border-right-color', 
                'border-bottom-color', 'border-left-color',
                'outline-color', 'text-decoration-color'
              ];
              
              colorProps.forEach(prop => {
                const value = computed.getPropertyValue(prop);
                if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('lab(') || value.includes('lch('))) {
                  const converted = convertColorToRgb(value);
                  element.style.setProperty(prop, converted, 'important');
                }
              });
              
              const boxShadow = computed.getPropertyValue('box-shadow');
              if (boxShadow && boxShadow !== 'none' && (boxShadow.includes('oklab') || boxShadow.includes('oklch'))) {
                let converted = boxShadow;
                const colorRegex = /(oklab|oklch|lab|lch)\([^)]+\)/g;
                const matches = boxShadow.match(colorRegex);
                if (matches) {
                  matches.forEach(match => {
                    converted = converted.replace(match, convertColorToRgb(match));
                  });
                }
                element.style.setProperty('box-shadow', converted, 'important');
              }
              
              const bgImage = computed.getPropertyValue('background-image');
              if (bgImage && bgImage !== 'none' && (bgImage.includes('oklab') || bgImage.includes('oklch'))) {
                let converted = bgImage;
                const colorRegex = /(oklab|oklch|lab|lch)\([^)]+\)/g;
                const matches = bgImage.match(colorRegex);
                if (matches) {
                  matches.forEach(match => {
                    converted = converted.replace(match, convertColorToRgb(match));
                  });
                }
                element.style.setProperty('background-image', converted, 'important');
              }
            });
          }
        });
      } catch (canvasError) {
        showErrorNotification(`Error al capturar: ${canvasError instanceof Error ? canvasError.message : String(canvasError)}`);
        setIsExporting(false);
        return;
      }
      
      if (format === 'png') {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${paletteName?.replace(/\s+/g, '-') || 'paleta'}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showSuccessNotification(`${paletteName || 'Paleta'}.png`);
        } catch (pngError) {
          showErrorNotification(`Error PNG: ${pngError instanceof Error ? pngError.message : String(pngError)}`);
        }
      } else if (format === 'pdf') {
        try {
          const imgData = canvas.toDataURL('image/png');
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          
          const isLandscape = canvasWidth > canvasHeight;
          
          const pdf = new jsPDF({
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'pt',
            format: 'a4'
          });
          
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
          const imgDisplayWidth = canvasWidth * ratio * 0.9;
          const imgDisplayHeight = canvasHeight * ratio * 0.9;
          
          const xOffset = (pageWidth - imgDisplayWidth) / 2;
          const yOffset = (pageHeight - imgDisplayHeight) / 2;
          
          pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgDisplayWidth, imgDisplayHeight);
          pdf.save(`${paletteName?.replace(/\s+/g, '-') || 'paleta'}.pdf`);
          showSuccessNotification(`${paletteName || 'Paleta'}.pdf`);
        } catch (pdfError) {
          showErrorNotification(`Error PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
        }
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);
      showErrorNotification(`Error: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  const showSuccessNotification = (fileName: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    notification.innerHTML = `✓ ${fileName} descargado`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };
  
  const showErrorNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 max-w-md';
    notification.innerHTML = `
      <div class="font-semibold mb-1">✕ Error al exportar</div>
      <div class="text-sm opacity-90">${message}</div>
      <div class="text-xs mt-2 opacity-70">Revisa la consola del navegador (F12) para más detalles</div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 8000);
  };
  
  const generateSVG = () => {
    const width = 595; // A4 width in points
    const height = enabledElements.length * 100 + 100;
    const colorWidth = width / colors.length;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${getBgColorSolid()}"/>
  ${elements.find(e => e.id === 'title' && e.enabled) ? `
  <text x="40" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${getTextColor()}">${paletteName || 'Mi Paleta'}</text>
  ` : ''}
  ${elements.find(e => e.id === 'palette-strip' && e.enabled) ? colors.map((color, i) => `
  <rect x="${i * colorWidth}" y="80" width="${colorWidth}" height="120" fill="${color}"/>
  ${showCodesUnderPalette ? `<text x="${i * colorWidth + colorWidth/2}" y="220" font-family="monospace" font-size="12" fill="${getTextColor()}" text-anchor="middle">${color.toUpperCase()}</text>` : ''}
  `).join('') : ''}
</svg>`;
  };

  // Renderizar pósters de estilo
  const renderRefinementPoster = (style: string) => {
    const textColor = getTextColor();
    const styles: Record<string, React.ReactNode> = {
      bold: (
        <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: colors[0], padding: '1.5rem', minHeight: '180px' }}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-white/60 text-sm font-mono">001</span>
            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: colors[1] || '#fff', opacity: 0.8 }} />
          </div>
          <div className="text-white text-4xl font-black leading-none mb-2">BOLD</div>
          <div className="text-white text-4xl font-black leading-none opacity-50">DESIGN</div>
          <div className="mt-6 flex gap-2">
            {colors.slice(1, 4).map((c, i) => (
              <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      ),
      minimal: (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[0] }} />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">Minimal</span>
          </div>
          <div>
            <div className="text-gray-900 text-3xl font-light mb-2">Less is</div>
            <div className="text-3xl font-semibold" style={{ color: colors[0] }}>More</div>
          </div>
          <div className="flex gap-2 mt-4">
            {colors.map((c, i) => (
              <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      ),
      elegant: (
        <div className="rounded-xl overflow-hidden shadow-lg p-6 min-h-[180px]" style={{ backgroundColor: '#0a0a0f' }}>
          <div className="text-center">
            <div className="text-gray-500 text-xs tracking-[0.3em] uppercase mb-4">Collection</div>
            <div className="text-white text-3xl font-serif italic mb-2">Elegance</div>
            <div className="w-12 h-px mx-auto my-3" style={{ backgroundColor: colors[0] }} />
            <div className="text-gray-400 text-sm">2024</div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {colors.map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full ring-2 ring-white/10" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      ),
      geometric: (
        <div className="rounded-xl overflow-hidden shadow-lg relative min-h-[180px]" style={{ backgroundColor: colors[colors.length - 1] || '#1a1a2e' }}>
          <div className="absolute top-4 left-4 w-20 h-20 rotate-45" style={{ backgroundColor: colors[0], opacity: 0.8 }} />
          <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full" style={{ backgroundColor: colors[1] || colors[0] }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-transparent" style={{ borderBottomColor: colors[2] || colors[0] }} />
          </div>
          <div className="absolute bottom-4 left-4 text-white font-bold text-lg">GEO</div>
          <div className="absolute top-4 right-4 text-white/60 text-xs">SHAPES</div>
        </div>
      ),
      editorial: (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white min-h-[180px] grid grid-cols-2">
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="text-gray-400 text-xs mb-2">ISSUE 01</div>
              <div className="text-gray-900 text-xl font-bold leading-tight">The Art of Color</div>
            </div>
            <div className="flex gap-1">
              {colors.slice(0, 3).map((c, i) => (
                <div key={i} className="w-3 h-3 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="relative" style={{ backgroundColor: colors[0] }}>
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-5xl font-black">M</div>
          </div>
        </div>
      ),
      swiss: (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white p-5 min-h-[180px]">
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {colors.slice(0, 3).map((c, i) => (
              <div key={i} className="h-16" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="text-gray-900 text-xs font-mono uppercase tracking-wider mb-1">Swiss Design</div>
          <div className="text-gray-900 text-2xl font-bold">Helvetica.</div>
          <div className="flex gap-2 mt-3">
            {colors.map((c, i) => (
              <div key={i} className="text-[8px] font-mono" style={{ color: c }}>{c}</div>
            ))}
          </div>
        </div>
      ),
    };
    
    return (
      <div key={`refinement-${style}`} className="mb-4">
        <div className="text-xs text-gray-400 mb-2 capitalize" style={{ color: textColor, opacity: 0.6 }}>{style}</div>
        {styles[style]}
      </div>
    );
  };

  const renderApplicationPoster = (style: string) => {
    const textColor = getTextColor();
    const styles: Record<string, React.ReactNode> = {
      evento: (
        <div className="rounded-xl overflow-hidden shadow-lg p-5 relative min-h-[180px]" style={{ backgroundColor: colors[0] }}>
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-30" style={{ backgroundColor: colors[1] || '#fff' }} />
          <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: colors[2] || '#fff' }} />
          <div className="relative z-10">
            <div className="text-white/60 text-xs mb-3 font-mono">24.12.2024</div>
            <div className="text-white text-3xl font-black mb-1">FESTIVAL</div>
            <div className="text-white/80 text-lg font-light">of colors</div>
            <div className="mt-4 inline-block px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors[1] || '#fff', color: colors[0] }}>
              Get tickets
            </div>
          </div>
        </div>
      ),
      producto: (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white min-h-[180px] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">New Release</div>
              <div className="text-gray-900 text-xl font-bold">Product X</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: colors[0] }}>$99</div>
            </div>
          </div>
          <div className="h-20 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: `${colors[0]}15` }}>
            <div className="w-12 h-12 rounded-xl shadow-lg" style={{ backgroundColor: colors[0] }} />
          </div>
          <div className="flex gap-2">
            {colors.map((c, i) => (
              <button key={i} className="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-transparent" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      ),
      artistico: (
        <div className="rounded-xl overflow-hidden shadow-lg relative min-h-[180px]" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length - 1]})` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full blur-2xl opacity-50" style={{ backgroundColor: colors[1] || '#fff' }} />
          </div>
          <div className="relative p-5 flex flex-col justify-between min-h-[180px]">
            <div className="text-white/80 text-xs font-mono">ART.2024</div>
            <div>
              <div className="text-white text-4xl font-black italic">Arte</div>
              <div className="text-white/60 text-base">Visual Experience</div>
            </div>
          </div>
        </div>
      ),
      tipografico: (
        <div className="rounded-xl overflow-hidden shadow-lg min-h-[180px] p-5" style={{ backgroundColor: colors[0] }}>
          <div className="flex flex-col justify-between min-h-[156px]">
            <div className="text-white/40 text-6xl font-black leading-none">Aa</div>
            <div>
              <div className="text-white text-lg font-light mb-1">Typography</div>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/30 rounded" />
                <span className="text-white/60 text-xs">2024</span>
              </div>
            </div>
          </div>
        </div>
      ),
      geometrico: (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white min-h-[180px] p-0 relative">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-gray-100" style={{ backgroundColor: i % 2 === 0 ? colors[i % colors.length] + '15' : 'transparent' }} />
            ))}
          </div>
          <div className="relative z-10 p-5 flex flex-col justify-between min-h-[180px]">
            <div className="flex gap-1.5">
              {colors.slice(0, 3).map((c, i) => (
                <div key={i} className="w-3 h-3" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div>
              <div className="text-gray-900 text-2xl font-bold">Grid</div>
              <div className="text-gray-400 text-sm">System</div>
            </div>
          </div>
        </div>
      ),
    };
    
    return (
      <div key={`application-${style}`} className="mb-4">
        <div className="text-xs text-gray-400 mb-2 capitalize" style={{ color: textColor, opacity: 0.6 }}>{style}</div>
        {styles[style]}
      </div>
    );
  };

  const renderDistribution = () => {
    const textColor = getTextColor();
    const distributions: Record<string, number[]> = {
      '60-30-10': [60, 30, 10],
      'golden': [61.8, 23.6, 14.6],
      '50-30-20': [50, 30, 20],
      'equal': colors.map(() => 100 / colors.length),
    };
    
    const percentages = distributions[distributionRule];
    const displayColors = colors.slice(0, percentages.length);
    
    return (
      <div className="space-y-4">
        <div className="text-xs mb-2" style={{ color: textColor, opacity: 0.6 }}>Distribución: {distributionRule}</div>
        <div className="h-14 rounded-xl overflow-hidden flex shadow-lg">
          {displayColors.map((color, i) => (
            <div 
              key={i}
              className="flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: color, width: `${percentages[i]}%` }}
            >
              {percentages[i].toFixed(0)}%
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: displayColors[0] || '#ccc' }}>
            <div className="p-3 min-h-[80px] flex flex-col justify-between">
              <div className="text-white/80 text-[10px]">Fondo</div>
              <div className="flex items-end gap-1.5">
                <div className="w-10 h-5 rounded" style={{ backgroundColor: displayColors[1] || '#fff' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: displayColors[2] || '#fff' }} />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="h-6" style={{ backgroundColor: displayColors[0] || '#ccc' }} />
            <div className="p-2.5">
              <div className="h-1.5 w-3/4 rounded mb-1.5" style={{ backgroundColor: displayColors[1] || '#ccc' }} />
              <div className="h-1.5 w-1/2 rounded mb-2" style={{ backgroundColor: '#e0e0e0' }} />
              <div className="h-4 w-10 rounded" style={{ backgroundColor: displayColors[2] || displayColors[0] || '#ccc' }} />
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg p-3 min-h-[80px]" style={{ backgroundColor: displayColors[0] || '#ccc' }}>
            <div className="text-white text-base font-bold mb-1.5" style={{ color: displayColors[1] || '#fff' }}>Título</div>
            <div className="h-1.5 w-full rounded mb-1 bg-white/30" />
            <div className="h-1.5 w-3/4 rounded mb-2 bg-white/30" />
            <span className="text-[10px] underline" style={{ color: displayColors[2] || '#fff' }}>Enlace →</span>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar elementos de la vista previa
  const renderElement = (element: ExportElement) => {
    const textColor = getTextColor();
    const subtextColor = getSubtextColor();

    switch (element.id) {
      case 'title':
        return (
          <div key={element.id} className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: textColor }}>
              {paletteName || 'Mi Paleta'}
            </h2>
            <p className="text-sm mt-1" style={{ color: subtextColor }}>
              {colors.length} colores • Palette Studio
            </p>
          </div>
        );

      case 'palette-strip':
        return (
          <div key={element.id} className="mb-6">
            <div 
              className="flex overflow-hidden shadow-lg"
              style={{ borderRadius: getBorderRadiusValue() }}
            >
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-24 relative"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {showCodesUnderPalette && (
              <div className="flex mt-3">
                {colors.map((color, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span 
                      className="text-xs font-mono font-medium px-2 py-1 rounded"
                      style={{ 
                        color: textColor,
                        backgroundColor: background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'color-codes':
        return (
          <div key={element.id} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: textColor }}>Códigos de color</h3>
              <button
                onClick={() => setShowAdvancedCodes(!showAdvancedCodes)}
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{ 
                  backgroundColor: showAdvancedCodes ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.1)',
                  color: showAdvancedCodes ? '#a78bfa' : subtextColor
                }}
              >
                {showAdvancedCodes ? '✓ Avanzado' : 'Avanzado'}
              </button>
            </div>
            <div className={`grid gap-3 ${showAdvancedCodes ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-3 lg:grid-cols-5'}`}>
              {colors.map((color, i) => {
                const rgb = hexToRgb(color);
                const hsl = hexToHsl(color);
                const cmyk = hexToCmyk(color);
                return (
                  <div 
                    key={i} 
                    className="rounded-xl overflow-hidden"
                    style={{ 
                      backgroundColor: background === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
                    }}
                  >
                    <div 
                      className={`w-full ${showAdvancedCodes ? 'h-20' : 'h-14'}`}
                      style={{ backgroundColor: color }}
                    />
                    <div className="p-3">
                      <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>
                        {getColorName(color)}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono" style={{ color: subtextColor }}>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>HEX</span>
                          <span className="font-medium">{color.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono" style={{ color: subtextColor }}>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>RGB</span>
                          <span>{rgb.r}, {rgb.g}, {rgb.b}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono" style={{ color: subtextColor }}>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)', color: '#fb923c' }}>HSL</span>
                          <span>{hsl.h}° {hsl.s}% {hsl.l}%</span>
                        </div>
                        {showAdvancedCodes && (
                          <>
                            <div className="flex items-center justify-between text-xs font-mono" style={{ color: subtextColor }}>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>CMYK</span>
                              <span>{cmyk.c}% {cmyk.m}% {cmyk.y}% {cmyk.k}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono" style={{ color: subtextColor }}>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>LUM</span>
                              <span>{hsl.l}%</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'color-wheel':
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Rueda cromática</h3>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {Array.from({ length: 72 }).map((_, i) => {
                    const startAngle = (i * 5 - 90) * (Math.PI / 180);
                    const endAngle = ((i + 1) * 5 - 90) * (Math.PI / 180);
                    const innerRadius = 32;
                    const outerRadius = 46;
                    
                    const x1 = 50 + Math.cos(startAngle) * innerRadius;
                    const y1 = 50 + Math.sin(startAngle) * innerRadius;
                    const x2 = 50 + Math.cos(startAngle) * outerRadius;
                    const y2 = 50 + Math.sin(startAngle) * outerRadius;
                    const x3 = 50 + Math.cos(endAngle) * outerRadius;
                    const y3 = 50 + Math.sin(endAngle) * outerRadius;
                    const x4 = 50 + Math.cos(endAngle) * innerRadius;
                    const y4 = 50 + Math.sin(endAngle) * innerRadius;
                    
                    return (
                      <path
                        key={i}
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
                        fill={`hsl(${i * 5}, 70%, 50%)`}
                        opacity="0.8"
                      />
                    );
                  })}
                  
                  <circle cx="50" cy="50" r="28" fill={background === 'dark' ? '#1a1a2e' : '#ffffff'} />
                  
                  {colors.map((color, i) => {
                    const hsl = hexToHsl(color);
                    const angle = (hsl.h - 90) * (Math.PI / 180);
                    const x = 50 + Math.cos(angle) * 39;
                    const y = 50 + Math.sin(angle) * 39;
                    return (
                      <line 
                        key={`line-${i}`}
                        x1="50" 
                        y1="50" 
                        x2={x} 
                        y2={y} 
                        stroke={color} 
                        strokeWidth="2" 
                        opacity="0.6"
                        strokeDasharray="2,2"
                      />
                    );
                  })}
                  
                  {colors.map((color, i) => {
                    const hsl = hexToHsl(color);
                    const angle = (hsl.h - 90) * (Math.PI / 180);
                    const x = 50 + Math.cos(angle) * 39;
                    const y = 50 + Math.sin(angle) * 39;
                    return (
                      <g key={`color-${i}`}>
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="8" 
                          fill={color} 
                          stroke="#fff" 
                          strokeWidth="2.5"
                        />
                        <text 
                          x={x} 
                          y={y + 0.5} 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          fontSize="6" 
                          fill="#fff" 
                          fontWeight="bold"
                        >
                          {i + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {colors.map((color, i) => {
                const hsl = hexToHsl(color);
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <div 
                      className="w-4 h-4 rounded-full ring-2 ring-white/20" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono" style={{ color: subtextColor }}>
                      {hsl.h}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'gradient':
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Gradiente</h3>
            <div 
              className="h-14 shadow-lg"
              style={{ 
                borderRadius: getBorderRadiusValue(),
                background: `linear-gradient(to right, ${colors.join(', ')})`
              }}
            />
          </div>
        );

      case 'refinement-poster':
        if (selectedRefinementPosters.size === 0) {
          return (
            <div key={element.id} className="mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>
                Pósters Estilo
              </h3>
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-800/30 rounded-xl">
                Selecciona al menos un estilo de póster en la pestaña "Pósters"
              </div>
            </div>
          );
        }
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>
              Pósters Estilo ({selectedRefinementPosters.size})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from(selectedRefinementPosters).map(style => (
                <div key={`ref-${style}`}>
                  {renderRefinementPoster(style)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'application-poster':
        if (selectedApplicationPosters.size === 0) {
          return (
            <div key={element.id} className="mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>
                Pósters Aplicación
              </h3>
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-800/30 rounded-xl">
                Selecciona al menos un estilo de póster en la pestaña "Pósters"
              </div>
            </div>
          );
        }
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>
              Pósters Aplicación ({selectedApplicationPosters.size})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from(selectedApplicationPosters).map(style => (
                <div key={`app-${style}`}>
                  {renderApplicationPoster(style)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'distribution':
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>
              Distribución de colores
            </h3>
            {renderDistribution()}
          </div>
        );

      case 'contrast-matrix':
        return (
          <div key={element.id} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Matriz de contraste</h3>
            <div 
              className="overflow-x-auto rounded-xl p-3"
              style={{ backgroundColor: background === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            >
              <table className="text-xs w-full">
                <tbody>
                  <tr>
                    <td className="w-8"></td>
                    {colors.map((c, i) => (
                      <td key={i} className="p-1 text-center">
                        <div className="w-6 h-6 rounded-lg mx-auto shadow-sm" style={{ backgroundColor: c }} />
                      </td>
                    ))}
                  </tr>
                  {colors.map((c1, i) => (
                    <tr key={i}>
                      <td className="p-1">
                        <div className="w-6 h-6 rounded-lg shadow-sm" style={{ backgroundColor: c1 }} />
                      </td>
                      {colors.map((c2, j) => {
                        const l1 = hexToHsl(c1).l / 100;
                        const l2 = hexToHsl(c2).l / 100;
                        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                        const isGood = ratio >= 4.5;
                        const isOk = ratio >= 3;
                        return (
                          <td 
                            key={j} 
                            className="p-1 text-center font-mono font-medium"
                            style={{ 
                              color: i === j ? subtextColor : isGood ? '#22c55e' : isOk ? '#eab308' : '#ef4444'
                            }}
                          >
                            {i === j ? '—' : ratio.toFixed(1)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-center gap-3 mt-2 text-[9px]" style={{ color: subtextColor }}>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ≥4.5 AA</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> ≥3 AA Large</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> &lt;3 Fallo</span>
              </div>
            </div>
          </div>
        );

      case 'harmony-info':
        return (
          <div key={element.id} className="mb-6">
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: background === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${background === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`
              }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Información de la paleta</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: colors[0] }}>{colors.length}</div>
                  <div className="text-[9px] uppercase tracking-wide" style={{ color: subtextColor }}>Colores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: colors[1] || colors[0] }}>
                    {Math.round(colors.reduce((acc, c) => acc + hexToHsl(c).s, 0) / colors.length)}%
                  </div>
                  <div className="text-[9px] uppercase tracking-wide" style={{ color: subtextColor }}>Saturación</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: colors[2] || colors[0] }}>
                    {Math.round(colors.reduce((acc, c) => acc + hexToHsl(c).l, 0) / colors.length)}%
                  </div>
                  <div className="text-[9px] uppercase tracking-wide" style={{ color: subtextColor }}>Luminosidad</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: colors[3] || colors[0] }}>
                    {Math.max(...colors.map(c => hexToHsl(c).h)) - Math.min(...colors.map(c => hexToHsl(c).h))}°
                  </div>
                  <div className="text-[9px] uppercase tracking-wide" style={{ color: subtextColor }}>Rango tonal</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div key={element.id} className="pt-4 mt-4 border-t" style={{ borderColor: background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between text-xs" style={{ color: subtextColor }}>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})` }} />
                Generado con Palette Studio
              </span>
              <span>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const basicElements = elements.filter(e => e.category === 'basic' || e.category === 'info' || e.category === 'visual');
  const allBasicEnabled = basicElements.every(e => e.enabled);
  const someBasicEnabled = basicElements.some(e => e.enabled);

  return (
    <div className="space-y-6">
      {/* Descarga rápida con presets - CON PARTÍCULAS */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-5 border border-purple-500/30">
        <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Descarga rápida
          <span className="text-xs text-gray-400 font-normal ml-2">— Presets optimizados listos para usar</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {quickDownloadPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleQuickDownload(preset.id)}
              onMouseEnter={() => setHoveredPreset(preset.id)}
              onMouseLeave={() => setHoveredPreset(null)}
              disabled={isExporting || isExportingZip}
              className="group relative bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 hover:border-purple-500/50 rounded-xl p-4 text-left transition-all hover:scale-[1.02] disabled:opacity-50 overflow-hidden"
            >
              {/* Partículas */}
              <ButtonParticles 
                isHovered={hoveredPreset === preset.id} 
                color={preset.color} 
                intensity="medium"
              />
              
              <div className="relative z-10">
                <div className="text-2xl mb-2">{preset.icon}</div>
                <div className="text-sm font-medium text-gray-200 mb-1">{preset.name}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{preset.description}</div>
              </div>
              
              {/* Indicador de descarga al hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: preset.color }}>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </button>
          ))}

          {/* Botón Todo ZIP */}
          <button
            onClick={handleExportAllZip}
            onMouseEnter={() => setHoveredPreset('zip')}
            onMouseLeave={() => setHoveredPreset(null)}
            disabled={isExporting || isExportingZip}
            className="group relative bg-gradient-to-br from-amber-900/40 to-orange-900/40 hover:from-amber-800/50 hover:to-orange-800/50 border border-amber-500/30 hover:border-amber-400/50 rounded-xl p-4 text-left transition-all hover:scale-[1.02] disabled:opacity-50 overflow-hidden"
          >
            {/* Partículas */}
            <ButtonParticles 
              isHovered={hoveredPreset === 'zip'} 
              color="#f59e0b" 
              intensity="medium"
            />
            
            <div className="relative z-10">
              {isExportingZip ? (
                <>
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-sm font-medium text-amber-200 mb-1">
                    {zipProgress.current}/{zipProgress.total}
                  </div>
                  <div className="text-[10px] text-amber-300/70 leading-tight">Exportando...</div>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-sm font-medium text-amber-200 mb-1">Todo ZIP</div>
                  <div className="text-[10px] text-amber-300/70 leading-tight">Cada elemento por separado</div>
                </>
              )}
            </div>
            
            {/* Indicador de descarga al hover */}
            {!isExportingZip && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-amber-500">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
          <span className="text-xs text-gray-400">Formato de descarga:</span>
          <div className="flex gap-2">
            {(['png', 'svg', 'pdf'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  format === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                .{f.toUpperCase()}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-auto">
            Click en cualquier preset para descargar con el formato seleccionado
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-700/50"></div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">O personaliza tu exportación</span>
        <div className="flex-1 h-px bg-gray-700/50"></div>
      </div>

      {/* Panel de configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1: Formato y estilo */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Formato
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'svg', 'pdf'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    format === f
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  .{f.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Tamaño</h4>
              <div className="flex gap-1">
                {(['1x', '2x', '3x'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setExportSize(size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      exportSize === size
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estilo visual */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Estilo
            </h3>
            
            <h4 className="text-xs font-medium text-gray-400 mb-2">Fondo</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { id: 'dark', label: 'Oscuro', color: '#0f0f1a' },
                { id: 'white', label: 'Claro', color: '#ffffff' },
                { id: 'gradient', label: 'Grad.', color: `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length-1]})` },
                { id: 'custom', label: 'Custom', color: customBg },
              ].map(bg => (
                <button
                  key={bg.id}
                  onClick={() => {
                    setBackground(bg.id as typeof background);
                    if (bg.id === 'custom') setShowColorPicker(true);
                  }}
                  className={`relative h-12 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    background === bg.id
                      ? 'border-purple-500 scale-105'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ background: bg.color }}
                >
                  <span className={`text-[10px] font-medium ${bg.id === 'white' ? 'text-gray-600' : 'text-white'}`}>{bg.label}</span>
                </button>
              ))}
            </div>
            
            {/* Color picker mejorado */}
            <AnimatePresence>
              {(background === 'custom' || showColorPicker) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-lg cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: customBg }}
                      >
                        <input
                          type="color"
                          value={customBg}
                          onChange={(e) => setCustomBg(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customBg}
                          onChange={(e) => setCustomBg(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {['#1a1a2e', '#0d1b2a', '#2d3436', '#1e3a5f', '#2c1810', '#1a2f1a'].map(color => (
                        <button
                          key={color}
                          onClick={() => setCustomBg(color)}
                          className={`w-8 h-8 rounded-lg transition-all ${customBg === color ? 'ring-2 ring-purple-500 scale-110' : 'hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Luminosidad</span>
                          <span>{hexToHsl(customBg).l}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={hexToHsl(customBg).l}
                          onChange={(e) => {
                            const hsl = hexToHsl(customBg);
                            const l = parseInt(e.target.value);
                            setCustomBg(hslToHex(hsl.h, hsl.s, l));
                          }}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #000, ${customBg}, #fff)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Bordes</h4>
                <div className="flex gap-1">
                  {[
                    { id: 'none', label: '—' },
                    { id: 'small', label: 'S' },
                    { id: 'medium', label: 'M' },
                    { id: 'large', label: 'L' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setBorderRadius(r.id as typeof borderRadius)}
                      className={`flex-1 py-2 text-xs font-medium transition-all ${
                        borderRadius === r.id
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                      style={{ borderRadius: r.id === 'none' ? '4px' : r.id === 'small' ? '6px' : r.id === 'medium' ? '8px' : '12px' }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Borde exterior</h4>
                <button
                  onClick={() => setShowBorder(!showBorder)}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    showBorder ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-gray-700/50 text-gray-400'
                  }`}
                >
                  {showBorder ? '✓ Visible' : 'Oculto'}
                </button>
              </div>
            </div>
          </div>

          {/* Código */}
          <button
            onClick={() => setShowCodeModal(true)}
            className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all text-left group"
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Exportar código
              <svg className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </h3>
            <p className="text-xs text-gray-400">CSS, SCSS, JSON, Tailwind, Swift, Kotlin</p>
          </button>
        </div>

        {/* Columna 2: Elementos */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Elementos del exportable
            </h3>

            {/* Category tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'basic', label: 'Básicos', icon: '📋' },
                { id: 'posters', label: 'Pósters', icon: '🖼️' },
                { id: 'distribution', label: 'Distribución', icon: '📊' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeCategory === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Botón marcar/desmarcar todos */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => toggleAllBasic(!allBasicEnabled)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                        allBasicEnabled 
                          ? 'bg-purple-600/30 text-purple-300' 
                          : someBasicEnabled 
                            ? 'bg-gray-700/50 text-gray-300'
                            : 'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      {allBasicEnabled ? '✓ Desmarcar todos' : 'Marcar todos'}
                    </button>
                  </div>

                  <Reorder.Group 
                    axis="y" 
                    values={basicElements} 
                    onReorder={(newOrder) => {
                      const otherElements = elements.filter(e => e.category === 'poster' || e.category === 'distribution');
                      setElements([...newOrder, ...otherElements]);
                    }}
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
                  >
                    {basicElements.map((element) => (
                      <Reorder.Item
                        key={element.id}
                        value={element}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-move transition-all ${
                          element.enabled 
                            ? 'bg-purple-600/20 border border-purple-500/30' 
                            : 'bg-gray-700/30 border border-gray-700/50 opacity-60'
                        }`}
                      >
                        <span className="text-gray-500 cursor-grab hover:text-gray-300">⋮⋮</span>
                        <span className="text-lg">{element.icon}</span>
                        <span className="text-sm text-gray-200 flex-1">{element.name}</span>
                        {element.id === 'palette-strip' && element.enabled && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowCodesUnderPalette(!showCodesUnderPalette); }}
                            className={`text-[10px] px-2 py-1 rounded-lg transition-all ${
                              showCodesUnderPalette ? 'bg-purple-600/50 text-purple-200' : 'bg-gray-700/50 text-gray-400'
                            }`}
                          >
                            {showCodesUnderPalette ? 'Códigos ✓' : 'Códigos'}
                          </button>
                        )}
                        {element.id === 'color-codes' && element.enabled && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowAdvancedCodes(!showAdvancedCodes); }}
                            className={`text-[10px] px-2 py-1 rounded-lg transition-all ${
                              showAdvancedCodes ? 'bg-purple-600/50 text-purple-200' : 'bg-gray-700/50 text-gray-400'
                            }`}
                          >
                            {showAdvancedCodes ? 'Avanzado ✓' : 'Avanzado'}
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleElement(element.id); }}
                          className={`w-10 h-6 rounded-full transition-all flex items-center ${element.enabled ? 'bg-purple-600' : 'bg-gray-600'}`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full bg-white transition-all shadow-sm"
                            style={{ marginLeft: element.enabled ? '18px' : '2px' }}
                          />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </motion.div>
              )}

              {activeCategory === 'posters' && (
                <motion.div
                  key="posters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Botón marcar/desmarcar todos */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleAllPosters(selectedRefinementPosters.size === 0 && selectedApplicationPosters.size === 0)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all"
                    >
                      {selectedRefinementPosters.size > 0 || selectedApplicationPosters.size > 0 ? 'Desmarcar todos' : 'Marcar todos'}
                    </button>
                  </div>

                  {/* Refinement posters - MULTICHECK */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <span className="text-sm text-gray-200">Póster Estilo</span>
                        {selectedRefinementPosters.size > 0 && (
                          <span className="text-xs bg-purple-600/50 text-purple-200 px-2 py-0.5 rounded-full">
                            {selectedRefinementPosters.size}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleElement('refinement-poster')}
                        className={`w-10 h-6 rounded-full transition-all flex items-center ${
                          elements.find(e => e.id === 'refinement-poster')?.enabled ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full bg-white transition-all shadow-sm"
                          style={{ marginLeft: elements.find(e => e.id === 'refinement-poster')?.enabled ? '18px' : '2px' }}
                        />
                      </button>
                    </div>
                    
                    {elements.find(e => e.id === 'refinement-poster')?.enabled && (
                      <div className="grid grid-cols-3 gap-2">
                        {(['bold', 'minimal', 'elegant', 'geometric', 'editorial', 'swiss'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => toggleRefinementPoster(style)}
                            className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all capitalize flex items-center justify-center gap-2 ${
                              selectedRefinementPosters.has(style)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {selectedRefinementPosters.has(style) && <span>✓</span>}
                            {style}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Application posters - MULTICHECK */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎭</span>
                        <span className="text-sm text-gray-200">Póster Aplicación</span>
                        {selectedApplicationPosters.size > 0 && (
                          <span className="text-xs bg-purple-600/50 text-purple-200 px-2 py-0.5 rounded-full">
                            {selectedApplicationPosters.size}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleElement('application-poster')}
                        className={`w-10 h-6 rounded-full transition-all flex items-center ${
                          elements.find(e => e.id === 'application-poster')?.enabled ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full bg-white transition-all shadow-sm"
                          style={{ marginLeft: elements.find(e => e.id === 'application-poster')?.enabled ? '18px' : '2px' }}
                        />
                      </button>
                    </div>
                    
                    {elements.find(e => e.id === 'application-poster')?.enabled && (
                      <div className="grid grid-cols-3 gap-2">
                        {(['evento', 'producto', 'artistico', 'tipografico', 'geometrico'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => toggleApplicationPoster(style)}
                            className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all capitalize flex items-center justify-center gap-2 ${
                              selectedApplicationPosters.has(style)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {selectedApplicationPosters.has(style) && <span>✓</span>}
                            {style}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeCategory === 'distribution' && (
                <motion.div
                  key="distribution"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Botón marcar/desmarcar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleAllDistribution(!elements.find(e => e.id === 'distribution')?.enabled)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all"
                    >
                      {elements.find(e => e.id === 'distribution')?.enabled ? 'Desmarcar' : 'Marcar'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <span className="text-sm text-gray-200">Mostrar distribución</span>
                    </div>
                    <button
                      onClick={() => toggleElement('distribution')}
                      className={`w-10 h-6 rounded-full transition-all flex items-center ${
                        elements.find(e => e.id === 'distribution')?.enabled ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full bg-white transition-all shadow-sm"
                        style={{ marginLeft: elements.find(e => e.id === 'distribution')?.enabled ? '18px' : '2px' }}
                      />
                    </button>
                  </div>

                  {elements.find(e => e.id === 'distribution')?.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: '60-30-10', name: 'Regla 60-30-10', desc: 'Clásica para interiores' },
                          { id: 'golden', name: 'Proporción Áurea', desc: 'Basada en φ (1.618)' },
                          { id: '50-30-20', name: 'Regla 50-30-20', desc: 'Equilibrio moderno' },
                          { id: 'equal', name: 'Distribución igual', desc: 'Partes iguales' },
                        ].map(rule => (
                          <button
                            key={rule.id}
                            onClick={() => setDistributionRule(rule.id as typeof distributionRule)}
                            className={`p-3 rounded-xl text-left transition-all ${
                              distributionRule === rule.id
                                ? 'bg-purple-600/30 border border-purple-500/50'
                                : 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-200">{rule.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{rule.desc}</div>
                          </button>
                        ))}
                      </div>

                      {/* Preview */}
                      <div className="h-8 rounded-lg overflow-hidden flex">
                        {(distributionRule === '60-30-10' ? [60, 30, 10] :
                          distributionRule === 'golden' ? [61.8, 23.6, 14.6] :
                          distributionRule === '50-30-20' ? [50, 30, 20] :
                          colors.map(() => 100 / colors.length)
                        ).slice(0, colors.length).map((pct, i) => (
                          <div 
                            key={i}
                            className="flex items-center justify-center text-white text-xs font-medium"
                            style={{ backgroundColor: colors[i], width: `${pct}%` }}
                          >
                            {pct.toFixed(0)}%
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Vista previa */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vista previa
            <span className="text-xs text-gray-400 font-normal">({enabledElements.length} elementos)</span>
          </h3>
          <button
            onClick={handleExport}
            disabled={isExporting || enabledElements.length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exportando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar .{format.toUpperCase()}
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center bg-gray-900/50 rounded-xl p-6 overflow-auto">
          <div 
            ref={previewRef}
            data-preview="true"
            className="w-full max-w-3xl overflow-hidden"
            style={{ 
              background: getBgColor(),
              border: showBorder ? `1px solid ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none',
              borderRadius: getBorderRadiusValue(),
              padding: '24px',
              minHeight: 'auto'
            }}
          >
            {enabledElements.map(element => renderElement(element))}
            
            {enabledElements.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium mb-1">Activa elementos para comenzar</p>
                <p className="text-sm text-gray-500">Selecciona los elementos que quieres incluir en tu exportable</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de código */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCodeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Exportar código</h3>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {(['css', 'scss', 'json', 'tailwind', 'swift', 'kotlin'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setCodeFormat(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      codeFormat === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="bg-gray-950 rounded-xl p-4 overflow-auto max-h-[400px] border border-gray-800">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {generateCode()}
                </pre>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateCode());
                    const btn = document.activeElement as HTMLButtonElement;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Copiado!';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                  }}
                  className="px-6 py-2.5 bg-purple-600 rounded-xl text-white font-medium hover:bg-purple-500 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
