import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

interface ApplicationShowcaseProps {
  colors: string[];
  paletteName?: string;
  onUpdateColors?: (newColors: string[]) => void;
}

type CategoryType = 'logos' | 'posters' | 'cards' | 'digital' | 'social' | 'print' | 'patterns' | 'merch' | 'spaces';

interface VariantInfo {
  id: string;
  name: string;
  icon: string;
}

const categories: { id: CategoryType; name: string; icon: string; tip: string; variants: VariantInfo[] }[] = [
  {
    id: 'posters',
    name: 'Pósters',
    icon: '🖼️',
    tip: 'El color dominante de tu paleta debería ocupar aproximadamente el 60% del diseño.',
    variants: [
      { id: 'event', name: 'Evento', icon: '🎭' },
      { id: 'product', name: 'Producto', icon: '📦' },
      { id: 'artistic', name: 'Artístico', icon: '🎨' },
      { id: 'geometric', name: 'Geométrico', icon: '◆' },
      { id: 'moodboard', name: 'Moodboard', icon: '📌' },
      { id: 'triptico', name: 'Tríptico', icon: '📄' },
      { id: 'panel', name: 'Panel', icon: '📐' },
    ]
  },
  {
    id: 'logos',
    name: 'Logos',
    icon: '🏷️',
    tip: 'Prueba tu logo sobre diferentes fondos para asegurar su versatilidad y legibilidad.',
    variants: [
      { id: 'isotipo', name: 'Isotipo', icon: '◇' },
      { id: 'imagotipo', name: 'Imagotipo', icon: '◈' },
      { id: 'logotipo', name: 'Logotipo', icon: 'Aa' },
      { id: 'simbolo', name: 'Símbolo', icon: '✦' },
      { id: 'mascota', name: 'Mascota', icon: '🎭' },
      { id: 'monograma', name: 'Monograma', icon: 'AB' },
    ]
  },
  {
    id: 'cards',
    name: 'Tarjetas',
    icon: '💳',
    tip: 'Las tarjetas de visita deben ser legibles y memorables. Menos es más.',
    variants: [
      { id: 'modern', name: 'Moderna', icon: '✨' },
      { id: 'classic', name: 'Clásica', icon: '📜' },
      { id: 'bold', name: 'Bold', icon: '💪' },
      { id: 'minimal', name: 'Minimal', icon: '〰️' },
      { id: 'creative', name: 'Creativa', icon: '🎯' },
    ]
  },
  {
    id: 'digital',
    name: 'Digital',
    icon: '📱',
    tip: 'Asegúrate de mantener suficiente contraste para la accesibilidad web.',
    variants: [
      { id: 'mobile', name: 'App Móvil', icon: '📱' },
      { id: 'web', name: 'Web', icon: '🌐' },
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
      { id: 'landing', name: 'Landing', icon: '🚀' },
    ]
  },
  {
    id: 'social',
    name: 'Redes',
    icon: '📲',
    tip: 'Los colores vibrantes funcionan mejor en redes sociales para captar la atención.',
    variants: [
      { id: 'post', name: 'Post', icon: '📷' },
      { id: 'story', name: 'Story', icon: '📱' },
      { id: 'banner', name: 'Banner', icon: '🖼️' },
      { id: 'profile', name: 'Perfil', icon: '👤' },
      { id: 'carousel', name: 'Carrusel', icon: '🎠' },
    ]
  },
  {
    id: 'patterns',
    name: 'Patrones',
    icon: '🔲',
    tip: 'Los patrones son perfectos para fondos, packaging y textiles. Prueba diferentes escalas.',
    variants: [
      { id: 'geometric', name: 'Geométrico', icon: '◆' },
      { id: 'organic', name: 'Orgánico', icon: '🌊' },
      { id: 'dots', name: 'Puntos', icon: '●' },
      { id: 'lines', name: 'Líneas', icon: '═' },
      { id: 'abstract', name: 'Abstracto', icon: '✧' },
    ]
  },
  {
    id: 'print',
    name: 'Impresión',
    icon: '🖨️',
    tip: 'Recuerda que los colores pueden variar ligeramente al imprimir. Usa CMYK para producción.',
    variants: [
      { id: 'letterhead', name: 'Membrete', icon: '📄' },
      { id: 'envelope', name: 'Sobre', icon: '✉️' },
      { id: 'folder', name: 'Carpeta', icon: '📁' },
      { id: 'packaging', name: 'Packaging', icon: '📦' },
    ]
  },
  {
    id: 'merch',
    name: 'Merchandising',
    icon: '👕',
    tip: 'El merchandising refuerza la identidad de marca. Asegúrate de que el logo sea legible en diferentes tamaños.',
    variants: [
      { id: 'tshirt', name: 'Camiseta', icon: '👕' },
      { id: 'totebag', name: 'Totebag', icon: '🛍️' },
      { id: 'notebook', name: 'Libreta', icon: '📓' },
      { id: 'cup', name: 'Vaso café', icon: '☕' },
      { id: 'lanyard', name: 'Lanyard', icon: '🎫' },
    ]
  },
  {
    id: 'spaces',
    name: 'Espacios',
    icon: '🏢',
    tip: 'El branding en espacios debe ser coherente y crear una experiencia inmersiva de marca.',
    variants: [
      { id: 'office', name: 'Oficina', icon: '🏢' },
      { id: 'retail', name: 'Retail', icon: '🏪' },
      { id: 'billboard', name: 'Billboard', icon: '🪧' },
      { id: 'objects3d', name: 'Objetos 3D', icon: '🎲' },
      { id: 'facade', name: 'Fachada', icon: '🏗️' },
    ]
  },
];

// Helper function
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

// getContrastColor removed - not used

