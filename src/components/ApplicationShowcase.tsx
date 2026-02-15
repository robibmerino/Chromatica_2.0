import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import InteriorPreview, { type InteriorPalette } from './InteriorPreviews';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

export type SupportPaletteVariant = 'claro' | 'oscuro';

export interface SupportColorItem {
  role: string;
  label: string;
  initial: string;
  hex: string;
}

interface ApplicationShowcaseProps {
  colors: string[];
  paletteName?: string;
  onUpdateColors?: (newColors: string[]) => void;
  /** Paleta de apoyo (según variante claro/oscuro) para recuadro "Tu paleta de apoyo" y selector Estilo */
  supportColorsList?: SupportColorItem[];
  supportVariant?: SupportPaletteVariant;
  setSupportVariant?: (v: SupportPaletteVariant) => void;
  updateSupportColor?: (role: string, hex: string) => void;
}

type EditingInRightColumn =
  | null
  | { type: 'main'; index: number }
  | { type: 'support'; role: string }
  | { type: 'background' };

type CategoryType = 'architecture' | 'poster' | 'branding';

interface VariantInfo {
  id: string;
  name: string;
  icon: string;
}

const categories: { id: CategoryType; name: string; icon: string; tip: string; variants: VariantInfo[] }[] = [
  {
    id: 'architecture',
    name: 'Arquitectura',
    icon: '🏠',
    tip: 'Diseño de interiores: aplica tu paleta a estudios, cafeterías, oficinas y más.',
    variants: [
      { id: 'estudio', name: 'Estudio', icon: '🛋️' },
      { id: 'cafeteria', name: 'Cafetería', icon: '☕' },
      { id: 'oficina', name: 'Oficina', icon: '🏢' },
      { id: 'stand', name: 'Stand corporativo', icon: '🏪' },
      { id: 'fachada', name: 'Fachada corporativa', icon: '🏛️' },
    ]
  },
  {
    id: 'poster',
    name: 'Poster',
    icon: '🖼️',
    tip: 'Carteles y pósters: aplica tu paleta con versión claro/oscuro y paleta de apoyo.',
    variants: [
      { id: 'conference', name: 'Conference', icon: '🎤' },
      { id: 'exhibition-swiss', name: 'Exhibition Swiss', icon: '🔤' },
      { id: 'festival-gig', name: 'Festival Gig', icon: '🎸' },
      { id: 'collage', name: 'Collage', icon: '📢' },
      { id: 'competition', name: 'Competition', icon: '🏆' },
    ]
  },
  {
    id: 'branding',
    name: 'Branding',
    icon: '🎨',
    tip: 'Identidad y territorio visual: misma plantilla A3/A2, modos claro/oscuro y paleta de apoyo.',
    variants: [
      { id: 'territorio-visual', name: 'Territorio visual', icon: '🌿' },
    ]
  },
];

/** Iconos SVG por categoría (24x24) para el menú de aplicación */
const CategoryIcons: Record<CategoryType, React.ReactNode> = {
  architecture: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  poster: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  branding: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

/** Póster: dimensiones y escala compartidas (proporción A3/A2). */
const POSTER_BASE_WIDTH = 620;
const POSTER_HEIGHT = Math.round(POSTER_BASE_WIDTH * Math.SQRT2);
const POSTER_SCALE = 0.78;
/** Altura de referencia 620×826 para pósters Swiss y Festival Gig (escalado a POSTER_HEIGHT). */
const POSTER_REF_HEIGHT = 826;
/** Índices de la rejilla decorativa tipo QR en el pie del póster Conference (celdas rellenas). */
const CONFERENCE_QR_FILL_INDICES = [0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 15];

/** Póster Collage: clip-path de los bloques y URLs de grano (feTurbulence). */
const COLLAGE_CLIP_1 = 'polygon(0% 0%, 100% 0%, 100% 2%, 98% 3%, 100% 5%, 99% 8%, 100% 12%, 98% 18%, 100% 25%, 99% 35%, 100% 45%, 98% 55%, 100% 65%, 99% 72%, 100% 80%, 97% 88%, 100% 92%, 99% 96%, 100% 100%, 0% 100%, 1% 95%, 0% 90%, 2% 85%, 0% 78%, 1% 70%, 0% 60%, 2% 50%, 0% 40%, 1% 30%, 0% 20%, 2% 10%)';
const COLLAGE_CLIP_2 = 'polygon(2% 0%, 5% 2%, 10% 0%, 18% 1%, 25% 0%, 35% 2%, 45% 0%, 55% 1%, 65% 0%, 75% 2%, 85% 0%, 92% 1%, 100% 0%, 100% 100%, 95% 98%, 88% 100%, 80% 99%, 70% 100%, 60% 98%, 50% 100%, 40% 99%, 30% 100%, 20% 98%, 10% 100%, 3% 99%, 0% 100%, 0% 0%)';
const COLLAGE_CLIP_3 = 'polygon(3% 2%, 8% 0%, 15% 3%, 25% 0%, 40% 2%, 55% 0%, 70% 3%, 85% 1%, 95% 3%, 100% 0%, 100% 100%, 97% 97%, 90% 100%, 80% 98%, 65% 100%, 50% 97%, 35% 100%, 20% 98%, 8% 100%, 0% 97%, 0% 3%)';
const COLLAGE_CLIP_5 = 'polygon(0% 5%, 5% 0%, 20% 3%, 40% 0%, 60% 4%, 80% 0%, 95% 2%, 100% 0%, 100% 95%, 95% 100%, 75% 97%, 55% 100%, 35% 98%, 15% 100%, 0% 96%)';
const COLLAGE_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='np'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23np)'/%3E%3C/svg%3E";
const COLLAGE_GRAIN2_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nq'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nq)'/%3E%3C/svg%3E";

/** Póster Competition: URLs de texturas (grano + papel). */
const COMPETITION_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nc'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nc)'/%3E%3C/svg%3E";
const COMPETITION_PAPER_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pc'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pc)'/%3E%3C/svg%3E";

/** Branding Territorio visual: grano y kraft (ids únicos nb, bk). */
const BRANDING_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nb'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nb)'/%3E%3C/svg%3E";
const BRANDING_KRAFT_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bk'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bk)'/%3E%3C/svg%3E";

/** Inicial y nombre por posición en la paleta principal (igual que en Refinar). */
const PALETTE_ROLE_LABELS: { initial: string; label: string }[] = [
  { initial: 'P', label: 'Principal' },
  { initial: 'S', label: 'Secundario' },
  { initial: 'A', label: 'Acento' },
  { initial: 'A2', label: 'Acento 2' },
  { initial: 'P2', label: 'Principal 2' },
  { initial: 'S2', label: 'Secundario 2' },
  { initial: 'A3', label: 'Acento 3' },
  { initial: 'A4', label: 'Acento 4' },
];

function getMainPaletteRole(index: number): { initial: string; label: string } {
  return PALETTE_ROLE_LABELS[index] ?? { initial: String(index + 1), label: `Color ${index + 1}` };
}

