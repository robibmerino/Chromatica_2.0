import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const BODY_PATH = 'M20,48 Q20,95 40,110 Q20,125 20,172 L60,172 Q60,125 40,110 Q60,95 60,48 Z';

const SAND_PARTICLES: [number, number][] = [
  [38, 106],
  [40, 112],
  [42, 118],
  [39, 124],
  [41, 130],
];

/**
 * HourglassTool — Reloj de arena. Sabio / Temporal.
 * Décima variante de herramienta. Colores personalizables según el eje.
 */
export function HourglassTool({
  colorLeft = '#a78bfa',
  colorRight = '#64748b',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('hourglass');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="110" rx="30" ry="55" fill={`url(#${gradId})`} />

      {/* Marco superior */}
      <rect x="14" y="38" width="52" height="10" rx="3" fill={color} opacity="0.55" />
      <rect x="14" y="38" width="52" height="10" rx="3" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <rect x="14" y="38" width="52" height="10" rx="3" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Cuerpo */}
      <path d={BODY_PATH} fill={color} opacity="0.25" />
      <path d={BODY_PATH} fill="none" stroke={color} strokeWidth="1.5" opacity="0.65" />
      <path d={BODY_PATH} fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />

      {/* Arena superior */}
      <path d="M28,55 Q28,85 40,100 Q52,85 52,55 Z" fill={color} opacity="0.3" />

      {/* Hilo de arena */}
      <path d="M40,100 L40,122" stroke={color} strokeWidth="1.5" opacity="0.5" />

      {/* Arena inferior */}
      <path d="M28,165 Q28,148 40,135 Q52,148 52,165 Z" fill={color} opacity="0.4" />

      {/* Partículas de arena cayendo */}
      {SAND_PARTICLES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.8} fill={color} opacity={0.4 + i * 0.08} />
      ))}

      {/* Marco inferior */}
      <rect x="14" y="172" width="52" height="10" rx="3" fill={color} opacity="0.55" />
      <rect x="14" y="172" width="52" height="10" rx="3" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <rect x="14" y="172" width="52" height="10" rx="3" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      {/* Centro */}
      <circle cx="40" cy="110" r="2" fill="white" opacity="0.35" />
    </svg>
  );
}
