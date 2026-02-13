import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { curatedPalettes, CuratedPalette } from '../data/colorConcepts';

interface CuratedPalettesPanelProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onSelectPalette: (colors: { h: number; s: number; l: number }[]) => void;
  onBack: () => void;
}

type CategoryFilter = 'all' | 'popular' | 'seasonal' | 'industry' | 'mood' | 'artistic';

const categoryInfo: Record<CategoryFilter, { name: string; icon: string }> = {
  all: { name: 'Todas', icon: '🌈' },
  popular: { name: 'Populares', icon: '⭐' },
  seasonal: { name: 'Estacionales', icon: '🍂' },
  industry: { name: 'Industrias', icon: '🏢' },
  mood: { name: 'Estados', icon: '💫' },
  artistic: { name: 'Artísticas', icon: '🎨' }
};

// Imágenes de fondo simuladas para cada paleta (patrones o gradientes)
const getPaletteBackground = (palette: CuratedPalette): string => {
  const colors = palette.colors;
  if (colors.length >= 3) {
    return `linear-gradient(135deg, 
      hsl(${colors[0].h}, ${colors[0].s}%, ${colors[0].l}%) 0%,
      hsl(${colors[1].h}, ${colors[1].s}%, ${colors[1].l}%) 50%,
      hsl(${colors[2].h}, ${colors[2].s}%, ${colors[2].l}%) 100%)`;
  }
  return `hsl(${colors[0].h}, ${colors[0].s}%, ${colors[0].l}%)`;
};

