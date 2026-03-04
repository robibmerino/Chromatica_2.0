import { blendHex, darkenHex, lightenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * GlitchBadge — Inspiración Glitch.
 * Variante 8 del eje Inspiración. Círculos desplazados, bandas y bloques fragmentados.
 */
export function GlitchBadge({
  colorLeft = '#ec4899',
  colorRight = '#06b6d4',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 70);
  const cR = lightenHex(c1, 90);
  const cB = darkenHex(c1, 50);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {/* Círculos desplazados — más grandes */}
      <circle cx="32" cy="75" r="28" fill="none" stroke={cR} strokeWidth="2" opacity="0.28" />
      <circle cx="48" cy="78" r="28" fill="none" stroke={cB} strokeWidth="2" opacity="0.28" />
      <circle cx="40" cy="76" r="28" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
      <rect x="0" y="58" width="80" height="5" fill={c2} opacity="0.4" />
      <rect x="20" y="59" width="40" height="3" fill={cR} opacity="0.25" />
      <circle cx="40" cy="76" r="6" fill={c1} opacity="0.55" />
      <circle cx="38" cy="74" r="6" fill={cR} opacity="0.2" />
      <rect x="0" y="108" width="80" height="4" fill={c1} opacity="0.4" />
      {/* Bloques fragmentados — más grandes */}
      {[[3, 125, 28, 5], [35, 138, 32, 5], [8, 152, 24, 5], [45, 118, 22, 5], [15, 168, 38, 5]].map(([x, y, w, h], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={i % 2 === 0 ? c1 : cR} opacity={0.3 + i * 0.04} />
      ))}
      {[[5, 195, 8, 5], [55, 208, 12, 4], [25, 218, 10, 5], [48, 182, 11, 5]].map(([x, y, w, h], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={i % 2 === 0 ? c1 : cB} opacity="0.35" />
      ))}
    </svg>
  );
}