export default function ApplicationShowcase({ colors, paletteName, onUpdateColors }: ApplicationShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('posters');
  const [activeVariants, setActiveVariants] = useState<Record<CategoryType, string>>({
    logos: 'isotipo',
    posters: 'event',
    cards: 'modern',
    digital: 'mobile',
    social: 'post',
    patterns: 'geometric',
    print: 'letterhead',
    merch: 'tshirt',
    spaces: 'office',
  });
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'color'>('dark');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [localColors, setLocalColors] = useState<string[]>(colors);
  
  // Sync local colors with props
  if (JSON.stringify(colors) !== JSON.stringify(localColors) && editingColorIndex === null) {
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

  const getBgColor = () => {
    switch (bgMode) {
      case 'light': return '#ffffff';
      case 'dark': return '#1a1a2e';
      case 'color': return getColor(0);
    }
  };

  // Logo Variants
  const renderLogos = () => {
    switch (currentVariant) {
      case 'isotipo':
        return (
          <div className="flex gap-8 flex-wrap justify-center items-center">
            {/* Solo símbolo - diferentes fondos */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                <div className="w-12 h-12 border-4 border-white rounded-full" />
              </div>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: getColor(1) }}>
                <div className="w-8 h-8 bg-white rotate-45" />
              </div>
            </div>
            <div className="p-8 rounded-xl" style={{ backgroundColor: getColor(0) }}>
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white" />
              </div>
            </div>
          </div>
        );
      case 'imagotipo':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            {/* Símbolo + texto lado */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                  <div className="w-8 h-8 border-3 border-white rounded-lg rotate-45" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: getColor(0) }}>brand</div>
                  <div className="text-xs text-gray-400 tracking-widest">STUDIO</div>
                </div>
              </div>
            </div>
            {/* Símbolo + texto abajo */}
            <div className="bg-gray-900 p-8 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: getColor(1) }}>
                  <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
                <div className="text-white text-xl font-light tracking-widest">BRAND</div>
              </div>
            </div>
          </div>
        );
      case 'logotipo':
        return (
          <div className="flex flex-col gap-6 items-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <span className="text-5xl font-black tracking-tight">
                {colors.slice(0, 5).map((color, i) => (
                  <span key={i} style={{ color }}>{'BRAND'[i]}</span>
                ))}
              </span>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-900 px-8 py-4 rounded-xl">
                <span className="text-3xl font-light text-white tracking-[0.3em]">BRAND</span>
              </div>
              <div className="px-8 py-4 rounded-xl" style={{ backgroundColor: getColor(0) }}>
                <span className="text-3xl font-black text-white">brand.</span>
              </div>
            </div>
          </div>
        );
      case 'simbolo':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            {/* Formas abstractas */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: getColor(0), opacity: 0.8 }} />
                <div className="absolute inset-2 rounded-full" style={{ backgroundColor: getColor(1), opacity: 0.8 }} />
                <div className="absolute inset-4 rounded-full" style={{ backgroundColor: getColor(2), opacity: 0.9 }} />
              </div>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl">
              <div className="w-24 h-24 relative flex items-center justify-center">
                <div className="w-20 h-20 rotate-45" style={{ backgroundColor: getColor(0) }} />
                <div className="absolute w-12 h-12 rounded-full bg-gray-900" />
                <div className="absolute w-8 h-8 rounded-full" style={{ backgroundColor: getColor(1) }} />
              </div>
            </div>
            <div className="p-8 rounded-xl" style={{ backgroundColor: getColor(2) }}>
              <div className="w-24 h-24 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/80" />
                <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-white/60" />
                <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        );
      case 'mascota':
        return (
          <div className="flex gap-8 flex-wrap justify-center items-center">
            {/* Mascota 1: Estilo flat/corporativo */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="w-32 h-36 relative">
                {/* Cuerpo */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 rounded-[40%_40%_50%_50%]" style={{ backgroundColor: getColor(0) }}>
                  {/* Patas */}
                  <div className="absolute -bottom-1 left-3 w-4 h-5 rounded-b-full" style={{ backgroundColor: getColor(0) }} />
                  <div className="absolute -bottom-1 right-3 w-4 h-5 rounded-b-full" style={{ backgroundColor: getColor(0) }} />
                  {/* Barriga */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-10 rounded-[50%] bg-white/20" />
                </div>
                {/* Cabeza */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full" style={{ backgroundColor: getColor(0) }}>
                  {/* Orejas */}
                  <div className="absolute -top-1 left-0 w-5 h-7 rounded-[50%_50%_50%_50%] rotate-[-20deg]" style={{ backgroundColor: getColor(1) }} />
                  <div className="absolute -top-1 right-0 w-5 h-7 rounded-[50%_50%_50%_50%] rotate-[20deg]" style={{ backgroundColor: getColor(1) }} />
                  {/* Cara */}
                  <div className="absolute top-6 left-4 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                  </div>
                  <div className="absolute top-6 right-4 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                  </div>
                  {/* Nariz */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-3 h-2 rounded-full" style={{ backgroundColor: getColor(2) }} />
                  {/* Mejillas */}
                  <div className="absolute bottom-4 left-1 w-3 h-2 rounded-full opacity-50" style={{ backgroundColor: getColor(1) }} />
                  <div className="absolute bottom-4 right-1 w-3 h-2 rounded-full opacity-50" style={{ backgroundColor: getColor(1) }} />
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-sm font-bold" style={{ color: getColor(0) }}>BUDDY</span>
              </div>
            </div>
            
            {/* Mascota 2: Estilo geométrico moderno */}
            <div className="bg-gray-900 p-6 rounded-2xl">
              <div className="w-32 h-36 relative flex items-center justify-center">
                {/* Cuerpo hexagonal */}
                <div className="absolute w-24 h-28 flex flex-col items-center">
                  {/* Cabeza */}
                  <div className="w-16 h-16 rotate-45 rounded-lg relative" style={{ backgroundColor: getColor(1) }}>
                    <div className="absolute inset-0 -rotate-45 flex items-center justify-center">
                      {/* Ojos */}
                      <div className="flex gap-4">
                        <div className="w-3 h-4 bg-white rounded-full" />
                        <div className="w-3 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  {/* Cuerpo */}
                  <div className="w-20 h-14 -mt-2 rounded-b-3xl" style={{ backgroundColor: getColor(1) }}>
                    <div className="w-full h-full flex items-center justify-center pt-2">
                      <div className="w-10 h-8 rounded-full" style={{ backgroundColor: getColor(2) }} />
                    </div>
                  </div>
                </div>
                {/* Antenas */}
                <div className="absolute top-0 left-6 w-1.5 h-6 rounded-full" style={{ backgroundColor: getColor(2) }} />
                <div className="absolute top-0 right-6 w-1.5 h-6 rounded-full" style={{ backgroundColor: getColor(2) }} />
                <div className="absolute top-0 left-5 w-3 h-3 rounded-full" style={{ backgroundColor: getColor(0) }} />
                <div className="absolute top-0 right-5 w-3 h-3 rounded-full" style={{ backgroundColor: getColor(0) }} />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-white/70">HEXY</span>
              </div>
            </div>
            
            {/* Mascota 3: Badge/emblema */}
            <div className="p-6 rounded-2xl" style={{ backgroundColor: getColor(0) + '20' }}>
              <div className="w-32 h-36 relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center" style={{ borderColor: getColor(0) }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{ backgroundColor: getColor(0) }}>
                    {/* Cara minimalista */}
                    <div className="absolute top-5 flex gap-3">
                      <div className="w-2 h-3 rounded-full bg-white" />
                      <div className="w-2 h-3 rounded-full bg-white" />
                    </div>
                    <div className="absolute bottom-5 w-6 h-2 border-b-2 border-white rounded-full" />
                  </div>
                </div>
                {/* Corona */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <div className="flex gap-1">
                    <div className="w-2 h-4 rounded-t-full" style={{ backgroundColor: getColor(1) }} />
                    <div className="w-2 h-6 rounded-t-full" style={{ backgroundColor: getColor(2) }} />
                    <div className="w-2 h-4 rounded-t-full" style={{ backgroundColor: getColor(1) }} />
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-bold" style={{ color: getColor(0) }}>ROYAL</span>
              </div>
            </div>
          </div>
        );
      case 'monograma':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                <span className="text-4xl font-black text-white">AB</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ borderColor: getColor(0) }}>
                <span className="text-3xl font-light" style={{ color: getColor(0) }}>AB</span>
              </div>
            </div>
            <div className="p-8 rounded-xl" style={{ backgroundColor: getColor(1) }}>
              <div className="w-24 h-24 flex items-center justify-center relative">
                <span className="text-5xl font-black text-white/30 absolute -left-1">A</span>
                <span className="text-5xl font-black text-white absolute left-4">B</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Poster Variants
  const renderPosters = () => {
    const posterClass = "w-64 h-80 rounded-xl overflow-hidden shadow-xl";
    
    switch (currentVariant) {
      case 'event':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className={posterClass} style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex flex-col p-6 text-white">
                <div className="text-xs uppercase tracking-widest opacity-70">Festival de</div>
                <div className="text-4xl font-black leading-none mt-1">MÚSICA</div>
                <div className="text-6xl font-black leading-none" style={{ color: getColor(1) }}>2024</div>
                <div className="flex-1 flex items-center">
                  <div className="w-full h-px bg-white/30" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">15—17 Agosto</div>
                  <div className="text-xs opacity-70">Parque Central</div>
                </div>
                <div className="mt-4 px-4 py-2 rounded-full text-center text-sm font-bold" style={{ backgroundColor: getColor(2) }}>
                  Entradas →
                </div>
              </div>
            </div>
            <div className={posterClass} style={{ background: `linear-gradient(135deg, ${getColor(0)}, ${getColor(1)})` }}>
              <div className="h-full flex flex-col p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20" style={{ backgroundColor: getColor(2) }} />
                <div className="text-xs uppercase tracking-widest">Conferencia</div>
                <div className="text-3xl font-black mt-2">DESIGN<br/>WEEK</div>
                <div className="flex-1" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(2) }} />
                    <span className="text-sm">10 Speakers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(2) }} />
                    <span className="text-sm">5 Workshops</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className={posterClass} style={{ backgroundColor: '#fff' }}>
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6" style={{ backgroundColor: getColor(0) + '15' }}>
                  <div className="w-32 h-32 rounded-3xl shadow-2xl" style={{ backgroundColor: getColor(0) }} />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest" style={{ color: getColor(1) }}>Nuevo</div>
                  <div className="text-xl font-bold text-gray-900">Producto Premium</div>
                  <div className="text-2xl font-black mt-2" style={{ color: getColor(0) }}>$99</div>
                </div>
              </div>
            </div>
            <div className={posterClass} style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex flex-col p-6 text-white">
                <div className="text-xs uppercase tracking-widest opacity-70">Colección</div>
                <div className="text-3xl font-black">VERANO<br/>2024</div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-3">
                    {colors.slice(0, 4).map((c, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl shadow-lg" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="text-center text-sm opacity-70">Descubre más →</div>
              </div>
            </div>
          </div>
        );
      case 'artistic':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className={posterClass} style={{ backgroundColor: '#1a1a2e' }}>
              <div className="h-full relative overflow-hidden">
                {colors.map((c, i) => (
                  <div 
                    key={i}
                    className="absolute rounded-full blur-2xl opacity-60"
                    style={{ 
                      backgroundColor: c,
                      width: `${80 + i * 20}px`,
                      height: `${80 + i * 20}px`,
                      left: `${10 + i * 30}px`,
                      top: `${20 + i * 40}px`,
                    }}
                  />
                ))}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white/50 text-xs uppercase tracking-widest">Exhibition</div>
                  <div className="text-white text-2xl font-light">Abstract Forms</div>
                </div>
              </div>
            </div>
            <div className={posterClass} style={{ backgroundColor: getColor(0) }}>
              <div className="h-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-white/20" />
                  <div className="absolute w-32 h-32 rounded-full" style={{ backgroundColor: getColor(1) }} />
                  <div className="absolute w-16 h-16 rounded-full" style={{ backgroundColor: getColor(2) }} />
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-3xl font-black">CÍRCULOS</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'moodboard':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-400">Proyecto</div>
                  <div className="text-xl font-bold text-gray-800">Brand Identity</div>
                </div>
                <div className="flex gap-1.5">
                  {colors.slice(0, 5).map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              
              {/* Main grid */}
              <div className="grid grid-cols-4 gap-3">
                {/* Hero image */}
                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden relative h-48" style={{ backgroundColor: getColor(0) }}>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="w-16 h-1 rounded mb-2" style={{ backgroundColor: getColor(1) }} />
                    <span className="text-white text-3xl font-black tracking-tight">VISION</span>
                    <span className="text-white/60 text-sm">2024 Collection</span>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20" />
                </div>
                
                {/* Texture block */}
                <div className="rounded-xl h-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${getColor(1)}40, ${getColor(2)}40)` }}>
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' }} />
                  <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 uppercase tracking-wider">Textura</div>
                </div>
                
                {/* Typography block */}
                <div className="rounded-xl h-24 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">Aa</div>
                    <div className="text-[8px] text-white/50 tracking-wider">TYPOGRAPHY</div>
                  </div>
                </div>
                
                {/* Color palette */}
                <div className="col-span-2 rounded-xl h-24 bg-white p-3 shadow-inner">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Paleta</div>
                  <div className="flex gap-1.5 h-12">
                    {colors.map((c, i) => (
                      <div key={i} className="flex-1 rounded-lg shadow" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                
                {/* Quote block */}
                <div className="col-span-2 rounded-xl p-4 flex items-center" style={{ backgroundColor: getColor(0) + '15' }}>
                  <div>
                    <div className="text-2xl font-serif text-gray-600">"</div>
                    <div className="text-sm text-gray-600 italic leading-tight">La simplicidad es la sofisticación definitiva</div>
                  </div>
                </div>
                
                {/* Icon grid */}
                <div className="rounded-xl bg-white p-3 shadow-inner">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {colors.slice(0, 4).map((c, i) => (
                      <div key={i} className="rounded aspect-square flex items-center justify-center" style={{ backgroundColor: c + '30' }}>
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Accent shape */}
                <div className="rounded-xl relative overflow-hidden" style={{ backgroundColor: getColor(1) }}>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full" style={{ backgroundColor: getColor(2) }} />
                  <div className="absolute top-2 left-2 w-6 h-1 rounded bg-white/50" />
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                <span>Mood Board • Concepto Visual</span>
                <span style={{ color: getColor(0) }}>brand.studio</span>
              </div>
            </div>
          </div>
        );
      case 'triptico':
        return (
          <div className="flex gap-1 justify-center">
            {/* 3 paneles del tríptico */}
            {[0, 1, 2].map((panel) => (
              <div key={panel} className="w-48 h-72 rounded-lg shadow-xl overflow-hidden" style={{ backgroundColor: panel === 1 ? getColor(0) : '#fff' }}>
                <div className="h-full flex flex-col p-4">
                  {panel === 0 && (
                    <>
                      <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: getColor(0) }} />
                      <div className="text-xl font-bold text-gray-900">Brand</div>
                      <div className="text-xs text-gray-500 mt-1">Servicios</div>
                      <div className="flex-1" />
                      <div className="space-y-1">
                        {['Diseño', 'Estrategia', 'Digital'].map((s, i) => (
                          <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                            {s}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {panel === 1 && (
                    <div className="h-full flex flex-col items-center justify-center text-white text-center">
                      <div className="text-4xl font-black">01</div>
                      <div className="text-lg mt-2">Nuestra</div>
                      <div className="text-lg font-bold">Misión</div>
                      <div className="w-8 h-px bg-white/50 my-4" />
                      <div className="text-xs opacity-70 px-4">Crear experiencias memorables</div>
                    </div>
                  )}
                  {panel === 2 && (
                    <>
                      <div className="text-xs text-gray-400 uppercase tracking-widest">Contacto</div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full" style={{ backgroundColor: getColor(1) + '30' }}>
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: getColor(1) }} />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 text-center space-y-1">
                        <div>hello@brand.com</div>
                        <div>+34 600 000 000</div>
                        <div className="pt-2" style={{ color: getColor(0) }}>www.brand.com</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'geometric':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className={posterClass} style={{ backgroundColor: '#fff' }}>
              <div className="h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40" style={{ backgroundColor: getColor(0) }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ backgroundColor: getColor(1) }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rotate-45" style={{ backgroundColor: getColor(2) }} />
                <div className="absolute bottom-6 left-6">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Geo 01</div>
                  <div className="text-xl font-bold text-gray-900">Formas</div>
                </div>
              </div>
            </div>
            <div className={posterClass} style={{ backgroundColor: getColor(0) }}>
              <div className="h-full relative overflow-hidden p-6">
                <div className="absolute top-0 left-0 w-full h-1/3" style={{ backgroundColor: getColor(1) }} />
                <div className="absolute bottom-0 right-0 w-2/3 h-1/3" style={{ backgroundColor: getColor(2) }} />
                <div className="relative z-10 h-full flex flex-col justify-end text-white">
                  <div className="text-4xl font-black">GEO</div>
                  <div className="text-sm opacity-70">métrico</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'panel':
        return (
          <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Panel 1: Regla de los tercios */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="flex">
                <div className="flex-1 relative h-48">
                  {/* Grid de tercios */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    <div style={{ backgroundColor: getColor(0) + '10' }} />
                    <div style={{ backgroundColor: getColor(0) + '05' }} />
                    <div style={{ backgroundColor: getColor(0) + '10' }} />
                    <div style={{ backgroundColor: getColor(0) + '05' }} />
                    <div className="relative" style={{ backgroundColor: getColor(0) }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30" />
                      </div>
                    </div>
                    <div style={{ backgroundColor: getColor(0) + '05' }} />
                    <div style={{ backgroundColor: getColor(0) + '10' }} />
                    <div style={{ backgroundColor: getColor(0) + '05' }} />
                    <div style={{ backgroundColor: getColor(0) + '10' }} />
                  </div>
                  {/* Líneas guía */}
                  <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                    <div className="border-r border-dashed" style={{ borderColor: getColor(1) }} />
                    <div className="border-r border-dashed" style={{ borderColor: getColor(1) }} />
                  </div>
                  <div className="absolute inset-0 grid grid-rows-3 pointer-events-none">
                    <div className="border-b border-dashed" style={{ borderColor: getColor(1) }} />
                    <div className="border-b border-dashed" style={{ borderColor: getColor(1) }} />
                  </div>
                </div>
                <div className="w-48 p-4 flex flex-col justify-center border-l">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Composición</div>
                  <div className="font-bold text-gray-900">Regla de Tercios</div>
                  <div className="text-xs text-gray-500 mt-2">Divide el espacio en 9 partes iguales para crear equilibrio visual.</div>
                </div>
              </div>
            </div>
            
            {/* Panel 2: Proporción Áurea */}
            <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
              <div className="flex">
                <div className="flex-1 relative h-48 p-4">
                  {/* Espiral áurea simplificada */}
                  <div className="absolute inset-4 flex">
                    <div className="flex-[1.618] h-full rounded-l-lg" style={{ backgroundColor: getColor(0) }}>
                      <div className="h-full flex flex-col">
                        <div className="flex-[1.618] flex items-end justify-end p-3">
                          <div className="text-white text-2xl font-black">φ</div>
                        </div>
                        <div className="flex-1 flex">
                          <div className="flex-[1.618] rounded-bl-lg" style={{ backgroundColor: getColor(1) }} />
                          <div className="flex-1" style={{ backgroundColor: getColor(2) }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex-[1.618] rounded-tr-lg" style={{ backgroundColor: getColor(1) + '80' }} />
                      <div className="flex-1 rounded-br-lg" style={{ backgroundColor: getColor(2) + '60' }} />
                    </div>
                  </div>
                </div>
                <div className="w-48 p-4 flex flex-col justify-center border-l border-gray-700">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Composición</div>
                  <div className="font-bold text-white">Proporción Áurea</div>
                  <div className="text-xs text-gray-400 mt-2">Ratio 1:1.618 para armonía matemática natural.</div>
                </div>
              </div>
            </div>
            
            {/* Panel 3: Simetría */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="flex">
                <div className="flex-1 relative h-48">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 p-4 flex items-center justify-end" style={{ backgroundColor: getColor(0) + '20' }}>
                      <div className="w-16 h-24 rounded-l-full" style={{ backgroundColor: getColor(0) }} />
                    </div>
                    <div className="w-px" style={{ backgroundColor: getColor(1) }} />
                    <div className="flex-1 p-4 flex items-center" style={{ backgroundColor: getColor(0) + '20' }}>
                      <div className="w-16 h-24 rounded-r-full" style={{ backgroundColor: getColor(0) }} />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 top-4 text-center">
                    <div className="text-xl font-black" style={{ color: getColor(0) }}>BALANCE</div>
                  </div>
                </div>
                <div className="w-48 p-4 flex flex-col justify-center border-l">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Composición</div>
                  <div className="font-bold text-gray-900">Simetría</div>
                  <div className="text-xs text-gray-500 mt-2">Elementos reflejados para transmitir estabilidad y orden.</div>
                </div>
              </div>
            </div>
            
            {/* Panel 4: Jerarquía visual */}
            <div className="rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="flex">
                <div className="flex-1 relative h-48 p-6">
                  <div className="space-y-3">
                    <div className="text-4xl font-black text-white">TÍTULO</div>
                    <div className="text-lg text-white/80">Subtítulo secundario</div>
                    <div className="text-sm text-white/60">Texto de apoyo para completar el mensaje visual de la composición.</div>
                    <div className="flex gap-2 mt-4">
                      <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: getColor(1) }}>
                        <span className="text-white">Acción</span>
                      </div>
                      <div className="px-4 py-2 rounded-full text-sm border border-white/30 text-white/70">
                        Secundario
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-48 p-4 flex flex-col justify-center border-l border-white/20">
                  <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Composición</div>
                  <div className="font-bold text-white">Jerarquía Visual</div>
                  <div className="text-xs text-white/60 mt-2">Guía la mirada mediante tamaño, peso y contraste.</div>
                </div>
              </div>
            </div>
            
            {/* Panel 5: Espacio negativo */}
            <div className="bg-gray-100 rounded-xl shadow-xl overflow-hidden">
              <div className="flex">
                <div className="flex-1 relative h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full" style={{ backgroundColor: getColor(0) }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-xs text-gray-500">Menos es más</div>
                  </div>
                </div>
                <div className="w-48 p-4 flex flex-col justify-center border-l">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Composición</div>
                  <div className="font-bold text-gray-900">Espacio Negativo</div>
                  <div className="text-xs text-gray-500 mt-2">El vacío como elemento activo del diseño.</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Business Card Variants
  const renderCards = () => {
    switch (currentVariant) {
      case 'modern':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex flex-col p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">B</div>
                  <div className="text-sm opacity-70">brand.co</div>
                </div>
                <div className="flex-1" />
                <div>
                  <div className="text-xl font-bold">María García</div>
                  <div className="text-sm opacity-70">Directora Creativa</div>
                </div>
                <div className="flex gap-4 mt-4 text-xs opacity-70">
                  <span>maria@brand.co</span>
                  <span>+34 600 000 000</span>
                </div>
              </div>
            </div>
            <div className="w-80 h-48 rounded-xl shadow-xl bg-white overflow-hidden">
              <div className="h-full flex">
                <div className="w-2" style={{ backgroundColor: getColor(0) }} />
                <div className="flex-1 p-6 flex flex-col">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: getColor(0) }} />
                  <div className="flex-1" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">brand.co</div>
                    <div className="text-xs text-gray-500">Diseño & Estrategia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'classic':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="w-80 h-48 rounded-xl shadow-xl bg-white overflow-hidden border">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full mb-4" style={{ backgroundColor: getColor(0) }} />
                <div className="text-xl font-serif text-gray-900">María García</div>
                <div className="text-sm text-gray-500 mt-1">Directora Creativa</div>
                <div className="w-12 h-px my-4" style={{ backgroundColor: getColor(0) }} />
                <div className="text-xs text-gray-500">maria@brand.co • +34 600 000 000</div>
              </div>
            </div>
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="text-2xl font-serif">Brand & Co</div>
                <div className="text-xs mt-2 opacity-70 tracking-widest uppercase">Establecido 2024</div>
              </div>
            </div>
          </div>
        );
      case 'bold':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${getColor(0)}, ${getColor(1)})` }}>
              <div className="h-full p-6 text-white">
                <div className="text-4xl font-black">BRAND</div>
                <div className="text-sm mt-1 opacity-70">Creative Studio</div>
                <div className="flex-1" />
                <div className="mt-8">
                  <div className="font-bold">María García</div>
                  <div className="text-xs opacity-70 mt-2">maria@brand.co</div>
                </div>
              </div>
            </div>
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden bg-gray-900">
              <div className="h-full p-6 text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full" style={{ backgroundColor: getColor(0) }} />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-3xl font-black" style={{ color: getColor(1) }}>B.</div>
                  <div className="flex-1" />
                  <div className="text-xs opacity-50">www.brand.co</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="w-80 h-48 rounded-xl shadow-xl bg-white overflow-hidden">
              <div className="h-full p-6 flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor(0) }} />
                  <span className="text-sm font-medium text-gray-900">brand</span>
                </div>
                <div className="flex-1" />
                <div>
                  <div className="text-gray-900">María García</div>
                  <div className="text-xs text-gray-400 mt-1">maria@brand.co</div>
                </div>
              </div>
            </div>
            <div className="w-80 h-48 rounded-xl shadow-xl bg-gray-50 overflow-hidden">
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getColor(0) }} />
              </div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0" style={{ backgroundColor: getColor(0) }} />
              <div className="absolute top-0 right-0 w-1/2 h-full" style={{ backgroundColor: getColor(1) }} />
              <div className="absolute inset-0 p-6 flex flex-col text-white">
                <div className="flex-1" />
                <div className="text-2xl font-black">María</div>
                <div className="text-2xl font-light">García</div>
                <div className="text-xs mt-2 opacity-70">Diseñadora</div>
              </div>
            </div>
            <div className="w-80 h-48 rounded-xl shadow-xl overflow-hidden bg-white">
              <div className="h-full flex">
                <div className="w-1/3 flex flex-col">
                  {colors.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="text-xs text-gray-500">Contacto</div>
                  <div className="text-sm text-gray-900 mt-2">maria@brand.co</div>
                  <div className="text-sm text-gray-900">+34 600 000 000</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Digital Variants
  const renderDigital = () => {
    switch (currentVariant) {
      case 'mobile':
        return (
          <div className="flex gap-6 justify-center">
            <div className="w-64 bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-[480px] bg-white rounded-2xl overflow-hidden relative">
                <div className="h-6 flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                  <div className="w-16 h-1 bg-black/20 rounded-full" />
                </div>
                <div className="p-4" style={{ backgroundColor: getColor(0) }}>
                  <div className="text-white text-lg font-bold">Hola, María</div>
                  <div className="text-white/70 text-xs">Bienvenida de nuevo</div>
                </div>
                <div className="p-4 -mt-4">
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Balance</span>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getColor(1) }} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">€2,450.00</div>
                  </div>
                </div>
                <div className="px-4 flex gap-2">
                  {['Enviar', 'Recibir', 'Pagar'].map((t, i) => (
                    <div key={i} className="flex-1 py-3 rounded-xl text-center text-xs font-medium text-white" style={{ backgroundColor: colors[i % colors.length] }}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className="p-4 mt-4">
                  <div className="text-xs text-gray-500 mb-2">Actividad reciente</div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: colors[i % colors.length] }}>
                        {['💳', '🛒', '🎁'][i-1]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">Pago #{i}</div>
                        <div className="text-xs text-gray-400">Hace {i}h</div>
                      </div>
                      <div className="text-sm font-medium" style={{ color: getColor(0) }}>-€{i * 15}</div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
                  <div className="flex justify-around py-3">
                    {[
                      { icon: '🏠', label: 'Inicio', active: true },
                      { icon: '📊', label: 'Stats', active: false },
                      { icon: '💳', label: 'Tarjeta', active: false },
                      { icon: '👤', label: 'Perfil', active: false },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className={`text-base ${item.active ? '' : 'opacity-40'}`} style={{ color: item.active ? getColor(0) : undefined }}>
                          {item.icon}
                        </span>
                        <span className={`text-[10px] mt-0.5 ${item.active ? 'font-medium' : 'text-gray-400'}`} style={{ color: item.active ? getColor(0) : undefined }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'web':
        return (
          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="h-8 bg-gray-100 flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-8">
                <div className="bg-white rounded h-5 px-2 text-xs text-gray-400 flex items-center">brand.co</div>
              </div>
            </div>
            <div className="h-12 flex items-center px-6 border-b">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: getColor(0) }} />
              <div className="flex-1 flex justify-center gap-6">
                {['Inicio', 'Servicios', 'Proyectos', 'Contacto'].map((t, i) => (
                  <span key={i} className={`text-sm ${i === 0 ? 'font-medium' : 'text-gray-500'}`} style={{ color: i === 0 ? getColor(0) : undefined }}>{t}</span>
                ))}
              </div>
              <div className="px-4 py-2 rounded-full text-xs text-white" style={{ backgroundColor: getColor(0) }}>CTA</div>
            </div>
            <div className="p-8" style={{ background: `linear-gradient(135deg, ${getColor(0)}15, ${getColor(1)}15)` }}>
              <div className="max-w-md">
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: getColor(1) }}>Bienvenido</div>
                <div className="text-3xl font-bold text-gray-900">Creamos experiencias digitales únicas</div>
                <div className="text-gray-500 mt-2 text-sm">Lorem ipsum dolor sit amet consectetur.</div>
                <div className="flex gap-3 mt-6">
                  <div className="px-6 py-2 rounded-full text-sm text-white" style={{ backgroundColor: getColor(0) }}>Comenzar</div>
                  <div className="px-6 py-2 rounded-full text-sm border" style={{ borderColor: getColor(0), color: getColor(0) }}>Saber más</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex h-80">
              <div className="w-16 flex flex-col items-center py-4 gap-4" style={{ backgroundColor: getColor(0) }}>
                <div className="w-8 h-8 rounded-lg bg-white/20" />
                <div className="flex-1 flex flex-col gap-3 mt-4">
                  {['📊', '📁', '👥', '⚙️'].map((icon, i) => (
                    <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-white/20' : ''}`}>
                      <span className="text-white/70">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-900">Dashboard</div>
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: getColor(1) }} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {colors.slice(0, 3).map((c, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-xs text-gray-500">Métrica {i + 1}</div>
                      <div className="text-xl font-bold" style={{ color: c }}>{(i + 1) * 234}</div>
                      <div className="h-1 rounded-full bg-gray-100 mt-2">
                        <div className="h-full rounded-full" style={{ backgroundColor: c, width: `${60 + i * 15}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-900 mb-3">Rendimiento</div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: colors[i % colors.length] }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ecommerce':
        return (
          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="h-12 flex items-center px-6 border-b">
              <div className="font-bold" style={{ color: getColor(0) }}>SHOP</div>
              <div className="flex-1 flex justify-center gap-6">
                {['Nuevo', 'Mujer', 'Hombre', 'Accesorios'].map((t, i) => (
                  <span key={i} className="text-sm text-gray-600">{t}</span>
                ))}
              </div>
              <div className="flex gap-3 text-gray-600">
                <span>🔍</span>
                <span>🛒</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {colors.slice(0, 3).map((c, i) => (
                  <div key={i} className="group">
                    <div className="aspect-[3/4] rounded-xl mb-2 relative overflow-hidden" style={{ backgroundColor: c + '30' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full" style={{ backgroundColor: c }} />
                      </div>
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: getColor(1) }}>Nuevo</div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">Producto {i + 1}</div>
                    <div className="text-sm" style={{ color: getColor(0) }}>€{(i + 1) * 49}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'landing':
        return (
          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="h-64 relative" style={{ background: `linear-gradient(135deg, ${getColor(0)}, ${getColor(1)})` }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <div className="text-xs uppercase tracking-widest opacity-70 mb-2">Lanzamiento 2024</div>
                <div className="text-4xl font-black">Tu próximo proyecto comienza aquí</div>
                <div className="mt-6 flex gap-3">
                  <div className="px-6 py-3 bg-white rounded-full text-sm font-medium" style={{ color: getColor(0) }}>Empezar gratis</div>
                  <div className="px-6 py-3 rounded-full text-sm border border-white/30">Ver demo</div>
                </div>
              </div>
            </div>
            <div className="p-6 flex gap-4">
              {['Rápido', 'Seguro', 'Fácil'].map((t, i) => (
                <div key={i} className="flex-1 text-center p-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: getColor(i) + '20' }}>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getColor(i) }} />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{t}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Social Media Variants
  const renderSocial = () => {
    switch (currentVariant) {
      case 'post':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-72 aspect-square rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="text-5xl font-black">"</div>
                <div className="text-lg font-medium mt-2">La creatividad es la inteligencia divirtiéndose</div>
                <div className="text-sm opacity-70 mt-4">— Albert Einstein</div>
              </div>
            </div>
            <div className="w-72 aspect-square rounded-xl shadow-xl overflow-hidden bg-white">
              <div className="h-2/3 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${getColor(0)}30, ${getColor(1)}30)` }}>
                <div className="w-24 h-24 rounded-2xl shadow-lg" style={{ backgroundColor: getColor(0) }} />
              </div>
              <div className="p-4">
                <div className="text-lg font-bold text-gray-900">Nuevo Producto</div>
                <div className="text-sm text-gray-500">Descúbrelo ahora →</div>
              </div>
            </div>
          </div>
        );
      case 'story':
        return (
          <div className="flex gap-6 justify-center">
            <div className="w-48 h-80 rounded-2xl shadow-xl overflow-hidden" style={{ background: `linear-gradient(180deg, ${getColor(0)}, ${getColor(1)})` }}>
              <div className="h-full flex flex-col p-4 text-white">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-black">50%</div>
                  <div className="text-lg">OFF</div>
                  <div className="mt-4 text-xs opacity-70">Desliza para ver más</div>
                </div>
                <div className="text-center">
                  <div className="inline-block px-4 py-2 rounded-full bg-white text-sm font-medium" style={{ color: getColor(0) }}>
                    Comprar ahora
                  </div>
                </div>
              </div>
            </div>
            <div className="w-48 h-80 rounded-2xl shadow-xl overflow-hidden bg-gray-900">
              <div className="h-full flex flex-col p-4 text-white relative overflow-hidden">
                {colors.map((c, i) => (
                  <div key={i} className="absolute rounded-full blur-3xl opacity-50" style={{
                    backgroundColor: c,
                    width: '150px',
                    height: '150px',
                    left: `${-30 + i * 40}px`,
                    top: `${50 + i * 60}px`,
                  }} />
                ))}
                <div className="flex-1 flex items-center justify-center relative z-10">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-widest opacity-70">Próximamente</div>
                    <div className="text-2xl font-black mt-2">NUEVO<br/>DROP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="space-y-4">
            <div className="w-full h-32 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="h-full flex items-center px-8">
                <div className="flex-1 text-white">
                  <div className="text-2xl font-bold">Oferta Especial</div>
                  <div className="text-sm opacity-70">Hasta 50% de descuento</div>
                </div>
                <div className="px-6 py-3 rounded-full bg-white font-medium" style={{ color: getColor(0) }}>
                  Ver ofertas
                </div>
              </div>
            </div>
            <div className="w-full h-24 rounded-xl shadow-xl overflow-hidden bg-white border">
              <div className="h-full flex items-center px-6">
                <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: getColor(0) }} />
                <div className="flex-1 ml-4">
                  <div className="font-bold text-gray-900">Brand Name</div>
                  <div className="text-sm text-gray-500">Síguenos para más contenido</div>
                </div>
                <div className="px-4 py-2 rounded-full text-sm text-white" style={{ backgroundColor: getColor(1) }}>
                  Seguir
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="w-80 mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-24" style={{ background: `linear-gradient(135deg, ${getColor(0)}, ${getColor(1)})` }} />
            <div className="px-4 pb-4">
              <div className="w-20 h-20 rounded-full border-4 border-white -mt-10 mx-auto" style={{ backgroundColor: getColor(2) }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl font-bold">M</div>
              </div>
              <div className="text-center mt-2">
                <div className="font-bold text-gray-900">María García</div>
                <div className="text-sm text-gray-500">@mariagarcia</div>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-center">
                <div>
                  <div className="font-bold text-gray-900">1.2K</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">45K</div>
                  <div className="text-xs text-gray-500">Seguidores</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">890</div>
                  <div className="text-xs text-gray-500">Siguiendo</div>
                </div>
              </div>
              <div className="mt-4 py-2 rounded-full text-center text-sm font-medium text-white" style={{ backgroundColor: getColor(0) }}>
                Seguir
              </div>
            </div>
          </div>
        );
      case 'carousel':
        return (
          <div className="flex gap-3 justify-center">
            {colors.slice(0, 4).map((c, i) => (
              <div key={i} className="w-40 aspect-square rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: c }}>
                <div className="h-full flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="text-3xl font-black">0{i + 1}</div>
                  <div className="text-sm mt-2 opacity-70">Slide {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Patterns Variants
  const renderPatterns = () => {
    switch (currentVariant) {
      case 'geometric':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden bg-white p-4">
              <div className="w-full h-full grid grid-cols-4 gap-1">
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className="rotate-45 scale-75" style={{ backgroundColor: colors[i % colors.length] }} />
                ))}
              </div>
            </div>
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
              <div className="w-full h-full grid grid-cols-6 gap-0">
                {Array(36).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    <div className="w-4 h-4 rotate-45" style={{ backgroundColor: i % 2 === 0 ? '#fff' : colors[(i + 1) % colors.length], opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'organic':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden relative" style={{ backgroundColor: getColor(0) }}>
              {colors.map((c, i) => (
                <div key={i} className="absolute rounded-full blur-xl" style={{
                  backgroundColor: c,
                  width: `${60 + i * 20}px`,
                  height: `${60 + i * 20}px`,
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 25}%`,
                  opacity: 0.6,
                }} />
              ))}
            </div>
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden bg-white relative">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="absolute" style={{
                  width: `${40 + Math.random() * 60}px`,
                  height: `${40 + Math.random() * 60}px`,
                  borderRadius: '50% 50% 50% 50%',
                  backgroundColor: colors[i % colors.length] + '40',
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                }} />
              ))}
            </div>
          </div>
        );
      case 'dots':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden bg-white p-2">
              <div className="w-full h-full grid grid-cols-8 gap-2">
                {Array(64).fill(0).map((_, i) => (
                  <div key={i} className="rounded-full" style={{ backgroundColor: colors[i % colors.length], opacity: 0.7 }} />
                ))}
              </div>
            </div>
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden p-4" style={{ backgroundColor: getColor(0) }}>
              <div className="w-full h-full grid grid-cols-6 gap-3">
                {Array(36).fill(0).map((_, i) => (
                  <div key={i} className="rounded-full bg-white" style={{ opacity: Math.random() * 0.5 + 0.2 }} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'lines':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden bg-white flex flex-col">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: i % 2 === 0 ? colors[i % colors.length] : 'white' }} />
              ))}
            </div>
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden flex">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: colors[i % colors.length] }} />
              ))}
            </div>
          </div>
        );
      case 'abstract':
        return (
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden relative" style={{ backgroundColor: '#1a1a2e' }}>
              <div className="absolute top-0 left-0 w-1/2 h-1/2" style={{ backgroundColor: getColor(0) }} />
              <div className="absolute bottom-0 right-0 w-2/3 h-1/3 rounded-tl-full" style={{ backgroundColor: getColor(1) }} />
              <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full" style={{ backgroundColor: getColor(2) }} />
            </div>
            <div className="w-64 h-64 rounded-xl shadow-xl overflow-hidden relative bg-white">
              {colors.slice(0, 4).map((c, i) => (
                <div key={i} className="absolute" style={{
                  backgroundColor: c,
                  width: `${30 + i * 10}%`,
                  height: `${20 + i * 15}%`,
                  left: `${i * 15}%`,
                  top: `${i * 20}%`,
                  borderRadius: i % 2 === 0 ? '0' : '50%',
                  transform: `rotate(${i * 15}deg)`,
                }} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Print Variants
  const renderPrint = () => {
    switch (currentVariant) {
      case 'letterhead':
        return (
          <div className="w-96 mx-auto bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: getColor(0) }} />
              <div>
                <div className="font-bold text-gray-900">Brand Company</div>
                <div className="text-xs text-gray-500">Diseño & Estrategia</div>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-2 rounded-full bg-gray-100" style={{ width: `${100 - i * 15}%` }} />
              ))}
            </div>
            <div className="mt-8 pt-4 border-t flex justify-between text-xs text-gray-400">
              <span>www.brand.co</span>
              <span>info@brand.co</span>
              <span style={{ color: getColor(0) }}>+34 600 000 000</span>
            </div>
          </div>
        );
      case 'envelope':
        return (
          <div className="w-96 h-56 mx-auto bg-white rounded-xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1/3 h-full" style={{ backgroundColor: getColor(0) }} />
            <div className="absolute inset-0 p-6 flex flex-col">
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 rounded bg-white/20" />
                <span className="text-sm font-medium">Brand</span>
              </div>
              <div className="flex-1" />
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Destinatario</div>
                <div className="text-sm text-gray-400">Calle Ejemplo, 123</div>
                <div className="text-sm text-gray-400">28001 Madrid</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 w-12 h-14 border-2 rounded" style={{ borderColor: getColor(1) }}>
              <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: getColor(1) }}>SELLO</div>
            </div>
          </div>
        );
      case 'folder':
        return (
          <div className="w-80 h-96 mx-auto rounded-xl shadow-xl overflow-hidden relative" style={{ backgroundColor: getColor(0) }}>
            <div className="absolute top-0 right-0 w-16 h-8 rounded-bl-xl" style={{ backgroundColor: getColor(1) }} />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white/10" />
            <div className="absolute inset-0 p-8 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div className="flex-1" />
              <div className="text-white">
                <div className="text-2xl font-bold">Brand</div>
                <div className="text-sm opacity-70">Dossier corporativo 2024</div>
              </div>
            </div>
          </div>
        );
      case 'packaging':
        return (
          <div className="flex gap-6 justify-center items-end">
            <div className="w-32 h-48 rounded-lg shadow-xl overflow-hidden relative" style={{ backgroundColor: getColor(0) }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <div className="text-2xl font-bold">B</div>
                </div>
                <div className="mt-4 text-sm font-light">BRAND</div>
              </div>
            </div>
            <div className="w-40 h-40 rounded-lg shadow-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${getColor(1)}, ${getColor(2)})` }}>
              <div className="h-full flex flex-col items-center justify-center text-white p-4">
                <div className="text-3xl font-black">B</div>
                <div className="text-xs mt-2 tracking-widest">PREMIUM</div>
              </div>
            </div>
            <div className="w-24 h-32 rounded-lg shadow-xl overflow-hidden bg-white border">
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: getColor(0) }} />
                </div>
                <div className="h-6" style={{ backgroundColor: getColor(0) }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Merchandise Variants
  const renderMerch = () => {
    switch (currentVariant) {
      case 'tshirt':
        return (
          <div className="flex gap-6 justify-center items-center">
            <div className="relative">
              <div className="w-48 h-56 bg-white rounded-lg shadow-xl flex flex-col items-center pt-6">
                <div className="w-10 h-6 rounded-b-full bg-gray-100" />
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full" style={{ backgroundColor: getColor(0) }}>
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">B</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-48 h-56 rounded-lg shadow-xl flex flex-col items-center pt-6" style={{ backgroundColor: getColor(0) }}>
                <div className="w-10 h-6 rounded-b-full" style={{ backgroundColor: getColor(1) }} />
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl font-black">BRAND</div>
                    <div className="text-xs tracking-widest opacity-70 mt-1">EST. 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'totebag':
        return (
          <div className="flex gap-6 justify-center">
            <div className="relative">
              <div className="w-48 h-56 bg-[#f5f0e6] rounded-lg shadow-xl relative overflow-hidden">
                <div className="absolute -top-4 left-8 w-2 h-8 bg-[#d4c9b8] rounded" />
                <div className="absolute -top-4 right-8 w-2 h-8 bg-[#d4c9b8] rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-xl flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                    <span className="text-white text-3xl font-black">B</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-48 h-56 rounded-lg shadow-xl relative overflow-hidden" style={{ backgroundColor: getColor(0) }}>
                <div className="absolute -top-4 left-8 w-2 h-8 rounded" style={{ backgroundColor: getColor(1) }} />
                <div className="absolute -top-4 right-8 w-2 h-8 rounded" style={{ backgroundColor: getColor(1) }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-light tracking-widest">BRAND</div>
                    <div className="w-12 h-px bg-white/50 mx-auto my-3" />
                    <div className="text-xs opacity-70">STUDIO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notebook':
        return (
          <div className="flex gap-6 justify-center">
            <div className="w-40 h-56 rounded-lg shadow-xl overflow-hidden relative" style={{ backgroundColor: getColor(0) }}>
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10" />
              <div className="absolute inset-0 pl-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">B</span>
                  </div>
                  <div className="mt-3 text-sm tracking-widest">NOTES</div>
                </div>
              </div>
            </div>
            <div className="w-40 h-56 rounded-lg shadow-xl overflow-hidden relative bg-white border">
              <div className="absolute left-0 top-0 bottom-0 w-4" style={{ backgroundColor: getColor(0) }} />
              <div className="absolute inset-0 pl-6 flex flex-col p-4">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: getColor(0) }} />
                <div className="flex-1" />
                <div className="text-xs text-gray-400">brand studio</div>
              </div>
            </div>
          </div>
        );
      case 'cup':
        return (
          <div className="flex gap-8 justify-center items-end">
            <div className="relative">
              <div className="w-28 h-36 rounded-lg shadow-xl overflow-hidden" style={{ backgroundColor: getColor(0) }}>
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold">B</div>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-5 h-14 border-4 rounded-r-full" style={{ borderColor: getColor(0) }} />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-2 rounded" style={{ backgroundColor: getColor(1) }} />
            </div>
            <div className="relative">
              <div className="w-24 h-32 rounded-b-lg shadow-xl overflow-hidden bg-white">
                <div className="h-6" style={{ backgroundColor: getColor(0) }} />
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: getColor(0) + '20' }}>
                      <span className="font-bold" style={{ color: getColor(0) }}>B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'lanyard':
        return (
          <div className="flex gap-6 justify-center">
            <div className="relative">
              <div className="w-6 h-24" style={{ backgroundColor: getColor(0) }} />
              <div className="w-32 h-44 rounded-lg shadow-xl overflow-hidden bg-white border relative -mt-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-4 rounded-b" style={{ backgroundColor: getColor(0) }} />
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div className="mt-3 text-center">
                    <div className="text-sm font-bold text-gray-900">María García</div>
                    <div className="text-xs text-gray-500">Diseñadora</div>
                  </div>
                  <div className="mt-2 w-full h-2 rounded" style={{ backgroundColor: getColor(0) }} />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-6 h-24" style={{ background: `repeating-linear-gradient(0deg, ${getColor(0)}, ${getColor(0)} 10px, ${getColor(1)} 10px, ${getColor(1)} 20px)` }} />
              <div className="w-32 h-44 rounded-lg shadow-xl overflow-hidden relative -mt-2" style={{ backgroundColor: getColor(0) }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-4 rounded-b bg-white/20" />
                <div className="h-full flex flex-col items-center justify-center p-4 text-white">
                  <div className="text-2xl font-black">VIP</div>
                  <div className="mt-2 text-xs opacity-70">ALL ACCESS</div>
                  <div className="mt-4 w-full h-8 rounded bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Spaces Variants
  const renderSpaces = () => {
    switch (currentVariant) {
      case 'office':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-100 rounded-xl shadow-xl overflow-hidden p-6">
              <div className="relative h-72 bg-white rounded-lg overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: getColor(0) + '15' }}>
                  <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl shadow-lg" style={{ backgroundColor: getColor(0) }}>
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">B</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: getColor(0) }}>brand</div>
                      <div className="text-xs text-gray-500">Creative Studio</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24" style={{ backgroundColor: getColor(1) + '20' }}>
                  <div className="absolute bottom-0 left-12 w-48 h-20 rounded-t-lg bg-white shadow-lg">
                    <div className="absolute top-2 left-4 w-8 h-8 rounded" style={{ backgroundColor: getColor(0) }} />
                  </div>
                </div>
                <div className="absolute top-16 right-8 flex gap-2">
                  {colors.slice(0, 3).map((c, i) => (
                    <div key={i} className="w-12 h-16 rounded-sm shadow" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">Recepción de oficina</div>
            </div>
          </div>
        );
      case 'retail':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden p-6">
              <div className="relative h-72 rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${getColor(0)}30, ${getColor(0)}10)` }}>
                <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center" style={{ backgroundColor: getColor(0) }}>
                  <span className="text-white text-2xl font-black tracking-wider">BRAND STORE</span>
                </div>
                <div className="absolute top-20 left-4 right-4 flex gap-4">
                  {colors.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-32 rounded-lg bg-white/10 p-2">
                        <div className="w-full h-full rounded flex items-center justify-center" style={{ backgroundColor: c + '40' }}>
                          <div className="w-8 h-12 rounded" style={{ backgroundColor: c }} />
                        </div>
                      </div>
                      <div className="h-2 mt-1 rounded" style={{ backgroundColor: c }} />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">Tienda retail</div>
            </div>
          </div>
        );
      case 'billboard':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-blue-400 to-blue-200 rounded-xl shadow-xl overflow-hidden p-6">
              {/* Street billboard */}
              <div className="relative h-80">
                {/* Billboard structure */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80">
                  {/* Billboard frame */}
                  <div className="bg-gray-800 p-2 rounded-lg shadow-2xl">
                    <div className="h-48 rounded overflow-hidden relative" style={{ backgroundColor: getColor(0) }}>
                      {/* Content */}
                      <div className="absolute inset-0 p-4 flex flex-col text-white">
                        <div className="text-xs uppercase tracking-widest opacity-70">Nuevo</div>
                        <div className="text-3xl font-black mt-1">BRAND</div>
                        <div className="text-lg font-light">Collection 2024</div>
                        <div className="flex-1" />
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: getColor(1) }}>
                            Descubre más
                          </div>
                          <div className="flex gap-1">
                            {colors.slice(0, 4).map((c, i) => (
                              <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-20 blur-xl" style={{ backgroundColor: getColor(1) }} />
                    </div>
                  </div>
                  {/* Pole */}
                  <div className="w-4 h-20 bg-gray-700 mx-auto" />
                </div>
                {/* Ground / street */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-600 rounded-b-xl">
                  <div className="h-2 bg-yellow-400 mt-5 mx-4 rounded" />
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">Billboard publicitario</div>
            </div>
          </div>
        );
      case 'objects3d':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden p-8">
              {/* 3D Objects simulation */}
              <div className="flex gap-8 justify-center items-end">
                {/* Sphere */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full shadow-2xl relative overflow-hidden" style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${getColor(0)}, ${getColor(0)}99 50%, ${getColor(0)}66 100%)` 
                  }}>
                    <div className="absolute top-4 left-6 w-8 h-4 rounded-full bg-white/30 blur-sm" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-md" />
                  <div className="text-center text-white/50 text-xs mt-4">Esfera</div>
                </div>
                {/* Cube */}
                <div className="relative">
                  <div className="w-28 h-28 relative" style={{ transform: 'perspective(200px) rotateX(-15deg) rotateY(25deg)' }}>
                    {/* Front face */}
                    <div className="absolute inset-0 shadow-xl" style={{ backgroundColor: getColor(1) }} />
                    {/* Top face */}
                    <div className="absolute -top-6 left-0 right-0 h-6 origin-bottom" style={{ 
                      backgroundColor: getColor(1), 
                      filter: 'brightness(1.2)',
                      transform: 'rotateX(60deg)',
                    }} />
                    {/* Right face */}
                    <div className="absolute top-0 -right-6 bottom-0 w-6 origin-left" style={{ 
                      backgroundColor: getColor(1), 
                      filter: 'brightness(0.8)',
                      transform: 'rotateY(-60deg)',
                    }} />
                  </div>
                  <div className="text-center text-white/50 text-xs mt-8">Cubo</div>
                </div>
                {/* Cylinder */}
                <div className="relative">
                  <div className="w-24 h-36 rounded-lg shadow-2xl relative overflow-hidden" style={{ 
                    background: `linear-gradient(90deg, ${getColor(2)}66, ${getColor(2)} 40%, ${getColor(2)} 60%, ${getColor(2)}66)` 
                  }}>
                    {/* Top ellipse */}
                    <div className="absolute -top-2 left-0 right-0 h-8 rounded-[50%]" style={{ backgroundColor: getColor(2), filter: 'brightness(1.2)' }} />
                    {/* Highlight */}
                    <div className="absolute top-8 left-4 w-2 h-20 bg-white/20 rounded-full" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/20 rounded-full blur-md" />
                  <div className="text-center text-white/50 text-xs mt-4">Cilindro</div>
                </div>
                {/* Torus / Ring */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-[12px] shadow-2xl" style={{ 
                    borderColor: getColor(3) || getColor(0),
                    background: 'transparent',
                  }}>
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `radial-gradient(circle at 50% 50%, transparent 40%, ${getColor(3) || getColor(0)}33 60%)`
                    }} />
                  </div>
                  <div className="text-center text-white/50 text-xs mt-4">Anillo</div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-400">Objetos volumétricos con paleta aplicada</div>
            </div>
          </div>
        );
      case 'facade':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-blue-200 to-blue-100 rounded-xl shadow-xl overflow-hidden p-6">
              <div className="relative h-72 rounded-lg overflow-hidden">
                <div className="absolute inset-4 bg-gray-200 rounded-lg shadow-inner">
                  <div className="absolute top-4 left-4 right-4 grid grid-cols-4 gap-2">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={i} className="aspect-[3/4] bg-gray-700/30 rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-4 right-4 h-24 rounded-t-lg overflow-hidden" style={{ backgroundColor: getColor(0) }}>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 px-8 py-2 rounded" style={{ backgroundColor: getColor(1) }}>
                      <span className="text-white font-bold text-lg">BRAND</span>
                    </div>
                    <div className="absolute bottom-0 left-4 right-4 h-14 bg-gray-800/30 rounded-t flex items-end justify-center pb-2">
                      <div className="flex gap-2">
                        {colors.slice(0, 3).map((c, i) => (
                          <div key={i} className="w-6 h-8 rounded-t" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-24 left-4 right-4 h-4" style={{ background: `repeating-linear-gradient(90deg, ${getColor(0)}, ${getColor(0)} 20px, ${getColor(1)} 20px, ${getColor(1)} 40px)` }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-400" />
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">Fachada de local comercial</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'logos': return renderLogos();
      case 'posters': return renderPosters();
      case 'cards': return renderCards();
      case 'digital': return renderDigital();
      case 'social': return renderSocial();
      case 'patterns': return renderPatterns();
      case 'print': return renderPrint();
      case 'merch': return renderMerch();
      case 'spaces': return renderSpaces();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-medium text-gray-200">Consejo de aplicación</div>
            <div className="text-sm text-gray-400 mt-1">
              {currentCategory.tip}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Variant Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">
            Variantes de {currentCategory.name}
          </span>
          <div className="flex gap-3 items-center">
            {/* Export buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30 transition-all disabled:opacity-50"
                title="Descargar esta vista como PNG"
              >
                {isExporting ? (
                  <div className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                <span>PNG</span>
              </button>
              <button
                onClick={handleExportAll}
                disabled={isExportingAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all disabled:opacity-50"
                title="Descargar todo como ZIP"
              >
                {isExportingAll ? (
                  <>
                    <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                    <span>{exportProgress.current}/{exportProgress.total}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Todo ZIP</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Divider */}
            <div className="w-px h-6 bg-gray-600" />
            
            {/* Background selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setBgMode('dark')}
                className={`w-7 h-7 rounded-full border-2 bg-gray-900 transition-all ${bgMode === 'dark' ? 'border-purple-500 scale-110' : 'border-gray-600 hover:border-gray-500'}`}
                title="Fondo oscuro"
              />
              <button
                onClick={() => setBgMode('light')}
                className={`w-7 h-7 rounded-full border-2 bg-white transition-all ${bgMode === 'light' ? 'border-purple-500 scale-110' : 'border-gray-600 hover:border-gray-500'}`}
                title="Fondo claro"
              />
              <button
                onClick={() => setBgMode('color')}
                className={`w-7 h-7 rounded-full border-2 transition-all ${bgMode === 'color' ? 'border-purple-500 scale-110' : 'border-gray-600 hover:border-gray-500'}`}
                style={{ backgroundColor: getColor(0) }}
                title="Fondo color"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {currentCategory.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setActiveVariants(prev => ({ ...prev, [activeCategory]: variant.id }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                currentVariant === variant.id
                  ? 'bg-purple-600/30 text-purple-300 font-medium border border-purple-500/50'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50'
              }`}
            >
              <span>{variant.icon}</span>
              <span>{variant.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div 
        ref={previewRef}
        className="rounded-2xl p-8 min-h-[400px] flex items-center justify-center transition-colors duration-300 border border-gray-700/30"
        style={{ backgroundColor: getBgColor() }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${currentVariant}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Palette Reference with Edit capabilities */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-300">Tu paleta</div>
          <div className="text-xs text-gray-500">Arrastra para reordenar • Clic para editar</div>
        </div>
        
        {/* Color items - using simple div for reordering */}
        <div className="flex gap-2">
          {localColors.map((color, i) => (
            <div
              key={i}
              className="flex-1 relative group"
              draggable
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
                  // Keep same color selected
                  if (editingColorIndex === fromIndex) {
                    setEditingColorIndex(toIndex);
                  } else if (editingColorIndex !== null) {
                    if (fromIndex < editingColorIndex && toIndex >= editingColorIndex) {
                      setEditingColorIndex(editingColorIndex - 1);
                    } else if (fromIndex > editingColorIndex && toIndex <= editingColorIndex) {
                      setEditingColorIndex(editingColorIndex + 1);
                    }
                  }
                }
              }}
            >
              <div 
                className={`h-12 rounded-lg shadow-lg ring-1 ring-white/10 transition-all hover:scale-105 cursor-grab active:cursor-grabbing ${editingColorIndex === i ? 'ring-2 ring-purple-500' : ''}`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingColorIndex(editingColorIndex === i ? null : i);
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
              <div className="text-xs text-center text-gray-400 mt-1.5 font-mono">
                {color.toUpperCase()}
              </div>
              
              {/* Inline color editor - positioned fixed to avoid clipping */}
              {editingColorIndex === i && (
                <div 
                  className="fixed z-[9999]"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black/30"
                    onClick={() => setEditingColorIndex(null)}
                  />
                  
                  {/* Editor panel */}
                  <div 
                    className="relative bg-gray-800 rounded-xl p-5 shadow-2xl border border-gray-600 min-w-[280px]"
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-white">Editar color {i + 1}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingColorIndex(null);
                        }}
                        className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Color preview */}
                    <div 
                      className="w-full h-20 rounded-lg mb-4 shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                    
                    {/* Color picker and HEX input */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(i, e.target.value)}
                          onMouseDown={e => e.stopPropagation()}
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => e.stopPropagation()}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-600 bg-transparent"
                          style={{ padding: 0 }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Código HEX</label>
                        <input
                          type="text"
                          value={color.toUpperCase()}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('#')) val = '#' + val;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val) && val.length === 7) {
                              handleColorChange(i, val);
                            }
                          }}
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => e.stopPropagation()}
                          className="w-full bg-gray-700 text-white text-base font-mono px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const hsl = hexToHsl(color);
                          handleColorChange(i, hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 15)));
                        }}
                        onMouseDown={e => e.stopPropagation()}
                        className="py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors font-medium"
                      >
                        +Claro
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const hsl = hexToHsl(color);
                          handleColorChange(i, hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 15)));
                        }}
                        onMouseDown={e => e.stopPropagation()}
                        className="py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors font-medium"
                      >
                        +Oscuro
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingColorIndex(null);
                        }}
                        onMouseDown={e => e.stopPropagation()}
                        className="py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors font-medium"
                      >
                        ✓ Listo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
