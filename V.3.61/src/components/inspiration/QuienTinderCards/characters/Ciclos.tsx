import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Ciclos (Imprevisible: rosa; Compromiso: azul al rotar). */
const CICLOS_PALETTE = {
  curve0: '#f472b6',
  curve1: '#38bdf8',
  curve2: '#a78bfa',
  curve3: '#34d399',
  curve4: '#fbbf24',
  curve5: '#fb7185',
  bgInner: '#001428',
  bgOuter: '#000508',
  coreMid: '#38bdf8',
  coreOuter: '#0369a1',
  ring0: '#38bdf8',
  ring1: '#a78bfa',
  ring2: '#34d399',
  node: '#f472b6',
} as const;

const CREATURE_ID = 23 as const;

const CX = 100;
const CY = 160;

const RING_RADII = [25, 45, 65];
const RING_COLOR_KEYS: (keyof typeof CICLOS_PALETTE)[] = ['ring0', 'ring1', 'ring2'];

function epicycloid(
  R: number,
  r: number,
  steps: number,
  cx: number,
  cy: number,
  scale: number
): string {
  const points = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 24;
    const x = cx + scale * ((R + r) * Math.cos(t) - r * Math.cos(((R + r) / r) * t));
    const y = cy + scale * ((R + r) * Math.sin(t) - r * Math.sin(((R + r) / r) * t));
    return `${x},${y}`;
  });
  return points.join(' ');
}

function hypotrochoid(
  R: number,
  r: number,
  d: number,
  steps: number,
  cx: number,
  cy: number,
  scale: number
): string {
  const points = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 20;
    const x = cx + scale * ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t));
    const y = cy + scale * ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t));
    return `${x},${y}`;
  });
  return points.join(' ');
}

interface CurveSpec {
  points: string;
  colorKey: keyof typeof CICLOS_PALETTE;
  strokeWidth: number;
  opacity: number;
  transform?: string;
}

function getCurveSpecs(cx: number, cy: number): CurveSpec[] {
  return [
    {
      points: epicycloid(40, 10, 400, cx, cy, 0.85),
      colorKey: 'curve0',
      strokeWidth: 0.8,
      opacity: 0.7,
    },
    {
      points: hypotrochoid(50, 15, 30, 500, cx, cy, 0.75),
      colorKey: 'curve1',
      strokeWidth: 0.7,
      opacity: 0.65,
    },
    {
      points: epicycloid(25, 8, 300, cx, cy, 0.75),
      colorKey: 'curve2',
      strokeWidth: 0.9,
      opacity: 0.75,
    },
    {
      points: hypotrochoid(30, 9, 18, 400, cx, cy, 0.7),
      colorKey: 'curve3',
      strokeWidth: 0.7,
      opacity: 0.6,
    },
    {
      points: epicycloid(35, 12, 350, cx, cy, 0.75),
      colorKey: 'curve4',
      strokeWidth: 0.6,
      opacity: 0.5,
      transform: 'rotate(30 100 160)',
    },
    {
      points: hypotrochoid(42, 11, 25, 450, cx, cy, 0.72),
      colorKey: 'curve5',
      strokeWidth: 0.6,
      opacity: 0.5,
      transform: 'rotate(15 100 160)',
    },
  ];
}

export function Ciclos({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('ciclos');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, CICLOS_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const curves = getCurveSpecs(CX, CY);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Ciclos'}
      subtitle={meta?.subtitle ?? 'Descubrimiento'}
      variant={meta?.labelVariant ?? 'sky'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" />
          <stop offset="40%" stopColor={c.coreMid} />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0.8" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.4, centerX: CX, centerY: CY }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="95" ry="150" fill={`url(#${bg})`} />

      {curves.map((curve, i) => {
        const content = (
          <polyline
            points={curve.points}
            fill="none"
            stroke={c[curve.colorKey]}
            strokeWidth={curve.strokeWidth}
            opacity={curve.opacity}
          />
        );
        return curve.transform ? (
          <g key={i} transform={curve.transform}>
            {content}
          </g>
        ) : (
          <g key={i}>{content}</g>
        );
      })}

      {RING_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c[RING_COLOR_KEYS[i]]}
          strokeWidth="0.4"
          opacity="0.2"
        />
      ))}

      {Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5;
        return (
          <circle
            key={i}
            cx={CX + Math.cos(a) * 55}
            cy={CY + Math.sin(a) * 55}
            r={2.5}
            fill={c.node}
            opacity="0.8"
          />
        );
      })}

      <circle cx={CX} cy={CY} r={11} fill={`url(#${core})`} opacity="0.95" />
      <circle cx={CX} cy={CY} r={6} fill="white" opacity="0.95" />
      <circle cx={CX} cy={CY} r={3} fill="white" />
      <circle cx={CX - 2} cy={CY - 2} r={1.5} fill="white" opacity="0.7" />
      </g>
    </CharacterFrame>
  );
}
