import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * HammerTool — Martillo. Artesano / Constructor.
 * Primera variante de herramienta. Colores personalizables según el eje.
 */
export function HammerTool({
  colorLeft = '#d97706',
  colorRight = '#b45309',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('hammer');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="20%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="50" rx="38" ry="28" fill={`url(#${gradId})`} />

      {/* Mango */}
      <path d="M40,68 L40,210" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      <path d="M40,68 L40,210" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />

      {/* Cabeza */}
      <rect x="10" y="35" width="60" height="30" rx="4" fill={color} opacity="0.5" />
      <rect x="10" y="35" width="60" height="30" rx="4" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <rect x="10" y="35" width="60" height="30" rx="4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

      <circle cx="30" cy="50" r="2" fill="white" opacity="0.35" />
    </svg>
  );
}
