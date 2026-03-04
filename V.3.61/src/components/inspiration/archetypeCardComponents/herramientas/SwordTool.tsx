import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BLADE_PATH = 'M40,22 L47,165 L40,172 L33,165 Z';

/**
 * SwordTool — Espada. Guerrero / Protector.
 * Quinta variante de herramienta. Colores personalizables según el eje.
 */
export function SwordTool({
  colorLeft = '#dc2626',
  colorRight = '#16a34a',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('sword');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="12%" r="25%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="32" rx="16" ry="25" fill={`url(#${gradId})`} />

      {/* Hoja */}
      <path d={BLADE_PATH} fill={color} opacity="0.45" />
      <path d={BLADE_PATH} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d={BLADE_PATH} fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />
      <path d="M40,35 L40,155" stroke="white" strokeWidth="0.8" opacity="0.15" />

      {/* Guarda */}
      <path d="M18,172 L62,172" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M18,172 L62,172" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.22" />

      {/* Empuñadura */}
      <path d="M40,176 L40,202" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.65" />
      <path d="M40,176 L40,202" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />

      {/* Pomo */}
      <circle cx="40" cy="210" r="6" fill={color} opacity="0.5" />
      <circle cx="40" cy="210" r="6" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <circle cx="40" cy="210" r="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      <circle cx="40" cy="28" r="1.8" fill="white" opacity="0.45" />
      <circle cx="40" cy="210" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}
