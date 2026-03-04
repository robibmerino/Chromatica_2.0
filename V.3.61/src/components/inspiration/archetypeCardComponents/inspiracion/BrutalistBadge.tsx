import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * BrutalistBadge — Inspiración Brutalista.
 * Variante 5 del eje Inspiración. Bloques rectangulares y formas crudas.
 */
export function BrutalistBadge({
  colorLeft = '#bfbfbf',
  colorRight = '#bfbfbf',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 80);
  const c3 = darkenHex(c1, 140);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="5" width="80" height="50" fill={c3} opacity="0.75" />
      <rect x="50" y="5" width="30" height="50" fill={c1} opacity="0.6" />
      <rect x="8" y="15" width="20" height="28" fill="black" opacity="0.3" />
      <rect x="0" y="55" width="80" height="6" fill={c2} opacity="0.65" />
      <rect x="5" y="65" width="35" height="90" fill={c1} opacity="0.5" />
      <rect x="5" y="65" width="35" height="90" fill="none" stroke={c2} strokeWidth="2" opacity="0.55" />
      <rect x="10" y="72" width="8" height="75" fill={c2} opacity="0.35" />
      <rect x="22" y="72" width="8" height="75" fill={c2} opacity="0.3" />
      <rect x="48" y="80" width="28" height="55" fill={c3} opacity="0.55" />
      <rect x="48" y="80" width="28" height="55" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
      <rect x="0" y="160" width="80" height="5" fill={c2} opacity="0.6" />
      <rect x="5" y="170" width="22" height="30" fill={c1} opacity="0.45" />
      <rect x="32" y="170" width="22" height="30" fill={c3} opacity="0.5" />
      <rect x="59" y="170" width="16" height="30" fill={c2} opacity="0.5" />
    </svg>
  );
}
