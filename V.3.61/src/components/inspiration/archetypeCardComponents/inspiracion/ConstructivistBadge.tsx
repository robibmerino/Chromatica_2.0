import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * ConstructivistBadge — Inspiración Constructivista.
 * Variante 15 del eje Inspiración. Composición geométrica y tipografía rusa.
 */
export function ConstructivistBadge({
  colorLeft = '#fbbf24',
  colorRight = '#d97706',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 90);
  const c4 = lightenHex(c1, 80);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <path d="M-5,120 L85,80 L85,95 L-5,135 Z" fill={c1} opacity="0.7" />
      <path d="M-5,135 L85,95 L85,105 L-5,145 Z" fill={c2} opacity="0.5" />
      <circle cx="30" cy="55" r="22" fill="none" stroke={c1} strokeWidth="4" opacity="0.6" />
      <path d="M30,55 L52,55 L30,33 Z" fill={c1} opacity="0.55" />
      <circle cx="30" cy="55" r="5" fill={c2} opacity="0.6" />
      <rect x="58" y="10" width="12" height="65" fill={c2} opacity="0.55" />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={10 + i * 8} y={170 - i * 8} width="6" height="4" fill={i % 2 === 0 ? c1 : c2} opacity={0.4 + i * 0.04} />
      ))}
      <path d="M55,170 L75,180 L55,190 Z" fill={c1} opacity="0.55" />
      <path d="M25,180 L55,180" stroke={c1} strokeWidth="3" opacity="0.45" />
      <rect x="5" y="200" width="70" height="12" fill={c2} opacity="0.5" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={10 + i * 15} y="203" width="8" height="6" fill={c4} opacity="0.6" />
      ))}
    </svg>
  );
}
