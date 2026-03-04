import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Metamorfosis). */
const COSMIC_BUTTERFLY_DEFAULT_LEFT = '#a855f7';

/** Paleta original: púrpura/teal que rotan según el eje Metamorfosis–Refugio. */
const COSMIC_BUTTERFLY_PALETTE = {
  wing1Light: '#c4b5fd',
  wing1Mid: '#a855f7',
  wing1Dark: '#581c87',
  wing2Light: '#5eead4',
  wing2Mid: '#0d9488',
  wing2Dark: '#134e4a',
  coreLight: '#e9d5ff',
  coreMid: '#a855f7',
  vein1: '#c4b5fd',
  vein2: '#5eead4',
  particle1: '#c4b5fd',
  particle2: '#5eead4',
  particle3: '#a855f7',
  particle4: '#0d9488',
  antenna1: '#c4b5fd',
  antenna2: '#5eead4',
  antennaTip1: '#a855f7',
  antennaTip2: '#0d9488',
  aura: '#c4b5fd',
} as const;

/**
 * CosmicButterfly — familiar con alas tipo crisálida.
 * Colores personalizables según eje Metamorfosis–Refugio. Rotación cromática como fondos.
 */
export function CosmicButterfly({
  colorLeft = COSMIC_BUTTERFLY_DEFAULT_LEFT,
  colorRight = '#0d9488',
  sliderValue = 0,
  defaultColorLeft = COSMIC_BUTTERFLY_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('cb');
  const wing1Id = svgId('wing1');
  const wing2Id = svgId('wing2');
  const coreId = svgId('core');
  const glowId = svgId('glow');
  const softId = svgId('soft');

  const c = useAxisRotatedPalette(COSMIC_BUTTERFLY_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" className={className}>
      <defs>
        <radialGradient id={wing1Id} cx="30%" cy="40%" r="70%">
          <stop offset="0%" stopColor={c.wing1Light} stopOpacity="0.9" />
          <stop offset="50%" stopColor={c.wing1Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.wing1Dark} stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id={wing2Id} cx="70%" cy="40%" r="70%">
          <stop offset="0%" stopColor={c.wing2Light} stopOpacity="0.9" />
          <stop offset="50%" stopColor={c.wing2Mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.wing2Dark} stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="60%" stopColor={c.coreLight} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.coreMid} stopOpacity="0.4" />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* Aura */}
      <ellipse cx="40" cy="40" rx="36" ry="28" fill={c.aura} opacity="0.08" filter={`url(#${softId})`} />
      {/* Ala izquierda superior */}
      <path d="M40 38 Q28 20 14 22 Q10 32 22 40 Q30 44 40 38Z" fill={`url(#${wing1Id})`} />
      {/* Ala izquierda inferior */}
      <path d="M40 40 Q26 44 16 56 Q24 62 34 54 Q38 48 40 40Z" fill={`url(#${wing1Id})`} opacity="0.7" />
      {/* Ala derecha superior */}
      <path d="M40 38 Q52 20 66 22 Q70 32 58 40 Q50 44 40 38Z" fill={`url(#${wing2Id})`} />
      {/* Ala derecha inferior */}
      <path d="M40 40 Q54 44 64 56 Q56 62 46 54 Q42 48 40 40Z" fill={`url(#${wing2Id})`} opacity="0.7" />
      {/* Venitas en alas */}
      <path d="M40 38 Q28 28 18 26" fill="none" stroke={c.vein1} strokeWidth="0.8" opacity="0.6" />
      <path d="M40 38 Q52 28 62 26" fill="none" stroke={c.vein2} strokeWidth="0.8" opacity="0.6" />
      <path d="M40 40 Q30 50 20 54" fill="none" stroke={c.vein1} strokeWidth="0.8" opacity="0.5" />
      <path d="M40 40 Q50 50 60 54" fill="none" stroke={c.vein2} strokeWidth="0.8" opacity="0.5" />
      {/* Partículas en alas */}
      <circle cx="22" cy="30" r="2" fill={c.particle1} opacity="0.8" filter={`url(#${glowId})`} />
      <circle cx="58" cy="30" r="2" fill={c.particle2} opacity="0.8" filter={`url(#${glowId})`} />
      <circle cx="20" cy="52" r="1.5" fill={c.particle3} opacity="0.7" filter={`url(#${glowId})`} />
      <circle cx="60" cy="52" r="1.5" fill={c.particle4} opacity="0.7" filter={`url(#${glowId})`} />
      {/* Cuerpo etéreo central */}
      <ellipse cx="40" cy="40" rx="4" ry="10" fill={`url(#${coreId})`} />
      <circle cx="40" cy="32" r="4" fill="white" opacity="0.9" filter={`url(#${glowId})`} />
      {/* Antenas */}
      <path d="M39 30 Q34 20 30 15" fill="none" stroke={c.antenna1} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M41 30 Q46 20 50 15" fill="none" stroke={c.antenna2} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <circle cx="30" cy="14" r="2.5" fill={c.antennaTip1} opacity="0.9" filter={`url(#${glowId})`} />
      <circle cx="50" cy="14" r="2.5" fill={c.antennaTip2} opacity="0.9" filter={`url(#${glowId})`} />
    </svg>
  );
}