export default function ApplicationShowcase({
  colors,
  paletteName,
  onUpdateColors,
  supportColorsList = [],
  supportVariant = 'claro',
  setSupportVariant,
  updateSupportColor,
}: ApplicationShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('architecture');
  /** Cuando no es null, la columna derecha muestra solo la interfaz de edición de color (en lugar de Estilo/Fondo/Exportar/paletas). */
  const [editingInRightColumn, setEditingInRightColumn] = useState<EditingInRightColumn>(null);
  const editingRef = useRef<EditingInRightColumn>(null);
  editingRef.current = editingInRightColumn;
  const [hoveredMainIndex, setHoveredMainIndex] = useState<number | null>(null);
  const [hoveredSupportRole, setHoveredSupportRole] = useState<string | null>(null);
  const [activeVariants, setActiveVariants] = useState<Record<CategoryType, string>>({
    architecture: 'estudio',
    poster: 'conference',
    branding: 'territorio-visual',
  });
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'color' | 'custom'>('dark');
  const [customBgColor, setCustomBgColor] = useState('#6366f1');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const [localColors, setLocalColors] = useState<string[]>(colors);

  /** Clase del tooltip al pasar el ratón sobre un color en las paletas (igual que en Refinar). */
  const paletteSwatchTooltipClass = 'absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-gray-700 text-gray-200 shadow-lg';
  
  // Sync local colors with props (no sync while editing a main palette color in the column)
  const isEditingMain = editingInRightColumn?.type === 'main';
  if (JSON.stringify(colors) !== JSON.stringify(localColors) && !isEditingMain) {
    setLocalColors(colors);
  }
  
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...localColors];
    newColors[index] = newColor;
    setLocalColors(newColors);
    onUpdateColors?.(newColors);
  };
  
  // Reorder handled via drag and drop

  // Función para convertir colores modernos (oklab, etc) a RGB
  const convertColorToRgb = (colorValue: string): string => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'inherit' || colorValue === 'initial') {
      return colorValue;
    }
    if (colorValue.includes('oklab') || colorValue.includes('oklch') || colorValue.includes('lab(') || colorValue.includes('lch(')) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = colorValue;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          return a < 255 ? `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
        }
      } catch {
        return colorValue;
      }
    }
    return colorValue;
  };

  // Función para sanitizar colores en el clone antes de captura
  const sanitizeCloneColors = (clonedDoc: Document) => {
    const allElements = clonedDoc.querySelectorAll('*');
    const colorProperties = [
      'color', 'background-color', 'border-color', 'border-top-color',
      'border-right-color', 'border-bottom-color', 'border-left-color',
      'outline-color', 'text-decoration-color'
    ];
    
    allElements.forEach((element) => {
      const el = element as HTMLElement;
      const computedStyle = window.getComputedStyle(el);
      
      colorProperties.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('lab(') || value.includes('lch('))) {
          el.style.setProperty(prop, convertColorToRgb(value));
        }
      });
      
      // Box shadow
      const boxShadow = computedStyle.getPropertyValue('box-shadow');
      if (boxShadow && (boxShadow.includes('oklab') || boxShadow.includes('oklch'))) {
        el.style.setProperty('box-shadow', 'none');
      }
      
      // Background image (gradients)
      const bgImage = computedStyle.getPropertyValue('background-image');
      if (bgImage && (bgImage.includes('oklab') || bgImage.includes('oklch'))) {
        const bgColor = computedStyle.getPropertyValue('background-color');
        el.style.setProperty('background-image', 'none');
        el.style.setProperty('background-color', convertColorToRgb(bgColor) || '#ffffff');
      }
    });
  };

  // Exportar PNG actual
  const handleExportPNG = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: getBgColor(),
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          sanitizeCloneColors(clonedDoc);
        }
      });
      
      const link = document.createElement('a');
      const fileName = `${(paletteName || 'paleta').replace(/\s+/g, '-')}-${activeCategory}-${activeVariants[activeCategory]}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar todo en ZIP
  const handleExportAll = async () => {
    if (!previewRef.current) return;
    
    setIsExportingAll(true);
    const zip = new JSZip();
    
    // Calcular total de items
    const totalItems = categories.reduce((acc, cat) => acc + cat.variants.length, 0);
    setExportProgress({ current: 0, total: totalItems });
    
    let currentItem = 0;
    
    try {
      for (const category of categories) {
        const folder = zip.folder(category.name);
        
        for (const variant of category.variants) {
          // Cambiar a esta variante
          setActiveCategory(category.id);
          setActiveVariants(prev => ({ ...prev, [category.id]: variant.id }));
          
          // Esperar a que se renderice
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (previewRef.current) {
            try {
              const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                backgroundColor: getBgColor(),
                useCORS: true,
                allowTaint: true,
                logging: false,
                onclone: (clonedDoc) => {
                  sanitizeCloneColors(clonedDoc);
                }
              });
              
              const dataUrl = canvas.toDataURL('image/png');
              const base64Data = dataUrl.split(',')[1];
              const fileName = `${variant.name.replace(/\s+/g, '-')}.png`;
              folder?.file(fileName, base64Data, { base64: true });
            } catch (err) {
              console.error(`Error capturing ${category.name}/${variant.name}:`, err);
            }
          }
          
          currentItem++;
          setExportProgress({ current: currentItem, total: totalItems });
        }
      }
      
      // Generar y descargar ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `${(paletteName || 'paleta').replace(/\s+/g, '-')}-aplicaciones.zip`;
      link.href = URL.createObjectURL(content);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error('Error exporting all:', error);
    } finally {
      setIsExportingAll(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  const currentCategory = categories.find(c => c.id === activeCategory)!;
  const currentVariant = activeVariants[activeCategory];

  const getColor = (index: number) => colors[index % colors.length];

  /**
   * Paleta para previews de interiores, unificada con Refinar y Armonía:
   * - primary, secondary, accent = paleta principal (Principal, Secundario, Acento = índices 0, 1, 2).
   * - background, surface, muted = paleta de apoyo según variante claro/oscuro (fondo, sobrefondo, texto fino),
   *   igual que en Refinar; si no hay paleta de apoyo, se usan índices 3–5 o valores por defecto.
   */
  const getInteriorColors = (): InteriorPalette => {
    const main = (i: number) => localColors[i % localColors.length] ?? getColor(i);
    const fondo = supportColorsList.find((s) => s.role === 'fondo')?.hex;
    const sobrefondo = supportColorsList.find((s) => s.role === 'sobrefondo')?.hex;
    const textoFino = supportColorsList.find((s) => s.role === 'texto fino')?.hex;
    const texto = supportColorsList.find((s) => s.role === 'texto')?.hex;
    return {
      primary: main(0),
      secondary: main(1),
      accent: main(2),
      background: fondo ?? main(3) ?? '#1a1a2e',
      surface: sobrefondo ?? main(4) ?? '#2d2d44',
      muted: textoFino ?? texto ?? main(5) ?? '#6b7280',
    };
  };

  /** Paleta para pósters: igual que interiores + text (texto) y textLight (texto fino) de paleta de apoyo. */
  const getPosterColors = () => {
    const base = getInteriorColors();
    const texto = supportColorsList.find((s) => s.role === 'texto')?.hex;
    const textoFino = supportColorsList.find((s) => s.role === 'texto fino')?.hex;
    return {
      ...base,
      text: texto ?? base.muted ?? '#e5e7eb',
      textLight: textoFino ?? base.muted ?? '#9ca3af',
    };
  };

  const getBgColor = () => {
    switch (bgMode) {
      case 'light': return '#ffffff';
      case 'dark': return '#1a1a2e';
      case 'color': return getColor(0);
      case 'custom': return customBgColor;
    }
  };

  const renderArchitecture = () => (
    <div className="flex justify-center items-start w-full">
      <InteriorPreview palette={getInteriorColors()} variant={currentVariant} />
    </div>
  );

  const renderPosterConference = () => {
    const c = getPosterColors();
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{
              width: POSTER_BASE_WIDTH,
              height: POSTER_HEIGHT,
              backgroundColor: c.background,
              fontFamily: "'Inter', sans-serif",
            }}
          >
          {/* Background geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-15" style={{ backgroundColor: c.accent }} />
            <div className="absolute bottom-32 -left-8 h-40 w-40 rounded-full opacity-10" style={{ backgroundColor: c.secondary }} />
            <div className="absolute top-0 right-48 h-full w-px opacity-10" style={{ backgroundColor: c.text }} />
            <div className="absolute top-1/3 left-0 h-px w-full opacity-5" style={{ backgroundColor: c.text }} />
            <div className="absolute top-2/3 left-0 h-px w-full opacity-5" style={{ backgroundColor: c.text }} />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
              <pattern id="poster-dots-full" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={c.text} />
              </pattern>
              <rect width="100%" height="100%" fill="url(#poster-dots-full)" />
            </svg>
          </div>
          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-10">
            <div>
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.accent }} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: c.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>Design Conference</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: c.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>2026</span>
              </div>
              <div className="mb-8">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.accent, fontFamily: "'Space Grotesk', sans-serif" }}>International</div>
                <h1 className="mb-2 text-7xl font-black leading-[0.85] tracking-tight" style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}>Creative</h1>
                <h1 className="mb-2 text-7xl font-black italic leading-[0.85] tracking-tight" style={{ color: c.accent, fontFamily: "'Playfair Display', serif" }}>Chormatica</h1>
                <h1 className="text-7xl font-black leading-[0.85] tracking-tight" style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}>Summit</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-16" style={{ backgroundColor: c.accent }} />
                <p className="max-w-xs text-xs font-light leading-relaxed" style={{ color: c.textLight }}>Where art, technology, and design converge to shape the future of creative expression.</p>
              </div>
            </div>
            <div className="my-8 grid grid-cols-3 gap-3">
              {[
                { number: '01', label: 'Keynotes', detail: '12 Speakers' },
                { number: '02', label: 'Workshops', detail: '24 Sessions' },
                { number: '03', label: 'Exhibits', detail: '48 Artists' },
              ].map((item) => (
                <div key={item.number} className="rounded-lg p-4" style={{ backgroundColor: c.surface }}>
                  <div className="mb-2 text-2xl font-bold" style={{ color: c.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{item.number}</div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: c.text }}>{item.label}</div>
                  <div className="text-[9px] font-medium" style={{ color: c.textLight }}>{item.detail}</div>
                </div>
              ))}
            </div>
            <div className="relative my-4">
              <div className="flex items-center justify-between rounded-xl p-6" style={{ backgroundColor: c.primary }}>
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em]" style={{ color: c.accent }}>Mark your calendar</div>
                  <div className="text-3xl font-bold tracking-tight" style={{ color: c.background, fontFamily: "'Space Grotesk', sans-serif" }}>OCT 15–18</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.3em]" style={{ color: c.accent }}>Location</div>
                  <div className="text-sm font-medium" style={{ color: c.background }}>Valencia, Spain</div>
                </div>
                <div className="absolute right-20 bottom-0 h-20 w-20 translate-y-1/2 rounded-full opacity-20" style={{ backgroundColor: c.accent }} />
              </div>
            </div>
            <div className="mt-auto">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[c.accent, c.secondary, c.primary, c.muted].map((color, i) => (
                    <div
                      key={i}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full text-[8px] font-bold"
                      style={{ backgroundColor: color, color: c.background, boxShadow: `0 0 0 2px ${c.background}` }}
                    >
                      {['RB', 'SI', 'MP', '+8'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>Featured Speakers</div>
                  <div className="text-[8px]" style={{ color: c.textLight }}>Laboratory leaders from around the globe</div>
                </div>
              </div>
              <div className="flex items-end justify-between border-t pt-5" style={{ borderColor: c.muted }}>
                <div>
                  <div className="mb-1 text-[22px] font-bold tracking-tight" style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}>CV/26</div>
                  <div className="text-[8px] font-medium uppercase tracking-[0.3em]" style={{ color: c.textLight }}>Neuroarchitecture.lab.upv</div>
                </div>
                <div className="grid grid-cols-4 gap-[2px]">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-[1px]"
                      style={{
                        backgroundColor: CONFERENCE_QR_FILL_INDICES.includes(i) ? c.text : c.muted,
                        opacity: CONFERENCE_QR_FILL_INDICES.includes(i) ? 0.6 : 0.2,
                      }}
                    />
                  ))}
                </div>
                <div className="flex h-10 items-center rounded-full px-5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: c.accent, color: c.primary }}>Register Now</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  const renderPosterExhibitionSwiss = () => {
    const c = getPosterColors();
    const k = POSTER_HEIGHT / POSTER_REF_HEIGHT;
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, backgroundColor: c.background, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line key={`v${i}`} x1={i * (POSTER_BASE_WIDTH / 6)} y1={0} x2={i * (POSTER_BASE_WIDTH / 6)} y2={POSTER_HEIGHT} stroke={c.text} strokeWidth={1} />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line key={`h${i}`} x1={0} y1={i * (POSTER_HEIGHT / 8)} x2={POSTER_BASE_WIDTH} y2={i * (POSTER_HEIGHT / 8)} stroke={c.text} strokeWidth={1} />
              ))}
            </svg>
            <div className="absolute top-0 left-0 right-0" style={{ height: 8, backgroundColor: c.accent }} />
            <div className="absolute" style={{ top: 28 * k, left: 36, right: 36 }}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted }}>International</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted }}>Design Exhibition</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, textAlign: 'right' }}>2026</div>
              </div>
            </div>
            <div
              className="absolute"
              style={{ top: 80 * k, right: -60, width: 320, height: 320, borderRadius: '50%', backgroundColor: c.primary, opacity: 0.12 }}
            />
            <div className="absolute" style={{ top: 100 * k, left: 36, right: 36 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 220, fontWeight: 900, lineHeight: 0.85, color: c.primary, letterSpacing: '-0.04em' }}>Ty</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 220, fontWeight: 900, lineHeight: 0.85, color: c.primary, letterSpacing: '-0.04em', marginTop: -10 }}>po</div>
            </div>
            <div className="absolute" style={{ top: 420 * k, left: 0, right: 0, height: 56 * k, backgroundColor: c.accent }}>
              <div className="flex items-center h-full" style={{ paddingLeft: 36, paddingRight: 36 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.background }}>The Art of Visual Typography</span>
              </div>
            </div>
            <div
              className="absolute"
              style={{ top: 496 * k, left: 36, width: 260, height: 180 * k, backgroundColor: c.secondary, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>Form</div>
                <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>& Function</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: c.background, opacity: 0.7 }}>Exhibition Hall A — B</div>
            </div>
            <div className="absolute" style={{ top: 496 * k, left: 316, right: 36 }}>
              <svg width="268" height="100" viewBox="0 0 268 100">
                {Array.from({ length: 5 }).map((_, row) =>
                  Array.from({ length: 7 }).map((_, col) => {
                    const isActive = (row + col) % 3 === 0 || (row * col) % 4 === 1;
                    return (
                      <rect
                        key={`sq${row}${col}`}
                        x={col * 38 + 2}
                        y={row * 20 + 2}
                        width={16}
                        height={16}
                        fill={isActive ? c.primary : c.surface}
                        opacity={isActive ? 0.8 : 0.4}
                      />
                    );
                  })
                )}
              </svg>
              <div className="flex gap-6" style={{ marginTop: 20 }}>
                {[
                  { value: '47', label: 'Artists', color: c.primary },
                  { value: '12', label: 'Countries', color: c.accent },
                  { value: '03', label: 'Weeks', color: c.secondary },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="absolute"
              style={{ bottom: 0, left: 0, right: 0, height: 130 * k, backgroundColor: c.primary, padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>14</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: c.accent, letterSpacing: '0.05em' }}>—</span>
                  <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>31</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.background, opacity: 0.6, marginTop: 4 }}>March 2026</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.background, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Museum of</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.background, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Chormatica</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: c.accent, marginTop: 6, letterSpacing: '0.05em' }}>Zürich, Switzerland</div>
              </div>
              <div className="absolute" style={{ bottom: 20 * k, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, backgroundColor: c.accent, borderRadius: '50%' }} />
            </div>
            <div className="absolute" style={{ top: 420 * k, left: 10, transformOrigin: 'left top', transform: 'rotate(-90deg) translateX(-100%)' }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.muted, opacity: 0.5 }}>Neuroarchitecture Lab UPV</span>
            </div>
            <svg className="absolute pointer-events-none" style={{ top: 80 * k, left: 0 }} width={POSTER_BASE_WIDTH} height={350 * k}>
              <line x1={500} y1={0} x2={620} y2={120 * k} stroke={c.accent} strokeWidth={2} opacity={0.3} />
              <line x1={510} y1={0} x2={620} y2={110 * k} stroke={c.accent} strokeWidth={1} opacity={0.15} />
            </svg>
            <div className="absolute" style={{ top: 88 * k, left: 420, width: 24, height: 24, borderRadius: '50%', border: `3px solid ${c.accent}` }} />
            <svg className="absolute pointer-events-none" style={{ top: 640 * k, left: 36 }} width={260} height={40}>
              {Array.from({ length: 20 }).map((_, i) => (
                <circle key={`dot${i}`} cx={i * 13 + 4} cy={20} r={2} fill={c.muted} opacity={0.3} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderPosterFestivalGig = () => {
    const c = getPosterColors();
    const k = POSTER_HEIGHT / POSTER_REF_HEIGHT;
    const ins = 14 * k;
    const rayCx = 310;
    const rayCy = 360;
    const rayLen = 500;
    const curvedTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: 82, fontWeight: 900, letterSpacing: '0.08em' as const };
    const eyeIcon = (
      <svg width={22} height={14} viewBox="0 0 22 14">
        <ellipse cx={11} cy={7} rx={10} ry={6} fill="none" stroke={c.primary} strokeWidth={1.5} opacity={0.4} />
        <circle cx={11} cy={7} r={3} fill={c.accent} opacity={0.6} />
        <circle cx={11} cy={7} r={1} fill={c.primary} opacity={0.5} />
      </svg>
    );
    const waveStrokes = [c.primary, c.accent, c.secondary, c.primary, c.accent] as const;
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, backgroundColor: c.background, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <div className="absolute inset-0" style={{ border: `6px solid ${c.primary}` }} />
            <div className="absolute" style={{ top: ins, left: ins, right: ins, bottom: ins, border: `2px solid ${c.accent}`, borderRadius: 8 }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 620 826">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x2 = rayCx + Math.cos(rad) * rayLen;
                const y2 = rayCy + Math.sin(rad) * rayLen;
                return (
                  <line
                    key={`ray${i}`}
                    x1={rayCx}
                    y1={rayCy}
                    x2={x2}
                    y2={y2}
                    stroke={i % 2 === 0 ? c.primary : c.secondary}
                    strokeWidth={i % 3 === 0 ? 30 : 18}
                    opacity={i % 2 === 0 ? 0.08 : 0.05}
                  />
                );
              })}
            </svg>
            <svg className="absolute pointer-events-none" style={{ bottom: 80 * k, left: 0 }} width={620} height={400 * k} viewBox="0 0 620 400">
              {[180, 220, 260, 300, 340].map((ry, i) => (
                <ellipse
                  key={`wave${i}`}
                  cx={310}
                  cy={400}
                  rx={280 - i * 10}
                  ry={ry}
                  fill="none"
                  stroke={waveStrokes[i]}
                  strokeWidth={3 - i * 0.4}
                  opacity={0.15 + i * 0.03}
                />
              ))}
            </svg>
            <svg className="absolute pointer-events-none" style={{ top: 260 * k, left: 210 }} width={200} height={200} viewBox="0 0 200 200">
              <polygon
                points={Array.from({ length: 24 })
                  .map((_, i) => {
                    const angle = (i * 360) / 24 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const r = i % 2 === 0 ? 95 : 50;
                    return `${100 + Math.cos(rad) * r},${100 + Math.sin(rad) * r}`;
                  })
                  .join(' ')}
                fill={c.accent}
                opacity={0.85}
              />
              <circle cx={100} cy={100} r={38} fill={c.background} />
              <circle cx={100} cy={100} r={30} fill={c.accent} opacity={0.3} />
              <circle cx={100} cy={100} r={18} fill={c.background} />
              <circle cx={100} cy={100} r={6} fill={c.primary} />
            </svg>
            <svg className="absolute pointer-events-none" style={{ top: 60 * k, left: 0 }} width={620} height={200} viewBox="0 0 620 200">
              <defs>
                <path id="arcTopGig" d="M 60,180 Q 310,20 560,180" />
              </defs>
              <text fill={c.primary} style={curvedTextStyle}>
                <textPath href="#arcTopGig" startOffset="50%" textAnchor="middle">CHROM</textPath>
              </text>
            </svg>
            <svg className="absolute pointer-events-none" style={{ top: 380 * k, left: 0 }} width={620} height={200} viewBox="0 0 620 200">
              <defs>
                <path id="arcBottomGig" d="M 80,30 Q 310,190 540,30" />
              </defs>
              <text fill={c.primary} style={curvedTextStyle}>
                <textPath href="#arcBottomGig" startOffset="50%" textAnchor="middle">ATICA</textPath>
              </text>
            </svg>
            <div className="absolute w-full text-center" style={{ top: 505 * k, fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 900, letterSpacing: '0.2em', color: c.primary }}>FESTIVAL</div>
            {[
              { top: 30 * k, left: 32 },
              { top: 30 * k, right: 32 },
              { bottom: 165 * k, left: 32 },
              { bottom: 165 * k, right: 32 },
            ].map((pos, i) => (
              <svg key={`star${i}`} className="absolute" style={pos} width={28} height={28} viewBox="0 0 28 28">
                <polygon points="14,0 17,11 28,14 17,17 14,28 11,17 0,14 11,11" fill={c.accent} opacity={0.7} />
              </svg>
            ))}
            <div className="absolute w-full text-center" style={{ top: 590 * k }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', color: c.primary, lineHeight: 2.2 }}>
                THE MIDNIGHT ECHO <span style={{ color: c.accent, fontSize: 10 }}>★</span> CRYSTAL VORTEX <span style={{ color: c.accent, fontSize: 10 }}>★</span> NEON DRIFT
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: c.secondary, lineHeight: 2.2 }}>
                AURORA PULSE <span style={{ color: c.accent, fontSize: 8 }}>★</span> SILVER GHOST <span style={{ color: c.accent, fontSize: 8 }}>★</span> DREAMWAVE COLLECTIVE
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: c.muted, lineHeight: 2.2 }}>
                VELVET HAZE • STARFIELD • ECHO CHAMBER • MIDNIGHT SUN • LUNAR TIDE
              </div>
            </div>
            <div
              className="absolute"
              style={{ top: 680 * k, left: 30, right: 30, height: 32 * k, backgroundColor: c.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
            >
              {['★ LIVE MUSIC', '★ ARTS', '★ VIBES', '★'].map((text, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: i % 2 === 0 ? c.accent : c.background }}>{text}</span>
              ))}
            </div>
            <div className="absolute w-full text-center" style={{ top: 716 * k }}>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.15em', color: c.primary, fontFamily: "'Playfair Display', serif" }}>AUGUST 15 — 17, 2026</div>
              <div className="flex items-center justify-center gap-3" style={{ marginTop: 8 }}>
                <svg width={16} height={10} viewBox="0 0 16 10">
                  <polygon points="0,5 5,0 10,5 5,10" fill={c.accent} opacity={0.6} />
                  <polygon points="6,5 11,0 16,5 11,10" fill={c.accent} opacity={0.3} />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: c.secondary, textTransform: 'uppercase' }}>Red Rocks Amphitheatre</span>
                <svg width={16} height={10} viewBox="0 0 16 10">
                  <polygon points="6,5 11,0 16,5 11,10" fill={c.accent} opacity={0.6} />
                  <polygon points="0,5 5,0 10,5 5,10" fill={c.accent} opacity={0.3} />
                </svg>
              </div>
            </div>
            <svg className="absolute pointer-events-none" style={{ bottom: 42 * k, left: 30 }} width={560} height={16} viewBox="0 0 560 16">
              <polyline
                points={Array.from({ length: 41 }).map((_, i) => `${i * 14},${i % 2 === 0 ? 2 : 14}`).join(' ')}
                fill="none"
                stroke={c.accent}
                strokeWidth={2}
                opacity={0.4}
              />
            </svg>
            <div className="absolute w-full flex justify-center items-center gap-4" style={{ bottom: 26 * k }}>
              {eyeIcon}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: c.primary, textTransform: 'uppercase' }}>Get Your Tickets</span>
              {eyeIcon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** Póster Collage: collage tipográfico — bloques de color, CHROM/ATICA, grano, cintas, sello. */
  const renderPosterCollage = () => {
    const c = getPosterColors();
    const c1 = c.primary;
    const c2 = c.accent;
    const c3 = c.secondary;
    const c4 = c.text;
    const c5 = c.background;
    const c6 = c.muted;
    const tapeStyle = { background: 'rgba(230,220,180,0.45)', borderTop: '1px solid rgba(200,190,150,0.3)', borderBottom: '1px solid rgba(200,190,150,0.3)' } as const;
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, background: c5 }}>
            {/* Grano */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100, opacity: 0.55, mixBlendMode: 'multiply', backgroundImage: `url("${COLLAGE_GRAIN_URL}")`, backgroundSize: '150px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 101, opacity: 0.12, mixBlendMode: 'overlay', backgroundImage: `url("${COLLAGE_GRAIN2_URL}")`, backgroundSize: '200px' }} />
            {/* Bloques collage */}
            <div className="absolute" style={{ top: '-3%', left: '-5%', width: '65%', height: '42%', background: c4, transform: 'rotate(-1.5deg)', zIndex: 1, clipPath: COLLAGE_CLIP_1 }} />
            <div className="absolute" style={{ bottom: '12%', right: '-4%', width: '70%', height: '28%', background: c1, transform: 'rotate(2deg)', zIndex: 3, clipPath: COLLAGE_CLIP_2 }} />
            <div className="absolute" style={{ top: '35%', right: '-3%', width: '45%', height: '25%', background: c3, transform: 'rotate(-3deg)', zIndex: 2, clipPath: COLLAGE_CLIP_3 }} />
            <div className="absolute" style={{ top: '30%', left: '-2%', width: '55%', height: '8%', background: c2, transform: 'rotate(1deg)', zIndex: 4 }} />
            <div className="absolute" style={{ top: '60%', left: '5%', width: '30%', height: '15%', background: c6, transform: 'rotate(-4deg)', zIndex: 2, clipPath: COLLAGE_CLIP_5 }} />
            {/* Tipografía */}
            <div className="absolute" style={{ top: '2%', left: '3%', zIndex: 10, fontFamily: "'Bebas Neue', sans-serif", fontSize: 140, lineHeight: 0.82, color: c5, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(-1.5deg)' }}>WILD</div>
            <div className="absolute" style={{ top: '18%', left: '10%', zIndex: 12, fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 72, color: c2, transform: 'rotate(-5deg)', lineHeight: 0.9 }}>& free</div>
            <div className="absolute" style={{ top: '26%', left: '-1%', zIndex: 15, fontFamily: "'Abril Fatface', serif", fontSize: 120, lineHeight: 0.85, color: c4, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(1deg)' }}>CHROM</div>
            <div className="absolute" style={{ top: '37%', left: '50%', zIndex: 14, fontFamily: "'Zilla Slab', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 42, color: c5, background: c4, padding: '2px 14px', transform: 'rotate(3deg)' }}>of</div>
            <div className="absolute" style={{ top: '37%', right: '5%', zIndex: 13, fontFamily: "'Rock Salt', cursive", fontSize: 38, color: c2, transform: 'rotate(-6deg)' }}>the</div>
            <div className="absolute" style={{ top: '58%', left: '2%', zIndex: 13, fontFamily: "'Permanent Marker', cursive", fontSize: 92, color: c5, lineHeight: 0.8, transform: 'rotate(-4deg)' }}>CRE</div>
            <div className="absolute" style={{ top: '68%', left: '15%', zIndex: 11, fontFamily: "'Bebas Neue', sans-serif", fontSize: 98, color: c4, lineHeight: 0.8, letterSpacing: '0.05em', transform: 'rotate(-1deg)' }}>ATIVE</div>
            <div className="absolute" style={{ bottom: '16%', right: '-1%', zIndex: 16, fontFamily: "'Abril Fatface', serif", fontSize: 155, lineHeight: 0.78, color: c5, textTransform: 'uppercase', letterSpacing: '-0.03em', transform: 'rotate(2deg)' }}>ATICA</div>
            <div className="absolute" style={{ bottom: '12%', right: '15%', zIndex: 17, fontFamily: "'Caveat', cursive", fontWeight: 400, fontSize: 68, color: c2, transform: 'rotate(4deg)' }}>follow</div>
            <div className="absolute" style={{ bottom: '-5%', left: '5%', zIndex: 18, fontFamily: "'Bebas Neue', sans-serif", fontSize: 168, lineHeight: 0.75, color: c4, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(-1deg)', opacity: 0.85 }}>RULES</div>
            <div className="absolute" style={{ top: '42%', left: '35%', zIndex: 5, fontFamily: "'Abril Fatface', serif", fontSize: 200, color: c1, opacity: 0.12, lineHeight: 1, transform: 'rotate(15deg)' }}>*</div>
            {/* Subrayado ondulado */}
            <div className="absolute" style={{ top: '37%', left: '-1%', width: '52%', height: 10, zIndex: 16, transform: 'rotate(1deg)', background: `repeating-linear-gradient(90deg, transparent 0, transparent 2px, ${c1} 2px, ${c1} 4px)`, maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5' fill='none' stroke='black' stroke-width='4'/%3E%3C/svg%3E\")", WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5' fill='none' stroke='black' stroke-width='4'/%3E%3C/svg%3E\")", maskSize: '32px 100%', WebkitMaskSize: '32px 100%' }} />
            {/* Elementos manuales */}
            <div className="absolute" style={{ top: '25%', right: '8%', width: 100, height: 100, border: `3px solid ${c1}`, borderRadius: '52% 48% 45% 55% / 50% 55% 45% 50%', transform: 'rotate(10deg)', zIndex: 6, opacity: 0.35 }} />
            <div className="absolute" style={{ top: '55%', right: '20%', zIndex: 14, fontFamily: "'Caveat', cursive", fontSize: 58, color: c6, transform: 'rotate(-30deg)' }}>→</div>
            <div className="absolute" style={{ top: '72%', left: '10%', width: '50%', height: 4, zIndex: 19, background: c4, transform: 'rotate(-2deg)', borderRadius: 2, opacity: 0.7 }} />
            <div className="absolute" style={{ top: '83%', left: '55%', width: 80, height: 2, background: c4, zIndex: 19, transform: 'rotate(8deg)', opacity: 0.4, borderRadius: 1 }} />
            <div className="absolute" style={{ top: '48%', left: '48%', width: 32, height: 32, background: c4, borderRadius: '60% 40% 55% 45% / 45% 60% 40% 55%', opacity: 0.15, zIndex: 5, transform: 'rotate(30deg)' }} />
            {/* Cintas */}
            <div className="absolute" style={{ top: '8%', left: '52%', width: 110, height: 26, zIndex: 20, transform: 'rotate(25deg)', ...tapeStyle }} />
            <div className="absolute" style={{ bottom: '32%', left: '2%', width: 110, height: 26, zIndex: 20, transform: 'rotate(-8deg)', ...tapeStyle }} />
            {/* Sello */}
            <div className="absolute flex items-center justify-center" style={{ bottom: '6%', right: '6%', width: 72, height: 72, border: `3px solid ${c1}`, borderRadius: '50%', zIndex: 19, transform: 'rotate(-15deg)', opacity: 0.5 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: c1, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Original</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** Póster Competition: concurso arquitectura — cabecera, título HABITAT & FORM, plano, elevación, espiral áurea, cotas, footer. */
  const renderPosterCompetition = () => {
    const c = getPosterColors();
    const c1 = c.text;
    const c2 = c.primary;
    const c3 = c.accent;
    const c4 = c.surface;
    const c5 = c.background;
    const c6 = c.muted;
    const footerItems: { label: string; value: string; highlight?: boolean }[] = [
      { label: 'Deadline', value: '15.09.2025', highlight: true },
      { label: 'Prize', value: '€ 25.000' },
      { label: 'Category', value: 'Open' },
      { label: 'Registration', value: 'chromatica.upv', highlight: true },
    ];
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div className="relative overflow-hidden shadow-2xl" style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, background: c5, fontFamily: "'DM Sans', sans-serif" }}>
            {/* Texturas */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 200, opacity: 0.3, mixBlendMode: 'multiply', backgroundImage: `url("${COMPETITION_GRAIN_URL}")`, backgroundSize: '128px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.04, backgroundImage: `url("${COMPETITION_PAPER_URL}")`, backgroundSize: '256px' }} />
            {/* Grid + márgenes */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.06, backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '8.33% 5%' }} />
            <div className="absolute top-0 bottom-0 left-[4%] w-px pointer-events-none" style={{ zIndex: 3, opacity: 0.08, background: `linear-gradient(to bottom, ${c1}, ${c6} 7%, ${c6} 94.5%, ${c1})` }} />
            <div className="absolute top-0 bottom-0 right-[4%] w-px pointer-events-none" style={{ zIndex: 3, opacity: 0.08, background: `linear-gradient(to bottom, ${c1}, ${c6} 7%, ${c6} 94.5%, ${c1})` }} />
            {/* Cabecera — mitad de grosor, sin org name */}
            <div className="absolute top-0 left-0 right-0" style={{ height: '7%', background: c1, zIndex: 15 }}>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: c2 }} />
            </div>
            <div className="absolute" style={{ top: '0.5%', right: '5%', zIndex: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 52, color: c5, lineHeight: 1, opacity: 0.15 }}>XII</div>
            <div className="absolute" style={{ top: '1.5%', left: '5%', zIndex: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c3 }}>International Architecture Competition</div>
            <div className="absolute" style={{ top: '4%', left: '5%', zIndex: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', color: c5, textTransform: 'uppercase' }}>Open Call — 2025 / 2026</div>
            {/* Título */}
            <div className="absolute" style={{ top: '10%', left: '5%', right: '5%', zIndex: 30 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 18, color: c6, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Rethinking</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 82, lineHeight: 0.88, color: c1, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>HABI</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 95, lineHeight: 0.82, color: 'transparent', textTransform: 'uppercase', letterSpacing: '-0.03em', WebkitTextStroke: `1.5px ${c1}` }}>TAT</div>
              <div className="flex items-baseline gap-3" style={{ marginTop: 0 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 52, color: c2, lineHeight: 1 }}>&</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 78, lineHeight: 0.88, color: c1, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>FORM</span>
              </div>
            </div>
            {/* Subtítulo — debajo de & FORM para evitar solapamiento */}
            <div className="absolute" style={{ top: '43%', left: '5%', maxWidth: '50%', zIndex: 30 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 20, color: c1, lineHeight: 1.25 }}>Designing spaces where <em style={{ color: c2, fontStyle: 'italic' }}>structure</em><br />meets the human <em style={{ color: c2, fontStyle: 'italic' }}>experience</em></div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 8, color: c6, lineHeight: 1.6, marginTop: 6, letterSpacing: '0.02em', maxWidth: '95%' }}>An open call for visionary proposals that challenge the boundaries between built form, landscape and the collective memory of place.</div>
            </div>
            {/* Plano */}
            <div className="absolute" style={{ top: '60%', left: '8%', width: '52%', height: '24%', zIndex: 12, border: `1px solid ${c6}`, opacity: 0.8 }}>
              <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: c1 }} />
              <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: c1 }} />
              <div className="absolute top-0 right-0 w-[3px] h-[70%]" style={{ background: c1 }} />
              <div className="absolute bottom-0 left-0 w-[60%] h-[3px]" style={{ background: c1 }} />
              <div className="absolute bottom-0 right-0 w-[25%] h-[3px]" style={{ background: c1 }} />
              <div className="absolute top-[30%] left-[35%] w-[3px] h-[45%]" style={{ background: c1 }} />
              <div className="absolute top-[30%] left-[35%] w-[30%] h-[3px]" style={{ background: c1 }} />
              <div className="absolute top-[65%] left-0 w-[35%] h-[2px]" style={{ background: c1 }} />
              <div className="absolute top-[65%] left-[35%] w-[2px] h-[35%]" style={{ background: c1 }} />
              <div className="absolute top-[65%] left-[57%] w-[18%] h-[12%] border-[1.5px] rounded-t-full opacity-60" style={{ borderColor: c6, borderBottom: 'none' }} />
              <div className="absolute top-[63%] right-[2%] w-[22%] aspect-square border border-dashed rounded-full opacity-35 overflow-hidden" style={{ borderColor: c6, clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }} />
              {[0, 1, 2, 3, 4].map((i) => <div key={i} className="absolute left-0 w-full border-b opacity-50" style={{ bottom: `${i * 20}%`, height: '20%', borderColor: c6 }} />)}
              {[[28, 18], [28, 52], [55, 18], [55, 72]].map(([t, l], i) => <div key={i} className="absolute w-1.5 aspect-square rounded-sm" style={{ top: `${t}%`, left: `${l}%`, background: c1 }} />)}
              <div className="absolute -bottom-[10%] left-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, letterSpacing: '0.2em', color: c6, textTransform: 'uppercase' }}>Plan — Level 00</div>
              <div className="absolute -bottom-[10%] right-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, color: c6 }}>1 : 200</div>
            </div>
            {/* Espiral áurea */}
            <div className="absolute" style={{ top: '56%', right: '3%', width: '35%', aspectRatio: '1.618 / 1', zIndex: 8, opacity: 0.1 }}>
              <div className="absolute inset-0 border" style={{ borderColor: c1 }} />
              <div className="absolute top-0 right-0 w-[61.8%] h-full border border-l-0" style={{ borderColor: c1 }} />
              <div className="absolute bottom-0 right-0 w-[61.8%] h-[61.8%] border border-t-0 border-l-0" style={{ borderColor: c1 }} />
              <div className="absolute bottom-0 left-0 w-[38.2%] h-[61.8%] border border-t-0" style={{ borderColor: c1 }} />
              <div className="absolute top-0 left-0 w-[76.4%] aspect-square border rounded-full overflow-hidden" style={{ borderColor: c2, clipPath: 'polygon(38.2% 0, 100% 0, 100% 100%, 38.2% 100%)' }} />
            </div>
            {/* Elevación */}
            <div className="absolute" style={{ top: '62%', right: '5%', width: '30%', height: '18%', zIndex: 14, opacity: 0.7 }}>
              <div className="absolute -top-[14%] left-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, letterSpacing: '0.15em', color: c6, textTransform: 'uppercase' }}>South Elevation</div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: c1 }} />
              <div className="absolute bottom-0.5 left-[10%] w-[80%] h-[55%] border-[1.5px] border-b-0" style={{ borderColor: c1 }} />
              <div className="absolute border-[1.5px] border-b-0" style={{ bottom: 'calc(2px + 55%)', left: '5%', width: '90%', height: '25%', borderColor: c1, clipPath: 'polygon(0 100%, 10% 0, 90% 0, 100% 100%)' }} />
              {[18, 42, 66].map((left, i) => <div key={i} className="absolute border bottom-[15%] w-[15%] h-[30%] opacity-30" style={{ left: `${left}%`, borderColor: c6, background: c3 }} />)}
            </div>
            {/* Sello */}
            <div className="absolute flex items-center justify-center" style={{ top: '18%', right: '16%', width: 72, height: 72, zIndex: 22, opacity: 0.12 }}>
              <div className="absolute inset-0 rounded-full border-[1.5px]" style={{ borderColor: c1 }} />
              <div className="absolute inset-[18%] rounded-full border" style={{ borderColor: c1 }} />
              {[0, 45, 90, 135].map((rot, i) => <div key={i} className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" style={{ background: c1, transform: `translateX(-50%) rotate(${rot}deg)` }} />)}
              <span style={{ position: 'relative', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: c1 }}>FA</span>
            </div>
            {/* Cotas */}
            <div className="absolute flex items-center gap-1" style={{ top: '6%', left: '5%', zIndex: 10 }}>
              <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
              <div className="h-px" style={{ width: 70, background: c6, opacity: 0.5 }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, padding: '0 4px', whiteSpace: 'nowrap' }}>12.400</span>
              <div className="h-px" style={{ width: 70, background: c6, opacity: 0.5 }} />
              <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
            </div>
            <div className="absolute flex items-center gap-1 flex-row-reverse" style={{ bottom: '11%', right: '5%', zIndex: 10 }}>
              <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
              <div className="h-px" style={{ width: 90, background: c6, opacity: 0.5 }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, padding: '0 4px', whiteSpace: 'nowrap' }}>8.250</span>
              <div className="h-px" style={{ width: 90, background: c6, opacity: 0.5 }} />
              <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
            </div>
            <div className="absolute flex flex-col items-center gap-1" style={{ right: '3%', top: '24%', zIndex: 10 }}>
              <div className="w-2 h-px" style={{ background: c6, opacity: 0.5 }} />
              <div className="w-px" style={{ height: 70, background: c6, opacity: 0.5 }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '4px 0', whiteSpace: 'nowrap' }}>±0.00</span>
            </div>
            {/* Cruces ref + bubbles */}
            <div className="absolute w-3 aspect-square opacity-25" style={{ top: '59%', left: '6%', zIndex: 10 }}>
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: c1 }} />
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: c1 }} />
            </div>
            <div className="absolute w-3 aspect-square opacity-25" style={{ top: '86%', right: '38%', zIndex: 10 }}>
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: c1 }} />
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: c1 }} />
            </div>
            {[['58%', '27%', 'A'], ['58%', '50%', 'B'], ['82%', '14%', '1']].map(([t, l, label], i) => (
              <div key={i} className="absolute flex items-center justify-center rounded-full border-[1.5px]" style={{ top: t, left: l, width: 26, height: 26, borderColor: c1, zIndex: 20 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: c1 }}>{label}</span>
              </div>
            ))}
            {/* Brújula */}
            <div className="absolute flex flex-col items-center" style={{ top: '18%', right: '6%', zIndex: 25, width: 36, opacity: 0.5 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: c1 }}>N</span>
              <div className="relative w-px mt-0.5" style={{ height: 22, background: c1 }} />
              <div className="w-4 aspect-square rounded-full border mt-0.5" style={{ borderColor: c1 }} />
            </div>
            {/* Hatch + pattern */}
            <div className="absolute opacity-[0.08]" style={{ top: '66%', left: '12%', width: '15%', height: '8%', zIndex: 11, background: `repeating-linear-gradient(45deg, ${c1}, ${c1} 1px, transparent 1px, transparent 5px)` }} />
            <div className="absolute opacity-[0.06]" style={{ top: '71%', left: '30%', width: '12%', height: '6%', zIndex: 11, backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '6px 4px' }} />
            {/* Coordenadas */}
            <div className="absolute flex items-center gap-2" style={{ bottom: '8%', left: '5%', zIndex: 42, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontSize: 9, color: c1, letterSpacing: '0.1em' }}>
              <div className="w-1.5 aspect-square rounded-full" style={{ background: c2 }} />
              <span>41°53&apos;24.8&quot;N 12°29&apos;32.5&quot;E</span>
            </div>
            {/* Franja + footer */}
            <div className="absolute left-0 right-0 h-0.5" style={{ bottom: '5.5%', background: c2, zIndex: 40 }} />
            <div className="absolute bottom-0 left-0 right-0 grid items-center" style={{ height: '5.5%', background: c1, zIndex: 35, gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr', padding: '0 5%' }}>
              {footerItems.flatMap((item, i) => [
                ...(i > 0 ? [<div key={`sep-${i}`} className="h-1/2" style={{ background: c4 }} />] : []),
                <div key={item.label} className="flex flex-col px-3">
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, letterSpacing: '0.25em', textTransform: 'uppercase', color: c6, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 11, color: item.highlight ? c2 : c5, letterSpacing: '0.05em' }}>{item.value}</div>
                </div>,
              ])}
            </div>
            {/* Watermark */}
            <div className="absolute pointer-events-none select-none whitespace-nowrap" style={{ top: '64%', left: '50%', transform: 'translate(-50%, -50%) rotate(-35deg)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 140, color: c1, opacity: 0.025, textTransform: 'uppercase', letterSpacing: '-0.04em', zIndex: 5 }}>HABITAT</div>
          </div>
        </div>
      </div>
    );
  };

  /** Branding: Territorio visual — plantilla Aura (logo, tipografía, paleta, patrón, aplicaciones). A2/A3, getPosterColors. */
  const renderBrandingTerritorioVisual = () => {
    const c = getPosterColors();
    const c1 = c.primary;
    const c2 = c.accent;
    const c3 = c.surface;
    const c4 = c.secondary;
    const c5 = c.background;
    const c6 = c.muted;
    const w = POSTER_BASE_WIDTH;
    const h = POSTER_HEIGHT;
    const px = (p: number) => (p / 100) * w;
    const py = (p: number) => (p / 100) * h;
    return (
      <div className="flex items-center justify-center w-full h-full min-h-0">
        <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Texturas */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />
            {/* Fondo superior ~25% (reducido 1/3 desde 38% para ganar espacio) */}
            <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '25%', background: c1 }}>
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
            </div>
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '25%', zIndex: 3, opacity: 0.03, backgroundImage: `radial-gradient(circle at 20% 30%, ${c4} 1px, transparent 1px), radial-gradient(circle at 60% 70%, ${c4} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${c4} 1px, transparent 1px), radial-gradient(circle at 40% 80%, ${c4} 1px, transparent 1px)`, backgroundSize: '60px 60px, 45px 45px, 55px 55px, 50px 50px' }} />
            {/* Esquinas */}
            {['tl', 'tr', 'bl', 'br'].map((pos) => (
              <div key={pos} className="absolute w-5 h-5 opacity-[0.12]" style={{ zIndex: 60, width: px(3.2), height: px(3.2), ...(pos === 'tl' ? { top: py(1.5), left: px(2) } : pos === 'tr' ? { top: py(1.5), right: px(2) } : pos === 'bl' ? { bottom: py(5.5), left: px(2) } : { bottom: py(5.5), right: px(2) }) }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
                <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
              </div>
            ))}
            {/* Logo area: centrado con left/translate y conjunto más grande */}
            <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center justify-center" style={{ width: '100%', top: '-1%' }}>
              <div className="relative flex flex-col items-center" style={{ width: 130, aspectRatio: 1 }}>
                {/* Taza: sin línea superior, doble grosor (solo bordes izquierdo, derecho y base) */}
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `4px solid ${c2}`, borderRight: `4px solid ${c2}`, borderBottom: `4px solid ${c2}` }} />
                {/* Apoyo/base: misma anchura que el humo (28%), centrada, en contacto con la curva sin solaparse */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 4, background: c2 }} />
                {/* Hoja / humo: doble grosor */}
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 4 }} />
              </div>
              <div className="w-full flex flex-col items-center" style={{ marginTop: -12 }}>
                <div className="font-serif lowercase leading-none text-center" style={{ fontFamily: "'Libre Baskerville', serif", color: c5, fontSize: 52, letterSpacing: '0.26em', marginLeft: 10 }}>aura</div>
                <div className="font-cursive text-center" style={{ fontFamily: "'Caveat', cursive", color: c5, fontSize: 18, letterSpacing: '0.12em', marginTop: -2 }}>slow brew coffe</div>
              </div>
            </div>
            {/* Grid construcción */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[260px] aspect-square z-[5] opacity-[0.025] pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border" style={{ borderColor: c3 }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] h-[68%] rounded-full border" style={{ borderColor: c3 }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] rounded-full border" style={{ borderColor: c3 }} />
              <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: c3 }} />
              <div className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2" style={{ background: c3 }} />
            </div>
            {/* Línea acento */}
            <div className="absolute z-[62] h-0.5 rounded-full" style={{ top: '24.8%', left: '5%', width: 40, background: c4 }} />
            {/* Sección media: tipografía + paleta (subida y tipografías más grandes) */}
            <div className="absolute grid z-[60]" style={{ top: '27%', left: '5%', right: '5%', gridTemplateColumns: '1fr 1px 1.15fr', gap: 24 }}>
              <div>
                <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c6 }}>Typography</div>
                <div className="flex items-baseline mb-2" style={{ gap: 12 }}>
                  <div className="flex-shrink-0" style={{ width: 58 }}>
                    <span className="font-serif leading-none" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 48, color: c1 }}>Aa</span>
                  </div>
                  <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
                    <span className="font-mono tracking-wide" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c1 }}>Libre Baskerville</span>
                    <span className="font-mono tracking-wide" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: c6 }}>Regular — Primary</span>
                  </div>
                </div>
                <div className="flex items-baseline mb-2" style={{ gap: 12 }}>
                  <div className="flex-shrink-0" style={{ width: 58 }}>
                    <span className="leading-none" style={{ fontFamily: "'Caveat', cursive", fontWeight: 500, fontSize: 40, color: c4 }}>Aa</span>
                  </div>
                  <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
                    <span className="font-mono" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c4 }}>Caveat</span>
                    <span className="font-mono" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: c6 }}>Handwritten — Accent</span>
                  </div>
                </div>
                <div className="flex items-baseline mb-3" style={{ gap: 12 }}>
                  <div className="flex-shrink-0" style={{ width: 58 }}>
                    <span className="leading-none font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 34, color: c.textLight }}>Aa</span>
                  </div>
                  <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
                    <span className="font-mono" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c.textLight }}>Plus Jakarta Sans</span>
                    <span className="font-mono" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: c6 }}>Light — Body</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: c4, opacity: 0.6 }}>brewed with intention</div>
              </div>
              <div style={{ background: `linear-gradient(to bottom, ${c3}, transparent)` }} />
              <div>
                <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c6 }}>Color Palette</div>
                <div className="grid grid-cols-3 gap-2">
                  {[c1, c2, c3, c4, c5, c6].map((bg, i) => {
                    const fg = [c1, c4, c6].includes(bg) ? c5 : c1;
                    return (
                      <div key={i} className="aspect-square rounded-md flex flex-col justify-end items-center p-1.5 pb-1" style={{ background: bg, border: bg === c5 ? `1px solid ${c3}` : undefined }}>
                        <span className="font-mono text-[9px] font-semibold tracking-wide opacity-90 whitespace-nowrap text-center" style={{ fontFamily: "'DM Mono', monospace", color: fg }}>{bg}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Patrón franja: solo forma hoja (logo rosa claro), rellena y recortada, alternando normal/volteada y filas desplazadas */}
            <div className="absolute z-[60]" style={{ top: '54%', left: '5%', right: '5%' }}>
              <div className="font-mono uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c6 }}>Brand Pattern</div>
              <div className="w-full rounded-lg overflow-hidden relative" style={{ height: 64, background: c1 }}>
                <div className="absolute flex flex-col justify-start" style={{ top: -8, left: -50, width: 'calc(100% + 100px)', height: 120, marginLeft: 18 }}>
                  {Array.from({ length: 6 }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-shrink-0 items-center gap-0" style={{ height: 28, transform: rowIndex % 2 === 1 ? 'translateX(18px)' : undefined }}>
                      {Array.from({ length: 32 }, (_, colIndex) => (
                        <div key={colIndex} className="flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 28 }}>
                          <div
                            className="rounded-[50%_2px_50%_2px]"
                            style={{
                              width: 14,
                              height: 20,
                              border: `3px solid ${c4}`,
                              opacity: 0.7,
                              transform: colIndex % 2 === 1 ? 'scaleX(-1) rotate(-8deg)' : 'rotate(-8deg)',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Aplicaciones: vaso, bolsa, tarjeta, delantal (más grandes y tipografía legible) */}
            <div className="absolute z-[60]" style={{ top: '68%', left: '5%', right: '5%' }}>
              <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c6 }}>Applications</div>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-full rounded-lg overflow-hidden flex items-center justify-center" style={{ aspectRatio: 0.7, background: c3, minHeight: 100 }}>
                    <div className="flex flex-col items-center w-[38%] h-[65%]">
                      <div className="w-[110%] h-[10%] rounded-t" style={{ background: c1 }} />
                      <div className="w-full flex-1 border border-t-0 rounded-b flex flex-col items-center justify-center relative" style={{ background: c5, borderColor: c1 }}>
                        <div className="absolute top-[30%] left-0 right-0 h-[30%]" style={{ background: c2, opacity: 0.25 }} />
                        <span className="font-serif tracking-widest lowercase z-[1]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 11, color: c1 }}>aura</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ fontFamily: "'DM Mono', monospace", color: c6 }}>Takeaway Cup</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center gap-1.5 relative" style={{ aspectRatio: 0.7, background: c1, minHeight: 100 }}>
                    <div className="absolute top-0 left-0 right-0 h-[12%]" style={{ background: c4, opacity: 0.4 }} />
                    <div className="flex flex-col items-center justify-center gap-1 rounded p-1.5" style={{ width: '58%', aspectRatio: 1, border: `2px solid ${c2}` }}>
                      <span className="font-serif tracking-widest lowercase" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, color: c5 }}>aura</span>
                      <div className="w-[40%] h-px" style={{ background: c5, opacity: 0.8 }} />
                      <span className="font-cursive" style={{ fontFamily: "'Caveat', cursive", fontSize: 11, color: c5 }}>single origin</span>
                    </div>
                    <span className="font-mono tracking-wider" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c5 }}>250g</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ fontFamily: "'DM Mono', monospace", color: c6 }}>Coffee Bag</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center gap-2.5 p-3" style={{ aspectRatio: 0.7, background: c4, minHeight: 100 }}>
                    <span className="font-cursive font-medium text-center" style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: c5 }}>your journey</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2" style={{ borderColor: i < 5 ? c2 : c5, opacity: i < 5 ? 0.7 : 0.5, background: i < 5 ? c2 : 'transparent' }} />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-50" style={{ fontFamily: "'DM Mono', monospace", color: c3 }}>Loyalty Card</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ fontFamily: "'DM Mono', monospace", color: c6 }}>Stamp Card</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-full rounded-lg overflow-hidden flex items-center justify-center relative" style={{ aspectRatio: 0.7, background: c3, minHeight: 100 }}>
                    <div className="relative flex flex-col items-center w-[50%] h-[60%]" style={{ opacity: 0.55 }}>
                      <div className="w-[30%] h-[12%] rounded-b-[50%]" style={{ borderBottom: `2px solid ${c1}`, borderLeft: `2px solid ${c1}`, borderRight: `2px solid ${c1}` }} />
                      <div className="w-full flex-1 rounded-b flex items-center justify-center mt-[-2px]" style={{ borderLeft: `2px solid ${c1}`, borderRight: `2px solid ${c1}`, borderBottom: `2px solid ${c1}` }}>
                        <span className="font-serif tracking-widest lowercase" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, color: c1 }}>aura</span>
                      </div>
                      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[50%] h-[18%] rounded-b" style={{ border: `2px solid ${c1}`, borderTopWidth: 2.5 }} />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ fontFamily: "'DM Mono', monospace", color: c6 }}>Apron</span>
                </div>
              </div>
            </div>
            {/* Marca de agua */}
            <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-25 pointer-events-none select-none lowercase" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 180, color: c3 }}>a</div>
            {/* Footer: aura y puntitos centrados, color suave para que se integren con el fondo */}
            <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '4%', background: c1 }}>
              <div className="flex items-center gap-2">
                <div className="rounded-full" style={{ width: 4, height: 4, background: c3 }} />
                <span className="font-serif text-[12px] tracking-[0.35em] lowercase" style={{ fontFamily: "'Libre Baskerville', serif", color: c3, textIndent: '0.35em' }}>aura</span>
                <div className="rounded-full" style={{ width: 4, height: 4, background: c3 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBranding = () => {
    const brandingByVariant: Record<string, () => React.ReactNode> = {
      'territorio-visual': renderBrandingTerritorioVisual,
    };
    return (brandingByVariant[currentVariant] ?? renderBrandingTerritorioVisual)();
  };

  const renderPoster = () => {
    const posterByVariant: Record<string, () => React.ReactNode> = {
      conference: renderPosterConference,
      'exhibition-swiss': renderPosterExhibitionSwiss,
      'festival-gig': renderPosterFestivalGig,
      collage: renderPosterCollage,
      competition: renderPosterCompetition,
    };
    return (posterByVariant[currentVariant] ?? renderPosterConference)();
  };

  const renderContent = () => {
    if (activeCategory === 'poster') return renderPoster();
    if (activeCategory === 'branding') return renderBranding();
    return renderArchitecture();
  };

  return (
    <div className="grid grid-cols-[minmax(0,200px)_1fr_minmax(0,240px)] gap-4 min-h-0 flex-1 overflow-hidden">
      {/* Columna izquierda: menú categorías + variantes */}
      <div className="flex flex-col gap-3 min-h-0 overflow-y-auto bg-gray-800/40 rounded-2xl border border-gray-700/50 p-3">
        <nav className="flex flex-col gap-1" aria-label="Categorías de aplicación">
          {categories.map(cat => (
            <div key={cat.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                <span className="shrink-0 text-gray-400 [.bg-indigo-600\/80_&]:text-indigo-200">
                  {CategoryIcons[cat.id]}
                </span>
                <span className="truncate">{cat.name}</span>
              </button>
              {activeCategory === cat.id && (
                <div className="flex flex-col gap-1 pl-1 ml-5 border-l border-gray-600/60">
                  {currentCategory.variants.map(variant => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setActiveVariants(prev => ({ ...prev, [cat.id]: variant.id }))}
                      className={`px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                        currentVariant === variant.id
                          ? 'bg-indigo-500/30 text-indigo-200 font-medium'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Columna central: vista previa - sin scroll, contenido centrado y ligeramente escalado para que quepa */}
      <div
        ref={previewRef}
        className="rounded-2xl p-6 min-h-0 flex-1 flex items-center justify-center transition-colors duration-300 border border-gray-700/30 overflow-hidden"
        style={{ backgroundColor: getBgColor() }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${currentVariant}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center min-h-0"
          >
            <div style={{ transform: 'scale(0.94)', transformOrigin: 'center center' }}>
              {renderContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Columna derecha: dos estados — edición de color o vista normal (Estilo, Fondo, Exportar, paletas) */}
      <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
        {editingInRightColumn ? (() => {
          const isMain = editingInRightColumn.type === 'main';
          const isSupport = editingInRightColumn.type === 'support';
          const currentHex = isMain
            ? localColors[editingInRightColumn.index] ?? '#000000'
            : isSupport
              ? (supportColorsList.find((s) => s.role === editingInRightColumn.role)?.hex ?? '#000000')
              : customBgColor;
          const setHex = (hex: string) => {
            if (isMain) handleColorChange(editingInRightColumn.index, hex);
            else if (isSupport) updateSupportColor?.(editingInRightColumn.role, hex);
            else setCustomBgColor(hex);
          };
          const title = isMain
            ? `Editar ${getMainPaletteRole(editingInRightColumn.index).label}`
            : isSupport
              ? `Editar ${supportColorsList.find((s) => s.role === editingInRightColumn.role)?.label ?? 'color de apoyo'}`
              : 'Editar fondo personalizado';
          return (
            <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 flex flex-col gap-4 min-h-0 shrink-0">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
              </div>
              <div className="w-full h-24 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: currentHex }} />
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-gray-600 overflow-hidden">
                  <input
                    type="color"
                    value={currentHex}
                    onChange={(e) => setHex(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer bg-transparent opacity-0"
                    style={{ padding: 0 }}
                    aria-label="Elegir color"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ backgroundColor: currentHex }} aria-hidden>
                    <span className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">HEX</label>
                  <input
                    type="text"
                    value={currentHex.toUpperCase()}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(v)) setHex(v);
                      const noHash = v.replace(/^#/, '');
                      if (/^[0-9A-Fa-f]{6}$/.test(noHash)) setHex('#' + noHash);
                    }}
                    className="w-full bg-gray-700 text-white text-sm font-mono px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
                    aria-label="Código HEX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const hsl = hexToHsl(currentHex);
                    setHex(hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 15)));
                  }}
                  className="py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors font-medium"
                >
                  +Claro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const hsl = hexToHsl(currentHex);
                    setHex(hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 15)));
                  }}
                  className="py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors font-medium"
                >
                  +Oscuro
                </button>
                <button
                  type="button"
                  onClick={() => setEditingInRightColumn(null)}
                  className="py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors font-medium col-span-1"
                >
                  ✓ Aceptar cambio
                </button>
              </div>
            </div>

            {/* Tu paleta (referencia mientras editas) */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 min-h-0 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-300">Tu paleta</div>
                <div className="text-[10px] text-gray-500">Clic para editar otro</div>
              </div>
              <div className="flex gap-2">
                {localColors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 relative group min-w-0"
                    onMouseEnter={() => setHoveredMainIndex(i)}
                    onMouseLeave={() => setHoveredMainIndex(null)}
                    title={getMainPaletteRole(i).label}
                  >
                    {hoveredMainIndex === i && (
                      <span className={paletteSwatchTooltipClass}>{getMainPaletteRole(i).label}</span>
                    )}
                    <div
                      className={`h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-pointer w-full ${editingInRightColumn?.type === 'main' && editingInRightColumn?.index === i ? 'ring-2 ring-purple-500' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingInRightColumn(editingInRightColumn?.type === 'main' && editingInRightColumn?.index === i ? null : { type: 'main', index: i });
                      }}
                    />
                    <div className="text-xs text-center text-gray-400 mt-1.5 font-medium truncate">{getMainPaletteRole(i).initial}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tu paleta de apoyo (referencia mientras editas) */}
            {supportColorsList.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 min-h-0 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-300">Tu paleta de apoyo</div>
                  <div className="text-[10px] text-gray-500">{supportVariant === 'claro' ? 'Claro' : 'Oscuro'}</div>
                </div>
                <div className="flex gap-2">
                  {supportColorsList.map((item) => (
                    <div
                      key={item.role}
                      className="flex-1 relative group min-w-0"
                      onMouseEnter={() => setHoveredSupportRole(item.role)}
                      onMouseLeave={() => setHoveredSupportRole(null)}
                      title={item.label}
                    >
                      {hoveredSupportRole === item.role && (
                        <span className={paletteSwatchTooltipClass}>{item.label}</span>
                      )}
                      <div
                        className={`h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-pointer w-full ${editingInRightColumn?.type === 'support' && editingInRightColumn?.role === item.role ? 'ring-2 ring-indigo-500' : ''}`}
                        style={{ backgroundColor: item.hex }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (updateSupportColor) setEditingInRightColumn(editingInRightColumn?.type === 'support' && editingInRightColumn?.role === item.role ? null : { type: 'support', role: item.role });
                        }}
                      />
                      <div className="text-xs text-center text-gray-400 mt-1.5 font-medium truncate">{item.initial}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
          );
        })() : (
        <>
        {/* Recuadro Estilo (claro / oscuro) */}
        <div className="shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-300 mb-3">Estilo</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSupportVariant?.('claro')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${supportVariant === 'claro' ? 'bg-gray-200 text-gray-900' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
              aria-pressed={supportVariant === 'claro'}
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setSupportVariant?.('oscuro')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${supportVariant === 'oscuro' ? 'bg-gray-700 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
              aria-pressed={supportVariant === 'oscuro'}
            >
              Oscuro
            </button>
          </div>
        </div>

        {/* Recuadro Fondo */}
        <div className="shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-300 mb-3">Fondo</div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setBgMode('dark')}
              className={`w-8 h-8 rounded-full border-2 bg-gray-900 transition-all shrink-0 ${bgMode === 'dark' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'}`}
              title="Fondo oscuro"
              aria-pressed={bgMode === 'dark'}
            />
            <button
              type="button"
              onClick={() => setBgMode('light')}
              className={`w-8 h-8 rounded-full border-2 bg-white transition-all shrink-0 ${bgMode === 'light' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'}`}
              title="Fondo claro"
              aria-pressed={bgMode === 'light'}
            />
            <button
              type="button"
              onClick={() => setBgMode('color')}
              className={`w-8 h-8 rounded-full border-2 transition-all shrink-0 ${bgMode === 'color' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'}`}
              style={{ backgroundColor: getColor(0) }}
              title="Fondo color de la paleta"
              aria-pressed={bgMode === 'color'}
            />
            <button
              type="button"
              onClick={() => {
                setBgMode('custom');
                setEditingInRightColumn({ type: 'background' });
              }}
              className={`w-8 h-8 rounded-full border-2 transition-all shrink-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 ${bgMode === 'custom' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30 text-indigo-400' : 'border-gray-600 hover:border-gray-500'}`}
              title="Fondo color personalizado"
              aria-pressed={bgMode === 'custom'}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recuadro Exportar */}
        <div className="shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-300 mb-3">Exportar</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all disabled:opacity-50"
              title="Descargar esta vista como PNG"
            >
              {isExporting ? (
                <div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={handleExportAll}
              disabled={isExportingAll}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all disabled:opacity-50"
              title="Descargar todo como ZIP"
            >
              {isExportingAll ? (
                <>
                  <div className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                  <span>{exportProgress.current}/{exportProgress.total}</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recuadro Tu paleta */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 min-h-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-300">Tu paleta</div>
            <div className="text-[10px] text-gray-500">Arrastra • Clic para editar</div>
          </div>
        
        {/* Color items - using simple div for reordering */}
        <div className="flex gap-2">
          {localColors.map((color, i) => (
            <div
              key={i}
              className="flex-1 relative group"
              draggable
              onMouseEnter={() => setHoveredMainIndex(i)}
              onMouseLeave={() => setHoveredMainIndex(null)}
              onDragStart={(e) => {
                e.dataTransfer.setData('colorIndex', i.toString());
                e.currentTarget.classList.add('opacity-50');
              }}
              onDragEnd={(e) => {
                e.currentTarget.classList.remove('opacity-50');
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('scale-105');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('scale-105');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('scale-105');
                const fromIndex = parseInt(e.dataTransfer.getData('colorIndex'));
                const toIndex = i;
                if (fromIndex !== toIndex) {
                  const newColors = [...localColors];
                  const [moved] = newColors.splice(fromIndex, 1);
                  newColors.splice(toIndex, 0, moved);
                  setLocalColors(newColors);
                  onUpdateColors?.(newColors);
                  // Keep editing index in sync when reordering main palette
                  const ed = editingRef.current;
                  if (ed && ed.type === 'main') {
                    const idx = ed.index;
                    if (fromIndex === idx) {
                      setEditingInRightColumn({ type: 'main', index: toIndex });
                    } else if (fromIndex < idx && toIndex >= idx) {
                      setEditingInRightColumn({ type: 'main', index: idx - 1 });
                    } else if (fromIndex > idx && toIndex <= idx) {
                      setEditingInRightColumn({ type: 'main', index: idx + 1 });
                    }
                  }
                }
              }}
            >
              {hoveredMainIndex === i && (
                <span className={paletteSwatchTooltipClass}>{getMainPaletteRole(i).label}</span>
              )}
              <div className="flex flex-col items-center" title={getMainPaletteRole(i).label}>
                <div
                  className={`h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-grab active:cursor-grabbing w-full ${editingRef.current?.type === 'main' && editingRef.current.index === i ? 'ring-2 ring-purple-500' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const ed = editingRef.current;
                    setEditingInRightColumn(ed?.type === 'main' && ed.index === i ? null : { type: 'main', index: i });
                  }}
                >
                  {/* Drag indicator */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 text-white/50 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    ⋮⋮
                  </div>
                  {/* Edit indicator on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-400 mt-1.5 font-medium w-full truncate">
                  {getMainPaletteRole(i).initial}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Recuadro Tu paleta de apoyo */}
        {supportColorsList.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-300">Tu paleta de apoyo</div>
              <div className="text-[10px] text-gray-500">{supportVariant === 'claro' ? 'Claro' : 'Oscuro'}</div>
            </div>
            <div className="flex gap-2">
              {supportColorsList.map((item) => (
                <div
                  key={item.role}
                  className="flex-1 relative group min-w-0"
                  onMouseEnter={() => setHoveredSupportRole(item.role)}
                  onMouseLeave={() => setHoveredSupportRole(null)}
                  title={item.label}
                >
                  {hoveredSupportRole === item.role && (
                    <span className={paletteSwatchTooltipClass}>{item.label}</span>
                  )}
                  <div
                    className={`h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-pointer w-full ${editingRef.current?.type === 'support' && editingRef.current.role === item.role ? 'ring-2 ring-indigo-500' : ''}`}
                    style={{ backgroundColor: item.hex }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (updateSupportColor) {
                        const ed = editingRef.current;
                        setEditingInRightColumn(ed?.type === 'support' && ed.role === item.role ? null : { type: 'support', role: item.role });
                      }
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-1.5 font-medium truncate">
                    {item.initial}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
