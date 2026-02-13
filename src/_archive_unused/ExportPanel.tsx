import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportPanelProps {
  colors: string[];
  paletteName: string;
}

type ExportFormat = 'png' | 'pdf' | 'svg' | 'code';
type LayoutStyle = 'horizontal' | 'vertical' | 'grid' | 'cards' | 'circle';

interface ExportElement {
  id: string;
  label: string;
  enabled: boolean;
  category: 'basic' | 'info' | 'visual' | 'analysis';
}

// Utility functions
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

function getContrastColor(hex: string): string {
  const { l } = hexToHsl(hex);
  return l > 55 ? '#1a1a2e' : '#ffffff';
}

function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ExportPanel({ colors, paletteName }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [layout, setLayout] = useState<LayoutStyle>('horizontal');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showDarkBg, setShowDarkBg] = useState(false);
  const [includeWhiteBorder, setIncludeWhiteBorder] = useState(true);
  const [exportSize, setExportSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [notification, setNotification] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<ExportElement[]>([
    // Basic
    { id: 'palette', label: 'Paleta de colores', enabled: true, category: 'basic' },
    { id: 'name', label: 'Nombre de la paleta', enabled: true, category: 'basic' },
    
    // Info
    { id: 'hexCodes', label: 'Códigos HEX', enabled: true, category: 'info' },
    { id: 'rgbCodes', label: 'Códigos RGB', enabled: false, category: 'info' },
    { id: 'hslCodes', label: 'Códigos HSL', enabled: false, category: 'info' },
    { id: 'colorNames', label: 'Nombres descriptivos', enabled: false, category: 'info' },
    
    // Visual
    { id: 'colorWheel', label: 'Rueda de color', enabled: false, category: 'visual' },
    { id: 'gradient', label: 'Vista gradiente', enabled: false, category: 'visual' },
    { id: 'application', label: 'Ejemplo de aplicación', enabled: false, category: 'visual' },
    { id: 'mockup', label: 'Mockup UI', enabled: false, category: 'visual' },
    
    // Analysis
    { id: 'contrast', label: 'Matriz de contraste', enabled: false, category: 'analysis' },
    { id: 'accessibility', label: 'Puntuación accesibilidad', enabled: false, category: 'analysis' },
    { id: 'harmony', label: 'Tipo de armonía', enabled: false, category: 'analysis' },
    { id: 'stats', label: 'Estadísticas (sat/lum)', enabled: false, category: 'analysis' },
  ]);

  const toggleElement = (id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, enabled: !el.enabled } : el
    ));
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isEnabled = (id: string) => elements.find(el => el.id === id)?.enabled;

  // Get approximate color name
  const getColorName = (hex: string): string => {
    const hsl = hexToHsl(hex);
    const { h, s, l } = hsl;
    
    if (s < 10) {
      if (l < 20) return 'Negro';
      if (l < 40) return 'Gris oscuro';
      if (l < 60) return 'Gris';
      if (l < 80) return 'Gris claro';
      return 'Blanco';
    }
    
    let name = '';
    if (h < 15 || h >= 345) name = 'Rojo';
    else if (h < 45) name = 'Naranja';
    else if (h < 75) name = 'Amarillo';
    else if (h < 150) name = 'Verde';
    else if (h < 210) name = 'Cian';
    else if (h < 270) name = 'Azul';
    else if (h < 315) name = 'Púrpura';
    else name = 'Rosa';
    
    if (l < 30) return name + ' oscuro';
    if (l > 70) return name + ' claro';
    if (s < 50) return name + ' apagado';
    return name;
  };

  // Detect harmony type
  const getHarmonyType = (): string => {
    if (colors.length < 2) return 'Monocromático';
    
    const hues = colors.map(c => hexToHsl(c).h);
    const diffs: number[] = [];
    
    for (let i = 1; i < hues.length; i++) {
      let diff = Math.abs(hues[i] - hues[0]);
      if (diff > 180) diff = 360 - diff;
      diffs.push(diff);
    }
    
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    
    if (avgDiff < 30) return 'Análogo';
    if (diffs.some(d => d > 150 && d < 210)) return 'Complementario';
    if (avgDiff > 100 && avgDiff < 140) return 'Triádico';
    return 'Personalizado';
  };

  // Calculate stats
  const getStats = () => {
    const hsls = colors.map(c => hexToHsl(c));
    const avgSat = Math.round(hsls.reduce((a, b) => a + b.s, 0) / hsls.length);
    const avgLum = Math.round(hsls.reduce((a, b) => a + b.l, 0) / hsls.length);
    return { avgSat, avgLum };
  };

  // Export functions
  const exportAsPNG = async () => {
    if (!previewRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: showDarkBg ? '#1a1a2e' : backgroundColor,
        scale: exportSize === 'small' ? 1 : exportSize === 'medium' ? 2 : 3,
      });
      
      const link = document.createElement('a');
      link.download = `${paletteName || 'paleta'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showNotif('✅ PNG descargado');
    } catch {
      showNotif('❌ Error al exportar PNG');
    }
  };

  const exportAsSVG = () => {
    const width = 800;
    const height = 200;
    const colorWidth = width / colors.length;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="${showDarkBg ? '#1a1a2e' : backgroundColor}"/>`;
    
    colors.forEach((color, i) => {
      svg += `<rect x="${i * colorWidth}" y="20" width="${colorWidth - 4}" height="${height - 40}" rx="8" fill="${color}"/>`;
      if (isEnabled('hexCodes')) {
        svg += `<text x="${i * colorWidth + colorWidth/2}" y="${height - 30}" text-anchor="middle" font-family="monospace" font-size="12" fill="${getContrastColor(color)}">${color.toUpperCase()}</text>`;
      }
    });
    
    if (isEnabled('name') && paletteName) {
      svg += `<text x="${width/2}" y="15" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="${showDarkBg ? '#ffffff' : '#333333'}">${paletteName}</text>`;
    }
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${paletteName || 'paleta'}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    showNotif('✅ SVG descargado');
  };

  const exportAsCode = (type: 'css' | 'json' | 'tailwind' | 'scss') => {
    let code = '';
    
    switch (type) {
      case 'css':
        code = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
        break;
      case 'json':
        code = JSON.stringify({ name: paletteName, colors }, null, 2);
        break;
      case 'tailwind':
        code = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${colors.map((c, i) => `          '${i + 1}': '${c}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`;
        break;
      case 'scss':
        code = `// ${paletteName || 'Palette'} Colors\n${colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n')}`;
        break;
    }
    
    navigator.clipboard.writeText(code);
    showNotif(`✅ ${type.toUpperCase()} copiado al portapapeles`);
  };

  const formats: { id: ExportFormat; label: string; icon: string }[] = [
    { id: 'png', label: 'PNG', icon: '🖼️' },
    { id: 'svg', label: 'SVG', icon: '📐' },
    { id: 'pdf', label: 'PDF', icon: '📄' },
    { id: 'code', label: 'Código', icon: '💻' },
  ];

  const layouts: { id: LayoutStyle; label: string; icon: string }[] = [
    { id: 'horizontal', label: 'Horizontal', icon: '▭' },
    { id: 'vertical', label: 'Vertical', icon: '▯' },
    { id: 'grid', label: 'Cuadrícula', icon: '⊞' },
    { id: 'cards', label: 'Tarjetas', icon: '🃏' },
    { id: 'circle', label: 'Círculo', icon: '◐' },
  ];

  const categories = [
    { id: 'basic', label: 'Básico', icon: '📋' },
    { id: 'info', label: 'Información', icon: 'ℹ️' },
    { id: 'visual', label: 'Visual', icon: '🎨' },
    { id: 'analysis', label: 'Análisis', icon: '📊' },
  ];

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Format selector */}
      <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <span>📁</span> Formato de exportación
        </h3>
        <div className="flex gap-2 flex-wrap">
          {formats.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                format === f.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Options */}
        <div className="space-y-4">
          {/* Layout style (for image formats) */}
          {(format === 'png' || format === 'svg' || format === 'pdf') && (
            <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <span>📐</span> Disposición
              </h3>
              <div className="flex gap-2 flex-wrap">
                {layouts.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      layout === l.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    <span>{l.icon}</span>
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Background options */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <label className="text-sm text-gray-400 mb-3 block">Fondo</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setShowDarkBg(false); setBackgroundColor('#ffffff'); }}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      !showDarkBg && backgroundColor === '#ffffff' 
                        ? 'border-purple-500 scale-110' 
                        : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                  <button
                    onClick={() => setShowDarkBg(true)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      showDarkBg 
                        ? 'border-purple-500 scale-110' 
                        : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: '#1a1a2e' }}
                  />
                  <button
                    onClick={() => { setShowDarkBg(false); setBackgroundColor(colors[0]); }}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      !showDarkBg && backgroundColor === colors[0] 
                        ? 'border-purple-500 scale-110' 
                        : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: colors[0] }}
                  />
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => { setShowDarkBg(false); setBackgroundColor(e.target.value); }}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                  <label className="flex items-center gap-2 ml-4 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={includeWhiteBorder}
                      onChange={(e) => setIncludeWhiteBorder(e.target.checked)}
                      className="rounded"
                    />
                    Borde blanco
                  </label>
                </div>
              </div>

              {/* Size */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <label className="text-sm text-gray-400 mb-3 block">Tamaño de exportación</label>
                <div className="flex gap-2">
                  {[
                    { id: 'small', label: 'Pequeño (1x)' },
                    { id: 'medium', label: 'Mediano (2x)' },
                    { id: 'large', label: 'Grande (3x)' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setExportSize(s.id as typeof exportSize)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        exportSize === s.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Elements to include */}
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span>✅</span> Elementos a incluir
            </h3>
            
            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat.id}>
                  <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {elements
                      .filter(el => el.category === cat.id)
                      .map(el => (
                        <button
                          key={el.id}
                          onClick={() => toggleElement(el.id)}
                          className={`px-3 py-2 rounded-lg text-sm text-left transition-all flex items-center gap-2 ${
                            el.enabled
                              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                              : 'bg-gray-700/30 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                            el.enabled ? 'bg-purple-500 text-white' : 'bg-gray-600'
                          }`}>
                            {el.enabled ? '✓' : ''}
                          </span>
                          {el.label}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code export options */}
          {format === 'code' && (
            <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <span>💻</span> Exportar código
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'css', label: 'CSS Variables', icon: '🎨' },
                  { id: 'scss', label: 'SCSS Variables', icon: '💅' },
                  { id: 'json', label: 'JSON', icon: '📋' },
                  { id: 'tailwind', label: 'Tailwind Config', icon: '🌬️' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => exportAsCode(opt.id as 'css' | 'json' | 'tailwind' | 'scss')}
                    className="px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl text-sm transition-all flex items-center gap-2 border border-gray-600/50 hover:border-gray-500/50"
                  >
                    <span>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <span>👁️</span> Vista previa
              </h3>
              {format !== 'code' && (
                <button
                  onClick={format === 'svg' ? exportAsSVG : exportAsPNG}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>⬇️</span>
                  Descargar {format.toUpperCase()}
                </button>
              )}
            </div>

            {/* Preview container */}
            <div 
              ref={previewRef}
              className="rounded-xl overflow-hidden transition-all"
              style={{ 
                backgroundColor: showDarkBg ? '#1a1a2e' : backgroundColor,
                padding: includeWhiteBorder ? '24px' : '0'
              }}
            >
              {/* Palette name */}
              {isEnabled('name') && paletteName && (
                <h4 
                  className="text-center font-bold mb-4"
                  style={{ color: showDarkBg ? '#ffffff' : '#333333' }}
                >
                  {paletteName}
                </h4>
              )}

              {/* Palette display based on layout */}
              {isEnabled('palette') && (
                <div className="mb-4">
                  {layout === 'horizontal' && (
                    <div className="flex h-24 rounded-xl overflow-hidden">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 flex items-end justify-center pb-2"
                          style={{ backgroundColor: color }}
                        >
                          {isEnabled('hexCodes') && (
                            <span 
                              className="text-xs font-mono px-1 rounded"
                              style={{ color: getContrastColor(color), backgroundColor: 'rgba(0,0,0,0.15)' }}
                            >
                              {color.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {layout === 'vertical' && (
                    <div className="flex flex-col gap-2">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="h-12 rounded-lg flex items-center px-4 justify-between"
                          style={{ backgroundColor: color }}
                        >
                          {isEnabled('colorNames') && (
                            <span className="text-sm font-medium" style={{ color: getContrastColor(color) }}>
                              {getColorName(color)}
                            </span>
                          )}
                          {isEnabled('hexCodes') && (
                            <span className="text-xs font-mono" style={{ color: getContrastColor(color) }}>
                              {color.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {layout === 'grid' && (
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          {isEnabled('hexCodes') && (
                            <span className="text-xs font-mono" style={{ color: getContrastColor(color) }}>
                              {color.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {layout === 'cards' && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-24 flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                          style={{ backgroundColor: showDarkBg ? '#2a2a3e' : '#f5f5f5' }}
                        >
                          <div className="h-20" style={{ backgroundColor: color }} />
                          <div className="p-2 text-center">
                            {isEnabled('hexCodes') && (
                              <span 
                                className="text-xs font-mono block"
                                style={{ color: showDarkBg ? '#ffffff' : '#333333' }}
                              >
                                {color.toUpperCase()}
                              </span>
                            )}
                            {isEnabled('colorNames') && (
                              <span 
                                className="text-xs block mt-1"
                                style={{ color: showDarkBg ? '#aaaaaa' : '#666666' }}
                              >
                                {getColorName(color)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {layout === 'circle' && (
                    <div className="flex justify-center py-4">
                      <div className="relative w-48 h-48">
                        {colors.map((color, i) => {
                          const angle = (i / colors.length) * 360 - 90;
                          const rad = (angle * Math.PI) / 180;
                          const size = 50;
                          const radius = 70;
                          return (
                            <div
                              key={i}
                              className="absolute rounded-full flex items-center justify-center shadow-lg"
                              style={{
                                backgroundColor: color,
                                width: size,
                                height: size,
                                left: `calc(50% + ${Math.cos(rad) * radius}px - ${size/2}px)`,
                                top: `calc(50% + ${Math.sin(rad) * radius}px - ${size/2}px)`,
                              }}
                            >
                              {isEnabled('hexCodes') && (
                                <span className="text-[8px] font-mono" style={{ color: getContrastColor(color) }}>
                                  {color.slice(1, 4).toUpperCase()}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RGB/HSL codes */}
              {(isEnabled('rgbCodes') || isEnabled('hslCodes')) && (
                <div 
                  className="text-xs font-mono space-y-1 mt-4 p-3 rounded-lg"
                  style={{ 
                    backgroundColor: showDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: showDarkBg ? '#aaaaaa' : '#666666'
                  }}
                >
                  {colors.map((color, i) => {
                    const rgb = hexToRgb(color);
                    const hsl = hexToHsl(color);
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                        {isEnabled('rgbCodes') && <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>}
                        {isEnabled('hslCodes') && <span>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Color wheel */}
              {isEnabled('colorWheel') && (
                <div className="mt-4 flex justify-center">
                  <div className="relative w-40 h-40">
                    {/* Color wheel background */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, hsl(0,80%,50%), hsl(60,80%,50%), hsl(120,80%,50%), hsl(180,80%,50%), hsl(240,80%,50%), hsl(300,80%,50%), hsl(360,80%,50%))'
                      }}
                    />
                    <div 
                      className="absolute inset-4 rounded-full"
                      style={{ backgroundColor: showDarkBg ? '#1a1a2e' : backgroundColor }}
                    />
                    {/* Color positions */}
                    {colors.map((color, i) => {
                      const hsl = hexToHsl(color);
                      const angle = hsl.h - 90;
                      const rad = (angle * Math.PI) / 180;
                      const radius = 55;
                      return (
                        <div
                          key={i}
                          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg"
                          style={{
                            backgroundColor: color,
                            left: `calc(50% + ${Math.cos(rad) * radius}px - 10px)`,
                            top: `calc(50% + ${Math.sin(rad) * radius}px - 10px)`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gradient view */}
              {isEnabled('gradient') && (
                <div className="mt-4">
                  <div 
                    className="h-12 rounded-lg"
                    style={{
                      background: `linear-gradient(90deg, ${colors.join(', ')})`
                    }}
                  />
                </div>
              )}

              {/* Application example */}
              {isEnabled('application') && (
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors[0] }}>
                  <h5 className="font-bold mb-2" style={{ color: colors[colors.length - 1] || '#ffffff' }}>
                    Título de ejemplo
                  </h5>
                  <p className="text-sm mb-3" style={{ color: getContrastColor(colors[0]) }}>
                    Texto de ejemplo para ver la legibilidad.
                  </p>
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ 
                      backgroundColor: colors[1] || colors[0], 
                      color: getContrastColor(colors[1] || colors[0]) 
                    }}
                  >
                    Botón
                  </button>
                </div>
              )}

              {/* Mockup UI */}
              {isEnabled('mockup') && (
                <div className="mt-4 rounded-xl overflow-hidden border" style={{ borderColor: showDarkBg ? '#333' : '#ddd' }}>
                  {/* Header */}
                  <div className="h-8 flex items-center px-3 gap-2" style={{ backgroundColor: colors[0] }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[1] || '#ffffff' }} />
                    <div className="flex-1 h-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  {/* Body */}
                  <div className="p-3 flex gap-2" style={{ backgroundColor: showDarkBg ? '#2a2a3e' : '#f9f9f9' }}>
                    {/* Sidebar */}
                    <div className="w-16 space-y-2">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="h-4 rounded" style={{ backgroundColor: colors[i % colors.length] + '40' }} />
                      ))}
                    </div>
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="h-12 rounded" style={{ backgroundColor: colors[0] + '30' }} />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 rounded" style={{ backgroundColor: colors[1] }} />
                        <div className="h-8 rounded" style={{ backgroundColor: colors[2] || colors[0] }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contrast matrix */}
              {isEnabled('contrast') && (
                <div className="mt-4">
                  <p 
                    className="text-xs mb-2"
                    style={{ color: showDarkBg ? '#888888' : '#666666' }}
                  >
                    Matriz de contraste
                  </p>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}>
                    {colors.map((c1, i) => (
                      colors.map((c2, j) => {
                        if (i >= j) return <div key={`${i}-${j}`} />;
                        const ratio = getContrastRatio(c1, c2);
                        return (
                          <div
                            key={`${i}-${j}`}
                            className="aspect-square rounded text-[8px] flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
                              color: ratio >= 4.5 ? '#22c55e' : ratio >= 3 ? '#eab308' : '#ef4444'
                            }}
                          >
                            <span className="bg-black/50 px-1 rounded">{ratio.toFixed(1)}</span>
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility score */}
              {isEnabled('accessibility') && (
                <div 
                  className="mt-4 p-3 rounded-lg text-center"
                  style={{ 
                    backgroundColor: showDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: showDarkBg ? '#ffffff' : '#333333'
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: showDarkBg ? '#888888' : '#666666' }}>
                    Puntuación de accesibilidad
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(colors.reduce((acc, c1, i) => {
                      const scores = colors.slice(i + 1).map(c2 => getContrastRatio(c1, c2) >= 4.5 ? 1 : 0);
                      return acc + (scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 1);
                    }, 0) / Math.max(1, colors.length - 1) * 100)}%
                  </p>
                </div>
              )}

              {/* Harmony type */}
              {isEnabled('harmony') && (
                <div 
                  className="mt-4 p-3 rounded-lg text-center"
                  style={{ 
                    backgroundColor: showDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: showDarkBg ? '#ffffff' : '#333333'
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: showDarkBg ? '#888888' : '#666666' }}>
                    Tipo de armonía
                  </p>
                  <p className="text-lg font-bold">{getHarmonyType()}</p>
                </div>
              )}

              {/* Stats */}
              {isEnabled('stats') && (
                <div 
                  className="mt-4 p-3 rounded-lg grid grid-cols-2 gap-4"
                  style={{ 
                    backgroundColor: showDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: showDarkBg ? '#ffffff' : '#333333'
                  }}
                >
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: showDarkBg ? '#888888' : '#666666' }}>
                      Saturación media
                    </p>
                    <p className="text-lg font-bold">{stats.avgSat}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: showDarkBg ? '#888888' : '#666666' }}>
                      Luminosidad media
                    </p>
                    <p className="text-lg font-bold">{stats.avgLum}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
            <p className="text-purple-200 text-sm flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                {format === 'png' && 'PNG es ideal para compartir en redes sociales o presentaciones.'}
                {format === 'svg' && 'SVG es perfecto para escalabilidad sin pérdida de calidad.'}
                {format === 'pdf' && 'PDF es excelente para documentación profesional.'}
                {format === 'code' && 'Exporta el código listo para usar en tu proyecto.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700 z-50"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
