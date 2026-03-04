import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { FluidTetradicBar } from './FluidTetradicBar';
import { COPY } from './config/copy';
import { INSPIRATION_MENU_OPTIONS } from './config/inspirationMenuOptions';
import type { InspirationMode } from '../../types/guidedPalette';

interface InspirationMenuPhaseProps {
  onSelectOption: (mode: InspirationMode) => void;
}

export function InspirationMenuPhase({ onSelectOption }: InspirationMenuPhaseProps) {
  return (
    <motion.div
      key="inspiration-menu"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-6xl mx-auto"
    >
      {/* Hero con más carácter: tipografía atrevida y mensaje claro */}
      <header
        className="mb-10 rounded-2xl border border-gray-700/40 bg-gradient-to-b from-gray-800/50 to-gray-800/20 px-6 py-7 md:px-10 md:py-9 text-center"
        role="region"
        aria-label="Inspiración"
      >
        <p className="text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-gray-500 mb-3">
          {COPY.inspiration.heroTitle}
        </p>
        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">
          {COPY.inspiration.heroTitleAccent}
        </h1>
        <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed md:whitespace-nowrap">
          {COPY.inspiration.heroSubtitle}
        </p>
        <FluidTetradicBar />
      </header>

      {/* 4 botones más grandes, misma fila */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        role="group"
        aria-label="Opciones de inspiración"
      >
        {INSPIRATION_MENU_OPTIONS.map((opt, index) => (
          <InspirationCard
            key={opt.id}
            option={opt}
            index={index}
            onSelectOption={onSelectOption}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface InspirationCardProps {
  option: (typeof INSPIRATION_MENU_OPTIONS)[number];
  index: number;
  onSelectOption: (mode: InspirationMode) => void;
}

const InspirationCard = React.memo(function InspirationCard({
  option,
  index,
  onSelectOption,
}: InspirationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onSelectOption(option.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col items-center rounded-2xl p-8 md:p-9 min-h-[240px] md:min-h-[260px] border backdrop-blur-sm overflow-hidden ${option.bgColor} ${option.borderColor} ${option.hoverBorder} transition-colors duration-200`}
      aria-label={`${option.title}. ${option.description}`}
    >
      <ButtonParticles isHovered={isHovered} color={option.particleColor} count={12} intensity="light" />

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${option.glowColor} 0%, transparent 65%)`,
        }}
      />

      <motion.span
        className={`relative z-10 flex shrink-0 items-center justify-center w-[4.25rem] h-[4.25rem] rounded-xl mb-4 ${option.iconBg} ${option.iconColor}`}
        animate={{ rotate: isHovered ? 5 : 0, scale: isHovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        {option.icon}
      </motion.span>
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <h3 className="text-base md:text-lg font-semibold text-white mb-1.5">
          {option.title}
        </h3>
        <p className={`text-sm leading-snug line-clamp-3 w-full text-center ${option.descriptionColor}`}>
          {option.description}
        </p>
      </div>
      <span
        className={`relative z-10 mt-3 flex items-center gap-1 text-xs font-medium ${option.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}
        aria-hidden
      >
        Elegir
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </motion.button>
  );
});
