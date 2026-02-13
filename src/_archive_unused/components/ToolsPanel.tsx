import { useState, useRef } from 'react';
import { HarmonyType } from '../types/palette';
import { cn } from '../utils/cn';

interface ToolsPanelProps {
  colorCount: number;
  onSetColorCount: (count: number) => void;
  onGenerateRandom: () => void;
  onGenerateHarmony: (type: HarmonyType) => void;
  onGenerateGradient: () => void;
  onReverseColors: () => void;
  onShuffleColors: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExtractFromImage: (colors: string[]) => void;
}

const harmonyTypes: { type: HarmonyType; label: string; icon: string; description: string }[] = [
  { type: 'complementary', label: 'Complementario', icon: '◐', description: 'Colores opuestos' },
  { type: 'analogous', label: 'Análogo', icon: '◔', description: 'Colores cercanos' },
  { type: 'triadic', label: 'Triádico', icon: '△', description: 'Tres colores equidistantes' },
  { type: 'split-complementary', label: 'Complementario Dividido', icon: '⋔', description: 'Variación del complementario' },
  { type: 'tetradic', label: 'Tetrádico', icon: '◇', description: 'Cuatro colores' },
  { type: 'monochromatic', label: 'Monocromático', icon: '▬', description: 'Variaciones de un color' },
];

export function ToolsPanel({
  colorCount,
  onSetColorCount,
  onGenerateRandom,
  onGenerateHarmony,
  onGenerateGradient,
  onReverseColors,
  onShuffleColors,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExtractFromImage,
}: ToolsPanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>('harmony');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorMap: { [key: string]: number } = {};

      // Sample pixels and count colors
      for (let i = 0; i < imageData.length; i += 16) {
        const r = Math.round(imageData[i] / 32) * 32;
        const g = Math.round(imageData[i + 1] / 32) * 32;
        const b = Math.round(imageData[i + 2] / 32) * 32;
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      // Get top colors
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount)
        .map(([color]) => color);

      onExtractFromImage(sortedColors);
      setIsProcessingImage(false);
      URL.revokeObjectURL(img.src);
    };
  };

  const ToolSection = ({ 
    id, 
    title, 
    icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-slate-700/50 last:border-0">
      <button
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-violet-400">{icon}</span>
          <span className="text-white font-medium">{title}</span>
        </div>
        <svg 
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform",
            activeSection === id && "rotate-180"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        activeSection === id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              canUndo ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-800 text-slate-600"
            )}
            title="Deshacer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              canRedo ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-800 text-slate-600"
            )}
            title="Rehacer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a5 5 0 00-5 5v2M21 10l-4-4m4 4l-4 4" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReverseColors}
            className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
            title="Invertir orden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <button
            onClick={onShuffleColors}
            className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
            title="Mezclar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Color Count */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-medium">Número de colores</span>
          <span className="text-white font-bold text-lg">{colorCount}</span>
        </div>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6, 7, 8].map((count) => (
            <button
              key={count}
              onClick={() => onSetColorCount(count)}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium transition-all",
                colorCount === count
                  ? "bg-violet-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Harmony Section */}
      <ToolSection 
        id="harmony" 
        title="Armonías de Color"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M12 2v20M2 12h20" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {harmonyTypes.map(({ type, label, icon, description }) => (
            <button
              key={type}
              onClick={() => onGenerateHarmony(type)}
              className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
              <p className="text-slate-400 text-xs">{description}</p>
            </button>
          ))}
        </div>
      </ToolSection>

      {/* Generation Section */}
      <ToolSection 
        id="generate" 
        title="Generación Rápida"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      >
        <div className="space-y-2">
          <button
            onClick={onGenerateRandom}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generar Aleatorio
          </button>
          
          <button
            onClick={onGenerateGradient}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Crear Gradiente
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {isProcessingImage ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Extraer de Imagen
              </>
            )}
          </button>
        </div>
      </ToolSection>

      {/* Tips Section */}
      <ToolSection 
        id="tips" 
        title="Consejos"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <p className="text-violet-300 font-medium mb-1">🔒 Bloquea colores</p>
            <p className="text-slate-400">Los colores bloqueados se mantienen al generar nuevas paletas.</p>
          </div>
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <p className="text-pink-300 font-medium mb-1">↔️ Arrastra y suelta</p>
            <p className="text-slate-400">Reorganiza los colores arrastrándolos a nueva posición.</p>
          </div>
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <p className="text-cyan-300 font-medium mb-1">🎯 Regla 60-30-10</p>
            <p className="text-slate-400">Usa 60% color dominante, 30% secundario, 10% acento.</p>
          </div>
        </div>
      </ToolSection>
    </div>
  );
}
