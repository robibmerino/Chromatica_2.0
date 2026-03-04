import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * BauhausBadge — Inspiración Bauhaus.
 * Variante 13 del eje Inspiración. Formas geométricas puras y composición funcional.
 */
export function BauhausBadge({
  colorLeft = '#a5b4fc',
  colorRight = '#4f46e5',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 80);
  const c3 = darkenHex(c1, 150);
  const c4 = lightenHex(c1, 70);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0, 38)">
      <rect x="0" y="0" width="40" height="40" fill={c3} opacity="0.8" />
      <circle cx="15" cy="20" r="8" fill={c4} opacity="0.75" />
      <circle cx="55" cy="50" r="28" fill={c1} opacity="0.65" />
      <circle cx="55" cy="50" r="16" fill={c4} opacity="0.8" />
      <circle cx="55" cy="50" r="5" fill={c2} opacity="0.7" />
      <path d="M0,85 L40,85 L20,45 Z" fill={c1} opacity="0.55" />
      <rect x="45" y="90" width="30" height="30" fill={c2} opacity="0.6" />
      <rect x="45" y="90" width="15" height="15" fill={c4} opacity="0.5" />
      <rect x="60" y="105" width="15" height="15" fill={c1} opacity="0.4" />
      <path d="M0,85 L45,85" stroke={c3} strokeWidth="2.5" opacity="0.7" />
      <path d="M40,45 L40,130" stroke={c3} strokeWidth="2" opacity="0.6" />
      <rect x="0" y="135" width="80" height="25" fill={c1} opacity="0.45" />
      <rect x="0" y="135" width="25" height="25" fill={c3} opacity="0.65" />
      </g>
    </svg>
  );
}
