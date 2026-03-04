import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BODY_PATH =
  'M40,90 Q60,90 58,110 Q55,125 48,132 Q62,142 60,168 Q58,192 40,194 Q22,192 20,168 Q18,142 32,132 Q25,125 22,110 Q20,90 40,90 Z';

/**
 * ViolinTool — Violín. Músico / Cantante.
 * Tercera variante de herramienta. Colores personalizables según el eje.
 */
export function ViolinTool({
  colorLeft = '#7c3aed',
  colorRight = '#6366f1',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('violin');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="140" rx="35" ry="65" fill={`url(#${gradId})`} />

      {/* Voluta */}
      <path d="M40,22 Q32,22 32,30 Q32,36 40,36" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M40,22 Q32,22 32,30 Q32,36 40,36" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />

      {/* Clavijero */}
      <path d="M40,36 L40,58" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M35,42 L45,42 M35,50 L45,50" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />

      {/* Mástil */}
      <path d="M40,58 L40,92" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M40,58 L40,92" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      {/* Cuerpo */}
      <path d={BODY_PATH} fill={color} opacity="0.4" />
      <path d={BODY_PATH} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d={BODY_PATH} fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />

      {/* Cuerdas */}
      <path d="M38,58 L38,190 M40,58 L40,190 M42,58 L42,190" stroke={color} strokeWidth="0.6" opacity="0.4" />

      {/* Puente */}
      <path d="M34,162 Q40,158 46,162" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />

      {/* Cordal */}
      <path d="M38,190 L40,208 L42,190" fill={color} opacity="0.45" />

      <circle cx="40" cy="140" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}
