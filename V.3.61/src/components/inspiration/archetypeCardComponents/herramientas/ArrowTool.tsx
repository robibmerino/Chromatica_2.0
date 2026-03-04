import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const TIP_PATH = 'M40,15 L32,45 L40,40 L48,45 Z';
const FEATHER_LEFT_PATH = 'M40,195 Q25,198 22,210 Q28,212 40,207';
const FEATHER_RIGHT_PATH = 'M40,195 Q55,198 58,210 Q52,212 40,207';
const NOCK_PATH = 'M38,207 L40,218 L42,207';

/**
 * ArrowTool — Flecha. Cazador / Arquero.
 * Vigésima segunda variante de herramienta. Colores personalizables según el eje.
 */
export function ArrowTool({
  colorLeft = '#dc2626',
  colorRight = '#16a34a',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('arrow');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="12%" r="22%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="30" rx="18" ry="22" fill={`url(#${gradId})`} />

      {/* Punta */}
      <path d={TIP_PATH} fill={color} opacity="0.55" />
      <path d={TIP_PATH} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
      <path d={TIP_PATH} fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round" opacity="0.3" />

      {/* Reflejo en punta */}
      <path d="M40,18 L37,38" stroke="white" strokeWidth="0.7" opacity="0.2" />

      {/* Asta */}
      <path d="M40,42 L40,195" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M40,42 L40,195" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      {/* Plumas */}
      {/* Pluma izquierda */}
      <path d={FEATHER_LEFT_PATH} fill={color} opacity="0.35" />
      <path d={FEATHER_LEFT_PATH} fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <path d={FEATHER_LEFT_PATH} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Pluma derecha */}
      <path d={FEATHER_RIGHT_PATH} fill={color} opacity="0.35" />
      <path d={FEATHER_RIGHT_PATH} fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <path d={FEATHER_RIGHT_PATH} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Nervios de las plumas */}
      <path d="M40,195 L28,206" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M40,195 L52,206" stroke={color} strokeWidth="0.6" opacity="0.4" />

      {/* Culote */}
      <path d={NOCK_PATH} fill={color} opacity="0.45" />
      <path d={NOCK_PATH} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      <circle cx="40" cy="18" r="1.5" fill="white" opacity="0.4" />
    </svg>
  );
}
