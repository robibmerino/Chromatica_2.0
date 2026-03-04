import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * ScissorsTool — Tijeras. Sastre / Diseñador.
 * Decimoséptima variante de herramienta. Colores personalizables según el eje.
 */
export function ScissorsTool({
  colorLeft = '#ec4899',
  colorRight = '#8b5cf6',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('scissors');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="65%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="155" rx="30" ry="42" fill={`url(#${gradId})`} />

      {/* Hoja izquierda */}
      <path d="M40,105 L12,32" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M40,105 L12,32" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <path d="M10,32 L12,26 L16,34" fill={color} opacity="0.55" />

      {/* Hoja derecha */}
      <path d="M40,105 L68,32" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M40,105 L68,32" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <path d="M64,34 L68,26 L70,32" fill={color} opacity="0.55" />

      {/* Pivote central */}
      <circle cx="40" cy="105" r="5" fill={color} opacity="0.55" />
      <circle cx="40" cy="105" r="5" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <circle cx="40" cy="105" r="5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />
      <circle cx="40" cy="105" r="2" fill="white" opacity="0.4" />

      {/* Ojo izquierdo */}
      <ellipse cx="28" cy="155" rx="14" ry="18" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
      <ellipse cx="28" cy="155" rx="14" ry="18" fill="none" stroke="white" strokeWidth="0.7" opacity="0.18" />
      <ellipse cx="28" cy="155" rx="8" ry="12" fill={color} opacity="0.15" />

      {/* Mango izquierdo */}
      <path d="M40,105 Q32,125 28,137" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <path d="M40,105 Q32,125 28,137" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      {/* Ojo derecho */}
      <ellipse cx="52" cy="155" rx="14" ry="18" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
      <ellipse cx="52" cy="155" rx="14" ry="18" fill="none" stroke="white" strokeWidth="0.7" opacity="0.18" />
      <ellipse cx="52" cy="155" rx="8" ry="12" fill={color} opacity="0.15" />

      {/* Mango derecho */}
      <path d="M40,105 Q48,125 52,137" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <path d="M40,105 Q48,125 52,137" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />
    </svg>
  );
}
