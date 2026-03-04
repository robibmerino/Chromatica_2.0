import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * MinimalistBadge — Inspiración Minimalista.
 * Variante 3 del eje Inspiración. Líneas y círculos esenciales.
 */
export function MinimalistBadge({
  colorLeft = '#93c5fd',
  colorRight = '#2563eb',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <path d="M8,120 L72,120" stroke={color} strokeWidth="2.5" opacity="0.55" />
      <circle cx="40" cy="120" r="24" fill="none" stroke={color} strokeWidth="2.5" opacity="0.5" />
      <circle cx="40" cy="120" r="5" fill={color} opacity="0.65" />
    </svg>
  );
}
