import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * LanternTool — Farol. Guía / Explorador.
 * Séptima variante de herramienta. Colores personalizables según el eje.
 */
export function LanternTool({
  colorLeft = '#fbbf24',
  colorRight = '#f97316',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('lantern');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');
  const flameId = id('fl');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={flameId} cx="50%" cy="45%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="50%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="115" rx="35" ry="55" fill={`url(#${gradId})`} />

      {/* Asa */}
      <path d="M28,45 Q40,28 52,45" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.65" />
      <path d="M28,45 Q40,28 52,45" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />

      {/* Tapa */}
      <path d="M24,45 L56,45 L52,55 L28,55 Z" fill={color} opacity="0.55" />
      <path d="M24,45 L56,45 L52,55 L28,55 Z" fill="none" stroke={color} strokeWidth="1" opacity="0.65" />
      <path d="M24,45 L56,45 L52,55 L28,55 Z" fill="none" stroke="white" strokeWidth="0.4" opacity="0.22" />

      {/* Cuerpo cristal */}
      <path d="M28,55 L25,175 L55,175 L52,55 Z" fill={color} opacity="0.18" />
      <path d="M28,55 L25,175 L55,175 L52,55 Z" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M28,55 L25,175 L55,175 L52,55 Z" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />

      {/* Divisiones */}
      <path d="M40,55 L40,175" stroke={color} strokeWidth="1" opacity="0.25" />
      <path d="M28,115 L52,115" stroke={color} strokeWidth="1" opacity="0.25" />

      {/* Resplandor interior */}
      <ellipse cx="40" cy="115" rx="16" ry="35" fill={`url(#${flameId})`} />

      {/* Llama */}
      <path d="M40,100 Q37,110 38,120 Q40,112 42,120 Q43,110 40,100" fill={color} opacity="0.55" />
      <path d="M40,103 Q38,110 39,117 Q40,112 41,117 Q42,110 40,103" fill="white" opacity="0.45" />

      {/* Base */}
      <rect x="22" y="175" width="36" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="22" y="175" width="36" height="8" rx="2" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <rect x="22" y="175" width="36" height="8" rx="2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Gancho */}
      <path d="M36,183 L36,192 Q40,198 44,192 L44,183" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
