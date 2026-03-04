import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * TelescopeTool — Telescopio. Astrónomo / Visionario.
 * Novena variante de herramienta. Colores personalizables según el eje.
 */
export function TelescopeTool({
  colorLeft = '#6366f1',
  colorRight = '#0ea5e9',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('telescope');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="30%" cy="18%" r="30%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="28" cy="44" rx="24" ry="22" fill={`url(#${gradId})`} />

      {/* Lente principal */}
      <ellipse cx="18" cy="38" rx="12" ry="14" fill={color} opacity="0.35" />
      <ellipse cx="18" cy="38" rx="12" ry="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="18" cy="38" rx="12" ry="14" fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="18" cy="38" rx="7" ry="9" fill="black" opacity="0.4" />
      <circle cx="15" cy="34" r="2.5" fill="white" opacity="0.3" />

      {/* Tubo */}
      <path d="M28,30 L62,62" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.55" />
      <path d="M28,30 L62,62" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />

      {/* Anillos del tubo */}
      <path d="M34,32 L38,40" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M48,46 L52,54" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.45" />

      {/* Ocular */}
      <circle cx="64" cy="64" r="6" fill={color} opacity="0.5" />
      <circle cx="64" cy="64" r="6" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <circle cx="64" cy="64" r="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />
      <circle cx="64" cy="64" r="3" fill="black" opacity="0.5" />

      {/* Trípode */}
      <path d="M48,58 L20,200" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M48,58 L20,200" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      <path d="M48,58 L52,200" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M48,58 L52,200" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      <path d="M48,58 L70,195" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M48,58 L70,195" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}
