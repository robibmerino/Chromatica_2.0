import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * OrganicBadge — Inspiración Orgánica.
 * Variante 2 del eje Inspiración. Formas curvas y fluidas.
 */
export function OrganicBadge({
  colorLeft = '#3eea7d',
  colorRight = '#3eea7d',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <path d="M10,40 Q-5,20 20,10 Q45,0 55,20 Q65,40 50,55 Q35,70 10,40 Z" fill={c1} opacity="0.15" />
      <path d="M10,40 Q-5,20 20,10 Q45,0 55,20 Q65,40 50,55 Q35,70 10,40 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
      <path d="M55,65 Q75,55 72,80 Q70,105 50,100 Q30,95 45,78 Q55,65 55,65 Z" fill={c1} opacity="0.12" />
      <path d="M55,65 Q75,55 72,80 Q70,105 50,100 Q30,95 45,78 Z" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.35" />
      <path d="M30,120 Q20,105 35,95 Q50,100 40,115 Z" fill={c1} opacity="0.18" />
      <path d="M25,200 Q30,170 35,140 Q38,120 40,100" fill="none" stroke={c1} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <path d="M35,140 Q20,135 12,120" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
      <path d="M38,160 Q55,155 65,140" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
      {[[20, 180, 4], [50, 175, 3.5], [35, 195, 3], [60, 195, 3], [15, 210, 2.5], [45, 215, 2.5]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r as number} fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />
          <circle cx={(x as number) - 1} cy={(y as number) - 1} r={(r as number) * 0.3} fill={c1} opacity="0.25" />
        </g>
      ))}
      <path d="M40,220 Q35,228 42,235" fill={c1} opacity="0.3" />
    </svg>
  );
}
