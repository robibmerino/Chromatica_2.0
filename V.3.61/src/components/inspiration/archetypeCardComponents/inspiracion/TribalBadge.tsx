import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * TribalBadge — Inspiración Tribal.
 * Variante 17 del eje Inspiración. Patrones étnicos, máscaras y símbolos ancestrales.
 */
export function TribalBadge({
  colorLeft = '#ff8229',
  colorRight = '#c2410c',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);
  const c3 = darkenHex(c1, 130);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <path d={`M${i * 16},12 L${i * 16 + 8},2 L${i * 16 + 16},12`} fill={c1} opacity="0.45" />
          <path d={`M${i * 16},0 L${i * 16 + 8},10 L${i * 16 + 16},0`} fill={c2} opacity="0.3" />
        </g>
      ))}
      <path d="M0,12 L80,12" stroke={c1} strokeWidth="1.5" opacity="0.5" />
      <path d="M40,30 Q52,36 56,52 Q58,70 52,85 Q46,95 40,98 Q34,95 28,85 Q22,70 24,52 Q28,36 40,30 Z" fill={c2} opacity="0.35" />
      <path d="M40,30 Q52,36 56,52 Q58,70 52,85 Q46,95 40,98 Q34,95 28,85 Q22,70 24,52 Q28,36 40,30 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" />
      <ellipse cx="34" cy="55" rx="5" ry="3.5" fill={c3} opacity="0.45" />
      <circle cx="34" cy="55" r="2" fill={c1} opacity="0.5" />
      <ellipse cx="46" cy="55" rx="5" ry="3.5" fill={c3} opacity="0.45" />
      <circle cx="46" cy="55" r="2" fill={c1} opacity="0.5" />
      <path d="M40,60 L40,72" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <path d="M35,80 Q40,85 45,80" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
      <path d="M40,25 L40,18" stroke={c1} strokeWidth="1.5" opacity="0.45" />
      <path d="M33,28 L30,20 M47,28 L50,20" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <path key={i} d={`M10,${110 + i * 10} L${10 + i * 3},${115 + i * 10} L${18 + i * 3},${110 + i * 10}`} fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <path key={i} d={`M${12 + i * 15},165 L${20 + i * 15},175 L${12 + i * 15},185 L${4 + i * 15},175 Z`} fill={i % 2 === 0 ? c1 : c2} stroke={c1} strokeWidth="0.8" opacity="0.38" />
      ))}
      <circle cx="40" cy="210" r="10" fill={c2} opacity="0.35" />
      <circle cx="40" cy="210" r="10" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
      <circle cx="40" cy="210" r="5" fill={c1} opacity="0.4" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <path key={i} d={`M${40 + 11 * Math.cos(a)},${210 + 11 * Math.sin(a)} L${40 + 16 * Math.cos(a)},${210 + 16 * Math.sin(a)}`} stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />;
      })}
    </svg>
  );
}
