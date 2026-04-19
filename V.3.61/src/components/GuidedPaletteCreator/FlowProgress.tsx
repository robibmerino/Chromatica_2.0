import { useCallback, useState } from 'react';
import {
  Cog,
  SlidersHorizontal,
  Layout,
  BarChart2,
  Save,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { ChromaticaSymbolLogo } from '../ChromaticaSymbolLogo';
import {
  STEPPER_STEPS,
  INSPIRATION_MODE_LABELS,
  getFlowAccent,
} from './config/phasesConfig';
import type { FlowSectionEdited } from './hooks/useGuidedPalette';
import type { Phase } from '../../types/guidedPalette';
import type { InspirationMode } from '../../types/guidedPalette';

const PHASE_ICONS: Record<string, LucideIcon> = {
  'inspiration-menu': Cog,
  'inspiration-detail': Cog,
  refinement: SlidersHorizontal,
  application: Layout,
  analysis: BarChart2,
  save: Save,
};

/** Duración de una vuelta completa del engranaje Fábrica (solo paso actual; más lento que `animate-spin`). */
const FABRICA_GEAR_SPIN_DURATION_S = 3.5;

/** Colores del cuadradito origen Chromática (verde, azul, magenta, naranja = los 4 flujos) */
const QUAD_COLORS = ['#059669', '#2563eb', '#c026d3', '#ea580c'] as const;

/** Acentos por defecto cuando no hay flujo (menú); tonos suaves para el botón activo */
const DEFAULT_ACCENT = {
  active: '#4f46e5',
  activeBg: 'rgba(79, 70, 229, 0.18)',
  activeRing: 'rgba(129, 140, 248, 0.35)',
  completed: '#fbbf24',
  completedBg: 'rgba(245, 158, 11, 0.15)',
  completedBorder: 'rgba(251, 191, 36, 0.35)',
  particle: '#818cf8',
};

interface FlowProgressProps {
  currentStepperIndex: number;
  totalStepperSteps: number;
  phase: Phase;
  inspirationMode: InspirationMode | null;
  colorsLength: number;
  /** Si el flujo actual ya usó "Usar paleta" al menos una vez; si no, no se puede ir a Refinar/Aplicar/Análisis/Guardar. */
  hasCompletedCurrentFlow: boolean;
  /** Si Refinar/Aplicar/Análisis tienen estado guardado en este flujo (feedback visual de personalización). */
  hasPersonalizedFlow: boolean;
  /** Qué secciones del eje tienen ediciones (check verde solo en esas). */
  flowSectionEdited: FlowSectionEdited;
  onPhaseClick: (targetPhase: Phase) => void;
}

export function FlowProgress({
  currentStepperIndex,
  totalStepperSteps: TOTAL_STEPS,
  phase,
  inspirationMode,
  colorsLength,
  hasCompletedCurrentFlow,
  hasPersonalizedFlow,
  flowSectionEdited,
  onPhaseClick,
}: FlowProgressProps) {
  const progressPercent = (currentStepperIndex / (TOTAL_STEPS - 1)) * 100;
  const flowAccent = getFlowAccent(inspirationMode) ?? DEFAULT_ACCENT;
  const prefersReducedMotion = useReducedMotion();

  const canGoToStep = (index: number) => {
    if (currentStepperIndex === 0) return index === 0;
    if (index === 0) return true;
    if (index === 1) return (currentStepperIndex >= 1 || colorsLength > 0) && inspirationMode != null;
    if (index >= 2 && !hasCompletedCurrentFlow) return false;
    return index <= currentStepperIndex || colorsLength > 0;
  };
  const isCurrentStep = (index: number) => index === currentStepperIndex;
  const isCompleted = (index: number) => index < currentStepperIndex;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [groupHovered, setGroupHovered] = useState(false);

  const getParticleColor = useCallback(
    (index: number) => {
      if (index === currentStepperIndex) return flowAccent.particle;
      if (index < currentStepperIndex) return flowAccent.completed;
      return '#6b7280';
    },
    [currentStepperIndex, flowAccent]
  );

  const getStepLabel = (index: number) => {
    const step = STEPPER_STEPS[index];
    if (!step) return '';
    if (step.dynamicLabel && inspirationMode) return INSPIRATION_MODE_LABELS[inspirationMode] ?? step.name;
    return step.name;
  };

  const getStepAriaLabel = (index: number) => {
    const step = STEPPER_STEPS[index];
    const name = index === 0 ? 'Elige de dónde nace tu paleta' : getStepLabel(index);
    const completed = isCompleted(index);
    const current = isCurrentStep(index);
    return `${completed ? 'Completado: ' : ''}${name}${current ? ' (actual)' : ''}`;
  };

  return (
    <div
      className="w-full max-w-xl"
      role="progressbar"
      aria-valuenow={currentStepperIndex + 1}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-label={`Paso ${currentStepperIndex + 1} de ${TOTAL_STEPS}: ${getStepLabel(currentStepperIndex) || 'Elige de dónde nace tu paleta'}`}
    >
      {/* Móvil: barra + paso actual (color según flujo) */}
      <div className="md:hidden space-y-1.5">
        <div className="h-1 rounded-full bg-gray-700/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: flowAccent.active }}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">
          {currentStepperIndex + 1} de {TOTAL_STEPS} · {getStepLabel(currentStepperIndex) || 'Origen'}
        </p>
      </div>

      {/* Escritorio: cuadradito | Fábrica | separador | [Refinar–Aplicar–Análisis] grupo | Guardar */}
      <div className="hidden md:flex items-center w-full">
        {STEPPER_STEPS.map((step, index) => {
          const completed = isCompleted(index);
          const current = isCurrentStep(index);
          const clickable = canGoToStep(index);
          const targetPhase = step.id as Phase;
          const label = getStepLabel(index);
          const isHovered = hoveredIndex === index;
          const Icon = PHASE_ICONS[step.id] ?? Cog;
          const isInspirationStep = index === 1;
          const isInRefineApplyAnalysis = index >= 2 && index <= 4;
          /** En el eje Refinar-Aplicar-Análisis, si hay ediciones guardadas, mostrar como completado (color del flujo + check) aunque no se haya pasado por ese paso. */
          const effectiveCompletedInGroup = isInRefineApplyAnalysis && hasPersonalizedFlow && !current;
          const showCompleted = completed || effectiveCompletedInGroup;
          const connectorColor = showCompleted ? flowAccent.completedBorder : 'rgba(75, 85, 99, 0.5)';

          /** Ancho fijo del paso Fábrica (compacto; cabe "Fabrica de Arquetipos"). */
          const inspirationStepWidth = 'w-[11rem]';
          /** Check verde solo si el paso está completado O si esa sección del eje tiene ediciones. */
          const showCheckForIndex = (idx: number) =>
            isCompleted(idx) ||
            (idx === 2 && flowSectionEdited.refinement) ||
            (idx === 3 && flowSectionEdited.application) ||
            (idx === 4 && flowSectionEdited.analysis);

          const renderStepButton = (completedOverride?: boolean) => {
            const showAsCompleted = completedOverride ?? showCompleted;
            const showCheck = showCheckForIndex(index);
            /** En Refinar/Aplicar/Análisis el recuadro verde (fondo) solo si esa sección tiene ediciones o está completada; fuera del grupo igual que antes. */
            const showStyleCompleted = isInRefineApplyAnalysis ? showCheck : showAsCompleted;
            const spinFabricaGear =
              isInspirationStep && current && !prefersReducedMotion;
            return (
              <motion.button
                key={step.id + index}
                type="button"
                onClick={() => clickable && onPhaseClick(targetPhase)}
                disabled={!clickable}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-current={current ? 'step' : undefined}
                aria-label={getStepAriaLabel(index)}
                whileHover={clickable ? { scale: 1.03, y: -1 } : {}}
                whileTap={clickable ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`group relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all duration-200 ${
                  step.showQuadOnly
                    ? 'px-2 py-2 min-w-0 rounded-lg'
                    : isInspirationStep
                      ? `gap-1.5 py-1.5 px-2 ${inspirationStepWidth} justify-center rounded-xl`
                      : 'gap-2 py-2 px-3 min-w-[7.25rem]'
                } ${isInspirationStep ? 'rounded-xl' : isInRefineApplyAnalysis ? 'rounded-md' : 'rounded-lg'} ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                } ${current ? 'border bg-transparent' : showStyleCompleted ? 'border' : 'bg-transparent text-gray-500'} ${
                  !current && !showStyleCompleted && isHovered && clickable ? 'border border-gray-500/70 bg-gray-700/40' : ''
                }`}
                style={
                  current
                    ? { borderColor: flowAccent.completedBorder, color: flowAccent.completed, backgroundColor: flowAccent.activeBg }
                    : showStyleCompleted
                      ? { backgroundColor: flowAccent.completedBg, borderColor: flowAccent.completedBorder, color: flowAccent.completed }
                      : !current && !showStyleCompleted && isHovered && clickable
                        ? { borderColor: 'rgba(107, 114, 128, 0.7)', backgroundColor: 'rgba(55, 65, 81, 0.4)' }
                        : {}
                }
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }}>
                  <ButtonParticles isHovered={current} color={current ? flowAccent.particle : showStyleCompleted ? flowAccent.completed : getParticleColor(index)} count={10} intensity="light" />
                </div>
                <span
                  className={`relative z-10 flex shrink-0 items-center justify-center rounded-md transition-colors ${
                    isInspirationStep ? 'w-8 h-8' : 'w-7 h-7'
                  } ${current ? 'bg-white/10' : showCheck ? 'bg-white/10' : 'bg-gray-700/50'}`}
                >
                  {step.showQuadOnly ? (
                    <span className="w-4 h-4 rounded overflow-hidden grid grid-cols-2 grid-rows-2" aria-hidden>
                      {QUAD_COLORS.map((fill, i) => (
                        <span key={i} style={{ backgroundColor: fill }} />
                      ))}
                    </span>
                  ) : showCheck && !isInspirationStep ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} style={{ color: flowAccent.completed }} />
                  ) : isInspirationStep ? (
                    <motion.span
                      className="inline-flex items-center justify-center"
                      animate={spinFabricaGear ? { rotate: 360 } : { rotate: 0 }}
                      transition={
                        spinFabricaGear
                          ? { duration: FABRICA_GEAR_SPIN_DURATION_S, repeat: Infinity, ease: 'linear' }
                          : { duration: 0.2 }
                      }
                    >
                      <Icon
                        className="w-[1.125rem] h-[1.125rem]"
                        strokeWidth={2}
                        style={isInspirationStep && showCheck ? { color: flowAccent.completed } : undefined}
                      />
                    </motion.span>
                  ) : (
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  )}
                </span>
                {!step.showQuadOnly && (
                  <span className="relative z-10 text-xs font-medium whitespace-nowrap">{label}</span>
                )}
              </motion.button>
            );
          };

          if (index === 0) {
            const originCurrent = current;
            const originHovered = isHovered;
            const originAccent = flowAccent.completedBorder ?? 'rgba(16, 185, 129, 0.5)';
            return (
              <div key={step.id + index} className="flex flex-shrink-0 items-center">
                <motion.button
                  type="button"
                  onClick={() => clickable && onPhaseClick(targetPhase)}
                  disabled={!clickable}
                  onMouseEnter={() => setHoveredIndex(0)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-current={originCurrent ? 'step' : undefined}
                  aria-label={getStepAriaLabel(0)}
                  whileHover={clickable ? { scale: 1.08 } : {}}
                  whileTap={clickable ? { scale: 0.96 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="relative flex items-center justify-center overflow-visible rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 min-w-0"
                >
                  {/* Anillo de foco (activo o hover): animado y suave */}
                  {(originCurrent || (originHovered && clickable)) && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: `0 0 0 1px ${originAccent}, 0 0 14px ${typeof originAccent === 'string' && originAccent.startsWith('rgba') ? originAccent.replace(/[\d.]+\)$/, '0.28)') : originAccent}`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        boxShadow: [
                          `0 0 0 1px ${originAccent}, 0 0 12px ${typeof originAccent === 'string' && originAccent.startsWith('rgba') ? originAccent.replace(/[\d.]+\)$/, '0.22)') : originAccent}`,
                          `0 0 0 1px ${originAccent}, 0 0 20px ${typeof originAccent === 'string' && originAccent.startsWith('rgba') ? originAccent.replace(/[\d.]+\)$/, '0.38)') : originAccent}`,
                          `0 0 0 1px ${originAccent}, 0 0 12px ${typeof originAccent === 'string' && originAccent.startsWith('rgba') ? originAccent.replace(/[\d.]+\)$/, '0.22)') : originAccent}`,
                        ],
                      }}
                      transition={{
                        opacity: { duration: 0.2 },
                        boxShadow: { duration: 2.5, repeat: originCurrent ? Infinity : 0, ease: 'easeInOut' },
                      }}
                    />
                  )}
                  {/* Capas concéntricas (tamaño fijo); el símbolo SVG puede ser mayor — overflow visible */}
                  <span className="relative z-10 flex size-12 shrink-0 items-center justify-center overflow-visible rounded-xl bg-gray-900/80 ring-1 ring-gray-700/80">
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-visible rounded-lg bg-gray-800/90 ring-1 ring-gray-600/60">
                      <ChromaticaSymbolLogo
                        size={44}
                        animated
                        speed={0.28}
                        className="shrink-0"
                      />
                    </span>
                  </span>
                </motion.button>
                <div className="flex-shrink-0 w-4 h-px mx-1.5" style={{ backgroundColor: connectorColor }} aria-hidden />
              </div>
            );
          }
          if (index === 1) {
            return (
              <div key={step.id + index} className="flex flex-shrink-0 items-center">
                <div className="flex flex-shrink-0 items-center rounded-lg px-0.5 py-0.5 bg-gray-800/40">
                  {renderStepButton()}
                </div>
                <div className="w-1 h-6 mx-0.5 rounded-full bg-gray-600/50 flex-shrink-0" aria-hidden title="Separación entre origen y mi paleta" />
                <div className="flex-shrink-0 w-4 h-px mx-0.5" style={{ backgroundColor: connectorColor }} aria-hidden />
              </div>
            );
          }
          if (index === 2) {
            return (
              <div
                key="group-refinar-aplicar"
                className="relative flex flex-shrink-0"
                onMouseEnter={() => setGroupHovered(true)}
                onMouseLeave={() => setGroupHovered(false)}
              >
                <div
                  className={`flex flex-shrink-0 items-center rounded-lg px-1 py-0.5 ${
                    hasPersonalizedFlow ? 'bg-gray-800/80 border border-gray-600/50' : 'bg-gray-800/40'
                  }`}
                >
                  {renderStepButton()}
                <div className="w-2.5 h-px mx-0.5 flex-shrink-0" style={{ backgroundColor: connectorColor }} aria-hidden />
                {STEPPER_STEPS.slice(3, 5).map((s, i) => {
                  const idx = 3 + i;
                  const cur = isCurrentStep(idx);
                  const showCheck = showCheckForIndex(idx);
                  const cl = canGoToStep(idx);
                  const ph = s.id as Phase;
                  const lbl = getStepLabel(idx);
                  const hov = hoveredIndex === idx;
                  const Ic = PHASE_ICONS[s.id] ?? Cog;
                  return (
                    <div key={s.id + idx} className="flex items-center flex-shrink-0">
                      <motion.button
                        type="button"
                        onClick={() => cl && onPhaseClick(ph)}
                        disabled={!cl}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        aria-current={cur ? 'step' : undefined}
                        aria-label={getStepAriaLabel(idx)}
                        whileHover={cl ? { scale: 1.03, y: -1 } : {}}
                        whileTap={cl ? { scale: 0.98 } : {}}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`group relative flex items-center gap-2 rounded-md py-2 px-2.5 min-w-[5.75rem] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all ${cl ? 'cursor-pointer' : 'cursor-default'} ${cur ? 'border bg-transparent' : showCheck ? 'border' : 'bg-transparent text-gray-500'} ${
                          !cur && !showCheck && hov && cl ? 'border border-gray-500/70 bg-gray-700/40' : ''
                        }`}
                        style={
                          cur
                            ? { borderColor: flowAccent.completedBorder, color: flowAccent.completed, backgroundColor: flowAccent.activeBg }
                            : showCheck
                              ? { backgroundColor: flowAccent.completedBg, borderColor: flowAccent.completedBorder, color: flowAccent.completed }
                              : !cur && !showCheck && hov && cl
                                ? { borderColor: 'rgba(107, 114, 128, 0.7)', backgroundColor: 'rgba(55, 65, 81, 0.4)' }
                                : {}
                        }
                      >
                        <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                          <ButtonParticles isHovered={cur} color={cur ? flowAccent.completed : showCheck ? flowAccent.completed : getParticleColor(idx)} count={10} intensity="light" />
                        </div>
                        <span className={`relative z-10 flex shrink-0 items-center justify-center rounded-md w-7 h-7 ${cur ? 'bg-white/10' : showCheck ? 'bg-white/10' : 'bg-gray-700/50'}`}>
                          {showCheck ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} style={{ color: flowAccent.completed }} /> : <Ic className="w-3.5 h-3.5" strokeWidth={2} />}
                        </span>
                        <span className="relative z-10 text-xs font-medium whitespace-nowrap">{lbl}</span>
                      </motion.button>
                      {idx < 4 && <div className="w-2.5 h-px mx-0.5 flex-shrink-0" style={{ backgroundColor: connectorColor }} aria-hidden />}
                    </div>
                  );
                })}
                </div>
                {hasPersonalizedFlow && groupHovered && (
                  <div
                    className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-600/80 bg-gray-800/95 px-3 py-2 text-xs text-gray-200 shadow-xl backdrop-blur-sm"
                    role="tooltip"
                  >
                    Mi paleta: Refinar, Aplicar y Análisis (con cambios guardados)
                  </div>
                )}
              </div>
            );
          }
          if (index === 5) {
            return (
              <div key={step.id + index} className="flex flex-shrink-0 items-center">
                <div className="flex-shrink-0 w-4 h-px mx-1.5" style={{ backgroundColor: connectorColor }} aria-hidden />
                {renderStepButton()}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
