import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * IsometricBadge — Inspiración Isométrica.
 * Variante 9 del eje Inspiración. Cubos isométricos apilados.
 */
export function IsometricBadge({
  colorLeft = '#38bdf8',
  colorRight = '#0ea5e9',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const cL = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const cT = lightenHex(cL, 50);
  const cR = darkenHex(cL, 60);
  const cD = darkenHex(cL, 110);

  const cube = (cx: number, cy: number, w: number, h: number, op: number, k: string) => {
    const hw = w / 2;
    return (
      <g key={k}>
        <path
          d={`M${cx - hw},${cy - h + hw * 0.58} L${cx},${cy - h + hw * 1.16} L${cx},${cy + hw * 1.16 - h + h} L${cx - hw},${cy + hw * 0.58 - h + h} Z`}
          fill={cL}
          opacity={op}
        />
        <path
          d={`M${cx},${cy - h + hw * 1.16} L${cx + hw},${cy - h + hw * 0.58} L${cx + hw},${cy + hw * 0.58 - h + h} L${cx},${cy + hw * 1.16 - h + h} Z`}
          fill={cR}
          opacity={op}
        />
        <path
          d={`M${cx},${cy - h} L${cx + hw},${cy - h + hw * 0.58} L${cx},${cy - h + hw * 1.16} L${cx - hw},${cy - h + hw * 0.58} Z`}
          fill={cT}
          opacity={op}
        />
        <path
          d={`M${cx},${cy - h} L${cx + hw},${cy - h + hw * 0.58} L${cx},${cy - h + hw * 1.16} L${cx - hw},${cy - h + hw * 0.58} Z`}
          fill="none"
          stroke={cD}
          strokeWidth="0.6"
          opacity={op * 0.5}
        />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {cube(40, 192, 40, 28, 0.48, 'b0')}
      {cube(40, 168, 40, 28, 0.45, 'b1')}
      {cube(40, 144, 40, 28, 0.42, 'b2')}
      {cube(40, 120, 40, 28, 0.4, 'b3')}
      {cube(18, 188, 26, 22, 0.38, 'l0')}
      {cube(62, 190, 24, 20, 0.38, 'r0')}
      {cube(40, 100, 22, 38, 0.4, 'col')}
      {cube(40, 68, 18, 18, 0.45, 'top')}
      <path d="M40,198 L72,218 L40,238 L8,218 Z" fill={cT} opacity="0.15" />
    </svg>
  );
}
