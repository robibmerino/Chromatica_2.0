import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * ScalesTool — Balanza. Juez / Equilibrio.
 * Decimocuarta variante de herramienta. Colores personalizables según el eje.
 */
export function ScalesTool({
  colorLeft = '#64748b',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('scales');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="30%" r="45%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="75" rx="38" ry="35" fill={`url(#${gradId})`} />

      {/* Pilar central */}
      <path d="M40,55 L40,185" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M40,55 L40,185" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />

      {/* Base */}
      <path d="M22,185 L58,185" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      <path d="M22,185 L58,185" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />

      {/* Fiel (triángulo superior) */}
      <path d="M36,48 L40,38 L44,48 Z" fill={color} opacity="0.55" />
      <path d="M36,48 L40,38 L44,48 Z" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Brazo horizontal */}
      <path d="M8,62 L72,62" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <path d="M8,62 L72,62" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.2" />

      {/* Cadena izquierda */}
      <path d="M12,62 L8,95" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12,62 L16,95" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Platillo izquierdo */}
      <ellipse cx="12" cy="98" rx="14" ry="4" fill={color} opacity="0.45" />
      <ellipse cx="12" cy="98" rx="14" ry="4" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <ellipse cx="12" cy="98" rx="14" ry="4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Cadena derecha */}
      <path d="M68,62 L64,95" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M68,62 L72,95" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Platillo derecho */}
      <ellipse cx="68" cy="98" rx="14" ry="4" fill={color} opacity="0.45" />
      <ellipse cx="68" cy="98" rx="14" ry="4" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <ellipse cx="68" cy="98" rx="14" ry="4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      <circle cx="40" cy="42" r="1.5" fill="white" opacity="0.35" />
    </svg>
  );
}
