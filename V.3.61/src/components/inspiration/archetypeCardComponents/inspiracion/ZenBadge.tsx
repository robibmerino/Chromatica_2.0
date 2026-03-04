import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * ZenBadge — Inspiración Zen.
 * Variante 16 del eje Inspiración. Minimalismo, calma y trazos orgánicos.
 */
export function ZenBadge({
  colorLeft = '#86efac',
  colorRight = '#22c55e',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 80);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <path d="M22,70 Q10,70 10,90 Q10,110 22,115 Q35,118 45,108 Q55,98 52,82 Q50,68 40,65" fill="none" stroke={c1} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M40,65 Q35,63 33,67" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <path d="M60,200 Q58,160 62,120 Q65,85 58,50" fill="none" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M60,55 L55,48 M60,55 L55,62" fill="none" stroke={c1} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M62,120 Q70,115 75,118" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M58,80 Q50,75 45,78" fill="none" stroke={c1} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <rect x="8" y="15" width="15" height="18" rx="1" fill={c1} opacity="0.5" />
      <path d="M12,22 L18,22 M15,20 L15,30" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M15,190 Q12,188 14,184 Q18,186 15,190" fill={c1} opacity="0.3" />
    </svg>
  );
}
