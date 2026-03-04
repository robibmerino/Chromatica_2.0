import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const FLAME_OUTER_PATH =
  'M40,12 Q28,28 26,48 Q25,62 32,72 Q38,78 40,72 Q36,58 40,38 Q44,58 40,72 Q42,78 48,72 Q55,62 54,48 Q52,28 40,12';
const FLAME_INNER_PATH =
  'M40,28 Q34,40 34,52 Q34,62 40,65 Q46,62 46,52 Q46,40 40,28';

const SPARKS: [number, number, number][] = [
  [28, 25, 0.4],
  [52, 22, 0.35],
  [22, 42, 0.3],
  [58, 38, 0.3],
  [34, 15, 0.25],
  [48, 18, 0.25],
];

/**
 * TorchTool — Antorcha. Pionero / Aventurero.
 * Vigésima primera variante de herramienta. Colores personalizables según el eje.
 */
export function TorchTool({
  colorLeft = '#f97316',
  colorRight = '#eab308',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('torch');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');
  const flameId = id('fl');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="15%" r="32%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={flameId} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="40%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="48" rx="30" ry="38" fill={`url(#${gradId})`} />

      {/* Llama exterior */}
      <path d={FLAME_OUTER_PATH} fill={color} opacity="0.35" />
      <path d={FLAME_OUTER_PATH} fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" />

      {/* Llama interior */}
      <path d={FLAME_INNER_PATH} fill={`url(#${flameId})`} opacity="0.8" />

      {/* Núcleo */}
      <ellipse cx="40" cy="52" rx="4" ry="8" fill="white" opacity="0.5" />
      <ellipse cx="40" cy="52" rx="2" ry="5" fill="white" opacity="0.7" />

      {/* Chispas */}
      {SPARKS.map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r={1} fill={color} opacity={o} />
      ))}

      {/* Copa / soporte */}
      <path d="M28,72 L26,82 L54,82 L52,72" fill={color} opacity="0.5" />
      <path d="M28,72 L26,82 L54,82 L52,72" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d="M28,72 L26,82 L54,82 L52,72" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Mango */}
      <path d="M40,82 L40,210" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.65" />
      <path d="M40,82 L40,210" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.2" />

      {/* Vendaje decorativo */}
      <path d="M36,105 L44,112 M36,112 L44,105" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M36,135 L44,142 M36,142 L44,135" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M36,165 L44,172 M36,172 L44,165" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />

      {/* Remate */}
      <circle cx="40" cy="213" r="4.5" fill={color} opacity="0.4" />
      <circle cx="40" cy="213" r="4.5" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="40" cy="213" r="4.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />
    </svg>
  );
}
