import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PosterExamplesProps {
  colors: string[];
  compact?: boolean;
}

type PosterStyle = 'minimal' | 'bold' | 'elegant' | 'geometric' | 'editorial' | 'swiss';

const PosterExamples: React.FC<PosterExamplesProps> = ({ colors, compact = false }) => {
  const [activeStyle, setActiveStyle] = useState<PosterStyle>('bold');
  
  const styles: { id: PosterStyle; name: string; icon: string }[] = [
    { id: 'bold', name: 'Bold', icon: '■' },
    { id: 'minimal', name: 'Minimal', icon: '◯' },
    { id: 'elegant', name: 'Elegante', icon: '◇' },
    { id: 'geometric', name: 'Geométrico', icon: '△' },
    { id: 'editorial', name: 'Editorial', icon: '¶' },
    { id: 'swiss', name: 'Swiss', icon: '⊞' },
  ];

  const getColor = (index: number, fallback?: string) => {
    if (index < colors.length) return colors[index];
    return fallback || colors[index % colors.length];
  };

  const renderMinimalPoster = () => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-6 relative"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Usa blanco como fondo */}
      <div 
        className="absolute top-8 left-8 w-16 h-16 rounded-full"
        style={{ backgroundColor: getColor(0) }}
      />
      <div className="text-center mt-8">
        <h3 
          className="text-3xl font-light tracking-widest mb-2"
          style={{ color: getColor(1, '#1a1a1a') }}
        >
          MINIMAL
        </h3>
        <p 
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: getColor(2, '#666666') }}
        >
          Design Studio
        </p>
      </div>
      <div className="flex gap-2 mt-8">
        {colors.slice(0, 4).map((color, i) => (
          <div 
            key={i}
            className="w-8 h-1 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div 
        className="absolute bottom-6 text-[8px] tracking-widest"
        style={{ color: getColor(0) }}
      >
        2024
      </div>
    </div>
  );

  const renderBoldPoster = () => (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor: getColor(0) }}
    >
      <div 
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-30"
        style={{ backgroundColor: getColor(1) }}
      />
      <div 
        className="absolute -left-5 bottom-20 w-24 h-24 rounded-full opacity-40"
        style={{ backgroundColor: getColor(2, getColor(1)) }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 
          className="text-4xl font-black leading-none mb-1"
          style={{ color: '#FFFFFF' }}
        >
          BOLD
        </h3>
        <h3 
          className="text-4xl font-black leading-none"
          style={{ color: getColor(1), opacity: 0.9 }}
        >
          IMPACT
        </h3>
        <div className="flex items-center gap-2 mt-4">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#FFFFFF' }}
          />
          <p 
            className="text-[10px] tracking-wider"
            style={{ color: '#FFFFFF', opacity: 0.8 }}
          >
            Creative Agency
          </p>
        </div>
      </div>
    </div>
  );

  const renderElegantPoster = () => (
    <div 
      className="w-full h-full flex flex-col relative"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Top accent */}
      <div 
        className="h-1/3 relative"
        style={{ backgroundColor: getColor(0) }}
      >
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full border-4 flex items-center justify-center"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: getColor(1, getColor(0))
          }}
        >
          <span 
            className="text-xl font-serif"
            style={{ color: getColor(0) }}
          >
            E
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12">
        <h3 
          className="text-xl font-serif tracking-wide mb-1"
          style={{ color: getColor(0) }}
        >
          Élégance
        </h3>
        <div 
          className="w-12 h-px my-3"
          style={{ backgroundColor: getColor(1, getColor(0)) }}
        />
        <p 
          className="text-[9px] tracking-[0.2em] uppercase text-center"
          style={{ color: getColor(2, '#888888') }}
        >
          Luxury Collection
        </p>
      </div>
      <div 
        className="h-2"
        style={{ backgroundColor: getColor(1, getColor(0)) }}
      />
    </div>
  );

  const renderGeometricPoster = () => (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor: getColor(0) }}
    >
      {/* Formas geométricas */}
      <div 
        className="absolute top-4 right-4 w-20 h-20"
        style={{ 
          backgroundColor: getColor(1),
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        }}
      />
      <div 
        className="absolute top-20 left-4 w-12 h-12 rounded-full"
        style={{ backgroundColor: getColor(2, getColor(1)), opacity: 0.7 }}
      />
      <div 
        className="absolute bottom-12 right-8 w-16 h-16 rotate-45"
        style={{ backgroundColor: getColor(3, getColor(1)), opacity: 0.5 }}
      />
      <div 
        className="absolute bottom-4 left-4 w-8 h-24"
        style={{ backgroundColor: '#FFFFFF', opacity: 0.2 }}
      />
      
      <div className="absolute bottom-6 left-6">
        <h3 
          className="text-2xl font-bold tracking-tight"
          style={{ color: '#FFFFFF' }}
        >
          GEO
        </h3>
        <p 
          className="text-[8px] tracking-widest mt-1"
          style={{ color: getColor(1) }}
        >
          SHAPES & FORMS
        </p>
      </div>
    </div>
  );

  const renderEditorialPoster = () => (
    <div 
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Header con blanco */}
      <div className="p-4 border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="flex justify-between items-center">
          <span 
            className="text-[8px] tracking-widest"
            style={{ color: getColor(0) }}
          >
            VOL. 01
          </span>
          <span 
            className="text-[8px]"
            style={{ color: '#999999' }}
          >
            2024
          </span>
        </div>
      </div>
      
      {/* Imagen principal */}
      <div 
        className="flex-1 mx-4 my-3 relative"
        style={{ backgroundColor: getColor(0) }}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: getColor(1), opacity: 0.6 }}
          />
        </div>
        <div 
          className="absolute bottom-2 left-2 right-2 h-1"
          style={{ backgroundColor: getColor(2, getColor(1)) }}
        />
      </div>
      
      {/* Texto */}
      <div className="p-4 pt-0">
        <h3 
          className="text-lg font-serif mb-1"
          style={{ color: '#1a1a1a' }}
        >
          Editorial
        </h3>
        <p 
          className="text-[8px] leading-relaxed"
          style={{ color: '#666666' }}
        >
          Magazine layout design with balanced colors
        </p>
        <div className="flex gap-1 mt-2">
          {colors.slice(0, 5).map((color, i) => (
            <div 
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSwissPoster = () => (
    <div 
      className="w-full h-full relative"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Grid suizo */}
      <div 
        className="absolute top-0 left-0 w-2/3 h-1/2"
        style={{ backgroundColor: getColor(0) }}
      />
      <div 
        className="absolute top-1/2 right-0 w-1/2 h-1/4"
        style={{ backgroundColor: getColor(1) }}
      />
      <div 
        className="absolute bottom-0 left-0 w-1/3 h-1/4"
        style={{ backgroundColor: getColor(2, getColor(1)) }}
      />
      
      {/* Tipografía */}
      <div className="absolute top-4 left-4">
        <h3 
          className="text-3xl font-black leading-none"
          style={{ color: '#FFFFFF' }}
        >
          TY
        </h3>
        <h3 
          className="text-3xl font-black leading-none"
          style={{ color: '#FFFFFF' }}
        >
          PO
        </h3>
      </div>
      
      <div 
        className="absolute bottom-4 right-4 text-right"
      >
        <p 
          className="text-[8px] tracking-widest"
          style={{ color: getColor(0) }}
        >
          SWISS
        </p>
        <p 
          className="text-[8px] tracking-wider"
          style={{ color: '#1a1a1a' }}
        >
          DESIGN
        </p>
      </div>
      
      {/* Círculo decorativo */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2"
        style={{ borderColor: getColor(3, '#1a1a1a') }}
      />
    </div>
  );

  const renderPoster = () => {
    switch (activeStyle) {
      case 'minimal': return renderMinimalPoster();
      case 'bold': return renderBoldPoster();
      case 'elegant': return renderElegantPoster();
      case 'geometric': return renderGeometricPoster();
      case 'editorial': return renderEditorialPoster();
      case 'swiss': return renderSwissPoster();
      default: return renderMinimalPoster();
    }
  };

  return (
    <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
      {/* Selector de estilos */}
      <div className="flex flex-wrap gap-2 justify-center">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeStyle === style.id
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="text-sm">{style.icon}</span>
            {style.name}
          </button>
        ))}
      </div>
      
      {/* Poster */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStyle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${compact ? 'w-40 h-56' : 'w-48 h-64'} rounded-lg overflow-hidden shadow-2xl`}
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {renderPoster()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Info del estilo */}
      <p className="text-center text-xs text-white/50">
        {activeStyle === 'minimal' && '✨ Fondo blanco con acentos de color'}
        {activeStyle === 'bold' && '💪 Alto contraste y tipografía impactante'}
        {activeStyle === 'elegant' && '🎀 Sofisticado con espacios en blanco'}
        {activeStyle === 'geometric' && '📐 Formas abstractas y composición dinámica'}
        {activeStyle === 'editorial' && '📰 Estilo revista con grid clásico'}
        {activeStyle === 'swiss' && '🇨🇭 Diseño tipográfico minimalista'}
      </p>
    </div>
  );
};

export default PosterExamples;