export const CuratedPalettesPanel: React.FC<CuratedPalettesPanelProps> = ({
  colorCount,
  onColorCountChange,
  onSelectPalette,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedPalette, setSelectedPalette] = useState<CuratedPalette | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPalettes = curatedPalettes.filter(palette => {
    const matchesCategory = activeCategory === 'all' || palette.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      palette.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      palette.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleSelectPalette = (palette: CuratedPalette) => {
    // Ajustar al número de colores deseado
    let adjustedColors = [...palette.colors];
    
    if (adjustedColors.length > colorCount) {
      adjustedColors = adjustedColors.slice(0, colorCount);
    } else if (adjustedColors.length < colorCount) {
      // Generar colores adicionales basados en los existentes
      while (adjustedColors.length < colorCount) {
        const baseColor = adjustedColors[adjustedColors.length % palette.colors.length];
        const variation = adjustedColors.length % 3;
        let newColor;
        
        switch (variation) {
          case 0:
            newColor = { ...baseColor, l: Math.min(90, baseColor.l + 15) };
            break;
          case 1:
            newColor = { ...baseColor, l: Math.max(20, baseColor.l - 15) };
            break;
          default:
            newColor = { ...baseColor, h: (baseColor.h + 30) % 360 };
        }
        adjustedColors.push(newColor);
      }
    }
    
    onSelectPalette(adjustedColors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Volver</span>
          </button>
          
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">✨</span>
            Sorpréndeme
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-6 space-y-4">
          {/* Búsqueda */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, etiqueta o estilo..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">🔍</span>
          </div>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(categoryInfo) as CategoryFilter[]).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2
                  ${activeCategory === category
                    ? 'bg-white text-indigo-900 shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }
                `}
              >
                <span>{categoryInfo[category].icon}</span>
                {categoryInfo[category].name}
              </button>
            ))}
          </div>

          {/* Control de número de colores */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/70">Colores:</span>
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  onClick={() => onColorCountChange(num)}
                  className={`
                    w-8 h-8 rounded-lg font-medium transition-all
                    ${colorCount === num
                      ? 'bg-white text-indigo-900'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de paletas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPalettes.map((palette, index) => (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer
                transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/10
                ${selectedPalette?.id === palette.id ? 'ring-2 ring-white' : ''}
              `}
              onClick={() => setSelectedPalette(palette)}
            >
              {/* Preview visual */}
              <div 
                className="h-32 relative"
                style={{ background: getPaletteBackground(palette) }}
              >
                {/* Elementos decorativos que muestran la paleta aplicada */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-2">
                    {/* Círculos flotantes */}
                    <div 
                      className="w-12 h-12 rounded-full shadow-lg"
                      style={{ backgroundColor: `hsl(${palette.colors[0].h}, ${palette.colors[0].s}%, ${palette.colors[0].l}%)` }}
                    />
                    {palette.colors.length > 1 && (
                      <div 
                        className="w-8 h-8 rounded-full shadow-lg mt-4"
                        style={{ backgroundColor: `hsl(${palette.colors[1].h}, ${palette.colors[1].s}%, ${palette.colors[1].l}%)` }}
                      />
                    )}
                    {palette.colors.length > 2 && (
                      <div 
                        className="w-10 h-10 rounded-full shadow-lg -mt-2"
                        style={{ backgroundColor: `hsl(${palette.colors[2].h}, ${palette.colors[2].s}%, ${palette.colors[2].l}%)` }}
                      />
                    )}
                  </div>
                </div>

                {/* Overlay con nombre */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white font-bold">{palette.name}</h3>
                </div>
              </div>

              {/* Barra de colores */}
              <div className="h-8 flex">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 relative group"
                    style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center 
                                     opacity-0 group-hover:opacity-100 transition-opacity
                                     text-[10px] font-mono text-white bg-black/50">
                      {hslToHex(color.h, color.s, color.l).slice(0, 7)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-white/70 text-sm mb-2 line-clamp-2">{palette.description}</p>
                <div className="flex flex-wrap gap-1">
                  {palette.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPalettes.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-white/60">No se encontraron paletas con esos criterios</p>
          </div>
        )}

        {/* Modal de paleta seleccionada */}
        {selectedPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPalette(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Preview grande */}
              <div 
                className="h-48 relative"
                style={{ background: getPaletteBackground(selectedPalette) }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Composición de ejemplo */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-sm">
                    <div 
                      className="w-16 h-16 rounded-xl mb-4 mx-auto"
                      style={{ backgroundColor: `hsl(${selectedPalette.colors[0].h}, ${selectedPalette.colors[0].s}%, ${selectedPalette.colors[0].l}%)` }}
                    />
                    <div 
                      className="h-3 w-32 rounded-full mb-2 mx-auto"
                      style={{ backgroundColor: `hsl(${selectedPalette.colors[1]?.h || 0}, ${selectedPalette.colors[1]?.s || 0}%, ${selectedPalette.colors[1]?.l || 50}%)` }}
                    />
                    <div 
                      className="h-2 w-24 rounded-full mx-auto"
                      style={{ backgroundColor: `hsl(${selectedPalette.colors[2]?.h || 0}, ${selectedPalette.colors[2]?.s || 0}%, ${selectedPalette.colors[2]?.l || 50}%)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Colores grandes */}
              <div className="h-16 flex">
                {selectedPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 flex items-center justify-center group cursor-pointer hover:flex-[1.5] transition-all"
                    style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
                  >
                    <span 
                      className="font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: color.l > 50 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                        color: color.l > 50 ? '#000' : '#fff'
                      }}
                    >
                      {hslToHex(color.h, color.s, color.l).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedPalette.name}</h2>
                    <p className="text-white/60">{selectedPalette.description}</p>
                  </div>
                  <span className="text-3xl">{categoryInfo[selectedPalette.category].icon}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPalette.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Ejemplos de uso */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {/* Botón */}
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/50 text-xs mb-2">Botón</p>
                    <button
                      className="px-4 py-2 rounded-lg font-medium w-full"
                      style={{ 
                        backgroundColor: `hsl(${selectedPalette.colors[0].h}, ${selectedPalette.colors[0].s}%, ${selectedPalette.colors[0].l}%)`,
                        color: selectedPalette.colors[0].l > 50 ? '#000' : '#fff'
                      }}
                    >
                      Acción
                    </button>
                  </div>

                  {/* Card */}
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/50 text-xs mb-2">Tarjeta</p>
                    <div 
                      className="rounded-lg p-2"
                      style={{ backgroundColor: `hsl(${selectedPalette.colors[selectedPalette.colors.length - 1].h}, ${selectedPalette.colors[selectedPalette.colors.length - 1].s}%, ${selectedPalette.colors[selectedPalette.colors.length - 1].l}%)` }}
                    >
                      <div 
                        className="w-6 h-6 rounded mx-auto mb-1"
                        style={{ backgroundColor: `hsl(${selectedPalette.colors[0].h}, ${selectedPalette.colors[0].s}%, ${selectedPalette.colors[0].l}%)` }}
                      />
                      <div 
                        className="h-1.5 w-12 rounded mx-auto"
                        style={{ backgroundColor: `hsl(${selectedPalette.colors[1]?.h || 0}, ${selectedPalette.colors[1]?.s || 0}%, ${selectedPalette.colors[1]?.l || 50}%)` }}
                      />
                    </div>
                  </div>

                  {/* Gradiente */}
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/50 text-xs mb-2">Gradiente</p>
                    <div 
                      className="h-10 rounded-lg"
                      style={{ 
                        background: `linear-gradient(90deg, ${selectedPalette.colors.map((c, i) => 
                          `hsl(${c.h}, ${c.s}%, ${c.l}%) ${(i / (selectedPalette.colors.length - 1)) * 100}%`
                        ).join(', ')})`
                      }}
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPalette(null)}
                    className="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    onClick={() => {
                      handleSelectPalette(selectedPalette);
                      setSelectedPalette(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                               text-white font-semibold rounded-lg shadow-lg"
                  >
                    Usar esta paleta →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
