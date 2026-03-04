import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const CROWN_PATH = 'M12,120 L12,72 L24,95 L40,58 L56,95 L68,72 L68,120 Z';

/**
 * CrownTool — Corona. Líder / Soberano.
 * Decimosexta variante de herramienta. Colores personalizables según el eje.
 */
export function CrownTool({
  colorLeft = '#d4af37',
  colorRight = '#b45309',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('crown');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="38%" r="38%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="36" ry="40" fill={`url(#${gradId})`} />

      {/* Silueta de la corona */}
      <path d={CROWN_PATH} fill={color} opacity="0.38" />
      <path d={CROWN_PATH} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
      <path d={CROWN_PATH} fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round" opacity="0.25" />

      {/* Gemas en las puntas */}
      <circle cx="12" cy="72" r="3" fill={color} opacity="0.6" />
      <circle cx="12" cy="72" r="1.5" fill="white" opacity="0.4" />

      <circle cx="40" cy="58" r="3.5" fill={color} opacity="0.65" />
      <circle cx="40" cy="58" r="1.8" fill="white" opacity="0.45" />

      <circle cx="68" cy="72" r="3" fill={color} opacity="0.6" />
      <circle cx="68" cy="72" r="1.5" fill="white" opacity="0.4" />

      {/* Banda inferior */}
      <rect x="12" y="118" width="56" height="10" rx="2" fill={color} opacity="0.5" />
      <rect x="12" y="118" width="56" height="10" rx="2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <rect x="12" y="118" width="56" height="10" rx="2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.22" />

      {/* Gema central en la banda */}
      <circle cx="40" cy="123" r="3" fill={color} opacity="0.55" />
      <circle cx="40" cy="123" r="1.5" fill="white" opacity="0.35" />

      {/* Gemas laterales en la banda */}
      <circle cx="26" cy="123" r="2" fill={color} opacity="0.4" />
      <circle cx="26" cy="123" r="1" fill="white" opacity="0.25" />
      <circle cx="54" cy="123" r="2" fill={color} opacity="0.4" />
      <circle cx="54" cy="123" r="1" fill="white" opacity="0.25" />
    </svg>
  );
}
