import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Energía). */
const GHOST_CAT_DEFAULT_LEFT = '#eab308';

/** Paleta original del GhostCat (anclada en Energía, slider=0). Colores amarillo eléctrico que rotan según el eje Energía–Armonía. */
const GHOST_CAT_PALETTE = {
  coreLight: '#fef08a',
  coreMid: '#eab308',
  coreDark: '#854d0e',
  glowLight: '#fde047',
  glowOuter: '#a16207',
  ringStroke: '#eab308',
  lineLight: '#fef08a',
  lineMid: '#eab308',
  nodeGlow: '#fde047',
  nodeMid: '#fef08a',
  nodeDark: '#eab308',
  centerFill: '#fef08a',
  centerWhite: '#ffffff',
} as const;

/**
 * GhostCat — familiar hexagonal etéreo con radios desde el centro.
 * Colores personalizables según eje Energía–Armonía. Rotación cromática como fondos.
 */
export function GhostCat({
  colorLeft = GHOST_CAT_DEFAULT_LEFT,
  colorRight = '#06b6d4',
  sliderValue = 0,
  defaultColorLeft = GHOST_CAT_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('gc');
  const coreId = svgId('core');
  const glowId = svgId('glow');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  const c = useAxisRotatedPalette(GHOST_CAT_PALETTE, {
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
          <stop offset="45%" stopColor={c.coreMid} stopOpacity="0.65" />
          <stop offset="100%" stopColor={c.coreDark} stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glowLight} stopOpacity="0.45" />
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
      <ellipse cx="40" cy="42" rx="33" ry="30" fill={`url(#${glowId})`} filter={`url(#${softId})`} />
      {/* Forma hexagonal etérea */}
      <path
        d="M40 10 L58 20 L58 44 L40 58 L22 44 L22 20 Z"
        fill={`url(#${coreId})`}
        opacity="0.85"
      />
      {/* Borde interior */}
      <path
        d="M40 16 L54 24 L54 42 L40 52 L26 42 L26 24 Z"
        fill="none"
        stroke={c.ringStroke}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Radios desde centro */}
      <line x1="40" y1="34" x2="40" y2="12" stroke={c.lineLight} strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="34" x2="56" y2="21" stroke={c.lineLight} strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="34" x2="56" y2="43" stroke={c.lineMid} strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="34" x2="40" y2="56" stroke={c.lineMid} strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="34" x2="24" y2="43" stroke={c.lineLight} strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="34" x2="24" y2="21" stroke={c.lineLight} strokeWidth="1" opacity="0.5" />
      {/* Nodos en vértices */}
      <circle cx="40" cy="10" r="3" fill={c.nodeGlow} opacity="0.9" filter={`url(#${blurId})`} />
      <circle cx="58" cy="20" r="2.5" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="58" cy="44" r="2.5" fill={c.nodeDark} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="40" cy="58" r="3" fill={c.nodeGlow} opacity="0.9" filter={`url(#${blurId})`} />
      <circle cx="22" cy="44" r="2.5" fill={c.nodeDark} opacity="0.8" filter={`url(#${blurId})`} />
      <circle cx="22" cy="20" r="2.5" fill={c.nodeMid} opacity="0.8" filter={`url(#${blurId})`} />
      {/* Centro pulsante */}
      <circle cx="40" cy="34" r="10" fill={c.centerFill} opacity="0.4" filter={`url(#${blurId})`} />
      <circle cx="40" cy="34" r="5" fill={c.centerWhite} opacity="0.9" />
      {/* Destellos */}
      <circle cx="37" cy="31" r="2" fill={c.centerWhite} opacity="0.8" />
      <circle cx="44" cy="38" r="1" fill={c.centerWhite} opacity="0.5" />
      <circle cx="52" cy="16" r="1.5" fill={c.lineLight} opacity="0.7" filter={`url(#${blurId})`} />
      <circle cx="28" cy="52" r="1.5" fill={c.nodeGlow} opacity="0.6" filter={`url(#${blurId})`} />
    </svg>
  );
}
