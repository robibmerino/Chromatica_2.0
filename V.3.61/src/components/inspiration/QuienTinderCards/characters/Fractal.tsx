import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Fractal (Simetría: violeta; Originalidad: más variado al rotar). */
const FRACTAL_PALETTE = {
  tri0a: '#a78bfa',
  tri0b: '#7c3aed',
  tri1a: '#60a5fa',
  tri1b: '#2563eb',
  tri2a: '#34d399',
  tri2b: '#059669',
  tri3a: '#fbbf24',
  tri3b: '#d97706',
  bgInner: '#0f0a1e',
  bgOuter: '#050010',
  coreMid: '#a78bfa',
  coreOuter: '#4c1d95',
  ring0: '#a78bfa',
  ring1: '#60a5fa',
  ring2: '#34d399',
  node: '#a78bfa',
} as const;

const CREATURE_ID = 22 as const;

const CX = 100;
const CY = 155;

const TRI_COLOR_KEYS: { fill: keyof typeof FRACTAL_PALETTE; stroke: keyof typeof FRACTAL_PALETTE }[] = [
  { fill: 'tri3a', stroke: 'tri3b' },
  { fill: 'tri2a', stroke: 'tri2b' },
  { fill: 'tri1a', stroke: 'tri1b' },
  { fill: 'tri0a', stroke: 'tri0b' },
];

const RING_COLOR_KEYS: (keyof typeof FRACTAL_PALETTE)[] = ['ring0', 'ring1', 'ring2'];

function drawSierpinski(
  x: number,
  y: number,
  size: number,
  depth: number,
  path: number,
  c: typeof FRACTAL_PALETTE
): ReactNode[] {
  if (depth === 0 || size < 3) {
    const s = size * 0.866;
    const colorIdx = Math.min(Math.floor(path % 4), 3);
    const keys = TRI_COLOR_KEYS[colorIdx];
    const fillColor = c[keys.fill];
    const strokeColor = c[keys.stroke];
    return [
      <polygon
        key={`${x}-${y}-${size}-${path}`}
        points={`${x},${y - size * 0.577} ${x - s / 2},${y + size * 0.289} ${x + s / 2},${y + size * 0.289}`}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.4"
        opacity={0.4 + depth * 0.15}
      />,
    ];
  }
  const half = size / 2;
  const h = size * 0.866;
  return [
    ...drawSierpinski(x, y - h / 3, half, depth - 1, path * 3, c),
    ...drawSierpinski(x - half / 2, y + h / 6, half, depth - 1, path * 3 + 1, c),
    ...drawSierpinski(x + half / 2, y + h / 6, half, depth - 1, path * 3 + 2, c),
  ];
}

export function Fractal({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('fractal');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, FRACTAL_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const triangles = useMemo(
    () => drawSierpinski(CX, CY, 130, 4, 0, c),
    [c]
  );

  return (
    <CharacterFrame
      title={meta?.name ?? 'Fractal'}
      subtitle={meta?.subtitle ?? 'Simetría'}
      variant={meta?.labelVariant ?? 'violet'}
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

      <ellipse cx={CX} cy={CY} rx="95" ry="150" fill={`url(#${bg})`} />
      {triangles}

      {[60, 80, 100].map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c[RING_COLOR_KEYS[i]]}
          strokeWidth="0.5"
          opacity="0.2"
        />
      ))}

      <circle cx={CX} cy={CY} r={12} fill={`url(#${core})`} opacity="0.9" />
      <circle cx={CX} cy={CY} r={7} fill="white" opacity="0.95" />
      <circle cx={CX} cy={CY} r={3.5} fill="white" />
      <circle cx={CX - 2} cy={CY - 2} r={1.5} fill="white" opacity="0.7" />

      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={CX + Math.cos((i * Math.PI) / 3) * 22}
          cy={CY + Math.sin((i * Math.PI) / 3) * 22}
          r={2}
          fill={c.node}
          opacity="0.7"
        />
      ))}
    </CharacterFrame>
  );
}
