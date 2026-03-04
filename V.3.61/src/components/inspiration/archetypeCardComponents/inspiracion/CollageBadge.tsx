import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * CollageBadge — Inspiración Collage.
 * Variante 18 del eje Inspiración. Recortes, superposiciones y composición libre.
 */
export function CollageBadge({
  colorLeft = '#ec4899',
  colorRight = '#be185d',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 60);
  const c3 = darkenHex(c1, 120);
  const c5 = lightenHex(c1, 100);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <g transform="rotate(-6 30 35)">
        <rect x="5" y="10" width="50" height="40" fill={c3} opacity="0.2" />
        <path d="M10,42 L22,22 L30,32 L42,15 L52,42 Z" fill={c1} opacity="0.3" />
        <circle cx="20" cy="20" r="5" fill={c5} opacity="0.35" />
      </g>
      <g transform="rotate(8 60 30)">
        <rect x="38" y="20" width="40" height="12" fill={c5} opacity="0.4" />
        <rect x="42" y="24" width="25" height="3" fill={c2} opacity="0.4" />
      </g>
      <g transform="rotate(-4 25 100)">
        <circle cx="25" cy="100" r="22" fill={c2} opacity="0.25" />
        <circle cx="25" cy="100" r="22" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
        <ellipse cx="25" cy="98" rx="12" ry="6" fill={c3} opacity="0.35" />
        <circle cx="25" cy="98" r="4" fill={c5} opacity="0.4" />
      </g>
      <g transform="rotate(5 55 105)">
        <rect x="38" y="80" width="35" height="45" fill={c5} opacity="0.2" />
        <rect x="38" y="80" width="35" height="45" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.3" />
        <circle cx="55" cy="100" r="12" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
        <path d="M55,88 L55,112 M43,100 L67,100" stroke={c1} strokeWidth="0.6" opacity="0.25" />
      </g>
      <g transform="rotate(-12 40 150)">
        <rect x="8" y="142" width="65" height="12" fill={c1} opacity="0.35" />
        <rect x="15" y="145" width="28" height="5" fill={c5} opacity="0.45" />
      </g>
      <rect x="30" y="170" width="20" height="8" fill={c5} opacity="0.25" transform="rotate(-8 40 174)" />
      <path d="M15,185 Q25,180 35,185" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M50,195 L60,190" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M56,188 L60,190 L58,194" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" />
      <g transform="rotate(15 60 215)">
        <circle cx="60" cy="215" r="10" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.3" />
        <circle cx="60" cy="215" r="7" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2" />
        <rect x="55" y="213" width="10" height="3" fill={c1} opacity="0.25" />
      </g>
    </svg>
  );
}
