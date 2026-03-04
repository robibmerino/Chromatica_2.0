import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const SHIELD_PATH = 'M40,30 L65,45 L62,130 Q52,175 40,190 Q28,175 18,130 L15,45 Z';

/**
 * ShieldTool — Escudo. Defensor / Protector.
 * Undécima variante de herramienta. Colores personalizables según el eje.
 */
export function ShieldTool({
  colorLeft = '#16a34a',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('shield');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="35%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="105" rx="35" ry="65" fill={`url(#${gradId})`} />

      {/* Silueta */}
      <path d={SHIELD_PATH} fill={color} opacity="0.35" />
      <path d={SHIELD_PATH} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
      <path d={SHIELD_PATH} fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round" opacity="0.25" />

      {/* Banda central vertical */}
      <path d="M40,38 L40,185" stroke={color} strokeWidth="1" opacity="0.35" />

      {/* Banda central horizontal */}
      <path d="M18,95 L62,95" stroke={color} strokeWidth="1" opacity="0.3" />

      {/* Emblema central */}
      <circle cx="40" cy="95" r="12" fill={color} opacity="0.2" />
      <circle cx="40" cy="95" r="12" fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <circle cx="40" cy="95" r="12" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      <circle cx="40" cy="95" r="5" fill={color} opacity="0.45" />
      <circle cx="40" cy="95" r="5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />
      <circle cx="40" cy="95" r="2" fill="white" opacity="0.4" />

      {/* Reflejos */}
      <circle cx="30" cy="60" r="2.5" fill="white" opacity="0.15" />
    </svg>
  );
}
