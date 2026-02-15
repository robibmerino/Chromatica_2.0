import { useCallback, useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Layout,
  BarChart2,
  Save,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { PHASES } from './config/phasesConfig';
import type { Phase } from '../../types/guidedPalette';

const PHASE_ICONS: Record<string, LucideIcon> = {
  'inspiration-menu': Sparkles,
  refinement: SlidersHorizontal,
  application: Layout,
  analysis: BarChart2,
  save: Save,
};

const STEPPER_LABELS: Record<string, string> = {
  'inspiration-menu': 'Inspiración',
  refinement: 'Refinar',
  application: 'Aplicar',
  analysis: 'Análisis',
  save: 'Guardar',
};

interface FlowProgressProps {
  currentPhaseIndex: number;
  phase: Phase;
  colorsLength: number;
  onPhaseClick: (targetPhase: Phase) => void;
}

const TOTAL_STEPS = PHASES.length;

export function FlowProgress({
  currentPhaseIndex,
  phase,
  colorsLength,
  onPhaseClick,
}: FlowProgressProps) {
  const progressPercent = (currentPhaseIndex / (TOTAL_STEPS - 1)) * 100;

  const canGoToStep = (index: number) => index <= currentPhaseIndex || colorsLength > 0;
  const isCurrentStep = (index: number) =>
    index === currentPhaseIndex || (phase === 'inspiration-detail' && index === 0);
  const isCompleted = (index: number) => index < currentPhaseIndex;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getParticleColor = useCallback(
    (index: number) => {
      if (index === currentPhaseIndex) return '#818cf8';
      if (index < currentPhaseIndex) return '#fbbf24';
      return '#6b7280';
    },
    [currentPhaseIndex]
  );

  return (
    <div
      className="w-full max-w-2xl"
      role="progressbar"
      aria-valuenow={currentPhaseIndex + 1}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-label={`Paso ${currentPhaseIndex + 1} de ${TOTAL_STEPS}: ${PHASES[currentPhaseIndex]?.name}`}
    >
      {/* Móvil: barra + paso actual */}
      <div className="md:hidden space-y-2">
        <div className="h-1.5 rounded-full bg-gray-700/60 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">
          {currentPhaseIndex + 1} de {TOTAL_STEPS} · {PHASES[currentPhaseIndex]?.name}
        </p>
      </div>

      {/* Escritorio: stepper; el espaciado entre botones lo da solo el conector (mx-1) para que quede equidistante */}
      <div className="hidden md:flex items-center w-full">
        {PHASES.map((p, index) => {
          const completed = isCompleted(index);
          const current = isCurrentStep(index);
          const clickable = canGoToStep(index);
          const Icon = PHASE_ICONS[p.id] ?? Sparkles;
          const label = STEPPER_LABELS[p.id] ?? p.name;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={p.id}
              className="flex flex-shrink-0 items-center"
            >
              <motion.button
                type="button"
                onClick={() => clickable && onPhaseClick(p.id)}
                disabled={!clickable}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-current={current ? 'step' : undefined}
                aria-label={`${completed ? 'Completado: ' : ''}${p.name}${current ? ' (actual)' : ''}`}
                whileHover={clickable ? { scale: 1.03, y: -1 } : {}}
                whileTap={clickable ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 min-w-[8.5rem] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-colors duration-200 ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  current
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 focus-visible:ring-indigo-400 hover:shadow-indigo-500/30 hover:bg-indigo-500'
                    : completed
                      ? 'bg-amber-950/30 text-amber-400/95 border border-amber-500/20 focus-visible:ring-amber-400/60 hover:bg-amber-900/40 hover:border-amber-500/30'
                      : 'bg-transparent text-gray-500 focus-visible:ring-gray-500'
                } ${clickable && !current ? 'hover:text-amber-300' : ''}`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <ButtonParticles
                    isHovered={isHovered && clickable}
                    color={getParticleColor(index)}
                    count={10}
                    intensity="light"
                  />
                </div>
                <span
                  className={`relative z-10 flex shrink-0 items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                    current
                      ? 'bg-white/20'
                      : completed
                        ? 'bg-amber-500/25 group-hover:bg-amber-500/35'
                        : 'bg-gray-700/50'
                  }`}
                >
                  {completed ? (
                    <Check className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  )}
                </span>
                <span className="relative z-10 text-sm font-medium whitespace-nowrap">{label}</span>
              </motion.button>

              {index < PHASES.length - 1 && (
                <div
                  className={`flex-shrink-0 w-5 h-px mx-2 transition-colors duration-200 ${
                    completed ? 'bg-amber-500/35' : 'bg-gray-600/50'
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
