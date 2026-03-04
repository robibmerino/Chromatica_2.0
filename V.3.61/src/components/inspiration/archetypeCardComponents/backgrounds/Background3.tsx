import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#5c1d6b';
const DEFAULT_RIGHT = '#0e7490';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;
const RINGS_COUNT = 18;
const EXTRA_ARCS_COUNT = 12;
const DOTS_PER_CORNER = 5;

const TO_RAD = Math.PI / 180;
const CORNER_ANGLES = [45 * TO_RAD, 135 * TO_RAD, 315 * TO_RAD, 225 * TO_RAD] as const;

/** Colores base por esquina (mayor contraste y saturación). */
const CORNER_BASES = [
  { color1: '#a035c4', color2: '#e8a0ff', cx: 0, cy: 0 },
  { color1: '#1a8fb8', color2: '#6ee0ff', cx: W, cy: 0 },
  { color1: '#e85538', color2: '#ffc090', cx: 0, cy: H },
  { color1: '#259566', color2: '#6ee8a8', cx: W, cy: H },
] as const;

/** Opacidad con degradado pronunciado desde el punto de emisión. */
function emissionOpacity(tNorm: number, coef: number, exp: number, min: number): number {
  return Math.max(min, coef * Math.pow(1 - tNorm, exp));
}

/** Esquinas con anillos. Colores con mayor contraste; el slider del eje Intimidad–Comunidad los modula. */
function getCorners(colorLeft: string, colorRight: string, t: number) {
  const axisBlend = blendHex(colorLeft, colorRight, t);
  return CORNER_BASES.map((base) => ({
    ...base,
    color1: blendHex(base.color1, axisBlend, 0.55),
    color2: blendHex(base.color2, axisBlend, 0.5),
  }));
}

/**
 * Coalescencia — anillos concéntricos en las esquinas con efecto halo.
 * Eje Intimidad–Comunidad. Sensible al slider.
 * Contrastes y número de ondas ampliados respecto al original.
 */
export function Background3({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('coalesc');
  const t = (sliderValue ?? 50) / 100;
  const corners = useMemo(
    () => getCorners(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t),
    [colorLeft, colorRight, t]
  );

  const bgId = svgId('bg');
  const centerId = svgId('center');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#050709" />
          <stop offset="100%" stopColor="#060810" />
        </linearGradient>
        <radialGradient id={centerId} cx="50%" cy="50%" r="42%">
          <stop offset="0%" stopColor="#07090e" stopOpacity="0" />
          <stop offset="55%" stopColor="#07090e" stopOpacity="0" />
          <stop offset="100%" stopColor="#07090e" stopOpacity="0.32" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${bgId})`} />

      {corners.map((corner, ci) =>
        Array.from({ length: RINGS_COUNT }, (_, ri) => {
          const tNorm = ri / RINGS_COUNT;
          const sw = ri === 0 ? 1.8 : ri < 3 ? 1.2 : ri < 6 ? 0.8 : 0.45;
          return (
            <circle
              key={`${ci}-${ri}`}
              cx={corner.cx}
              cy={corner.cy}
              r={14 + ri * 12}
              fill="none"
              stroke={ri % 2 === 0 ? corner.color1 : corner.color2}
              strokeWidth={sw}
              opacity={emissionOpacity(tNorm, 1.15, 2.2, 0.018)}
            />
          );
        })
      )}

      {/* Arcos adicionales — más ondas */}
      {corners.map((corner, ci) =>
        Array.from({ length: EXTRA_ARCS_COUNT }, (_, i) => (
          <circle
            key={`ea${ci}-${i}`}
            cx={corner.cx}
            cy={corner.cy}
            r={6 + i * 5}
            fill="none"
            stroke={corner.color2}
            strokeWidth={i < 4 ? 0.9 : 0.5}
            opacity={emissionOpacity(i / EXTRA_ARCS_COUNT, 1.1, 2.4, 0.014)}
          />
        ))
      )}

      {/* Puntos de anclaje en cada esquina */}
      {corners.map((corner, ci) =>
        Array.from({ length: DOTS_PER_CORNER }, (_, i) => {
          const angle = CORNER_ANGLES[ci];
          const dist = 18 + i * 16;
          return (
            <circle
              key={`dot${ci}-${i}`}
              cx={corner.cx + Math.cos(angle) * dist}
              cy={corner.cy + Math.sin(angle) * dist}
              r={0.9 - i * 0.12}
              fill={corner.color2}
              opacity={emissionOpacity(i / DOTS_PER_CORNER, 1.05, 2, 0.035)}
            />
          );
        })
      )}

      <rect width={W} height={H} fill={`url(#${centerId})`} />
    </svg>
  );
}
