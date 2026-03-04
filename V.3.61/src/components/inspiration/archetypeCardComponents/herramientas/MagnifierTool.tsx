import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * MagnifierTool — Lupa. Investigador / Descubridor.
 * Vigésima cuarta variante de herramienta. Colores personalizables según el eje.
 */
export function MagnifierTool({
  colorLeft = '#6366f1',
  colorRight = '#0ea5e9',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('magnifier');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');
  const lensId = id('lens');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="30%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={lensId} cx="40%" cy="38%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="60%" stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="38" cy="78" rx="36" ry="38" fill={`url(#${gradId})`} />

      {/* Lente — fondo */}
      <circle cx="38" cy="78" r="28" fill="black" opacity="0.15" />
      <circle cx="38" cy="78" r="28" fill={`url(#${lensId})`} />

      {/* Reflejo curvo */}
      <path d="M22,60 Q28,52 40,55" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.18" />

      {/* Marco */}
      <circle cx="38" cy="78" r="28" fill="none" stroke={color} strokeWidth="4" opacity="0.15" />
      <circle cx="38" cy="78" r="28" fill="none" stroke={color} strokeWidth="2" opacity="0.65" />
      <circle cx="38" cy="78" r="28" fill="none" stroke="white" strokeWidth="0.6" opacity="0.28" />

      {/* Mango */}
      <path d="M56,100 L68,205" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      <path d="M56,100 L68,205" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.18" />

      {/* Anillo de unión */}
      <ellipse cx="55" cy="99" rx="6" ry="7" fill="none" stroke={color} strokeWidth="2" opacity="0.5" transform="rotate(18 55 99)" />
      <ellipse cx="55" cy="99" rx="6" ry="7" fill="none" stroke="white" strokeWidth="0.5" opacity="0.18" transform="rotate(18 55 99)" />

      {/* Punto de luz en la lente */}
      <circle cx="28" cy="65" r="3" fill="white" opacity="0.2" />
      <circle cx="28" cy="65" r="1.2" fill="white" opacity="0.35" />
    </svg>
  );
}
