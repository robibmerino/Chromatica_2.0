import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * LineArtBadge — Inspiración Line Art.
 * Variante 11 del eje Inspiración. Dibujo a línea, rostro y formas orgánicas.
 */
export function LineArtBadge({
  colorLeft = '#a5b4fc',
  colorRight = '#6366f1',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <g transform="translate(40,110) scale(1.3) translate(-40,-110)">
      <path d="M28,50 Q25,40 30,30 Q35,22 40,22 Q45,22 50,30 Q55,40 52,50 Q48,60 40,62 Q32,60 28,50 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <path d="M33,42 Q37,40 41,42 Q37,45 33,42" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />
      <path d="M43,42 Q47,40 51,42 Q47,45 43,42" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />
      <path d="M37,52 Q40,55 43,52" fill="none" stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M40,90 Q35,80 35,70 Q35,65 40,62 Q45,65 45,70 Q45,80 40,90" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" />
      <path d="M40,90 Q38,95 40,100 Q42,95 40,90" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M50,140 Q48,120 52,105 Q55,95 52,85" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M52,120 Q60,115 65,118" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M50,135 Q42,132 38,125" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M48,155 Q42,148 40,138 Q42,143 48,148 Q52,148 55,142 Q52,148 48,155" fill="none" stroke={c1} strokeWidth="1" opacity="0.45" />
      <circle cx="40" cy="175" r="8" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <circle cx="40" cy="175" r="4" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />
      <path d="M30,195 Q40,190 50,195 Q40,200 30,195" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
}
