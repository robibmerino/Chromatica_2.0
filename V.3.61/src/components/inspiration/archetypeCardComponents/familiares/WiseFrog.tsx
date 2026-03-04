import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Lujo). */
const WISE_FROG_DEFAULT_LEFT = '#d4af37';

/** Paleta original del WiseFrog (anclada en Lujo, slider=0). Colores dorados que rotan según el eje Lujo–Misterio. */
const WISE_FROG_PALETTE = {
  coreLight: '#fef3c7',
  coreMid: '#d4af37',
  coreDark: '#78350f',
  glowLight: '#fcd34d',
  glowOuter: '#78350f',
  ringStroke: '#d4af37',
  lineLight: '#fef3c7',
  nodeGlow: '#fcd34d',
  nodeMid: '#d4af37',
  centerFill: '#fef3c7',
  spiralStroke: '#d4af37',
  centerWhite: '#ffffff',
} as const;

/**
 * WiseFrog — familiar tipo rombo redondeado con cruz de luz.
 * Colores personalizables según eje Lujo–Misterio. Rotación cromática como fondos.
 */
export function WiseFrog({
  colorLeft = WISE_FROG_DEFAULT_LEFT,
  colorRight = '#6d28d9',
  sliderValue = 0,
  defaultColorLeft = WISE_FROG_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('wf');
  const coreId = svgId('core');
  const glowId = svgId('glow');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  const c = useAxisRotatedPalette(WISE_FROG_PALETTE, {
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
          <stop offset="0%" stopColor={c.glowLight} stopOpacity="0.3" />
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
      <ellipse cx="40" cy="42" rx="32" ry="30" fill={`url(#${glowId})`} filter={`url(#${softId})`} />
      {/* Forma principal — rombo redondeado */}
      <path
        d="M40 10 Q60 22 64 40 Q60 58 40 66 Q20 58 16 40 Q20 22 40 10Z"
        fill={`url(#${coreId})`}
      />
      {/* Anillo interior */}
      <path
        d="M40 18 Q55 27 58 40 Q55 53 40 60 Q25 53 22 40 Q25 27 40 18Z"
        fill="none"
        stroke={c.ringStroke}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Cruz de luz interior */}
      <line x1="40" y1="20" x2="40" y2="60" stroke={c.lineLight} strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="40" x2="60" y2="40" stroke={c.lineLight} strokeWidth="1" opacity="0.4" />
      {/* Nodos en la cruz */}
      <circle cx="40" cy="20" r="3" fill={c.nodeGlow} opacity="0.9" filter={`url(#${blurId})`} />
      <circle cx="40" cy="60" r="3" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="20" cy="40" r="3" fill={c.nodeGlow} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="60" cy="40" r="3" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      {/* Centro */}
      <circle cx="40" cy="40" r="10" fill={c.centerFill} opacity="0.5" filter={`url(#${blurId})`} />
      <circle cx="40" cy="40" r="5" fill={c.centerWhite} opacity="0.9" />
      {/* Espirales sutiles */}
      <path
        d="M40 35 Q46 37 44 43 Q42 49 36 47 Q30 45 32 39 Q34 33 40 35Z"
        fill="none"
        stroke={c.spiralStroke}
        strokeWidth="1.2"
        opacity="0.6"
      />
      {/* Destellos */}
      <circle cx="37" cy="37" r="1.5" fill={c.centerWhite} opacity="0.8" />
      <circle cx="44" cy="44" r="1" fill={c.centerWhite} opacity="0.6" />
      <circle cx="30" cy="28" r="1.5" fill={c.nodeGlow} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="52" cy="54" r="1.5" fill={c.nodeMid} opacity="0.7" filter={`url(#${blurId})`} />
    </svg>
  );
}
