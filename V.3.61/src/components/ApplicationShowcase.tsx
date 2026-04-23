import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import type { InteriorPalette } from './InteriorPreviews';
import {
  type ApplicationShowcaseProps,
  type EditingInRightColumn,
  type CategoryType,
  categories,
  CategoryIcons,
} from './ApplicationShowcase/types';
import { cn } from '../utils/cn';
import {
  getMainPaletteRole,
  POSTER_PREVIEW_HEIGHT,
  POSTER_PREVIEW_WIDTH,
} from './ApplicationShowcase/constants';
import { ArchitectureSection } from './ApplicationShowcase/ArchitectureSection';
import { PosterSection } from './ApplicationShowcase/PosterSection';
import { BrandingSection } from './ApplicationShowcase/BrandingSection';
import { FloatingPanel } from './GuidedPaletteCreator/FloatingPanel';
import { ColorEditPanelBody } from './ColorEditPanelBody';
import { ResponsiveSceneFrame } from './ResponsiveSceneFrame';

export type { SupportPaletteVariant, SupportColorItem } from './ApplicationShowcase/types';

export default function ApplicationShowcase({
  colors,
  paletteName,
  onUpdateColors,
  supportColorsList = [],
  supportVariant = 'claro',
  setSupportVariant,
  updateSupportColor,
  resetSupportPalette,
}: ApplicationShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('architecture');
  /** Cuando no es null, se abre un modal para editar este color (main, support o background). Ya no se usa la columna derecha para el editor. */
  const [editingColorModal, setEditingColorModal] = useState<EditingInRightColumn>(null);
  const [draftHex, setDraftHex] = useState('#000000');
  const editingRef = useRef<EditingInRightColumn>(null);
  editingRef.current = editingColorModal;
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
  const [supportResetTooltipRect, setSupportResetTooltipRect] = useState<DOMRect | null>(null);
  const supportResetButtonRef = useRef<HTMLButtonElement>(null);
  const [localColors, setLocalColors] = useState<string[]>(colors);

  /** Clase del tooltip al pasar el ratón sobre un color en las paletas (igual que en Refinar). */
  const paletteSwatchTooltipClass = 'absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-gray-700 text-gray-200 shadow-lg';

  // Sync local colors with props (evitar setState durante render; no sincronizar mientras se edita un color principal en el modal)
  const isEditingMain = editingColorModal?.type === 'main';
  useEffect(() => {
    if (isEditingMain) return;
    setLocalColors((prev) => (JSON.stringify(colors) === JSON.stringify(prev) ? prev : colors));
  }, [colors, isEditingMain]);

  // Al abrir el modal de edición, inicializar draftHex con el color actual
  useEffect(() => {
    if (!editingColorModal) return;
    const hex =
      editingColorModal.type === 'main'
        ? localColors[editingColorModal.index] ?? '#000000'
        : editingColorModal.type === 'support'
          ? (supportColorsList.find((s) => s.role === editingColorModal.role)?.hex ?? '#000000')
          : customBgColor;
    setDraftHex(hex);
  }, [editingColorModal]);

  // Colores "efectivos" para vista previa en tiempo real (sin tocar historial hasta Aceptar)
  const previewLocalColors = useMemo(() => {
    if (!editingColorModal || editingColorModal.type !== 'main') return localColors;
    const next = [...localColors];
    if (editingColorModal.index >= 0 && editingColorModal.index < next.length) {
      next[editingColorModal.index] = draftHex;
    }
    return next;
  }, [localColors, editingColorModal, draftHex]);

  const previewSupportColors = useMemo(() => {
    if (!editingColorModal || editingColorModal.type !== 'support') return supportColorsList;
    return supportColorsList.map((s) =>
      s.role === editingColorModal.role ? { ...s, hex: draftHex } : s
    );
  }, [supportColorsList, editingColorModal, draftHex]);

  const previewCustomBgColor = useMemo(() => {
    if (!editingColorModal || editingColorModal.type !== 'background') return customBgColor;
    return draftHex;
  }, [customBgColor, editingColorModal, draftHex]);

  const handleColorChange = (index: number, newColor: string, changeDescription?: string) => {
    const newColors = [...localColors];
    newColors[index] = newColor;
    setLocalColors(newColors);
    onUpdateColors?.(newColors, changeDescription);
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

  /** Espera al siguiente frame de pintado (doble rAF). Más fiable que un timeout fijo. */
  const waitForPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

  // Exportar todo en ZIP
  const handleExportAll = async () => {
    if (!previewRef.current) return;

    const savedCategory = activeCategory;
    const savedVariants = { ...activeVariants };

    setIsExportingAll(true);
    const zip = new JSZip();

    const totalItems = categories.reduce((acc, cat) => acc + cat.variants.length, 0);
    setExportProgress({ current: 0, total: totalItems });

    let currentItem = 0;

    try {
      for (const category of categories) {
        const folder = zip.folder(category.name);

        for (const variant of category.variants) {
          setActiveCategory(category.id);
          setActiveVariants((prev) => ({ ...prev, [category.id]: variant.id }));

          await waitForPaint();

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
      setActiveCategory(savedCategory);
      setActiveVariants(savedVariants);
      setIsExportingAll(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  const currentCategory = categories.find(c => c.id === activeCategory)!;
  const currentVariant = activeVariants[activeCategory];

  const getColor = (index: number) => previewLocalColors[index % previewLocalColors.length];

  /**
   * Paleta para previews de interiores (memoizada para evitar recálculos en cada render).
   * - primary, secondary, accent = paleta principal (índices 0, 1, 2).
   * - background, surface, muted = paleta de apoyo (fondo, sobrefondo, texto fino) o índices 3–5.
   */
  const interiorColors = useMemo((): InteriorPalette => {
    const main = (i: number) =>
      previewLocalColors[i % previewLocalColors.length] ??
      colors[i % colors.length];
    const fondo = previewSupportColors.find((s) => s.role === 'fondo')?.hex;
    const sobrefondo = previewSupportColors.find((s) => s.role === 'sobrefondo')?.hex;
    const textoFino = previewSupportColors.find((s) => s.role === 'texto fino')?.hex;
    const texto = previewSupportColors.find((s) => s.role === 'texto')?.hex;
    return {
      primary: main(0),
      secondary: main(1),
      accent: main(2),
      background: fondo ?? main(3) ?? '#1a1a2e',
      surface: sobrefondo ?? main(4) ?? '#2d2d44',
      muted: textoFino ?? texto ?? main(5) ?? '#6b7280',
    };
  }, [previewLocalColors, colors, previewSupportColors]);

  /** Paleta para pósters: interiores + text, textLight y accent2 (4º color principal). */
  const posterColors = useMemo(() => {
    const main = (i: number) =>
      previewLocalColors[i % previewLocalColors.length] ??
      colors[i % colors.length];
    const texto = previewSupportColors.find((s) => s.role === 'texto')?.hex;
    const textoFino = previewSupportColors.find((s) => s.role === 'texto fino')?.hex;
    return {
      ...interiorColors,
      text: texto ?? interiorColors.muted ?? '#e5e7eb',
      textLight: textoFino ?? interiorColors.muted ?? '#9ca3af',
      accent2: previewLocalColors.length > 3 ? main(3) : interiorColors.accent,
    };
  }, [interiorColors, previewLocalColors, colors, previewSupportColors]);

  const getBgColor = () => {
    switch (bgMode) {
      case 'light': return '#ffffff';
      case 'dark': return '#1a1a2e';
      case 'color': return previewLocalColors[0] ?? getColor(0);
      case 'custom': return previewCustomBgColor;
    }
  };

  const renderContent = () => {
    if (activeCategory === 'architecture') return <ArchitectureSection palette={interiorColors} variant={currentVariant} />;
    if (activeCategory === 'poster') return <PosterSection posterColors={posterColors} variant={currentVariant} />;
    if (activeCategory === 'branding') return <BrandingSection posterColors={posterColors} variant={currentVariant} />;
    return null;
  };

  const sceneBase = useMemo(() => {
    if (activeCategory === 'architecture') {
      return { width: 620, height: 640 };
    }
    return { width: POSTER_PREVIEW_WIDTH, height: POSTER_PREVIEW_HEIGHT };
  }, [activeCategory]);

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
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
                )}
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
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs text-left transition-all',
                        currentVariant === variant.id
                          ? 'bg-indigo-500/30 text-indigo-200 font-medium'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      )}
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

      {/* Columna central: vista previa ajustada con fit proporcional por escena */}
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
            <ResponsiveSceneFrame baseWidth={sceneBase.width} baseHeight={sceneBase.height}>
              {renderContent()}
            </ResponsiveSceneFrame>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Columna derecha: Estilo, Fondo, Exportar, Tu paleta, Tu paleta de apoyo. La edición de color se hace en un modal. */}
      <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
        <>
        {/* Recuadro Estilo (claro / oscuro) */}
        <div className="shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-300 mb-3">Estilo</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSupportVariant?.('claro')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                supportVariant === 'claro' ? 'bg-gray-200 text-gray-900' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              )}
              aria-pressed={supportVariant === 'claro'}
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setSupportVariant?.('oscuro')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                supportVariant === 'oscuro' ? 'bg-gray-700 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              )}
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
              className={cn(
                'w-8 h-8 rounded-full border-2 bg-gray-900 transition-all shrink-0',
                bgMode === 'dark' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'
              )}
              title="Fondo oscuro"
              aria-pressed={bgMode === 'dark'}
            />
            <button
              type="button"
              onClick={() => setBgMode('light')}
              className={cn(
                'w-8 h-8 rounded-full border-2 bg-white transition-all shrink-0',
                bgMode === 'light' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'
              )}
              title="Fondo claro"
              aria-pressed={bgMode === 'light'}
            />
            <button
              type="button"
              onClick={() => setBgMode('color')}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all shrink-0',
                bgMode === 'color' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'
              )}
              style={{ backgroundColor: getColor(0) }}
              title="Fondo color de la paleta"
              aria-pressed={bgMode === 'color'}
            />
            <button
              type="button"
              onClick={() => {
                setBgMode('custom');
                setEditingColorModal({ type: 'background' });
              }}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all shrink-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300',
                bgMode === 'custom' ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/30 text-indigo-400' : 'border-gray-600 hover:border-gray-500'
              )}
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
          {previewLocalColors.map((color, i) => (
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
                  onUpdateColors?.(newColors, 'Orden');
                  // Keep modal editing index in sync when reordering main palette
                  const ed = editingRef.current;
                  if (ed && ed.type === 'main') {
                    const idx = ed.index;
                    if (fromIndex === idx) {
                      setEditingColorModal({ type: 'main', index: toIndex });
                    } else if (fromIndex < idx && toIndex >= idx) {
                      setEditingColorModal({ type: 'main', index: idx - 1 });
                    } else if (fromIndex > idx && toIndex <= idx) {
                      setEditingColorModal({ type: 'main', index: idx + 1 });
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
                  className={cn(
                    'h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-grab active:cursor-grabbing w-full',
                    editingRef.current?.type === 'main' && editingRef.current.index === i && 'ring-2 ring-purple-500'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const ed = editingRef.current;
                    setEditingColorModal(ed?.type === 'main' && ed.index === i ? null : { type: 'main', index: i });
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
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-sm font-medium text-gray-300">Tu paleta de apoyo</div>
              {resetSupportPalette && (
                <div
                  className="relative shrink-0"
                  onMouseEnter={() => {
                    const rect = supportResetButtonRef.current?.getBoundingClientRect();
                    if (rect) setSupportResetTooltipRect(rect);
                  }}
                  onMouseLeave={() => setSupportResetTooltipRect(null)}
                >
                  {typeof document !== 'undefined' &&
                    supportResetTooltipRect &&
                    createPortal(
                      <span
                        role="tooltip"
                        className="fixed px-3 py-2 text-sm text-gray-100 bg-gray-900 border border-gray-600 rounded-lg shadow-xl whitespace-normal text-center pointer-events-none z-[200]"
                        style={{
                          left: supportResetTooltipRect.left + supportResetTooltipRect.width / 2,
                          top: supportResetTooltipRect.top,
                          transform: 'translate(-50%, calc(-100% - 8px))',
                          maxWidth: 'min(360px, 90vw)',
                          width: 'max-content',
                        }}
                      >
                        Restaurar paleta de apoyo al valor predeterminado
                      </span>,
                      document.body
                    )}
                  <button
                    ref={supportResetButtonRef}
                    type="button"
                    onClick={resetSupportPalette}
                    className="p-1.5 rounded-lg bg-gray-700/80 hover:bg-gray-600 text-gray-400 hover:text-gray-300 border border-gray-600 transition-colors"
                    aria-label="Restaurar paleta de apoyo"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {previewSupportColors.map((item) => (
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
                    className={cn(
                        'h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-pointer w-full',
                        editingRef.current?.type === 'support' && editingRef.current.role === item.role && 'ring-2 ring-indigo-500'
                      )}
                    style={{ backgroundColor: item.hex }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (updateSupportColor) {
                        const ed = editingRef.current;
                        setEditingColorModal(ed?.type === 'support' && ed.role === item.role ? null : { type: 'support', role: item.role });
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

        {/* Modal de edición de color (al hacer clic en Tu paleta, paleta de apoyo o fondo personalizado) */}
        {editingColorModal && (
          <FloatingPanel
            open
            onClose={() => setEditingColorModal(null)}
            title={
              editingColorModal.type === 'main'
                ? `Editar ${getMainPaletteRole(editingColorModal.index).label}`
                : editingColorModal.type === 'support'
                  ? `Editar ${supportColorsList.find((s) => s.role === editingColorModal.role)?.label ?? 'color de apoyo'}`
                  : 'Editar fondo personalizado'
            }
            initialWidth={360}
            initialHeight={560}
          >
            <ColorEditPanelBody
              key={
                editingColorModal.type === 'main'
                  ? `main-${editingColorModal.index}`
                  : editingColorModal.type === 'support'
                    ? `support-${editingColorModal.role}`
                    : 'custom-bg'
              }
              draftHex={draftHex}
              setDraftHex={setDraftHex}
              onAccept={() => {
                if (editingColorModal.type === 'main') {
                  handleColorChange(editingColorModal.index, draftHex, 'Tono');
                } else if (editingColorModal.type === 'support') {
                  updateSupportColor?.(editingColorModal.role, draftHex);
                } else {
                  setCustomBgColor(draftHex);
                }
                setEditingColorModal(null);
              }}
            />
          </FloatingPanel>
        )}
        </>
      </div>
    </div>
  );
}
