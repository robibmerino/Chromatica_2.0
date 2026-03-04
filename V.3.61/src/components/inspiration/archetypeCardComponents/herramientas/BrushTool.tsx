import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * BrushTool — Pincel. Artista / Creador visual.
 * Segunda variante de herramienta. Colores personalizables según el eje.
 */
export function BrushTool({
  colorLeft = '#ec4899',
  colorRight = '#8b5cf6',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('brush');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="12%" r="28%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="35" rx="22" ry="25" fill={`url(#${gradId})`} />

      {/* Mango */}
      <path d="M40,82 L40,215" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <path d="M40,82 L40,215" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />

      {/* Virola */}
      <rect x="33" y="66" width="14" height="18" rx="2" fill={color} opacity="0.55" />
      <rect x="33" y="66" width="14" height="18" rx="2" fill="none" stroke={color} strokeWidth="1" opacity="0.65" />
      <rect x="33" y="66" width="14" height="18" rx="2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Cerdas */}
      <path d="M34,66 Q30,48 28,30 Q32,20 40,18 Q48,20 52,30 Q50,48 46,66" fill={color} opacity="0.45" />
      <path d="M34,66 Q30,48 28,30 Q32,20 40,18 Q48,20 52,30 Q50,48 46,66" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <path d="M34,66 Q30,48 28,30 Q32,20 40,18 Q48,20 52,30 Q50,48 46,66" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Punta */}
      <circle cx="40" cy="20" r="2.5" fill={color} opacity="0.6" />
      <circle cx="40" cy="20" r="1.2" fill="white" opacity="0.45" />
    </svg>
  );
}
