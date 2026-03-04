import { blendHex, darkenHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * OpArtBadge — Inspiración Op Art.
 * Variante 14 del eje Inspiración. Ilusiones ópticas y patrones geométricos.
 */
export function OpArtBadge({
  colorLeft = '#67e8f9',
  colorRight = '#0891b2',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const c1 = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const c2 = darkenHex(c1, 100);

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx="40" cy="70" r={8 + i * 5} fill="none" stroke={i % 2 === 0 ? c1 : c2} strokeWidth={1.8 - i * 0.1} opacity={0.5 - i * 0.03} />
      ))}
      <circle cx="40" cy="70" r="5" fill={c1} opacity="0.6" />
      <circle cx="40" cy="70" r="2.5" fill="white" opacity="0.4" />
      {Array.from({ length: 6 }).map((_, i) => {
        const size = 28 - i * 4;
        return <rect key={i} x={40 - size / 2} y={160 - size / 2} width={size} height={size} fill="none" stroke={i % 2 === 0 ? c1 : c2} strokeWidth={1.5 - i * 0.12} opacity={0.45 - i * 0.04} transform={`rotate(${i * 5} 40 160)`} />;
      })}
      <circle cx="40" cy="160" r="3" fill={c1} opacity="0.5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={20 + i * 10} cy="210" r={1 + i * 0.5} fill={c1} opacity={0.3 + i * 0.08} />
      ))}
    </svg>
  );
}
