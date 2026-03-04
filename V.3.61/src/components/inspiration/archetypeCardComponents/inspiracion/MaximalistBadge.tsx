import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * MaximalistBadge — Inspiración Maximalista.
 * Variante 1 del eje Inspiración. Colores personalizables según el eje.
 */
export function MaximalistBadge({
  colorLeft = '#c4b5fd',
  colorRight = '#7c3aed',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('maximalist');
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 60);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id={id('d')} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.5" fill={c1} opacity="0.55" />
        </pattern>
        <pattern id={id('s')} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3" height="6" fill={c1} opacity="0.5" />
        </pattern>
      </defs>
      <rect x="5" y="5" width="30" height="50" fill={`url(#${id('s')})`} />
      <circle cx="55" cy="35" r="22" fill={c1} opacity="0.45" />
      <circle cx="55" cy="35" r="22" fill={`url(#${id('d')})`} />
      <circle cx="55" cy="35" r="22" fill="none" stroke={c2} strokeWidth="2" opacity="0.7" />
      <path d="M15,70 L65,70" stroke={c1} strokeWidth="4" opacity="0.65" />
      <path d="M10,80 L55,80" stroke={c2} strokeWidth="3" opacity="0.55" />
      <path d="M40,95 L70,140 L10,140 Z" fill={c1} opacity="0.4" />
      <path d="M40,95 L70,140 L10,140 Z" fill={`url(#${id('d')})`} opacity="0.55" />
      <path d="M40,95 L70,140 L10,140 Z" fill="none" stroke={c2} strokeWidth="2" opacity="0.65" />
      <rect x="8" y="150" width="30" height="40" fill={c2} opacity="0.5" />
      <rect x="8" y="150" width="30" height="40" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.65" />
      <circle cx="58" cy="170" r="16" fill={c1} opacity="0.45" />
      <circle cx="58" cy="170" r="16" fill="none" stroke={c2} strokeWidth="2" opacity="0.6" />
      <path d="M5,200 L75,200" stroke={c1} strokeWidth="3" opacity="0.6" />
      <path d="M10,210 L70,210" stroke={c2} strokeWidth="2" opacity="0.5" />
      {[15, 30, 45, 60].map((x, i) => (
        <circle key={i} cx={x} cy="225" r="4" fill={i % 2 === 0 ? c1 : c2} opacity="0.6" />
      ))}
    </svg>
  );
}
