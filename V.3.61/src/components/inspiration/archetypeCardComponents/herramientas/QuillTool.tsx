import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const LEFT_BARB = 'M38,20 Q15,40 14,70 Q16,95 32,115 Q38,125 40,140';
const RIGHT_BARB = 'M38,20 Q58,35 62,65 Q60,90 50,110 Q45,122 43,140';

/**
 * QuillTool — Pluma. Escritor / Erudito.
 * Cuarta variante de herramienta. Colores personalizables según el eje.
 */
export function QuillTool({
  colorLeft = '#1e40af',
  colorRight = '#0f766e',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('quill');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="45%" cy="18%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="38" cy="50" rx="30" ry="40" fill={`url(#${gradId})`} />

      {/* Barbas */}
      <path d={LEFT_BARB} fill={color} opacity="0.3" />
      <path d={LEFT_BARB} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d={LEFT_BARB} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      <path d={RIGHT_BARB} fill={color} opacity="0.3" />
      <path d={RIGHT_BARB} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d={RIGHT_BARB} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Raquis */}
      <path d="M38,20 Q40,80 42,140 Q43,175 44,215" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M38,20 Q40,80 42,140 Q43,175 44,215" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />

      {/* Plumín */}
      <path d="M42,212 L44,228 L46,212" fill={color} opacity="0.6" />
      <path d="M42,212 L44,228 L46,212" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />

      <circle cx="38" cy="22" r="2" fill="white" opacity="0.4" />
      <circle cx="44" cy="228" r="1.2" fill="white" opacity="0.35" />
    </svg>
  );
}
