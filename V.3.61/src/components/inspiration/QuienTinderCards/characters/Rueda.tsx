import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Rueda (Rotativo: dinámico; Fijo: más estable al rotar). */
const RUEDA_PALETTE = {
  curve0: '#ff6b9d',
  curve1: '#ff9a3c',
  curve2: '#ffe44d',
  curve3: '#7fff6b',
  curve4: '#4dfff3',
  curve5: '#6b9dff',
  curve6: '#c46bff',
  curve7: '#ff6bff',
} as const;

const CREATURE_ID = 28 as const;

const CX = 100;
const CY = 160;

function cycloidPath(
  R: number,
  r: number,
  d: number,
  cx: number,
  cy: number,
  steps: number,
  rotOffset = 0
): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * Math.ceil(R / r) + rotOffset;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ') + 'Z';
}

interface CurveSpec {
  R: number;
  r: number;
  d: number;
  colorKey: keyof typeof RUEDA_PALETTE;
  opacity: number;
  strokeW: number;
  rot: number;
}

const CURVES: CurveSpec[] = [
  { R: 90, r: 30, d: 90, colorKey: 'curve0', opacity: 0.5, strokeW: 1.2, rot: 0 },
  { R: 80, r: 20, d: 75, colorKey: 'curve1', opacity: 0.45, strokeW: 1.1, rot: 0.3 },
  { R: 70, r: 25, d: 65, colorKey: 'curve2', opacity: 0.45, strokeW: 1.0, rot: 0.6 },
  { R: 60, r: 15, d: 55, colorKey: 'curve3', opacity: 0.5, strokeW: 1.0, rot: 0.9 },
  { R: 75, r: 35, d: 70, colorKey: 'curve4', opacity: 0.4, strokeW: 0.9, rot: 1.2 },
  { R: 55, r: 18, d: 50, colorKey: 'curve5', opacity: 0.45, strokeW: 0.9, rot: 1.5 },
  { R: 45, r: 12, d: 42, colorKey: 'curve6', opacity: 0.55, strokeW: 1.1, rot: 0.2 },
  { R: 35, r: 10, d: 32, colorKey: 'curve7', opacity: 0.65, strokeW: 1.2, rot: 0.8 },
];

export function Rueda({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('rueda');
  const glow = svgId('glow');
  const soft = svgId('soft');

  const palette = useCreatureAxisPalette(CREATURE_ID, RUEDA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Rueda'}
      subtitle={meta?.subtitle ?? 'Rotativo'}
      variant={meta?.labelVariant ?? 'rose'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={soft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {CURVES.map((curve, i) => {
        const color = palette[curve.colorKey];
        return (
          <g key={i}>
            <path
              d={cycloidPath(curve.R, curve.r, curve.d, CX, CY, 300, curve.rot)}
              fill="none"
              stroke={color}
              strokeWidth={curve.strokeW}
              strokeOpacity={curve.opacity}
              strokeLinecap="round"
            />
            <path
              d={cycloidPath(curve.R, curve.r, curve.d * 0.95, CX, CY, 300, curve.rot)}
              fill="none"
              stroke={color}
              strokeWidth={curve.strokeW * 0.4}
              strokeOpacity={curve.opacity * 0.5}
              filter={i > 4 ? `url(#${glow})` : undefined}
            />
          </g>
        );
      })}

      {CURVES.map((curve, i) => {
        const t = curve.rot;
        const x = CX + (curve.R - curve.r) * Math.cos(t) + curve.d * Math.cos(((curve.R - curve.r) / curve.r) * t);
        const y = CY + (curve.R - curve.r) * Math.sin(t) - curve.d * Math.sin(((curve.R - curve.r) / curve.r) * t);
        const color = palette[curve.colorKey];
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2.5}
            fill={color}
            opacity="0.9"
            filter={`url(#${glow})`}
          />
        );
      })}

      <circle cx={CX} cy={CY} r={10} fill="white" opacity="0.12" filter={`url(#${soft})`} />
      <circle cx={CX} cy={CY} r={4} fill="white" opacity="0.5" filter={`url(#${glow})`} />
      <circle cx={CX} cy={CY} r={2} fill="white" opacity="0.95" />
    </CharacterFrame>
  );
}
