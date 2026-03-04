import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * GeometricBadge — Inspiración Geométrica.
 * Variante 4 del eje Inspiración. Triángulos, rectángulos y círculos.
 */
export function GeometricBadge({
  colorLeft = '#f0abfc',
  colorRight = '#c026d3',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);
  const c3 = darkenHex(c1, 130);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <path d="M5,10 L75,10 L5,80 Z" fill={c1} opacity="0.3" />
      <path d="M5,10 L75,10 L5,80 Z" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.55" />
      <rect x="25" y="85" width="50" height="50" fill={c1} opacity="0.2" />
      <rect x="25" y="85" width="50" height="50" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.55" />
      <path d="M25,85 L75,135" stroke={c3} strokeWidth="1" opacity="0.35" />
      <circle cx="50" cy="110" r="20" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <circle cx="50" cy="110" r="2" fill={c2} opacity="0.5" />
      <path d="M20,155 L60,145 L60,185 L20,195 Z" fill={c2} opacity="0.25" />
      <path d="M20,155 L60,145 L60,185 L20,195 Z" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" />
      <rect x="10" y="205" width="60" height="8" fill={c1} opacity="0.3" />
      <path d="M0,0 L80,240" stroke={c1} strokeWidth="0.4" opacity="0.1" />
    </svg>
  );
}
