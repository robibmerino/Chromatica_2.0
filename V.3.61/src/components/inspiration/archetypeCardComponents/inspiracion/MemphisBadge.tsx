import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * MemphisBadge — Inspiración Memphis.
 * Variante 12 del eje Inspiración. Estilo Memphis años 80: geométrico y juguetón.
 */
export function MemphisBadge({
  colorLeft = '#fb7185',
  colorRight = '#e11d48',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);
  const c4 = lightenHex(c1, 60);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <circle cx="25" cy="40" r="20" fill={c4} opacity="0.3" />
      <circle cx="25" cy="40" r="20" fill="none" stroke={c2} strokeWidth="3" opacity="0.6" />
      <circle cx="28" cy="37" r="8" fill={c1} opacity="0.45" />
      <path d="M55,15 L70,45 L40,45 Z" fill={c1} opacity="0.3" />
      <path d="M55,15 L70,45 L40,45 Z" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.55" />
      <path d="M5,70 Q18,63 30,70 Q42,77 55,70 Q68,63 75,70" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <rect x="10" y="85" width="35" height="30" fill={c4} opacity="0.25" />
      <rect x="10" y="85" width="35" height="30" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.55" />
      <rect x="18" y="90" width="18" height="18" fill={c1} opacity="0.4" transform="rotate(12 27 99)" />
      <path d="M50,90 A20,20 0 0,1 50,130" fill={c1} opacity="0.3" />
      <path d="M50,90 A20,20 0 0,1 50,130" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.5" />
      <path d="M10,140 L20,130 L30,140 L40,130 L50,140" fill="none" stroke={c1} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      {[[15, 160, 4], [55, 155, 3], [35, 170, 3.5], [65, 170, 3], [20, 180, 3]].map(([x, y, r], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={i % 2 === 0 ? c1 : c4} opacity="0.4" />
      ))}
      {[[60, 85], [25, 155], [60, 145]].map(([x, y], i) => (
        <g key={i} opacity="0.35">
          <path d={`M${(x as number) - 3},${y} L${(x as number) + 3},${y}`} stroke={c2} strokeWidth="2" />
          <path d={`M${x},${(y as number) - 3} L${x},${(y as number) + 3}`} stroke={c2} strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}
