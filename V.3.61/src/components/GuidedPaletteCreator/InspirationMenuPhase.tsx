import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { FluidTetradicBar } from './FluidTetradicBar';
import { COPY } from './config/copy';
import { INSPIRATION_MENU_OPTIONS } from './config/inspirationMenuOptions';
import type { InspirationMode } from '../../types/guidedPalette';
import { PaletteBar } from '../inspiration/PaletteBar';
import { blendColorsVibrant } from '../inspiration/archetypePaletteUtils';

interface InspirationMenuPhaseProps {
  onSelectOption: (mode: InspirationMode) => void;
  /** Paletas activas por flujo (cadena Refinar→Aplicar→Análisis→Guardar). */
  activePalettesByMode?: Partial<Record<InspirationMode, string[]>>;
  /** Abre la vista emergente para ver/editar la paleta combinada. */
  onOpenCombinedPalette?: (colors: string[]) => void;
}

function buildCombinedPaletteFromOrigins(
  activePalettesByMode?: Partial<Record<InspirationMode, string[]>>,
  maxColors = 8
): string[] {
  if (!activePalettesByMode) return [];
  const palettes = Object.entries(activePalettesByMode)
    .filter(
      ([mode, colors]): colors is string[] =>
        mode !== 'multi-origin' && Array.isArray(colors) && colors.length > 0
    )
    .map(([, colors]) => colors);
  if (palettes.length <= 1) return [];
  const targetCount = Math.min(
    maxColors,
    Math.max(...palettes.map((p) => p.length))
  );
  if (targetCount <= 0) return [];
  const getColor = (palette: string[], index: number) =>
    palette[index % palette.length] ?? palette[palette.length - 1] ?? '#666666';
  return Array.from({ length: targetCount }, (_, i) =>
    blendColorsVibrant(palettes.map((pal) => getColor(pal, i)))
  );
}

export function InspirationMenuPhase({
  onSelectOption,
  activePalettesByMode,
  onOpenCombinedPalette,
}: InspirationMenuPhaseProps) {
  const combinedPalette = useMemo(
    () => buildCombinedPaletteFromOrigins(activePalettesByMode),
    [activePalettesByMode]
  );
  const hasCombinedPalette = combinedPalette.length > 0;

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
          <div key={opt.id} className="flex flex-col gap-3">
            <InspirationCard
              option={opt}
              index={index}
              onSelectOption={onSelectOption}
            />
            {activePalettesByMode?.[opt.id] && activePalettesByMode[opt.id]!.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400">Paleta activa</p>
                <PaletteBar
                  colors={activePalettesByMode[opt.id]!.slice(0, 8)}
                  className="h-8"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {hasCombinedPalette && onOpenCombinedPalette && (
        <div className="mt-8 rounded-2xl border border-gray-700/60 bg-gray-800/40 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-200">Paleta combinada</h3>
              <p className="text-xs text-gray-400">
                Generada a partir de las paletas activas de los orígenes seleccionados.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCombinedPalette(combinedPalette)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium border border-sky-400/60 transition-colors"
            >
              Ver / Editar →
            </button>
          </div>
        </div>
      )}
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
      className={`group relative flex flex-col items-center rounded-2xl p-8 md:p-9 h-[230px] md:h-[240px] border backdrop-blur-sm overflow-hidden ${option.bgColor} ${option.borderColor} ${option.hoverBorder} transition-colors duration-200`}
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
    </motion.button>
  );
});
