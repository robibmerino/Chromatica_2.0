import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BOWL_PATH = 'M12,105 Q10,155 20,170 Q30,182 40,184 Q50,182 60,170 Q70,155 68,105';

/**
 * MortarTool — Mortero y mano. Alquimista / Boticario.
 * Decimonovena variante de herramienta. Colores personalizables según el eje.
 */
export function MortarTool({
  colorLeft = '#7c3aed',
  colorRight = '#0f766e',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('mortar');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="55%" r="38%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="130" rx="30" ry="45" fill={`url(#${gradId})`} />

      {/* Mano de mortero (pestle) */}
      <path d="M55,38 L28,92" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.65" />
      <path d="M55,38 L28,92" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />

      {/* Bola del pestle */}
      <circle cx="26" cy="95" r="7" fill={color} opacity="0.5" />
      <circle cx="26" cy="95" r="7" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <circle cx="26" cy="95" r="7" fill="none" stroke="white" strokeWidth="0.4" opacity="0.22" />
      <circle cx="24" cy="93" r="2" fill="white" opacity="0.25" />

      {/* Pomo superior */}
      <circle cx="57" cy="36" r="5" fill={color} opacity="0.5" />
      <circle cx="57" cy="36" r="5" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <circle cx="57" cy="36" r="5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.22" />
      <circle cx="55" cy="34" r="1.5" fill="white" opacity="0.35" />

      {/* Cuenco */}
      <path d={BOWL_PATH} fill={color} opacity="0.38" />
      <path d={BOWL_PATH} fill="none" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <path d={BOWL_PATH} fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />

      {/* Labio del cuenco */}
      <ellipse cx="40" cy="105" rx="28" ry="8" fill={color} opacity="0.5" />
      <ellipse cx="40" cy="105" rx="28" ry="8" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <ellipse cx="40" cy="105" rx="28" ry="8" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Interior oscuro */}
      <ellipse cx="40" cy="107" rx="22" ry="5" fill="black" opacity="0.3" />

      {/* Pie del mortero */}
      <ellipse cx="40" cy="186" rx="12" ry="4" fill={color} opacity="0.45" />
      <ellipse cx="40" cy="186" rx="12" ry="4" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <ellipse cx="40" cy="186" rx="12" ry="4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />
    </svg>
  );
}
