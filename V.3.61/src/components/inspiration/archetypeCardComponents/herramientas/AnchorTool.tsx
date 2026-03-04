import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * AnchorTool — Ancla. Marinero / Firmeza.
 * Decimoquinta variante de herramienta. Colores personalizables según el eje.
 */
export function AnchorTool({
  colorLeft = '#0ea5e9',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('anchor');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="22%" r="28%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="52" rx="20" ry="22" fill={`url(#${gradId})`} />

      {/* Anilla */}
      <circle cx="40" cy="42" r="10" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
      <circle cx="40" cy="42" r="10" fill="none" stroke="white" strokeWidth="0.7" opacity="0.2" />
      <circle cx="40" cy="42" r="4" fill={color} opacity="0.2" />

      {/* Cepo (barra horizontal) */}
      <path d="M16,68 L64,68" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M16,68 L64,68" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />

      {/* Caña (vertical) */}
      <path d="M40,52 L40,185" stroke={color} strokeWidth="5.5" strokeLinecap="round" opacity="0.65" />
      <path d="M40,52 L40,185" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.18" />

      {/* Brazo izquierdo / uña */}
      <path d="M40,185 Q15,180 12,155" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M40,185 Q15,180 12,155" fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />
      {/* Punta izquierda */}
      <path d="M12,155 L8,148 L16,152" fill={color} opacity="0.5" />

      {/* Brazo derecho / uña */}
      <path d="M40,185 Q65,180 68,155" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M40,185 Q65,180 68,155" fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />
      {/* Punta derecha */}
      <path d="M68,155 L72,148 L64,152" fill={color} opacity="0.5" />

      <circle cx="36" cy="38" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}
