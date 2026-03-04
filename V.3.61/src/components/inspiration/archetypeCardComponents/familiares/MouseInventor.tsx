import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Vida). */
const MOUSE_INVENTOR_DEFAULT_LEFT = '#059669';

/** Paleta del MouseInventor (anclada en Vida, slider=0). Colores esmeralda/ámbar que rotan según el eje Vida–Origen. */
const MOUSE_INVENTOR_PALETTE = {
  coreLight: '#d1fae5',
  coreMid: '#059669',
  coreDark: '#064e3b',
  glowLight: '#6ee7b7',
  glowOuter: '#064e3b',
  ringStroke: '#059669',
  nodeGlow: '#6ee7b7',
  nodeMid: '#059669',
  nodeLight: '#d1fae5',
  centerFill: '#d1fae5',
  filMain: '#6ee7b7',
  filMid: '#059669',
  filLight: '#d1fae5',
  centerWhite: '#ffffff',
} as const;

/**
 * MouseInventor — familiar en forma de triángulo redondeado con órbita y filamentos (Semilla).
 * Colores personalizables según eje Vida–Origen. Rotación cromática como fondos.
 */
export function MouseInventor({
  colorLeft = MOUSE_INVENTOR_DEFAULT_LEFT,
  colorRight = '#d97706',
  sliderValue = 0,
  defaultColorLeft = MOUSE_INVENTOR_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('mi');
  const coreId = svgId('core');
  const glowId = svgId('glow');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  const c = useAxisRotatedPalette(MOUSE_INVENTOR_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" className={className}>
      <defs>
        <radialGradient id={coreId} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="0.95" />
          <stop offset="50%" stopColor={c.coreMid} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c.coreDark} stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glowLight} stopOpacity="0.4" />
          <stop offset="100%" stopColor={c.glowOuter} stopOpacity="0" />
        </radialGradient>
        <filter id={blurId}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* Aura exterior */}
      <ellipse cx="40" cy="40" rx="34" ry="34" fill={`url(#${glowId})`} filter={`url(#${softId})`} />
      {/* Forma principal etérea - triángulo redondeado */}
      <path
        d="M40 12 Q52 18 56 32 Q60 46 50 56 Q40 64 30 56 Q20 46 24 32 Q28 18 40 12Z"
        fill={`url(#${coreId})`}
      />
      {/* Anillo orbital */}
      <ellipse
        cx="40"
        cy="38"
        rx="28"
        ry="10"
        fill="none"
        stroke={c.ringStroke}
        strokeWidth="1.5"
        opacity="0.6"
        transform="rotate(-30, 40, 38)"
      />
      {/* Partículas orbitales */}
      <circle cx="16" cy="32" r="3" fill={c.nodeGlow} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="64" cy="44" r="2.5" fill={c.nodeMid} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="40" cy="14" r="2" fill={c.nodeLight} opacity="0.9" filter={`url(#${blurId})`} />
      {/* Centro brillante */}
      <circle cx="40" cy="38" r="8" fill={c.centerFill} opacity="0.6" filter={`url(#${blurId})`} />
      <circle cx="40" cy="38" r="4" fill={c.centerWhite} opacity="0.9" />
      {/* Filamentos */}
      <path
        d="M40 18 Q48 28 40 38"
        fill="none"
        stroke={c.filMain}
        strokeWidth="1"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M40 18 Q32 28 40 38"
        fill="none"
        stroke={c.filMid}
        strokeWidth="1"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M40 58 Q48 48 40 38"
        fill="none"
        stroke={c.filLight}
        strokeWidth="1"
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Destellos */}
      <circle cx="36" cy="35" r="1.5" fill={c.centerWhite} opacity="0.8" />
      <circle cx="44" cy="42" r="1" fill={c.centerWhite} opacity="0.6" />
    </svg>
  );
}
