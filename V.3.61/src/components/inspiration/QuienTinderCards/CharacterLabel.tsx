import type { QuienCharacterId } from './types';
import {
  CREATURE_LABELS,
  CREATURE_SUBTITLES,
  CREATURE_LABEL_VARIANTS,
} from '../archetypeCardComponents/creatures';

export interface CharacterLabelProps {
  title: string;
  subtitle: string;
  /** Color del título: emerald, violet, rose, amber, sky, slate, cyan, fuchsia */
  variant?: 'emerald' | 'violet' | 'rose' | 'amber' | 'sky' | 'slate' | 'cyan' | 'fuchsia';
}

const VARIANT_CLASSES: Record<NonNullable<CharacterLabelProps['variant']>, string> = {
  emerald: 'text-emerald-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  amber: 'text-amber-400',
  sky: 'text-sky-400',
  slate: 'text-slate-400',
  cyan: 'text-cyan-400',
  fuchsia: 'text-fuchsia-400',
};

const LABEL_BOX_CLASS =
  'px-4 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-center shrink-0';

export function CharacterLabel({ title, subtitle, variant = 'slate' }: CharacterLabelProps) {
  return (
    <div className={`mt-2 flex flex-col gap-1.5 ${LABEL_BOX_CLASS}`}>
      <p className={`text-sm font-semibold ${VARIANT_CLASSES[variant]}`}>{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

/** Variantes de color para los pills (estilo tarjeta Quién: Persona, Identidad, Rol). */
const VARIANT_PILL: Record<NonNullable<CharacterLabelProps['variant']>, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-300' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-300' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-300' },
  sky: { bg: 'bg-sky-500/20', text: 'text-sky-300' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-300' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  fuchsia: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300' },
};

/** Pills en fila bajo la tarjeta (estilo Quién: Persona, Identidad, Rol). */
export function CharacterLabelBelowCard({
  title,
  subtitle,
  variant = 'slate',
  className = '',
  compact = false,
}: CharacterLabelProps & { className?: string; compact?: boolean }) {
  const pill = VARIANT_PILL[variant];
  const textSize = compact ? 'text-[10px]' : 'text-xs';
  const padCls = compact ? 'px-2 py-0.5' : 'px-2 py-1';
  const subtitleTags = subtitle.split(',').map((s) => s.trim()).filter(Boolean);
  return (
    <div className={`flex flex-wrap gap-2 justify-center mt-2 w-full ${className}`}>
      <span
        className={`${textSize} font-medium rounded-full ${padCls} ${pill.bg} ${pill.text} shrink-0`}
      >
        {title}
      </span>
      {subtitleTags.map((tag) => (
        <span
          key={tag}
          className={`${textSize} rounded-full ${padCls} bg-gray-600/40 text-gray-400 shrink-0`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Etiqueta bajo tarjeta a partir del ID efectivo de criatura. Devuelve null si el ID no es válido. */
export function CharacterLabelFromEffectiveId({
  effectiveCharId,
  compact = false,
  className = '',
}: {
  effectiveCharId: number | null;
  compact?: boolean;
  className?: string;
}) {
  if (effectiveCharId == null || !(effectiveCharId in CREATURE_LABELS)) return null;
  const id = effectiveCharId as QuienCharacterId;
  return (
    <CharacterLabelBelowCard
      title={CREATURE_LABELS[id]}
      subtitle={CREATURE_SUBTITLES[id]}
      variant={CREATURE_LABEL_VARIANTS[id]}
      compact={compact}
      className={className}
    />
  );
}
