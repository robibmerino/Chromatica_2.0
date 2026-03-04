import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * ArtDecoBadge — Inspiración Art Déco.
 * Variante 7 del eje Inspiración. Rayos solares, arcos y formas geométricas elegantes.
 */
export function ArtDecoBadge({
  colorLeft = '#fcd34d',
  colorRight = '#b45309',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -90 + (i - 4) * 20;
        const rad = (angle * Math.PI) / 180;
        return (
          <path
            key={i}
            d={`M40,5 L${40 + 70 * Math.cos(rad)},${5 + 70 * Math.sin(rad)}`}
            stroke={i % 2 === 0 ? c1 : c2}
            strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
            opacity={i % 2 === 0 ? 0.3 : 0.18}
          />
        );
      })}
      {[25, 40, 55].map((r, i) => (
        <path
          key={i}
          d={`M${40 - r},5 A${r},${r} 0 0,1 ${40 + r},5`}
          fill="none"
          stroke={c1}
          strokeWidth={1.5 - i * 0.3}
          opacity={0.4 - i * 0.08}
        />
      ))}
      <rect x="5" y="60" width="10" height="130" fill={c2} opacity="0.35" />
      <rect x="65" y="60" width="10" height="130" fill={c2} opacity="0.35" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${20 + i * 5},90 L40,${125 - i * 8} L${60 - i * 5},90`}
          fill="none"
          stroke={c1}
          strokeWidth={1.8 - i * 0.3}
          opacity={0.45 - i * 0.08}
        />
      ))}
      <path d="M40,108 L50,120 L40,132 L30,120 Z" fill={c2} opacity="0.4" />
      <path d="M40,108 L50,120 L40,132 L30,120 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="120" r="3" fill={c1} opacity="0.5" />
      <rect x="10" y="195" width="60" height="5" fill={c1} opacity="0.4" />
      <path d="M15,210 L25,200 L35,210 L45,200 L55,210 L65,200" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}
