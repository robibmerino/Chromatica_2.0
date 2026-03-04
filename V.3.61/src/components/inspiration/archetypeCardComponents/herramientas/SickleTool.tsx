import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BLADE_PATH = 'M36,82 Q18,68 16,42 Q15,22 32,18 Q52,16 68,32 Q75,42 72,55';
const EDGE_PATH = 'M36,82 Q24,70 22,48 Q22,32 35,26 Q50,24 62,36';

/**
 * SickleTool — Hoz. Cosechador / Cultivador.
 * Decimoctava variante de herramienta. Colores personalizables según el eje.
 */
export function SickleTool({
  colorLeft = '#16a34a',
  colorRight = '#15803d',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('sickle');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="55%" cy="22%" r="32%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="42" cy="58" rx="28" ry="30" fill={`url(#${gradId})`} />

      {/* Hoja curva */}
      <path d={BLADE_PATH} fill={color} opacity="0.35" />
      <path d={BLADE_PATH} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <path d={BLADE_PATH} fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />

      {/* Filo interior */}
      <path d={EDGE_PATH} fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" strokeDasharray="3,2" />

      {/* Punta */}
      <circle cx="72" cy="55" r="2" fill={color} opacity="0.6" />
      <circle cx="72" cy="55" r="1" fill="white" opacity="0.4" />

      {/* Mango */}
      <path d="M36,82 L32,205" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <path d="M36,82 L32,205" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />

      {/* Remate inferior */}
      <circle cx="32" cy="208" r="4" fill={color} opacity="0.45" />
      <circle cx="32" cy="208" r="4" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <circle cx="32" cy="208" r="4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Reflejo de hoja */}
      <circle cx="28" cy="35" r="2.5" fill="white" opacity="0.2" />
    </svg>
  );
}
