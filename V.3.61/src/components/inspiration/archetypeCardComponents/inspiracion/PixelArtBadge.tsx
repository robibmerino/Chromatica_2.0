import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * PixelArtBadge — Inspiración Pixel Art.
 * Variante 10 del eje Inspiración. Formas pixeladas retro.
 */
export function PixelArtBadge({
  colorLeft = '#4ade80',
  colorRight = '#16a34a',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 60);
  const c4 = lightenHex(c1, 70);
  const c5 = lightenHex(c1, 110);

  const P = 8;
  const px = (x: number, y: number, c: string, op = 1) => (
    <rect x={x * P} y={y * P} width={P} height={P} fill={c} opacity={op} />
  );

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {[[4, 3], [5, 3], [4, 4], [5, 4]].map(([x, y], i) => (
        <g key={`s${i}`}>{px(x as number, y as number, c4, 0.6)}</g>
      ))}
      {[[3, 4], [6, 4], [3, 5], [4, 5], [5, 5], [6, 5], [4, 6], [5, 6]].map(([x, y], i) => (
        <g key={`sb${i}`}>{px(x as number, y as number, c1, 0.5)}</g>
      ))}
      {[[4, 10], [4, 11], [4, 12], [4, 13], [4, 14], [4, 15]].map(([x, y], i) => (
        <g key={`bl${i}`}>
          {px(x as number, y as number, c4, 0.55)}
          {px((x as number) + 1, y as number, c1, 0.45)}
        </g>
      ))}
      {px(4, 9, c5, 0.6)}
      {[2, 3, 4, 5, 6].map((x, i) => (
        <g key={`g${i}`}>{px(x, 16, c2, 0.5)}</g>
      ))}
      {[17, 18].map((y, i) => (
        <g key={`h${i}`}>{px(4, y, c2, 0.45)}</g>
      ))}
      {[[3, 21], [4, 21], [5, 21], [6, 21], [3, 22], [4, 22], [5, 22], [6, 22], [7, 22], [4, 23], [5, 23], [6, 23], [5, 24]].map(([x, y], i) => (
        <g key={`m${i}`}>{px(x as number, y as number, c1, 0.4)}</g>
      ))}
      {px(5, 21, c5, 0.4)}
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={`hp${i}`}>{px(2 + i, 27, i < 5 ? c1 : c4, 0.5)}</g>
      ))}
    </svg>
  );
}
