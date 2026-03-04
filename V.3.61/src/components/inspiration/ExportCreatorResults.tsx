import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface ExportOption {
  id: string;
  name: string;
  icon: string;
}

interface ArchetypeItem {
  category: string;
  concept: string;
  color: string;
  isCustom?: boolean;
}

interface AxisItem {
  id: string;
  value: number;
  leftTerm: string;
  rightTerm: string;
  leftColors: string[];
  rightColors: string[];
}

interface ShapeItem {
  id: string;
  name: string;
  customName?: string;
  color: string;
  category: string;
  svg: React.ReactNode;
}

interface ExportCreatorResultsProps {
  type: 'archetypes-tinder' | 'archetypes-comparative' | 'shapes-tinder' | 'shapes-remaining';
  paletteName?: string;
  selectedItems?: ArchetypeItem[] | ShapeItem[];
  axes?: AxisItem[];
  remainingShapes?: ShapeItem[];
  suggestedPalettes?: string[][];
  colorCount?: number;
}

export const ExportCreatorResults: React.FC<ExportCreatorResultsProps> = ({
  type,
  paletteName = 'Mi Paleta',
  selectedItems = [],
  axes = [],
  remainingShapes = [],
  suggestedPalettes = [],
  colorCount = 5
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedExport, setSelectedExport] = useState<string>('concepts');
  const [exportStyle, setExportStyle] = useState<'modern' | 'minimal' | 'vibrant' | 'elegant' | 'corporate'>('modern');
  const exportRef = useRef<HTMLDivElement>(null);

  // Estilos de exportación
  const exportStyles = {
    modern: {
      name: 'Moderno',
      icon: '🌙',
      background: 'linear-gradient(135deg, rgb(17, 24, 39), rgb(17, 24, 39), rgba(88, 28, 135, 0.3))',
      textColor: 'white',
      subtextColor: 'rgb(156, 163, 175)',
      cardBg: 'rgba(31, 41, 55, 0.6)',
      accentColor: 'rgb(192, 132, 252)',
      borderColor: 'rgb(55, 65, 81)'
    },
    minimal: {
      name: 'Minimalista',
      icon: '◯',
      background: 'linear-gradient(135deg, rgb(250, 250, 250), rgb(245, 245, 245))',
      textColor: 'rgb(17, 24, 39)',
      subtextColor: 'rgb(107, 114, 128)',
      cardBg: 'rgb(255, 255, 255)',
      accentColor: 'rgb(79, 70, 229)',
      borderColor: 'rgb(229, 231, 235)'
    },
    vibrant: {
      name: 'Vibrante',
      icon: '🌈',
      background: 'linear-gradient(135deg, rgb(79, 70, 229), rgb(147, 51, 234), rgb(236, 72, 153))',
      textColor: 'white',
      subtextColor: 'rgba(255, 255, 255, 0.8)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      accentColor: 'rgb(253, 224, 71)',
      borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    elegant: {
      name: 'Elegante',
      icon: '✧',
      background: 'linear-gradient(135deg, rgb(0, 0, 0), rgb(17, 17, 17))',
      textColor: 'white',
      subtextColor: 'rgb(163, 163, 163)',
      cardBg: 'rgba(38, 38, 38, 0.8)',
      accentColor: 'rgb(212, 175, 55)',
      borderColor: 'rgb(64, 64, 64)'
    },
    corporate: {
      name: 'Corporativo',
      icon: '▣',
      background: 'linear-gradient(135deg, rgb(241, 245, 249), rgb(226, 232, 240))',
      textColor: 'rgb(30, 41, 59)',
      subtextColor: 'rgb(100, 116, 139)',
      cardBg: 'rgb(255, 255, 255)',
      accentColor: 'rgb(59, 130, 246)',
      borderColor: 'rgb(203, 213, 225)'
    }
  };

  const currentStyle = exportStyles[exportStyle];

  const exportOptions: ExportOption[] = type === 'archetypes-tinder' 
    ? [
        { id: 'concepts', name: 'Conceptos y colores', icon: '🎭' },
        { id: 'palettes', name: 'Paletas sugeridas', icon: '🎨' },
        { id: 'complete', name: 'Completo', icon: '📋' }
      ]
    : type === 'archetypes-comparative'
    ? [
        { id: 'axes', name: 'Ejes de arquetipos', icon: '⚖️' },
        { id: 'palettes', name: 'Paletas sugeridas', icon: '🎨' },
        { id: 'complete', name: 'Completo', icon: '📋' }
      ]
    : type === 'shapes-tinder'
    ? [
        { id: 'shapes', name: 'Formas y colores', icon: '◇' },
        { id: 'palettes', name: 'Paletas sugeridas', icon: '🎨' },
        { id: 'complete', name: 'Completo', icon: '📋' }
      ]
    : [
        { id: 'remaining', name: 'Formas disponibles', icon: '◈' },
        { id: 'complete', name: 'Completo', icon: '📋' }
      ];

  // Convert any modern color format to RGB for html2canvas compatibility
  const convertColorToRgb = (colorValue: string): string => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return colorValue;
      ctx.fillStyle = colorValue;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      if (a === 0) return 'transparent';
      return a < 255 ? `rgba(${r},${g},${b},${(a/255).toFixed(2)})` : `rgb(${r},${g},${b})`;
    } catch {
      return colorValue;
    }
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    let tempWrapper: HTMLDivElement | null = null;
    
    try {
      const elementToExport = exportRef.current;
      
      // Create a temporary wrapper off-screen
      tempWrapper = document.createElement('div');
      tempWrapper.style.cssText = 'position:absolute;left:-9999px;top:0;';
      document.body.appendChild(tempWrapper);
      
      // Deep clone the element
      const clonedElement = elementToExport.cloneNode(true) as HTMLElement;
      tempWrapper.appendChild(clonedElement);
      
      // Helper function to sanitize a single element
      const sanitizeElement = (sourceEl: Element, targetEl: HTMLElement) => {
        try {
          const computed = window.getComputedStyle(sourceEl);
          
          // Sanitize color properties
          const colorProps = [
            'color', 'background-color', 'border-color',
            'border-top-color', 'border-right-color',
            'border-bottom-color', 'border-left-color',
            'outline-color'
          ];
          
          colorProps.forEach(prop => {
            const val = computed.getPropertyValue(prop);
            if (val) {
              targetEl.style.setProperty(prop, convertColorToRgb(val), 'important');
            }
          });
          
          // Remove box-shadow (can contain modern colors)
          targetEl.style.setProperty('box-shadow', 'none', 'important');
          
          // Handle background-image - remove if it contains modern colors
          const bgImage = computed.getPropertyValue('background-image');
          if (bgImage && bgImage !== 'none') {
            if (bgImage.includes('oklab') || bgImage.includes('oklch') || 
                bgImage.includes('lab(') || bgImage.includes('lch(')) {
              targetEl.style.setProperty('background-image', 'none', 'important');
            }
          }
          
          // Copy layout styles
          ['display', 'flex-direction', 'align-items', 'justify-content', 'gap',
           'padding', 'margin', 'width', 'height', 'min-width', 'max-width',
           'border-radius', 'font-size', 'font-weight', 'font-family', 
           'text-align', 'line-height', 'overflow', 'position',
           'top', 'left', 'right', 'bottom', 'transform', 'grid-template-columns',
           'flex', 'flex-grow', 'flex-shrink', 'flex-wrap'
          ].forEach(prop => {
            const val = computed.getPropertyValue(prop);
            if (val && val !== 'auto' && val !== 'none' && val !== 'normal') {
              targetEl.style.setProperty(prop, val);
            }
          });
        } catch {
          // Ignore individual element errors
        }
      };
      
      // Sanitize the root element
      sanitizeElement(elementToExport, clonedElement);
      
      // Sanitize all children
      const sourceChildren = elementToExport.querySelectorAll('*');
      const targetChildren = clonedElement.querySelectorAll('*');
      sourceChildren.forEach((source, idx) => {
        if (targetChildren[idx]) {
          sanitizeElement(source, targetChildren[idx] as HTMLElement);
        }
      });
      
      // Use html2canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        backgroundColor: '#1a1a2e',
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false
      });
      
      // Clean up
      if (tempWrapper) {
        document.body.removeChild(tempWrapper);
        tempWrapper = null;
      }
      
      // Download the image
      const link = document.createElement('a');
      const typeName = type.replace('-', '_');
      link.download = `${paletteName.replace(/\s+/g, '_')}_${typeName}_${selectedExport}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      // Ensure cleanup
      if (tempWrapper && document.body.contains(tempWrapper)) {
        document.body.removeChild(tempWrapper);
      }
      setIsExporting(false);
    }
  };

  const renderConceptsList = () => {
    const items = selectedItems as ArchetypeItem[];
    const style = currentStyle;
    const isMinimal = exportStyle === 'minimal';
    const isVibrant = exportStyle === 'vibrant';
    const isElegant = exportStyle === 'elegant';
    
    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 p-4"
            style={{ 
              backgroundColor: isMinimal ? 'transparent' : style.cardBg,
              borderRadius: isMinimal ? '0' : isVibrant ? '16px' : '12px',
              borderBottom: isMinimal ? `1px solid ${style.borderColor}` : 'none',
              borderLeft: isVibrant ? `4px solid ${item.color}` : isElegant ? `2px solid ${style.accentColor}` : 'none',
              border: !isMinimal && !isVibrant ? `1px solid ${style.borderColor}` : undefined,
              boxShadow: isVibrant ? `0 4px 20px ${item.color}30` : 'none'
            }}
          >
            <div 
              className="w-10 h-10 flex items-center justify-center text-xl font-bold"
              style={{ 
                backgroundColor: isMinimal ? 'transparent' : style.cardBg,
                color: style.subtextColor,
                borderRadius: isVibrant ? '50%' : '8px',
                border: isMinimal ? `1px solid ${style.borderColor}` : 'none'
              }}
            >
              {idx + 1}
            </div>
            <div 
              className="w-12 h-12"
              style={{ 
                backgroundColor: item.color,
                borderRadius: isVibrant ? '16px' : isElegant ? '4px' : '12px',
                border: isElegant ? `2px solid ${style.accentColor}` : 'none'
              }}
            />
            <div className="flex-1">
              <p className="font-semibold" style={{ color: style.textColor, fontFamily: isElegant ? 'Georgia, serif' : 'inherit' }}>{item.concept}</p>
              <p className="text-sm" style={{ color: style.subtextColor }}>{item.category}{item.isCustom ? ' ✦' : ''}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm" style={{ color: style.subtextColor }}>{item.color}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAxesList = () => {
    const style = currentStyle;
    const isMinimal = exportStyle === 'minimal';
    const isVibrant = exportStyle === 'vibrant';
    const isElegant = exportStyle === 'elegant';
    
    return (
      <div className="space-y-4">
        {axes.map((axis, idx) => {
          const position = ((axis.value + 2) / 4) * 100;
          return (
            <div 
              key={idx} 
              className="p-5"
              style={{ 
                backgroundColor: isMinimal ? 'transparent' : style.cardBg,
                borderRadius: isVibrant ? '20px' : '12px',
                border: isMinimal ? `1px solid ${style.borderColor}` : isElegant ? `1px solid ${style.accentColor}` : `1px solid ${style.borderColor}`,
                boxShadow: isVibrant ? `0 4px 20px rgba(147, 51, 234, 0.2)` : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex" style={{ marginLeft: '-4px' }}>
                    {axis.leftColors.slice(0, 3).map((c, i) => (
                      <div 
                        key={i}
                        className="w-6 h-6"
                        style={{ 
                          backgroundColor: c, 
                          border: isElegant ? `1px solid ${style.accentColor}` : `2px solid ${isMinimal ? style.borderColor : 'rgb(17, 24, 39)'}`, 
                          marginLeft: i > 0 ? '-6px' : '0',
                          borderRadius: isMinimal ? '0' : isElegant ? '2px' : '50%'
                        }}
                      />
                    ))}
                  </div>
                  <span 
                    className="font-semibold text-lg" 
                    style={{ 
                      color: axis.value < 0 ? style.textColor : style.subtextColor,
                      fontFamily: isElegant ? 'Georgia, serif' : 'inherit'
                    }}
                  >
                    {axis.leftTerm}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="font-semibold text-lg" 
                    style={{ 
                      color: axis.value > 0 ? style.textColor : style.subtextColor,
                      fontFamily: isElegant ? 'Georgia, serif' : 'inherit'
                    }}
                  >
                    {axis.rightTerm}
                  </span>
                  <div className="flex" style={{ marginLeft: '-4px' }}>
                    {axis.rightColors.slice(0, 3).map((c, i) => (
                      <div 
                        key={i}
                        className="w-6 h-6"
                        style={{ 
                          backgroundColor: c, 
                          border: isElegant ? `1px solid ${style.accentColor}` : `2px solid ${isMinimal ? style.borderColor : 'rgb(17, 24, 39)'}`, 
                          marginLeft: i > 0 ? '-6px' : '0',
                          borderRadius: isMinimal ? '0' : isElegant ? '2px' : '50%'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Scale bar */}
              <div 
                className="relative overflow-hidden" 
                style={{ 
                  height: isVibrant ? '16px' : '12px',
                  backgroundColor: isMinimal ? style.borderColor : 'rgb(55, 65, 81)',
                  borderRadius: isMinimal ? '0' : isVibrant ? '8px' : '6px'
                }}
              >
                <div 
                  className="absolute inset-y-0 left-0"
                  style={{ 
                    width: `${position}%`,
                    background: isVibrant 
                      ? `linear-gradient(to right, ${axis.leftColors[0]}, ${style.accentColor}, ${axis.rightColors[0]})`
                      : `linear-gradient(to right, ${axis.leftColors[0]}, ${axis.rightColors[0]})`,
                    borderRadius: isMinimal ? '0' : '6px'
                  }}
                />
                <div 
                  className="absolute"
                  style={{ 
                    width: isVibrant ? '20px' : '16px',
                    height: isVibrant ? '20px' : '16px',
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    left: `calc(${position}% - ${isVibrant ? '10px' : '8px'})`,
                    backgroundColor: isElegant ? style.accentColor : 'white',
                    border: isElegant ? `2px solid ${style.accentColor}` : `3px solid rgb(17, 24, 39)`,
                    borderRadius: isMinimal ? '0' : '50%',
                    boxShadow: isVibrant ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-xs" style={{ color: style.subtextColor }}>
                <span>100%</span>
                <span>50%</span>
                <span style={{ color: style.accentColor }}>○</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderShapesList = () => {
    const items = selectedItems as ShapeItem[];
    return (
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: 'rgba(31, 41, 55, 0.6)' }}>
            <div className="w-8 h-8 flex items-center justify-center text-lg font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {idx + 1}
            </div>
            <div 
              className="w-16 h-16 flex-shrink-0"
              style={{ color: item.color }}
            >
              {item.svg}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: 'white' }}>
                {item.customName || item.name}
              </p>
              <p className="text-sm" style={{ color: 'rgb(156, 163, 175)' }}>{item.category}</p>
              <p className="font-mono text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{item.color}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRemainingShapes = () => {
    return (
      <div className="grid grid-cols-4 gap-3">
        {remainingShapes.map((shape, idx) => (
          <div key={idx} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(31, 41, 55, 0.6)' }}>
            <div 
              className="w-10 h-10 mx-auto mb-2"
              style={{ color: shape.color }}
            >
              {shape.svg}
            </div>
            <p className="text-xs truncate" style={{ color: 'rgb(156, 163, 175)' }}>{shape.name}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderPalettes = () => {
    const style = currentStyle;
    const isMinimal = exportStyle === 'minimal';
    const isVibrant = exportStyle === 'vibrant';
    const isElegant = exportStyle === 'elegant';
    
    return (
      <div className="space-y-4">
        {suggestedPalettes.map((palette, idx) => (
          <div 
            key={idx} 
            className="p-4"
            style={{ 
              backgroundColor: isMinimal ? 'transparent' : style.cardBg,
              borderRadius: isVibrant ? '20px' : '12px',
              border: isMinimal ? `1px solid ${style.borderColor}` : isElegant ? `1px solid ${style.accentColor}` : `1px solid ${style.borderColor}`,
              boxShadow: isVibrant ? '0 8px 30px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <p className="text-sm mb-3" style={{ color: style.subtextColor, fontFamily: isElegant ? 'Georgia, serif' : 'inherit' }}>
              {isElegant ? `Variación ${['I', 'II', 'III'][idx] || idx + 1}` : `Variación ${idx + 1}`}
            </p>
            <div className="flex gap-2 h-20" style={{ gap: isVibrant ? '4px' : isMinimal ? '8px' : '4px' }}>
              {palette.map((color, colorIdx) => (
                <div 
                  key={colorIdx}
                  className="flex-1 flex items-end justify-center pb-2"
                  style={{ 
                    backgroundColor: color,
                    borderRadius: isVibrant ? '12px' : isMinimal ? '0' : isElegant ? '2px' : '8px',
                    border: isElegant ? `1px solid ${style.accentColor}` : 'none'
                  }}
                >
                  <span 
                    className="text-xs font-mono"
                    style={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      backgroundColor: isMinimal ? 'rgba(0,0,0,0.5)' : 'transparent',
                      padding: isMinimal ? '2px 4px' : '0',
                      borderRadius: '2px'
                    }}
                  >
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExportContent = () => {
    const title = type === 'archetypes-tinder' ? 'Arquetipos Seleccionados'
      : type === 'archetypes-comparative' ? 'Ejes de Arquetipos'
      : type === 'shapes-tinder' ? 'Formas Seleccionadas'
      : 'Formas Disponibles';

    // Aplicar estilo actual
    const style = currentStyle;

    return (
      <div 
        ref={exportRef}
        data-export-content
        className="p-8 rounded-2xl"
        style={{ 
          background: style.background,
          minWidth: '600px',
          maxWidth: '900px',
          border: `1px solid ${style.borderColor}`
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">
              {type.includes('archetypes') ? '🎭' : '◇'}
            </span>
            <h2 className="text-2xl font-bold" style={{ color: style.textColor }}>{title}</h2>
          </div>
          <p style={{ color: style.subtextColor }}>{paletteName} • {colorCount} colores</p>
        </div>

        {/* Content based on selection */}
        {selectedExport === 'concepts' && type === 'archetypes-tinder' && renderConceptsList()}
        {selectedExport === 'axes' && type === 'archetypes-comparative' && renderAxesList()}
        {selectedExport === 'shapes' && type === 'shapes-tinder' && renderShapesList()}
        {selectedExport === 'remaining' && type === 'shapes-remaining' && renderRemainingShapes()}
        {selectedExport === 'palettes' && renderPalettes()}
        
        {selectedExport === 'complete' && (
          <div className="space-y-8">
            {type === 'archetypes-tinder' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>🎭</span> Conceptos seleccionados
                  </h3>
                  {renderConceptsList()}
                </div>
                <div className="pt-6" style={{ borderTop: '1px solid rgb(55, 65, 81)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>🎨</span> Paletas sugeridas
                  </h3>
                  {renderPalettes()}
                </div>
              </>
            )}
            
            {type === 'archetypes-comparative' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>⚖️</span> Ejes configurados
                  </h3>
                  {renderAxesList()}
                </div>
                <div className="pt-6" style={{ borderTop: '1px solid rgb(55, 65, 81)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>🎨</span> Paletas sugeridas
                  </h3>
                  {renderPalettes()}
                </div>
              </>
            )}
            
            {type === 'shapes-tinder' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>◇</span> Formas seleccionadas
                  </h3>
                  {renderShapesList()}
                </div>
                <div className="pt-6" style={{ borderTop: '1px solid rgb(55, 65, 81)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                    <span>🎨</span> Paletas sugeridas
                  </h3>
                  {renderPalettes()}
                </div>
              </>
            )}
            
            {type === 'shapes-remaining' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                  <span>◈</span> Formas disponibles ({remainingShapes.length})
                </h3>
                {renderRemainingShapes()}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: `1px solid ${style.borderColor}` }}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black">
              <span style={{ color: style.textColor }}>chrom</span>
              <span style={{ color: style.accentColor }}>atica</span>
            </span>
            <span className="text-xs" style={{ color: style.subtextColor }}>Palette Studio</span>
          </div>
          <p className="text-xs" style={{ color: style.subtextColor }}>
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Export Button */}
      <button
        onClick={() => setShowExportModal(true)}
        className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)', color: 'rgb(74, 222, 128)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar
      </button>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              style={{ backgroundColor: 'rgb(17, 24, 39)', border: '1px solid rgb(55, 65, 81)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgb(55, 65, 81)' }}>
                <h3 className="text-lg font-bold" style={{ color: 'white' }}>Exportar resultado</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(156, 163, 175)' }}
                >
                  ✕
                </button>
              </div>

              {/* Options */}
              <div className="p-4" style={{ borderBottom: '1px solid rgb(55, 65, 81)' }}>
                <div className="flex gap-8">
                  {/* Contenido */}
                  <div className="flex-1">
                    <p className="text-sm mb-3" style={{ color: 'rgb(156, 163, 175)' }}>¿Qué quieres exportar?</p>
                    <div className="flex gap-2 flex-wrap">
                      {exportOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedExport(option.id)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                          style={{ 
                            backgroundColor: selectedExport === option.id ? 'rgb(147, 51, 234)' : 'rgb(31, 41, 55)',
                            color: selectedExport === option.id ? 'white' : 'rgb(156, 163, 175)'
                          }}
                        >
                          <span>{option.icon}</span>
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Estilos */}
                  <div>
                    <p className="text-sm mb-3" style={{ color: 'rgb(156, 163, 175)' }}>Estilo visual</p>
                    <div className="flex gap-2">
                      {Object.entries(exportStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => setExportStyle(key as typeof exportStyle)}
                          className="p-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1"
                          style={{ 
                            backgroundColor: exportStyle === key ? 'rgb(147, 51, 234)' : 'rgb(31, 41, 55)',
                            color: exportStyle === key ? 'white' : 'rgb(156, 163, 175)',
                            minWidth: '70px'
                          }}
                          title={style.name}
                        >
                          <span className="text-lg">{style.icon}</span>
                          <span className="text-xs">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(3, 7, 18, 0.5)' }}>
                <div className="transform scale-75 origin-center">
                  {renderExportContent()}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgb(55, 65, 81)' }}>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'rgb(31, 41, 55)', color: 'rgb(209, 213, 219)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  style={{ 
                    backgroundColor: isExporting ? 'rgb(22, 101, 52)' : 'rgb(22, 163, 74)', 
                    color: 'white',
                    opacity: isExporting ? 0.5 : 1
                  }}
                >
                  {isExporting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar PNG
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExportCreatorResults;
