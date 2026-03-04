import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BOWL_PATH = 'M18,48 Q18,108 40,115 Q62,108 62,48';

/**
 * ChaliceTool — Cáliz. Sanador / Ceremonial.
 * Octava variante de herramienta. Colores personalizables según el eje.
 */
export function ChaliceTool({
  colorLeft = '#22d3ee',
  colorRight = '#a78bfa',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('chalice');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');
  const innerId = id('il');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="25%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={innerId} cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="60%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="65" rx="30" ry="38" fill={`url(#${gradId})`} />

      {/* Copa */}
      <path d={BOWL_PATH} fill={color} opacity="0.4" />
      <path d={BOWL_PATH} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d={BOWL_PATH} fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />

      {/* Brillo interior */}
      <ellipse cx="40" cy="72" rx="16" ry="25" fill={`url(#${innerId})`} />

      {/* Labio */}
      <ellipse cx="40" cy="48" rx="22" ry="6" fill={color} opacity="0.5" />
      <ellipse cx="40" cy="48" rx="22" ry="6" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <ellipse cx="40" cy="48" rx="22" ry="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />

      {/* Tallo */}
      <path d="M40,115 L40,178" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M40,115 L40,178" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />

      {/* Nudo */}
      <circle cx="40" cy="148" r="5" fill={color} opacity="0.5" />
      <circle cx="40" cy="148" r="5" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="40" cy="148" r="5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Base */}
      <ellipse cx="40" cy="188" rx="20" ry="7" fill={color} opacity="0.45" />
      <ellipse cx="40" cy="188" rx="20" ry="7" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <ellipse cx="40" cy="188" rx="20" ry="7" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />
      <path d="M40,178 Q48,182 60,188 M40,178 Q32,182 20,188" fill="none" stroke={color} strokeWidth="1.2" opacity="0.35" />

      <circle cx="32" cy="62" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}
