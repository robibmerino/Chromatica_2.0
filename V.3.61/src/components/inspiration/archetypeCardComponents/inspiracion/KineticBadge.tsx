import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * KineticBadge — Inspiración Cinética.
 * Variante 6 del eje Inspiración. Líneas dinámicas y ondas de movimiento.
 */
export function KineticBadge({
  colorLeft = '#67e8f9',
  colorRight = '#0891b2',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {/* Círculos concéntricos — más grandes */}
      <circle cx="40" cy="77" r="34" fill="none" stroke={c1} strokeWidth="2" opacity="0.15" />
      <circle cx="40" cy="77" r="28" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.25" />
      <circle cx="40" cy="77" r="20" fill={c1} opacity="0.25" />
      <circle cx="40" cy="77" r="20" fill="none" stroke={c2} strokeWidth="3" opacity="0.6" />
      <circle cx="40" cy="77" r="7" fill={c2} opacity="0.6" />
      {/* Líneas radiales */}
      {[6, 18, 30, 42].map((x, i) => (
        <path
          key={i}
          d={`M${x},${54 + i * 2} L${x},${100 - i * 2}`}
          stroke={c1}
          strokeWidth={2.2 - i * 0.2}
          opacity={0.35 - i * 0.04}
        />
      ))}
      {/* Barras escalonadas */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={18 + i * 11} y={120 - i * 10} width="8" height={28 + i * 14} fill={c1} opacity={0.4 + i * 0.08} />
      ))}
      {/* Onda inferior */}
      <path d="M5,200 Q25,190 45,200 Q55,210 75,200" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.45" />
    </svg>
  );
}
