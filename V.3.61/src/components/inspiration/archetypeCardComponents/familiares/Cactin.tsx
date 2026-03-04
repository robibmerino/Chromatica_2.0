import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Núcleo). */
const CACTIN_DEFAULT_LEFT = '#3b82f6';

/** Paleta del Cactin (anclada en Núcleo, slider=0). Colores azul/naranja que rotan según el eje Núcleo–Evolución. */
const CACTIN_PALETTE = {
  coreLight: '#dbeafe',
  coreMid: '#3b82f6',
  coreDark: '#1e3a8a',
  glowLight: '#93c5fd',
  glowOuter: '#1e40af',
  ringStroke: '#3b82f6',
  spiralStroke: '#93c5fd',
  lineLight: '#dbeafe',
  lineMid: '#3b82f6',
  nodeGlow: '#93c5fd',
  nodeMid: '#3b82f6',
  nodeLight: '#dbeafe',
  centerFill: '#dbeafe',
  centerWhite: '#ffffff',
} as const;

/**
 * Cactin — familiar tipo estrella/energía de 8 puntas (Átomo).
 * Colores personalizables según eje Núcleo–Evolución. Rotación cromática como fondos.
 */
export function Cactin({
  colorLeft = CACTIN_DEFAULT_LEFT,
  colorRight = '#f97316',
  sliderValue = 0,
  defaultColorLeft = CACTIN_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('cactin');
  const coreId = svgId('core');
  const glowId = svgId('glow');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  const c = useAxisRotatedPalette(CACTIN_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" className={className}>
      <defs>
        <radialGradient id={coreId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="0.95" />
          <stop offset="45%" stopColor={c.coreMid} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c.coreDark} stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glowLight} stopOpacity="0.35" />
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
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {/* Aura */}
      <ellipse cx="40" cy="40" rx="33" ry="33" fill={`url(#${glowId})`} filter={`url(#${softId})`} />
      {/* Forma principal — estrella de 8 puntas suave */}
      <path
        d="M40 10 Q44 24 56 16 Q48 28 62 32 Q48 36 56 48 Q44 40 40 54 Q36 40 24 48 Q32 36 18 32 Q32 28 24 16 Q36 24 40 10Z"
        fill={`url(#${coreId})`}
      />
      {/* Anillo intermedio */}
      <circle cx="40" cy="32" r="16" fill="none" stroke={c.ringStroke} strokeWidth="1" opacity="0.4" />
      {/* Espiral interior */}
      <path
        d="M40 26 Q46 28 46 34 Q46 40 40 42 Q34 40 32 34 Q34 28 40 26Z"
        fill="none"
        stroke={c.spiralStroke}
        strokeWidth="1.2"
        opacity="0.7"
      />
      {/* Líneas de energía */}
      <line x1="40" y1="14" x2="40" y2="50" stroke={c.lineLight} strokeWidth="0.8" opacity="0.35" />
      <line x1="14" y1="32" x2="66" y2="32" stroke={c.lineLight} strokeWidth="0.8" opacity="0.35" />
      <line x1="20" y1="18" x2="60" y2="46" stroke={c.lineMid} strokeWidth="0.8" opacity="0.3" />
      <line x1="60" y1="18" x2="20" y2="46" stroke={c.lineMid} strokeWidth="0.8" opacity="0.3" />
      {/* Nodos en puntas */}
      <circle cx="40" cy="12" r="3" fill={c.nodeGlow} opacity="0.9" filter={`url(#${blurId})`} />
      <circle cx="60" cy="32" r="2.5" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="40" cy="52" r="3" fill={c.nodeGlow} opacity="0.9" filter={`url(#${blurId})`} />
      <circle cx="20" cy="32" r="2.5" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="56" cy="16" r="2" fill={c.nodeLight} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="56" cy="48" r="2" fill={c.nodeLight} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="24" cy="16" r="2" fill={c.nodeMid} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="24" cy="48" r="2" fill={c.nodeMid} opacity="0.7" filter={`url(#${blurId})`} />
      {/* Centro */}
      <circle cx="40" cy="32" r="9" fill={c.centerFill} opacity="0.5" filter={`url(#${blurId})`} />
      <circle cx="40" cy="32" r="4" fill={c.centerWhite} opacity="0.95" />
      {/* Destellos */}
      <circle cx="37" cy="29" r="2" fill={c.centerWhite} opacity="0.8" />
      <circle cx="43" cy="35" r="1" fill={c.centerWhite} opacity="0.5" />
    </svg>
  );
}
