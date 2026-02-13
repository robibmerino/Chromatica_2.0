import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { conceptCategories, getColorsByConcepts, generateHarmoniousPalette } from '../data/colorConcepts';

interface ConceptstormingPanelProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onGeneratePalette: (colors: { h: number; s: number; l: number }[]) => void;
  onBack: () => void;
}

export const ConceptstormingPanel: React.FC<ConceptstormingPanelProps> = ({
  colorCount,
  onColorCountChange,
  onGeneratePalette,
  onBack
}) => {
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('emotional');
  const [previewColors, setPreviewColors] = useState<{ h: number; s: number; l: number }[]>([]);

  // Actualizar preview cuando cambian los conceptos seleccionados
  useEffect(() => {
    if (selectedConcepts.length > 0) {
      const matchingColors = getColorsByConcepts(selectedConcepts, colorCount);
      const palette = generateHarmoniousPalette(matchingColors, colorCount);
      setPreviewColors(palette);
    } else {
      setPreviewColors([]);
    }
  }, [selectedConcepts, colorCount]);

  const toggleConcept = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId)
        ? prev.filter(c => c !== conceptId)
        : [...prev, conceptId]
    );
  };

  const handleApply = () => {
    if (previewColors.length > 0) {
      onGeneratePalette(previewColors);
    }
  };

  const clearSelection = () => {
    setSelectedConcepts([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
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
            <span className="text-3xl">🧠</span>
            Conceptstorming
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-center"
        >
          <p className="text-white/90">
            Selecciona conceptos que representen tu proyecto y generaremos una paleta basada en la psicología del color
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de categorías y conceptos */}
          <div className="lg:col-span-2 space-y-4">
            {conceptCategories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIndex * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
              >
                {/* Cabecera de categoría */}
                <button
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">{category.name}</h3>
                      <p className="text-white/60 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                    className="text-white/60"
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Conceptos de la categoría */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 flex flex-wrap gap-2">
                        {category.concepts.map((concept) => {
                          const isSelected = selectedConcepts.includes(concept.id);
                          return (
                            <motion.button
                              key={concept.id}
                              onClick={() => toggleConcept(concept.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-all
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                                }
                              `}
                              title={concept.description}
                            >
                              {concept.name}
                              {isSelected && <span className="ml-2">✓</span>}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Panel lateral - Preview y controles */}
          <div className="space-y-4">
            {/* Conceptos seleccionados */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Conceptos seleccionados</h3>
                {selectedConcepts.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              
              {selectedConcepts.length === 0 ? (
                <p className="text-white/50 text-sm text-center py-4">
                  Selecciona conceptos para ver la paleta sugerida
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedConcepts.map(conceptId => {
                    const concept = conceptCategories
                      .flatMap(c => c.concepts)
                      .find(c => c.id === conceptId);
                    return concept ? (
                      <span
                        key={conceptId}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                   rounded-full text-white text-sm flex items-center gap-2"
                      >
                        {concept.name}
                        <button
                          onClick={() => toggleConcept(conceptId)}
                          className="hover:text-pink-300"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Control de número de colores */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Número de colores</h3>
              <div className="flex gap-2">
                {[3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => onColorCountChange(num)}
                    className={`
                      flex-1 py-2 rounded-lg font-medium transition-all
                      ${colorCount === num
                        ? 'bg-white text-purple-900'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview de paleta */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Vista previa</h3>
              
              {previewColors.length > 0 ? (
                <>
                  {/* Barra de colores */}
                  <div className="h-20 rounded-lg overflow-hidden flex mb-4">
                    {previewColors.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex-1 relative group"
                        style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
                      >
                        <div className="absolute inset-0 flex items-end justify-center pb-2 
                                        opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-mono px-1 py-0.5 rounded bg-black/50 text-white">
                            {hslToHex(color.h, color.s, color.l).toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini ejemplos */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Botones */}
                    <div className="bg-white/5 rounded-lg p-2">
                      <div 
                        className="py-1.5 px-3 rounded text-center text-sm font-medium mb-1"
                        style={{ 
                          backgroundColor: `hsl(${previewColors[0]?.h}, ${previewColors[0]?.s}%, ${previewColors[0]?.l}%)`,
                          color: previewColors[0]?.l > 50 ? '#000' : '#fff'
                        }}
                      >
                        Botón
                      </div>
                      <div 
                        className="py-1.5 px-3 rounded text-center text-sm font-medium"
                        style={{ 
                          backgroundColor: `hsl(${previewColors[1]?.h || 0}, ${previewColors[1]?.s || 0}%, ${previewColors[1]?.l || 50}%)`,
                          color: (previewColors[1]?.l || 50) > 50 ? '#000' : '#fff'
                        }}
                      >
                        Secundario
                      </div>
                    </div>

                    {/* Texto */}
                    <div 
                      className="rounded-lg p-2"
                      style={{ backgroundColor: `hsl(${previewColors[previewColors.length - 1]?.h}, ${previewColors[previewColors.length - 1]?.s}%, ${previewColors[previewColors.length - 1]?.l}%)` }}
                    >
                      <div 
                        className="text-sm font-bold"
                        style={{ color: `hsl(${previewColors[0]?.h}, ${previewColors[0]?.s}%, ${previewColors[0]?.l}%)` }}
                      >
                        Título
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: `hsl(${previewColors[1]?.h || 0}, ${previewColors[1]?.s || 0}%, ${previewColors[1]?.l || 50}%)` }}
                      >
                        Subtítulo de ejemplo
                      </div>
                    </div>
                  </div>

                  {/* Botón aplicar */}
                  <motion.button
                    onClick={handleApply}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                               text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30
                               hover:shadow-purple-500/50 transition-shadow"
                  >
                    Usar esta paleta →
                  </motion.button>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-white/50 text-center">
                  <div>
                    <span className="text-4xl block mb-2">🎨</span>
                    <p className="text-sm">Selecciona conceptos para generar una paleta</p>
                  </div>
                </div>
              )}
            </div>

            {/* Regenerar */}
            {previewColors.length > 0 && (
              <button
                onClick={() => {
                  const matchingColors = getColorsByConcepts(selectedConcepts, colorCount);
                  // Añadir algo de variación aleatoria
                  const palette = generateHarmoniousPalette(matchingColors, colorCount).map(c => ({
                    h: (c.h + Math.floor(Math.random() * 20) - 10 + 360) % 360,
                    s: Math.max(10, Math.min(100, c.s + Math.floor(Math.random() * 20) - 10)),
                    l: Math.max(10, Math.min(90, c.l + Math.floor(Math.random() * 10) - 5))
                  }));
                  setPreviewColors(palette);
                }}
                className="w-full py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 
                           transition-colors flex items-center justify-center gap-2"
              >
                <span>🔄</span> Generar variación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
