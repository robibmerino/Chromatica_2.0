import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const GEM_PATH = 'M40,22 L58,65 L55,160 L40,185 L25,160 L22,65 Z';

/**
 * CrystalTool — Cristal. Místico / Clarividente.
 * Vigésima variante de herramienta. Colores personalizables según el eje.
 */
export function CrystalTool({
  colorLeft = '#22d3ee',
  colorRight = '#a78bfa',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('crystal');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');
  const fillId = id('f');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="35%" r="38%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="50%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="100" rx="30" ry="60" fill={`url(#${gradId})`} />

      {/* Forma principal */}
      <path d={GEM_PATH} fill={`url(#${fillId})`} />
      <path d={GEM_PATH} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
      <path d={GEM_PATH} fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round" opacity="0.3" />

      {/* Facetas */}
      <path d="M40,22 L40,185" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M22,65 L58,65" stroke={color} strokeWidth="0.8" opacity="0.35" />
      <path d="M40,22 L22,65 L40,75 L58,65 Z" fill="white" opacity="0.06" />
      <path d="M40,75 L25,160" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <path d="M40,75 L55,160" stroke={color} strokeWidth="0.5" opacity="0.25" />

      {/* Faceta iluminada */}
      <path d="M40,22 L58,65 L40,75 Z" fill="white" opacity="0.08" />

      {/* Brillo interior */}
      <circle cx="40" cy="95" r="8" fill={color} opacity="0.2" />
      <circle cx="40" cy="95" r="4" fill="white" opacity="0.15" />

      {/* Destellos */}
      <path d="M35,45 L37,40 L39,45 M37,42 L33,42 M37,42 L41,42" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.35" />
      <circle cx="48" cy="88" r="1.5" fill="white" opacity="0.25" />
      <circle cx="33" cy="120" r="1" fill="white" opacity="0.2" />

      {/* Pequeños cristales en la base */}
      <path d="M30,180 L28,195 L32,195 Z" fill={color} opacity="0.3" />
      <path d="M30,180 L28,195 L32,195 Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.45" />
      <path d="M48,175 L46,192 L50,192 Z" fill={color} opacity="0.25" />
      <path d="M48,175 L46,192 L50,192 Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}
